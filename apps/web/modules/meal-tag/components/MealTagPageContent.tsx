"use client";

import {
  CategoryCard,
  ConfirmActionDialog,
  SearchableEmptyState,
  SearchFieldURL,
  SectionHeader,
} from "@/components";
import { useToast } from "@/providers";
import { Add } from "@mui/icons-material";
import { Button, Grid, Stack, Typography } from "@mui/material";
import type { MealTag, MealTagWithExamples } from "@repo/schemas";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { EditDeleteMenu } from "@/components/EditDeleteMenu";
import { deleteMealTag } from "../actions/deleteMealTag";
import { mealTagDefaultValues, useMealTagForm } from "../hooks/useMealTagForm";
import { MealTagDialog } from "./MealTagDialog";

type MealTagPageContentProps = {
  mealTags: MealTagWithExamples[];
};

export function MealTagPageContent({ mealTags }: MealTagPageContentProps) {
  // URL state for search
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get("search") || "";

  // Local state management
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedTag, setSelectedTag] = useState<MealTagWithExamples | null>(null);
  const [tagToDelete, setTagToDelete] = useState<MealTag | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Hooks
  const [isPending, startTransition] = useTransition();
  const toast = useToast();
  const form = useMealTagForm();

  // Computed values
  const filteredTags = useMemo(() => {
    if (!search.trim()) return mealTags;

    const searchLower = search.toLowerCase();
    return mealTags.filter(
      (tag) =>
        tag.name.toLowerCase().includes(searchLower) ||
        tag.description?.toLowerCase().includes(searchLower)
    );
  }, [mealTags, search]);

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
      } catch {
        toast.error("Failed to remove meal tag.");
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
  const hasTags = mealTags.length > 0;
  const hasActiveFilters = !!search.trim();
  const hasFilteredResults = filteredTags.length > 0;
  const showEmptyState = !hasTags || (hasActiveFilters && !hasFilteredResults);

  // Props objects for readability
  const emptyStateProps = {
    search,
    onAdd: () => handleOpenDialog(),
    onClearFilters: handleClearFilters,
    hasActiveFilters,
    config: {
      entityName: "meal tags",
      entityNameSingular: "meal tag",
      addButtonText: "Add Tag",
      organizeText: "organizing meals",
    },
  } as const;

  const dialogProps = {
    open: isDialogOpen,
    onClose: handleCloseDialog,
    form,
  } as const;

  const confirmDialogProps = {
    title: "Delete Meal Tag",
    onClose: handleCloseDeleteDialog,
    loading: isPending,
    onConfirm: handleConfirmDelete,
    open: Boolean(tagToDelete),
    description: (
      <>
        <Typography>
          Are you sure you want to delete the tag <strong>"{tagToDelete?.name}"</strong>?
        </Typography>
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          Warning: Deleting this tag will remove it from all associated meals. This action cannot be
          undone.
        </Typography>
      </>
    ),
  } as const;

  const menuProps = {
    anchorEl: menuAnchorEl,
    open: Boolean(menuAnchorEl),
    onClose: handleCloseMenu,
    onEdit: handleEditTag,
    onDelete: handleOpenDeleteDialog,
  } as const;

  return (
    <div>
      <SectionHeader
        title="Meal Tags"
        description="Tag meals by dietary properties to quickly find what you need."
        action={
          <Stack direction="row" spacing={2} alignItems="center">
            <SearchFieldURL
              onChange={handleSearchChange}
              value={search}
              placeholder="Search tags..."
            />
            <Button
              size="small"
              color="primary"
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              aria-label="Add new meal tag"
            >
              Add Tag
            </Button>
          </Stack>
        }
      />

      {showEmptyState && <SearchableEmptyState {...emptyStateProps} />}

      {hasTags && hasFilteredResults && (
        <Grid container spacing={2}>
          {filteredTags.map((tag) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={tag.id}>
              <CategoryCard
                item={tag}
                onMenuClick={handleOpenMenu}
                config={{
                  countLabel: "meals",
                  countValue: tag.mealsCount || 0,
                  emptyExamplesText: "Add meals to see examples here",
                  defaultColor: "primary.main",
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <EditDeleteMenu {...menuProps} />
      <MealTagDialog {...dialogProps} />
      <ConfirmActionDialog {...confirmDialogProps} />
    </div>
  );
}
