import { Box, Card, CardContent, Divider, Grid, Skeleton, Stack } from "@mui/material";

const CARDS_PER_SECTION = 8; // 4 per row, 2 rows

export default function Loading() {
  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={4}>
        {/* Page Header Skeleton */}
        <Skeleton variant="text" width={250} height={56} sx={{ fontSize: "2.5rem" }} />

        {/* Ingredient Groups Section */}
        <Box>
          {/* Section Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
            <Stack spacing={1}>
              <Skeleton variant="text" width={200} height={40} sx={{ fontSize: "1.75rem" }} />
              <Skeleton variant="text" width={450} height={24} />
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <Skeleton variant="rounded" width={200} height={40} sx={{ borderRadius: 3 }} />
              <Skeleton
                variant="rounded"
                width={120}
                height={40}
                sx={{
                  borderRadius: 3,
                  bgcolor: "rgba(139, 92, 246, 0.1)",
                }}
              />
            </Stack>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* Ingredient Groups Cards Grid */}
          <Grid container spacing={2}>
            {Array.from({ length: CARDS_PER_SECTION }, (_, i) => i).map((cardKey) => (
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                  lg: 3,
                }}
                key={`ig-${cardKey}`}
              >
                <Card
                  sx={{
                    background: "linear-gradient(135deg, #141721 0%, #1A1F2E 100%)",
                    border: "1px solid #1E293B",
                    borderRadius: 2,
                  }}
                >
                  <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {/* Card Header */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Skeleton variant="circular" width={12} height={12} />
                        <Skeleton variant="text" width={100} height={28} />
                      </Box>
                      <Skeleton variant="circular" width={32} height={32} sx={{ opacity: 0.5 }} />
                    </Box>

                    {/* Description */}
                    <Skeleton variant="text" width="90%" height={20} sx={{ mb: 2 }} />

                    {/* Count */}
                    <Skeleton variant="text" width={80} height={20} />

                    {/* Example Tags */}
                    <Stack direction="row" spacing={0.5}>
                      <Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: 3 }} />
                      <Skeleton variant="rounded" width={45} height={24} sx={{ borderRadius: 3 }} />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Meal Tags Section */}
        <Box>
          {/* Section Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
            <Stack spacing={1}>
              <Skeleton variant="text" width={150} height={40} sx={{ fontSize: "1.75rem" }} />
              <Skeleton variant="text" width={400} height={24} />
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <Skeleton variant="rounded" width={200} height={40} sx={{ borderRadius: 3 }} />
              <Skeleton
                variant="rounded"
                width={100}
                height={40}
                sx={{
                  borderRadius: 3,
                  bgcolor: "rgba(139, 92, 246, 0.1)",
                }}
              />
            </Stack>
          </Stack>

          <Divider sx={{ mb: 3 }} />
        </Box>
      </Stack>
    </Box>
  );
}
