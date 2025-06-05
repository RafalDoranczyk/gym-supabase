"use client";

import { ConfirmActionDialog } from "@/components";
import { useToast } from "@/providers";
import { Delete, Edit } from "@mui/icons-material";
import { Divider, Grid, Menu, MenuItem } from "@mui/material";
import type { MealTag, MealTagWithExamples } from "@repo/schemas";
import { useMemo, useState, useTransition } from "react";

import { deleteMealTag } from "../actions/deleteMealTag";
import { mealTagDefaultValues, useMealTagForm } from "../hooks/useMealTagForm";
import { MealTagCard } from "./MealTagCard";
import { MealTagDialog } from "./MealTagDialog";
import { MealTagEmptyState } from "./MealTagEmptyState";
import { MealTagToolbar } from "./MealTagToolbar";

type MealTagsPageContentProps = {
  mealTags: MealTagWithExamples[];
};

export function MealTagsPageContent({ mealTags }: MealTagsPageContentProps) {
  // State
  const [search, setSearch] = useState("");
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedTag, setSelectedTag] = useState<MealTagWithExamples | null>(null);
  const [tagToDelete, setTagToDelete] = useState<MealTag | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isPending, startTransition] = useTransition();
  const toast = useToast();
  const form = useMealTagForm();

  // Computed values
  const filteredTags = useMemo(() => {
    return mealTags.filter(
      (tag) =>
        tag.name.toLowerCase().includes(search.toLowerCase()) ||
        tag.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [mealTags, search]);

  const hasTags = mealTags.length > 0;
  const hasActiveFilters = !!search;

  // Menu handlers
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>, tag: MealTagWithExamples) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedTag(tag);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setSelectedTag(null);
  };

  // Dialog handlers
  const handleOpenDialog = (tag?: MealTagWithExamples) => {
    form.reset(tag || mealTagDefaultValues);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  // Action handlers
  const handleEditTag = () => {
    if (selectedTag) handleOpenDialog(selectedTag);
    handleCloseMenu();
  };

  const handleOpenDeleteDialog = () => {
    if (selectedTag) setTagToDelete(selectedTag);
    handleCloseMenu();
  };

  const handleCloseDeleteDialog = () => {
    setTagToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!tagToDelete) return;

    startTransition(async () => {
      try {
        await deleteMealTag({ id: tagToDelete.id });
        toast.success(`Meal tag "${tagToDelete.name}" removed successfully`);
        handleCloseDeleteDialog();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        toast.error(`Failed to remove meal tag: ${errorMessage}`);
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
      <MealTagToolbar
        onCreateClick={() => handleOpenDialog()}
        onSearchChange={handleSearchChange}
        search={search}
      />

      <Divider sx={{ mb: 3 }} />

      {!hasTags && (
        <MealTagEmptyState
          search={search}
          onAddTag={() => handleOpenDialog()}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      )}

      {hasTags && (
        <Grid container spacing={2}>
          {filteredTags.map((tag) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={tag.id}>
              <MealTagCard tag={tag} onMenuClick={handleOpenMenu} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Context Menu */}
      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={handleEditTag}>
          <Edit sx={{ mr: 1, fontSize: 20 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleOpenDeleteDialog}>
          <Delete sx={{ mr: 1, fontSize: 20 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Create/Edit Dialog */}
      <MealTagDialog open={isDialogOpen} onClose={handleCloseDialog} form={form} />

      {/* Delete Confirmation Dialog */}
      <ConfirmActionDialog
        title="Delete Meal Tag"
        description={
          tagToDelete
            ? `Are you sure you want to delete the tag "${tagToDelete.name}"? This action cannot be undone.`
            : "Are you sure you want to delete this tag?"
        }
        handleClose={handleCloseDeleteDialog}
        loading={isPending}
        onConfirm={handleConfirmDelete}
        open={Boolean(tagToDelete)}
      />
    </div>
  );
}
