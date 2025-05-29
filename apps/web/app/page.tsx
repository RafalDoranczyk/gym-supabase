"use client";

import { loginWithGithub, loginWithGoogle } from "@/actions";
import { GitHub, Google } from "@mui/icons-material";
import { Box, Button, Container, Typography } from "@mui/material";

export default function HomePage() {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          alignItems: "center",
          backgroundColor: "background.default",
          borderRadius: 2,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "100vh",
          padding: 4,
        }}
      >
        <Typography
          sx={{
            color: "text.primary",
            fontWeight: 600,
            marginBottom: 3,
            textAlign: "center",
          }}
          variant="h4"
        >
          Welcome to the Gym App
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
            fontWeight: 400,
            marginBottom: 4,
            textAlign: "center",
          }}
          variant="h6"
        >
          Log in to get started
        </Typography>

        <Button
          onClick={loginWithGithub}
          sx={{
            "&:hover": {
              backgroundColor: "#333",
              boxShadow: 4,
            },
            alignItems: "center",
            backgroundColor: "#000",
            borderRadius: 3,
            boxShadow: 2,
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            marginBottom: 3,
            padding: "12px 24px",
            width: "100%",
          }}
          variant="contained"
        >
          <GitHub sx={{ marginRight: 2 }} />
          Log in with GitHub
        </Button>

        <Button
          onClick={loginWithGoogle}
          sx={{
            "&:hover": {
              backgroundColor: "#F1F3F4",
              borderColor: "#357AE8",
              boxShadow: 4,
            },
            alignItems: "center",
            borderColor: "#4285F4",
            borderRadius: 3,
            boxShadow: 2,
            color: "#4285F4",
            display: "flex",
            justifyContent: "center",
            marginBottom: 3,
            padding: "12px 24px",
            width: "100%",
          }}
          variant="outlined"
        >
          <Google sx={{ marginRight: 2 }} />
          Log in with Google
        </Button>
      </Box>
    </Container>
  );
}
