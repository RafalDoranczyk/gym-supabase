import { Delete, Edit } from "@mui/icons-material";
import { Menu, MenuItem } from "@mui/material";

type EditDeleteMenuProps = {
  onEdit: () => void;
  onDelete: () => void;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
};

export function EditDeleteMenu({
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
  ...menuProps
}: EditDeleteMenuProps) {
  return (
    <Menu {...menuProps}>
      {canEdit && (
        <MenuItem onClick={onEdit}>
          <Edit sx={{ mr: 1, fontSize: 20 }} />
          Edit
        </MenuItem>
      )}
      {canDelete && (
        <MenuItem onClick={onDelete}>
          <Delete sx={{ mr: 1, fontSize: 20, color: "error.main" }} />
          Delete
        </MenuItem>
      )}
    </Menu>
  );
}
