import {
  AddCircle,
  Delete,
  Download,
  Edit,
  EditOff,
  ExitToApp,
  Lock,
  MoreVert,
  Save,
  Settings,
} from "@mui/icons-material";
import { IconButton, type IconButtonProps, Tooltip } from "@mui/material";
import { type ReactElement, cloneElement } from "react";

type TooltipButtonType =
  | "create"
  | "delete"
  | "download"
  | "edit"
  | "edit-off"
  | "lock"
  | "logout"
  | "menu"
  | "save"
  | "settings";

type TooltipIconButtonProps = IconButtonProps & {
  variant: TooltipButtonType;
};

const IconsMap: Record<
  TooltipButtonType,
  {
    color?: IconButtonProps["color"];
    icon: ReactElement;
    name: string;
  }
> = {
  create: { icon: <AddCircle />, name: "Create" },
  delete: { color: "error", icon: <Delete />, name: "Delete" },
  download: { icon: <Download />, name: "Download" },
  edit: { icon: <Edit />, name: "Edit" },
  "edit-off": { icon: <EditOff />, name: "Edit off" },
  lock: { color: "warning", icon: <Lock />, name: "Lock" },
  logout: { icon: <ExitToApp />, name: "Logout" },
  menu: { icon: <MoreVert />, name: "Menu" },
  save: { icon: <Save />, name: "Save" },
  settings: { icon: <Settings />, name: "Settings" },
};

export function TooltipIconButton({ disabled, size, variant, ...props }: TooltipIconButtonProps) {
  const { color = "default", icon, name } = IconsMap[variant];

  const Icon = cloneElement(icon, { fontSize: size });

  const button = (
    <IconButton color={color} disabled={disabled} {...props}>
      {Icon}
    </IconButton>
  );

  return disabled ? button : <Tooltip title={name}>{button}</Tooltip>;
}
