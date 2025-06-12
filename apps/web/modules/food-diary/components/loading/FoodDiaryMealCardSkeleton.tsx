import { Box, Card, Skeleton } from "@mui/material";

export function FoodDiaryMealCardSkeleton() {
  return (
    <Card sx={{ p: 2.5 }}>
      <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
        <Skeleton variant="circular" width={36} height={36} />
        <Box flex={1}>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="40%" height={16} />
        </Box>
        <Box display="flex" gap={0.5}>
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
      </Box>

      {/* Nutrition chips */}
      <Box display="flex" gap={0.5} flexWrap="wrap" mb={1.5}>
        <Skeleton variant="rounded" width={60} height={24} />
        <Skeleton variant="rounded" width={80} height={24} />
        <Skeleton variant="rounded" width={70} height={24} />
        <Skeleton variant="rounded" width={60} height={24} />
      </Box>

      {/* Divider */}
      <Skeleton variant="rectangular" width="100%" height={1} sx={{ my: 1.5 }} />

      {/* Ingredients */}
      <Box display="flex" flexDirection="column" gap={0.75}>
        {[1, 2, 3].map((i) => (
          <Box
            key={i}
            p={1.5}
            bgcolor="action.hover"
            borderRadius={1}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Skeleton variant="text" width={120} height={20} />
              <Skeleton variant="text" width={60} height={16} />
            </Box>
            <Box display="flex" gap={0.5}>
              <Skeleton variant="rounded" width={50} height={20} />
              <Skeleton variant="rounded" width={60} height={20} />
              <Skeleton variant="rounded" width={55} height={20} />
              <Skeleton variant="rounded" width={45} height={20} />
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
