import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import type { ReactNode } from "react";

type UserSettingsCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  variant?: "default" | "coming-soon";
};

export function UserSettingsCard({
  title,
  description,
  children,
  variant = "default",
}: UserSettingsCardProps) {
  return (
    <Card
      sx={{
        mb: 3,
        backgroundColor: variant === "coming-soon" ? "action.hover" : "background.paper",
        border: 1,
        borderColor: variant === "coming-soon" ? "action.disabled" : "divider",
        transition: "all 0.2s ease",
        ...(variant === "coming-soon" && {
          opacity: 0.7,
          cursor: "not-allowed",
          "& *": {
            color: "text.disabled",
          },
        }),
      }}
    >
      <CardHeader
        sx={{ pb: 1 }}
        title={
          <Typography
            variant="h6"
            component="h2"
            fontWeight={600}
            color={variant === "coming-soon" ? "text.disabled" : "text.primary"}
          >
            {title}
          </Typography>
        }
        subheader={
          description && (
            <Typography
              variant="body2"
              color={variant === "coming-soon" ? "text.disabled" : "text.secondary"}
              sx={{ mt: 0.5 }}
            >
              {description}
            </Typography>
          )
        }
      />
      <CardContent
        sx={{
          pt: 0,
          ...(variant === "coming-soon" && {
            pointerEvents: "none",
          }),
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
}
