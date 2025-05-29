"use client";

import { Box, Container, Divider, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const links = [
  { href: "/dashboard/data-management/tags", label: "Meal Tags" },
  { href: "/dashboard/data-management/ingredient-groups", label: "Ingredient Groups" },
];

export default function DataManagementPage() {
  const pathname = usePathname();

  const active = useMemo(() => {
    return links.find((link) => pathname?.startsWith(link.href))?.href;
  }, [pathname]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography gutterBottom variant="h4">
        Data Management
      </Typography>

      <Typography color="text.secondary" gutterBottom variant="body1">
        Manage your reusable categories like meal tags and ingredient groups.
      </Typography>

      <Divider sx={{ my: 4 }} />

      <Stack spacing={2}>
        {links.map((link) => (
          <Box
            component={Link}
            href={link.href}
            key={link.href}
            sx={{
              "&:hover": {
                backgroundColor: "action.hover",
              },
              backgroundColor: active === link.href ? "action.selected" : "background.paper",
              border: "1px solid",
              borderColor: active === link.href ? "primary.main" : "divider",
              borderRadius: 2,
              p: 3,
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            <Typography variant="h6">{link.label}</Typography>
          </Box>
        ))}
      </Stack>
    </Container>
  );
}
