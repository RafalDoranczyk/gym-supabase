"use client";

import { ConfirmActionDialog } from "@/components";
import { useToast } from "@/providers";
import { Delete, Edit } from "@mui/icons-material";
import { Divider, Grid, Menu, MenuItem, Typography } from "@mui/material";
import type { IngredientGroup, IngredientGroupWithExamples } from "@repo/schemas";
import { useMemo, useState, useTransition } from "react";
import { deleteIngredientGroup } from "../actions/deleteIngredientGroup";
import {
  ingredientGroupDefaultValues,
  useIngredientGroupForm,
} from "../hoooks/useIngredientGroupForm";
import { IngredientGroupCard } from "./IngredientGroupCard";
import { IngredientGroupDialog } from "./IngredientGroupDialog";
import { IngredientGroupEmptyState } from "./IngredientGroupEmptyState";
import { IngredientGroupToolbar } from "./IngredientGroupToolbar";

type IngredientsGroupPageContentProps = {
  ingredientGroups: IngredientGroupWithExamples[];
};

export function IngredientsGroupPageContent({
  ingredientGroups,
}: IngredientsGroupPageContentProps) {
  // State
  const [search, setSearch] = useState("");
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<IngredientGroupWithExamples | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<IngredientGroup | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isPending, startTransition] = useTransition();
  const toast = useToast();
  const form = useIngredientGroupForm();

  // Computed values
  const filteredGroups = useMemo(() => {
    return ingredientGroups.filter(
      (group) =>
        group.name.toLowerCase().includes(search.toLowerCase()) ||
        group.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [ingredientGroups, search]);

  const hasGroups = ingredientGroups.length > 0;
  const hasActiveFilters = !!search;
  const showEmptyState =
    !hasGroups || (hasGroups && hasActiveFilters && filteredGroups.length === 0);

  // Menu handlers
  const handleOpenMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    group: IngredientGroupWithExamples
  ) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedGroup(group);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setSelectedGroup(null);
  };

  // Dialog handlers
  const handleOpenDialog = (group?: IngredientGroupWithExamples) => {
    form.reset(group || ingredientGroupDefaultValues);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  // Action handlers
  const handleEditGroup = () => {
    if (selectedGroup) handleOpenDialog(selectedGroup);
    handleCloseMenu();
  };

  const handleOpenDeleteDialog = () => {
    if (selectedGroup) setGroupToDelete(selectedGroup);
    handleCloseMenu();
  };

  const handleCloseDeleteDialog = () => {
    setGroupToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!groupToDelete) return;

    startTransition(async () => {
      try {
        await deleteIngredientGroup({ id: groupToDelete.id });
        toast.success(`Ingredient group "${groupToDelete.name}" removed successfully`);
        handleCloseDeleteDialog();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        toast.error(`Failed to remove ingredient group: ${errorMessage}`);
      }
    });
  };

  // Search handlers
  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleClearFilters = () => {
    setSearch("");
  };

  return (
    <div>
      <IngredientGroupToolbar
        onSearchChange={handleSearchChange}
        search={search}
        onCreateClick={() => handleOpenDialog()}
      />

      <Divider sx={{ mb: 3 }} />

      {showEmptyState && (
        <IngredientGroupEmptyState
          search={search}
          onAddIngredient={() => handleOpenDialog()}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      )}

      {hasGroups && filteredGroups.length > 0 && (
        <Grid container spacing={2}>
          {filteredGroups.map((group) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={group.id}>
              <IngredientGroupCard group={group} onMenuClick={handleOpenMenu} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Context Menu */}
      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={handleEditGroup}>
          <Edit sx={{ mr: 1, fontSize: 20 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleOpenDeleteDialog}>
          <Delete sx={{ mr: 1, fontSize: 20 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Create/Edit Dialog */}
      <IngredientGroupDialog open={isDialogOpen} onClose={handleCloseDialog} form={form} />

      {/* Delete Confirmation Dialog */}
      <ConfirmActionDialog
        title="Delete Ingredient Group"
        description={
          groupToDelete ? (
            <>
              <Typography>
                Are you sure you want to delete the group <strong>"{groupToDelete.name}"</strong>?
              </Typography>
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                Warning: Deleting this group will also delete all ingredients that belong to it.
                This action cannot be undone.
              </Typography>
            </>
          ) : (
            "Are you sure you want to delete this ingredient group?"
          )
        }
        handleClose={handleCloseDeleteDialog}
        loading={isPending}
        onConfirm={handleConfirmDelete}
        open={Boolean(groupToDelete)}
      />
    </div>
  );
}
