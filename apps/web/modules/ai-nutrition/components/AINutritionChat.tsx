"use client";
import { useAutoScroll } from "@/hooks";
import { SmartToy as BotIcon, Person as PersonIcon, Send as SendIcon } from "@mui/icons-material";
import {
  alpha,
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Fade,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { chatWithNutritionAssistant } from "../config/nutrition-ai";
import { QUICK_RESPONSES } from "../config/prompts";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isQuickResponse?: boolean;
};

function formatDate(date: Date): string {
  return date.toLocaleString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// Smart quick responses based on context
function getSmartSuggestions() {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 10) {
    return ["Plan my breakfast", "How many calories for breakfast?", "Suggest protein foods"];
  }
  if (hour >= 11 && hour < 14) {
    return ["Plan my lunch", "How many calories left?", "Quick lunch ideas"];
  }
  if (hour >= 17 && hour < 21) {
    return ["Plan my dinner", "What should I eat tonight?", "How am I doing today?"];
  }
  return ["How many calories left?", "Suggest protein foods", "Plan my next meal"];
}

function getInitialMessage(): Message {
  const hour = new Date().getHours();
  let greeting: string = QUICK_RESPONSES.GREETING;

  if (hour < 12) {
    greeting = `🌅 Good morning! ${greeting}`;
  } else if (hour < 17) {
    greeting = `☀️ Good afternoon! ${greeting}`;
  } else {
    greeting = `🌆 Good evening! ${greeting}`;
  }

  return {
    id: "1",
    content: greeting,
    isUser: false,
    timestamp: new Date(),
    isQuickResponse: true,
  };
}

function ChatLoading() {
  const theme = useTheme();

  return (
    <Fade in>
      <Box display="flex" justifyContent="flex-start">
        <Stack direction="row" spacing={2} maxWidth="85%">
          <Avatar
            sx={{
              width: 40,
              height: 40,
            }}
          >
            <BotIcon fontSize="small" />
          </Avatar>
          <Paper
            elevation={0}
            sx={{
              padding: 2,
              borderRadius: 3,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <CircularProgress
                size={16}
                thickness={4}
                sx={{
                  color: theme.palette.secondary.main,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                }}
              >
                Thinking...
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </Fade>
  );
}

function FormattedMessage({ message }: { message?: string }) {
  if (!message) return null;

  const formattedContent = message.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  return formattedContent.split("\n").map((line, index) => (
    <Typography
      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
      key={index}
      variant="body2"
      component="div"
      gutterBottom={!!line.trim()}
      sx={{
        lineHeight: 1.6,
        "& strong": {
          fontWeight: 600,
          color: "primary.main",
        },
      }}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{ __html: line || "<br>" }}
    />
  ));
}

export function AINutritionChat() {
  const theme = useTheme();
  const [messages, setMessages] = useState([getInitialMessage()]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesRef = useAutoScroll([messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      console.log("🚀 Sending message to AI:", currentInput);
      const response = await chatWithNutritionAssistant(currentInput);
      console.log("📥 AI Response received:", response);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.success
          ? response.message
          : "Sorry, I encountered an error. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("💥 Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Paper>
      <Box height={600} mx="auto" display="flex" flexDirection="column">
        {/* Header */}
        <Box
          p={3}
          sx={{
            position: "relative",
            bgcolor: "primary.dark",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Avatar
              sx={{
                width: 48,
                height: 48,
                background: alpha(theme.palette.common.white, 0.2),
                backdropFilter: "blur(10px)",
                border: `2px solid ${alpha(theme.palette.common.white, 0.3)}`,
              }}
            >
              <BotIcon sx={{ color: "white" }} />
            </Avatar>
            <Box>
              <Typography variant="h6" gutterBottom>
                Nutri - AI Nutrition Assistant
              </Typography>
              <Typography variant="body2">Ask me about your nutrition goals! 🥗✨</Typography>
            </Box>
          </Stack>
        </Box>

        {/* Messages */}
        <Box flex={1} ref={messagesRef} overflow="auto" p={3}>
          <Stack spacing={3}>
            {messages.map(({ id, isUser, isQuickResponse, content, timestamp }, index) => (
              <Fade in={true} timeout={300 + index * 100} key={id}>
                <Box display="flex" justifyContent={isUser ? "flex-end" : "flex-start"}>
                  <Stack direction={isUser ? "row-reverse" : "row"} spacing={2} maxWidth="85%">
                    {/* Avatar */}
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        background: isUser
                          ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                          : `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                        boxShadow: `0 4px 12px ${alpha(isUser ? theme.palette.primary.main : theme.palette.secondary.main, 0.3)}`,
                        opacity: isQuickResponse ? 0.8 : 1,
                        border: `2px solid ${alpha(theme.palette.common.white, 0.8)}`,
                      }}
                    >
                      {isUser ? <PersonIcon fontSize="small" /> : <BotIcon fontSize="small" />}
                    </Avatar>

                    {/* Message bubble */}
                    <Paper
                      elevation={0}
                      sx={{
                        padding: 2.5,
                        borderRadius: 3,
                        opacity: isQuickResponse ? 0.9 : 1,
                        background: isUser ? theme.palette.grey[700] : theme.palette.primary.dark,
                        position: "relative",
                        transform: "translateY(0)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <Box>
                        <Box marginBottom={1}>
                          <FormattedMessage message={content} />
                        </Box>
                        <Typography
                          variant="caption"
                          display="block"
                          sx={{
                            color: isUser
                              ? alpha(theme.palette.common.white, 0.7)
                              : theme.palette.text.secondary,
                            fontWeight: 500,
                            fontSize: "0.75rem",
                          }}
                        >
                          {formatDate(timestamp)}
                        </Typography>
                      </Box>
                    </Paper>
                  </Stack>
                </Box>
              </Fade>
            ))}

            {/* Loading indicator */}
            {isLoading && <ChatLoading />}
          </Stack>
        </Box>

        {/* Input */}
        <Box
          sx={{
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            p: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.default, 0.95)})`,
            backdropFilter: "blur(20px)",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              fullWidth
              multiline
              maxRows={3}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about your nutrition goals..."
              variant="outlined"
              size="small"
              disabled={isLoading}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              size="medium"
            >
              <SendIcon />
            </IconButton>
          </Stack>

          {/* Smart quick suggestions based on time */}
          <Stack direction="row" spacing={1} marginTop={2} flexWrap="wrap" gap={1}>
            {getSmartSuggestions().map((suggestion, index) => (
              <Fade in timeout={500 + index * 100} key={suggestion}>
                <Chip
                  label={suggestion}
                  onClick={() => setInputMessage(suggestion)}
                  disabled={isLoading}
                  size="medium"
                  variant="outlined"
                  clickable
                />
              </Fade>
            ))}
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
}
