import { Box } from "@mui/material";
import CountUp from "react-countup";

type CountIndicatorProps = {
  end: number;
  start?: number;
};

export function CountIndicator({ end, start = 0 }: CountIndicatorProps) {
  return (
    <CountUp delay={0} duration={0.4} end={end} start={start}>
      {({ countUpRef }) => (
        <Box
          alignItems="center"
          aria-label={`Count: ${end}`}
          bgcolor={({ palette }) => palette.action.hover}
          borderRadius={2}
          display="flex"
          fontSize={14}
          height={32}
          justifyContent="center"
          width={32}
        >
          <span ref={countUpRef} />
        </Box>
      )}
    </CountUp>
  );
}
