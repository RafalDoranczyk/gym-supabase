"use client";

import { ConfirmActionDialog, EmptyState, SearchField } from "@/components";
import { useToast } from "@/providers";
import { Add, Delete, Edit } from "@mui/icons-material";
import { Button, Divider, Grid, Menu, MenuItem, Stack, Typography } from "@mui/material";
import type { NutritionGroupWithExamples } from "@repo/schemas";
import { useMemo, useState, useTransition } from "react";
import { deleteIngredientGroup } from "../actions/deleteIngredientGroup";
import { useIngredientGroupUI } from "../hoooks/useIngredientGroupUI";
import { IngredientGroupCard } from "./IngredientGroupCard";
import { IngredientGroupDialog } from "./IngredientGroupDialog";

type IngredientsGroupPageViewProps = {
  groups: NutritionGroupWithExamples[];
};

export function IngredientsGroupPageView({ groups }: IngredientsGroupPageViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<NutritionGroupWithExamples | null>(null);

  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  const {
    groupToDelete,
    editDialogState,
    handleEdit,
    handleDeleteClick,
    closeConfirmDialog,
    closeEditDialog,
    openCreateDialog,
  } = useIngredientGroupUI();

  const filteredGroups = useMemo(() => {
    return groups.filter(
      (group) =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [groups, searchTerm]);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    group: NutritionGroupWithExamples,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedGroup(group);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedGroup(null);
  };

  const handleEditClick = () => {
    if (selectedGroup) {
      handleEdit(selectedGroup);
    }
    handleMenuClose();
  };

  const handleDeleteMenuClick = () => {
    if (selectedGroup) {
      handleDeleteClick(selectedGroup);
    }
    handleMenuClose();
  };

  const handleDeleteGroup = () => {
    if (groupToDelete) {
      startTransition(() => {
        deleteIngredientGroup(groupToDelete.id)
          .then(() => {
            toast.success(`Ingredient group ${groupToDelete.name} removed successfully`);
            closeConfirmDialog();
          })
          .catch((error) => {
            toast.error(`Failed to remove ingredient group: ${error.message}`);
          });
      });
    }
  };

  return (
    <div>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Stack spacing={1} sx={{ flex: 1, maxWidth: "60%" }}>
          <Typography variant="h4">Ingredient Groups</Typography>
          <Typography variant="body2" color="textSecondary">
            Organize ingredients into categories for faster recipe creation.
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <SearchField onChange={(value) => setSearchTerm(value)} value={searchTerm} />
          <Button
            size="small"
            color="primary"
            variant="contained"
            startIcon={<Add />}
            onClick={openCreateDialog}
          >
            Add Group
          </Button>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {filteredGroups.length === 0 ? (
        <EmptyState
          title={searchTerm ? "No groups found" : "No ingredient groups"}
          subtitle={
            searchTerm
              ? "Try using different keywords"
              : "Add your first group to start organizing ingredients"
          }
          size="medium"
          action={
            !searchTerm ? (
              <Button variant="outlined" startIcon={<Add />} onClick={openCreateDialog}>
                Add Group
              </Button>
            ) : undefined
          }
        />
      ) : (
        <Grid container spacing={2}>
          {filteredGroups.map((group) => (
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4,
                lg: 3,
              }}
              key={group.id}
            >
              <IngredientGroupCard group={group} onMenuClick={handleMenuClick} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Context Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEditClick}>
          <Edit sx={{ mr: 1, fontSize: 20 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteMenuClick}>
          <Delete sx={{ mr: 1, fontSize: 20 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Edit/Create Dialog */}
      <IngredientGroupDialog
        group={editDialogState.group}
        open={editDialogState.open}
        onClose={closeEditDialog}
      />

      {/* Delete Confirmation Dialog */}

      <ConfirmActionDialog
        title="Confirm Delete"
        description={
          <>
            <Typography>
              Are you sure you want to delete the group <strong>"{groupToDelete?.name}"</strong>?
            </Typography>
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              Warning: Deleting this group will also delete all ingredients that belong to it. This
              action cannot be undone.
            </Typography>
          </>
        }
        handleClose={closeConfirmDialog}
        loading={isPending}
        onConfirm={handleDeleteGroup}
        open={Boolean(groupToDelete)}
      />
    </div>
  );
}
