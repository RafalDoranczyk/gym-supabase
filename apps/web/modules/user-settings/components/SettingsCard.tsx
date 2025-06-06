import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import type { ReactNode } from "react";

type SettingsCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  variant?: "default" | "coming-soon";
};

export function SettingsCard({
  title,
  description,
  children,
  variant = "default",
}: SettingsCardProps) {
  return (
    <Card
      sx={{
        mb: 3,
        backgroundColor: variant === "coming-soon" ? "rgba(255,255,255,0.02)" : "background.paper",
        border: 1,
        borderColor: variant === "coming-soon" ? "rgba(255,255,255,0.1)" : "divider",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: variant === "coming-soon" ? "rgba(255,255,255,0.2)" : "primary.main",
          transform: "translateY(-1px)",
          boxShadow: 2,
        },
      }}
    >
      <CardHeader
        sx={{ pb: 1 }}
        title={
          <Typography variant="h6" component="h2" fontWeight={600}>
            {title}
          </Typography>
        }
        subheader={
          description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {description}
            </Typography>
          )
        }
      />
      <CardContent sx={{ pt: 0 }}>{children}</CardContent>
    </Card>
  );
}
