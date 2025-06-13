"use client";

import { SmartToy as BotIcon, AutoAwesome as SparkleIcon } from "@mui/icons-material";
import { Badge, Box, Dialog, DialogContent, Fab, Tooltip, Zoom } from "@mui/material";
import { useState } from "react";
import { AINutritionChat } from "./AINutritionChat";

export function AIChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewSuggestion, setHasNewSuggestion] = useState(true);

  const handleOpen = () => {
    setIsOpen(true);
    setHasNewSuggestion(false); // Clear notification when opened
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <Tooltip title="AI Nutrition Assistant" placement="left" arrow>
        <Box position="fixed" bottom={24} right={24} zIndex={1000}>
          <Badge badgeContent={hasNewSuggestion ? "!" : 0} color="warning">
            <Zoom in>
              <Fab onClick={handleOpen} color="primary" size="large">
                <Box display="flex" alignItems="center" position="relative">
                  <BotIcon fontSize="large" />
                  <SparkleIcon
                    fontSize="small"
                    style={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      animation: "sparkle 2s ease-in-out infinite",
                    }}
                  />
                </Box>
              </Fab>
            </Zoom>
          </Badge>
        </Box>
      </Tooltip>

      {/* Chat Dialog */}
      <Dialog open={isOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent
          sx={{
            padding: 0,
          }}
        >
          <AINutritionChat />
        </DialogContent>
      </Dialog>

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes sparkle {
          0%, 100% { 
            opacity: 0.3; 
            transform: rotate(0deg) scale(0.8); 
          }
          50% { 
            opacity: 1; 
            transform: rotate(180deg) scale(1.2); 
          }
        }
      `}</style>
    </>
  );
}
