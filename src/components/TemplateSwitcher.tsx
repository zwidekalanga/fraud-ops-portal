import { Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import {
  useTemplate,
  TEMPLATE_NAMES,
  type TemplateName,
} from "../contexts/TemplateContext";
import { Paintbrush } from "lucide-react";
import { useState } from "react";

const TEMPLATE_LABELS: Record<TemplateName, string> = {
  brutalist: "Brutalist",
  terminal: "Terminal",
};

const TEMPLATE_COLORS: Record<TemplateName, string> = {
  brutalist: "#FACC15",
  terminal: "#00FF41",
};

export function TemplateSwitcher() {
  const current = useTemplate();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (template: TemplateName) => {
    navigate({
      search: (prev: Record<string, unknown>) => ({ ...prev, template }),
    });
    setIsOpen(false);
  };

  return (
    <Box position="fixed" bottom="6" right="6" zIndex={9999}>
      {/* Dropdown */}
      {isOpen && (
        <Box
          position="absolute"
          bottom="14"
          right="0"
          bg="white"
          rounded="xl"
          shadow="2xl"
          borderWidth="1px"
          borderColor="gray.200"
          overflow="hidden"
          minW="200px"
          className="animate-fade-in"
        >
          <Box
            px="4"
            py="3"
            borderBottomWidth="1px"
            borderColor="gray.100"
            bg="gray.50"
          >
            <Text
              fontSize="xs"
              fontWeight="bold"
              color="gray.500"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              Select Template
            </Text>
          </Box>
          <Flex direction="column" py="1">
            {TEMPLATE_NAMES.map((name) => (
              <Box
                key={name}
                as="button"
                display="flex"
                alignItems="center"
                gap="3"
                w="full"
                px="4"
                py="2.5"
                fontSize="sm"
                fontWeight={current === name ? "bold" : "medium"}
                color={current === name ? "gray.900" : "gray.600"}
                bg={current === name ? "gray.50" : "transparent"}
                _hover={{ bg: "gray.50" }}
                transition="all 0.15s"
                textAlign="left"
                onClick={() => handleSelect(name)}
              >
                <Box
                  w="3"
                  h="3"
                  rounded="full"
                  bg={TEMPLATE_COLORS[name]}
                  borderWidth="2px"
                  borderColor={current === name ? "gray.800" : "transparent"}
                  flexShrink={0}
                />
                <Text>{TEMPLATE_LABELS[name]}</Text>
                {current === name && (
                  <Text ml="auto" fontSize="xs" color="gray.400">
                    Active
                  </Text>
                )}
              </Box>
            ))}
          </Flex>
        </Box>
      )}

      {/* Toggle Button */}
      <Box
        as="button"
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="12"
        h="12"
        rounded="full"
        bg="gray.900"
        color="white"
        shadow="xl"
        _hover={{ bg: "gray.700", transform: "scale(1.05)" }}
        _active={{ transform: "scale(0.95)" }}
        transition="all 0.2s"
        onClick={() => setIsOpen(!isOpen)}
        title="Switch template"
      >
        <Paintbrush size={20} />
      </Box>
    </Box>
  );
}
