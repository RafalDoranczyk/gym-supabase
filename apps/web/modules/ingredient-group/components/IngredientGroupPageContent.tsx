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
import type { IngredientGroup, IngredientGroupWithExamples } from "@repo/schemas";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { EditDeleteMenu } from "@/components/EditDeleteMenu";
import { deleteIngredientGroup } from "../actions/deleteIngredientGroup";
import {
  ingredientGroupDefaultValues,
  useIngredientGroupForm,
} from "../hooks/useIngredientGroupForm";
import { IngredientGroupDialog } from "./IngredientGroupDialog";

type IngredientGroupsPageContentProps = {
  ingredientGroups: IngredientGroupWithExamples[];
};

export function IngredientGroupPageContent({ ingredientGroups }: IngredientGroupsPageContentProps) {
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
    onAdd: () => handleOpenDialog(),
    onClearFilters: handleClearFilters,
    hasActiveFilters,
    config: {
      entityName: "ingredient groups",
      entityNameSingular: "ingredient group",
      addButtonText: "Add Group",
      organizeText: "organizing ingredients",
    },
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
    onClose: handleCloseDeleteDialog,
    loading: isPending,
    onConfirm: handleConfirmDelete,
    open: Boolean(groupToDelete),
  } as const;

  const menuProps = {
    anchorEl: menuAnchorEl,
    open: Boolean(menuAnchorEl),
    onClose: handleCloseMenu,
    onEdit: handleEditGroup,
    onDelete: handleOpenDeleteDialog,
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

      {showEmptyState && <SearchableEmptyState {...emptyStateProps} />}

      {hasGroups && hasFilteredResults && (
        <Grid container spacing={2}>
          {filteredGroups.map((group) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={group.id}>
              <CategoryCard
                item={group}
                onMenuClick={handleOpenMenu}
                config={{
                  countLabel: "ingredients",
                  countValue: group.ingredientsCount || 0,
                  emptyExamplesText: "Add ingredients to see examples here",
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <EditDeleteMenu {...menuProps} />

      {/* Dialogs */}
      <IngredientGroupDialog {...dialogProps} />
      <ConfirmActionDialog {...confirmDialogProps} />
    </div>
  );
}
