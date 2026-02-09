import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  color?: "green" | "red" | "yellow" | "blue" | "gray" | "orange" | "purple";
  className?: string;
}

const colors = {
  green: {
    bg: "emerald.100",
    color: "emerald.800",
    borderColor: "emerald.200",
  },
  red: {
    bg: "red.100",
    color: "red.800",
    borderColor: "red.200",
  },
  yellow: {
    bg: "yellow.100",
    color: "yellow.800",
    borderColor: "yellow.200",
  },
  blue: {
    bg: "blue.100",
    color: "blue.800",
    borderColor: "blue.200",
  },
  gray: {
    bg: "slate.100",
    color: "slate.800",
    borderColor: "slate.200",
  },
  orange: {
    bg: "orange.100",
    color: "orange.800",
    borderColor: "orange.200",
  },
  purple: {
    bg: "purple.100",
    color: "purple.800",
    borderColor: "purple.200",
  },
};

export function SentinelBadge({ children, color = "gray", className }: BadgeProps) {
  const colorScheme = colors[color];

  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      px="2.5"
      py="0.5"
      rounded="full"
      fontSize="xs"
      fontWeight="medium"
      borderWidth="1px"
      bg={colorScheme.bg}
      color={colorScheme.color}
      borderColor={colorScheme.borderColor}
      className={className}
    >
      {children}
    </Box>
  );
}
