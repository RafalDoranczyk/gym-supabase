"use client";

import { Add, Delete, Edit } from "@mui/icons-material";
import { Button, Divider, Grid, Menu, MenuItem, Stack, Typography } from "@mui/material";
import type { MealTag, MealTagWithExamples } from "@repo/schemas";
import { useMemo, useState, useTransition } from "react";

import { ConfirmActionDialog, EmptyState, SearchField } from "@/components";
import { useToast } from "@/providers";
import { deleteMealTag } from "../actions/deleteMealTag";
import { useMealTagsUI } from "../hooks/useMealTagsUI";
import { MealTagCard } from "./MealTagCard";
import { MealTagDialog } from "./MealTagDialog";

type MealTagsPageViewProps = {
  tags: MealTagWithExamples[];
};

export function MealTagsPageView({ tags }: MealTagsPageViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedTag, setSelectedTag] = useState<MealTag | null>(null);

  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  const {
    tagToDelete,
    editDialogState,
    handleEdit,
    handleDeleteClick,
    closeConfirmDialog,
    closeEditDialog,
    openCreateDialog,
  } = useMealTagsUI();

  const filteredTags = useMemo(() => {
    return tags.filter(
      (tag) =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tag.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [tags, searchTerm]);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, tag: MealTag) => {
    setAnchorEl(event.currentTarget);
    setSelectedTag(tag);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTag(null);
  };

  const handleEditClick = () => {
    if (selectedTag) {
      handleEdit(selectedTag);
    }
    handleMenuClose();
  };

  const handleDeleteMenuClick = () => {
    if (selectedTag) {
      handleDeleteClick(selectedTag);
    }
    handleMenuClose();
  };

  const handleDeleteTag = () => {
    if (tagToDelete) {
      startTransition(() => {
        deleteMealTag(tagToDelete.id)
          .then(() => {
            toast.success(`Meal tag ${tagToDelete.name} removed successfully`);
            closeConfirmDialog();
          })
          .catch((error) => {
            toast.error(`Failed to remove meal tag: ${error.message}`);
          });
      });
    }
  };

  return (
    <div>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Stack spacing={1} sx={{ flex: 1, maxWidth: "60%" }}>
          <Typography variant="h4">Meal Tags</Typography>
          <Typography variant="body2" color="textSecondary">
            Tag meals by dietary properties to quickly find what you need.
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
            aria-label="Add new meal tag"
          >
            Add Tag
          </Button>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {filteredTags.length === 0 ? (
        <EmptyState
          title={searchTerm ? "No tags found" : "No meal tags"}
          subtitle={
            searchTerm
              ? "Try using different keywords"
              : "Add your first tag to start organizing meals"
          }
          size="medium"
          action={
            !searchTerm ? (
              <Button variant="outlined" startIcon={<Add />} onClick={openCreateDialog}>
                Add Tag
              </Button>
            ) : undefined
          }
        />
      ) : (
        <Grid container spacing={2}>
          {filteredTags.map((tag) => (
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4,
                lg: 3,
              }}
              key={tag.id}
            >
              <MealTagCard tag={tag} onMenuClick={handleMenuClick} />
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
      <MealTagDialog
        tag={editDialogState.tag}
        open={editDialogState.open}
        onClose={closeEditDialog}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmActionDialog
        title="Confirm Delete"
        description={`Are you sure you want to delete the tag "${tagToDelete?.name}"? This action cannot be undone.`}
        handleClose={closeConfirmDialog}
        loading={isPending}
        onConfirm={handleDeleteTag}
        open={Boolean(tagToDelete)}
      />
    </div>
  );
}
