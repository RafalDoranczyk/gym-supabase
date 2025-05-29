"use client";

import { ListItemButton, ListItemIcon, Typography } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export type NavigationLinkElementProps = {
  icon: ReactNode;
  id: string;
  text: string;
  to: string;
};

export function NavigationLinkElement({ icon, text, to }: NavigationLinkElementProps) {
  const pathname = usePathname();

  const isSelected = (current: string, target: string) => {
    return target === "/dashboard" ? current === target : current.includes(target);
  };

  const selected = isSelected(pathname, to);

  return (
    <ListItemButton component={Link} href={to} selected={selected} sx={{ textDecoration: "none" }}>
      <ListItemIcon
        sx={{
          svg: {
            color: ({ palette }) => (selected ? palette.primary.main : "unset"),
            height: 20,
          },
        }}
      >
        {icon}
      </ListItemIcon>
      <Typography color="textPrimary" fontWeight={selected ? "bold" : "normal"} variant="subtitle2">
        {text}
      </Typography>
    </ListItemButton>
  );
}
