"use client";

import { ConfirmActionDialog, SearchFieldURL, SectionHeader } from "@/components";
import { useToast } from "@/providers";
import { Add, Delete, Edit } from "@mui/icons-material";
import { Button, Grid, Menu, MenuItem, Stack, Typography } from "@mui/material";
import type { IngredientGroup, IngredientGroupWithExamples } from "@repo/schemas";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { deleteIngredientGroup } from "../actions/deleteIngredientGroup";
import {
  ingredientGroupDefaultValues,
  useIngredientGroupForm,
} from "../hooks/useIngredientGroupForm";
import { IngredientGroupCard } from "./IngredientGroupCard";
import { IngredientGroupDialog } from "./IngredientGroupDialog";
import { IngredientGroupEmptyState } from "./IngredientGroupEmptyState";

type IngredientGroupsPageContentProps = {
  ingredientGroups: IngredientGroupWithExamples[];
};

export function IngredientGroupsPageContent({
  ingredientGroups,
}: IngredientGroupsPageContentProps) {
  // URL state for search
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get("search") || "";

  // Local state management
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<IngredientGroupWithExamples | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<IngredientGroup | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Hooks
  const [isPending, startTransition] = useTransition();
  const toast = useToast();
  const form = useIngredientGroupForm();

  // Computed values
  const filteredGroups = useMemo(() => {
    if (!search.trim()) return ingredientGroups;

    const searchLower = search.toLowerCase();
    return ingredientGroups.filter(
      (group) =>
        group.name.toLowerCase().includes(searchLower) ||
        group.description?.toLowerCase().includes(searchLower)
    );
  }, [ingredientGroups, search]);

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

  // URL search handlers
  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    router.push(`?${params}`, { scroll: false });
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(`?${params}`, { scroll: false });
  };

  // Computed state
  const hasGroups = ingredientGroups.length > 0;
  const hasActiveFilters = !!search.trim();
  const hasFilteredResults = filteredGroups.length > 0;
  const showEmptyState = !hasGroups || (hasActiveFilters && !hasFilteredResults);

  // Props objects for readability
  const emptyStateProps = {
    search,
    onAddIngredient: () => handleOpenDialog(),
    onClearFilters: handleClearFilters,
    hasActiveFilters,
  } as const;

  const dialogProps = {
    open: isDialogOpen,
    onClose: handleCloseDialog,
    form,
  } as const;

  const confirmDialogProps = {
    title: "Delete Ingredient Group",
    description: groupToDelete ? (
      <>
        <Typography>
          Are you sure you want to delete the group <strong>"{groupToDelete.name}"</strong>?
        </Typography>
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          Warning: Deleting this group will also delete all ingredients that belong to it. This
          action cannot be undone.
        </Typography>
      </>
    ) : (
      "Are you sure you want to delete this ingredient group?"
    ),
    handleClose: handleCloseDeleteDialog,
    loading: isPending,
    onConfirm: handleConfirmDelete,
    open: Boolean(groupToDelete),
  } as const;

  const menuProps = {
    anchorEl: menuAnchorEl,
    open: Boolean(menuAnchorEl),
    onClose: handleCloseMenu,
  } as const;

  return (
    <div>
      <SectionHeader
        title="Ingredient Groups"
        description="Organize ingredients into categories for faster recipe creation."
        action={
          <Stack direction="row" spacing={2} alignItems="center">
            <SearchFieldURL
              onChange={handleSearchChange}
              value={search}
              placeholder="Search groups..."
            />
            <Button
              size="small"
              color="primary"
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              Add Group
            </Button>
          </Stack>
        }
      />

      {/* Conditional rendering based on groups availability */}
      {showEmptyState && <IngredientGroupEmptyState {...emptyStateProps} />}

      {hasGroups && hasFilteredResults && (
        <Grid container spacing={2}>
          {filteredGroups.map((group) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={group.id}>
              <IngredientGroupCard group={group} onMenuClick={handleOpenMenu} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Context Menu */}
      <Menu {...menuProps}>
        <MenuItem onClick={handleEditGroup}>
          <Edit sx={{ mr: 1, fontSize: 20 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleOpenDeleteDialog}>
          <Delete sx={{ mr: 1, fontSize: 20 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Dialogs */}
      <IngredientGroupDialog {...dialogProps} />
      <ConfirmActionDialog {...confirmDialogProps} />
    </div>
  );
}
