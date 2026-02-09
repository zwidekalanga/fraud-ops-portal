import {
  Box,
  Flex,
  Text,
  HStack,
  VStack,
  Icon,
  Textarea,
} from "@chakra-ui/react";
import {
  Sliders,
  Plus,
  ToggleLeft,
  ToggleRight,
  X,
  Save,
  Edit2,
} from "lucide-react";
import { SentinelBadge } from "../../components/ui/badge";
import { formatConditions, type RulesData } from "../../hooks/useRules";
import { useAuth } from "../../contexts/AuthContext";

function getSeverityBadgeColor(
  severity: string,
): "red" | "orange" | "yellow" | "green" {
  switch (severity) {
    case "critical":
      return "red";
    case "high":
      return "orange";
    case "medium":
      return "yellow";
    default:
      return "green";
  }
}

export default function TerminalRules(props: RulesData) {
  const {
    rules,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    editingRule,
    setEditingRule,
    toggleRule,
    openNewRuleModal,
    openEditRuleModal,
    handleSaveRule,
  } = props;
  const { hasRole } = useAuth();
  const canManageRules = hasRole("admin");

  if (isLoading) {
    return (
      <Flex h="full" align="center" justify="center">
        <Text color="#00FF41" fontSize="xs" className="terminal-cursor">
          Loading rule definitions...
        </Text>
      </Flex>
    );
  }

  return (
    <Box h="full" display="flex" flexDirection="column" position="relative">
      {/* Header */}
      <Text
        color="rgba(0, 255, 65, 0.3)"
        fontSize="2xs"
        mb="1"
        letterSpacing="widest"
      >
        {"// RULE ENGINE CONFIGURATION"}
      </Text>
      <Text
        color="#00FF41"
        fontSize="sm"
        mb="4"
        textShadow="0 0 6px rgba(0, 255, 65, 0.3)"
      >
        {">"} sentinel rules --manage
      </Text>

      <Box
        border="1px solid rgba(0, 255, 65, 0.2)"
        bg="rgba(0, 255, 65, 0.02)"
        flex="1"
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        {/* Toolbar */}
        <Flex
          px="5"
          py="4"
          borderBottomWidth="1px"
          borderColor="rgba(0, 255, 65, 0.15)"
          justify="space-between"
          align="center"
          bg="rgba(0, 255, 65, 0.03)"
        >
          <HStack gap="3">
            <Icon boxSize="4" color="rgba(0, 255, 65, 0.5)">
              <Sliders />
            </Icon>
            <Text
              fontWeight="bold"
              color="#00FF41"
              fontSize="xs"
              letterSpacing="wider"
            >
              RULE DEFINITIONS [{rules.length}]
            </Text>
          </HStack>
          {canManageRules && (
            <Box
              as="button"
              display="flex"
              alignItems="center"
              px="4"
              py="2"
              border="1px solid rgba(0, 255, 65, 0.4)"
              color="#00FF41"
              bg="rgba(0, 255, 65, 0.05)"
              fontSize="xs"
              fontWeight="bold"
              _hover={{
                bg: "rgba(0, 255, 65, 0.1)",
                borderColor: "#00FF41",
                textShadow: "0 0 8px rgba(0, 255, 65, 0.5)",
              }}
              transition="all 0.15s"
              onClick={openNewRuleModal}
            >
              <Icon boxSize="3.5" mr="2">
                <Plus />
              </Icon>
              NEW RULE
            </Box>
          )}
        </Flex>

        {/* Rules list */}
        <Box flex="1" overflowY="auto">
          {rules.map((rule, index) => (
            <Box
              key={rule.code}
              p="5"
              display="flex"
              flexDirection={{ base: "column", md: "row" }}
              alignItems={{ md: "center" }}
              justifyContent="space-between"
              borderBottomWidth="1px"
              borderColor="rgba(0, 255, 65, 0.08)"
              _hover={{ bg: "rgba(0, 255, 65, 0.03)" }}
              transition="background 0.15s"
              role="group"
            >
              <Box
                flex="1"
                pr="6"
                cursor={canManageRules ? "pointer" : "default"}
                onClick={() => canManageRules && openEditRuleModal(rule as any)}
              >
                <HStack mb="2" gap="2">
                  <Text fontSize="2xs" color="rgba(0, 255, 65, 0.3)">
                    [{String(index + 1).padStart(2, "0")}]
                  </Text>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="#00FF41"
                    textShadow="0 0 4px rgba(0, 255, 65, 0.3)"
                    mr="2"
                  >
                    {rule.name}
                  </Text>
                  <SentinelBadge color={getSeverityBadgeColor(rule.severity)}>
                    {rule.severity.toUpperCase()}
                  </SentinelBadge>
                  <Text
                    fontSize="2xs"
                    color="rgba(0, 255, 65, 0.3)"
                    border="1px solid rgba(0, 255, 65, 0.1)"
                    px="1.5"
                    py="0.5"
                  >
                    {rule.code}
                  </Text>
                  {canManageRules && (
                    <Icon
                      boxSize="3"
                      color="rgba(0, 255, 65, 0.2)"
                      opacity={0}
                      _groupHover={{ opacity: 1 }}
                      transition="opacity 0.15s"
                    >
                      <Edit2 />
                    </Icon>
                  )}
                </HStack>
                <Text
                  color="rgba(0, 255, 65, 0.45)"
                  fontSize="xs"
                  mb="3"
                  lineHeight="relaxed"
                >
                  {rule.description}
                </Text>
                <HStack gap="3" flexWrap="wrap">
                  <Box
                    display="flex"
                    alignItems="center"
                    px="2"
                    py="1"
                    border="1px solid rgba(0, 255, 65, 0.1)"
                    bg="rgba(0, 255, 65, 0.02)"
                  >
                    <Text
                      fontSize="2xs"
                      color="rgba(0, 255, 65, 0.3)"
                      mr="2"
                      letterSpacing="wider"
                    >
                      CAT:
                    </Text>
                    <Text fontSize="2xs" color="rgba(0, 255, 65, 0.6)">
                      {rule.category}
                    </Text>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    px="2"
                    py="1"
                    border="1px solid rgba(0, 255, 65, 0.1)"
                    bg="rgba(0, 255, 65, 0.02)"
                  >
                    <Text
                      fontSize="2xs"
                      color="rgba(0, 255, 65, 0.3)"
                      mr="2"
                      letterSpacing="wider"
                    >
                      IMPACT:
                    </Text>
                    <Text fontSize="2xs" color="#FFB000">
                      +{rule.score}
                    </Text>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    px="2"
                    py="1"
                    border="1px solid rgba(0, 255, 65, 0.1)"
                    bg="rgba(0, 255, 65, 0.02)"
                    maxW="sm"
                  >
                    <Text
                      fontSize="2xs"
                      color="rgba(0, 255, 65, 0.3)"
                      mr="2"
                      letterSpacing="wider"
                    >
                      LOGIC:
                    </Text>
                    <Text
                      fontSize="2xs"
                      color="rgba(0, 255, 65, 0.5)"
                      isTruncated
                    >
                      {formatConditions(rule.conditions)}
                    </Text>
                  </Box>
                </HStack>
              </Box>

              {/* Toggle */}
              <Flex
                mt={{ base: "4", md: "0" }}
                alignItems="center"
                pl="4"
                borderLeftWidth={{ md: "1px" }}
                borderColor="rgba(0, 255, 65, 0.1)"
              >
                <Box
                  as="button"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  transition="all 0.15s"
                  color={rule.enabled ? "#00FF41" : "rgba(0, 255, 65, 0.2)"}
                  _hover={{
                    color: rule.enabled ? "#00FF41" : "rgba(0, 255, 65, 0.4)",
                    textShadow: rule.enabled
                      ? "0 0 8px rgba(0, 255, 65, 0.5)"
                      : "none",
                  }}
                  opacity={canManageRules ? 1 : 0.4}
                  cursor={canManageRules ? "pointer" : "not-allowed"}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (canManageRules) toggleRule(rule.code);
                  }}
                >
                  <Icon boxSize="7">
                    {rule.enabled ? <ToggleRight /> : <ToggleLeft />}
                  </Icon>
                  <Text
                    fontSize="2xs"
                    fontWeight="bold"
                    letterSpacing="widest"
                    mt="1"
                  >
                    {rule.enabled ? "ON" : "OFF"}
                  </Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Rule Editor Modal */}
      {isModalOpen && (
        <Box
          position="fixed"
          inset="0"
          zIndex={50}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p="4"
        >
          <Box
            position="absolute"
            inset="0"
            bg="rgba(0, 0, 0, 0.85)"
            onClick={() => setIsModalOpen(false)}
          />
          <Box
            position="relative"
            bg="#0a0a0a"
            border="1px solid rgba(0, 255, 65, 0.3)"
            boxShadow="0 0 30px rgba(0, 255, 65, 0.1), inset 0 0 30px rgba(0, 255, 65, 0.02)"
            w="full"
            maxW="2xl"
            overflow="hidden"
            display="flex"
            flexDirection="column"
            maxH="90vh"
          >
            {/* Modal header */}
            <Flex
              px="5"
              py="3"
              borderBottomWidth="1px"
              borderColor="rgba(0, 255, 65, 0.15)"
              justify="space-between"
              align="center"
              bg="rgba(0, 255, 65, 0.03)"
            >
              <Text
                fontWeight="bold"
                color="#00FF41"
                fontSize="xs"
                letterSpacing="wider"
                textShadow="0 0 6px rgba(0, 255, 65, 0.3)"
              >
                {">"}{" "}
                {editingRule.created_at ? "EDIT RULE" : "NEW RULE DEFINITION"}
              </Text>
              <Box
                as="button"
                p="1"
                color="rgba(0, 255, 65, 0.4)"
                _hover={{ color: "#00FF41" }}
                onClick={() => setIsModalOpen(false)}
              >
                <Icon boxSize="4">
                  <X />
                </Icon>
              </Box>
            </Flex>

            {/* Modal body */}
            <Box p="5" overflowY="auto">
              <Box as="form" id="ruleForm" onSubmit={handleSaveRule}>
                <VStack gap="4" align="stretch">
                  <Flex gap="4" direction={{ base: "column", md: "row" }}>
                    <Box flex="1">
                      <Text
                        fontSize="2xs"
                        color="rgba(0, 255, 65, 0.4)"
                        mb="1"
                        letterSpacing="wider"
                      >
                        RULE_NAME
                      </Text>
                      <Box
                        as="input"
                        required
                        type="text"
                        w="full"
                        bg="#0d0d0d"
                        border="1px solid rgba(0, 255, 65, 0.3)"
                        color="#00FF41"
                        fontSize="xs"
                        px="3"
                        py="2"
                        _focus={{
                          borderColor: "#00FF41",
                          boxShadow: "0 0 8px rgba(0, 255, 65, 0.3)",
                        }}
                        value={editingRule.name || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEditingRule({
                            ...editingRule,
                            name: e.target.value,
                          })
                        }
                        placeholder="e.g. High Velocity Transactions"
                      />
                    </Box>
                    <Box flex="1">
                      <Text
                        fontSize="2xs"
                        color="rgba(0, 255, 65, 0.4)"
                        mb="1"
                        letterSpacing="wider"
                      >
                        RULE_CODE
                      </Text>
                      <Box
                        as="input"
                        required
                        type="text"
                        w="full"
                        bg="#0d0d0d"
                        border="1px solid rgba(0, 255, 65, 0.3)"
                        color="#00FF41"
                        fontSize="xs"
                        px="3"
                        py="2"
                        _focus={{
                          borderColor: "#00FF41",
                          boxShadow: "0 0 8px rgba(0, 255, 65, 0.3)",
                        }}
                        value={editingRule.code || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEditingRule({
                            ...editingRule,
                            code: e.target.value,
                          })
                        }
                        placeholder="e.g. VEL-001"
                        disabled={!!editingRule.created_at}
                      />
                    </Box>
                  </Flex>

                  <Box>
                    <Text
                      fontSize="2xs"
                      color="rgba(0, 255, 65, 0.4)"
                      mb="1"
                      letterSpacing="wider"
                    >
                      DESCRIPTION
                    </Text>
                    <Textarea
                      required
                      rows={2}
                      w="full"
                      bg="#0d0d0d"
                      border="1px solid rgba(0, 255, 65, 0.3)"
                      color="#00FF41"
                      fontSize="xs"
                      px="3"
                      py="2"
                      resize="none"
                      _focus={{
                        borderColor: "#00FF41",
                        boxShadow: "0 0 8px rgba(0, 255, 65, 0.3)",
                      }}
                      _placeholder={{ color: "rgba(0, 255, 65, 0.2)" }}
                      value={editingRule.description || ""}
                      onChange={(e) =>
                        setEditingRule({
                          ...editingRule,
                          description: e.target.value,
                        })
                      }
                      placeholder="Explain what this rule detects..."
                    />
                  </Box>

                  <Flex gap="4" direction={{ base: "column", md: "row" }}>
                    <Box flex="1">
                      <Text
                        fontSize="2xs"
                        color="rgba(0, 255, 65, 0.4)"
                        mb="1"
                        letterSpacing="wider"
                      >
                        CATEGORY
                      </Text>
                      <Box
                        as="select"
                        w="full"
                        bg="#0d0d0d"
                        border="1px solid rgba(0, 255, 65, 0.3)"
                        color="#00FF41"
                        fontSize="xs"
                        px="3"
                        py="2"
                        appearance="none"
                        _focus={{
                          borderColor: "#00FF41",
                          boxShadow: "0 0 8px rgba(0, 255, 65, 0.3)",
                        }}
                        value={editingRule.category || ""}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setEditingRule({
                            ...editingRule,
                            category: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Category</option>
                        <option value="velocity">Velocity</option>
                        <option value="amount">Amount</option>
                        <option value="geographic">Geographic</option>
                        <option value="behavioral">Behavioral</option>
                        <option value="device">Device</option>
                        <option value="combined">Combined</option>
                      </Box>
                    </Box>
                    <Box flex="1">
                      <Text
                        fontSize="2xs"
                        color="rgba(0, 255, 65, 0.4)"
                        mb="1"
                        letterSpacing="wider"
                      >
                        SEVERITY
                      </Text>
                      <Box
                        as="select"
                        w="full"
                        bg="#0d0d0d"
                        border="1px solid rgba(0, 255, 65, 0.3)"
                        color="#00FF41"
                        fontSize="xs"
                        px="3"
                        py="2"
                        appearance="none"
                        _focus={{
                          borderColor: "#00FF41",
                          boxShadow: "0 0 8px rgba(0, 255, 65, 0.3)",
                        }}
                        value={editingRule.severity || "low"}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setEditingRule({
                            ...editingRule,
                            severity: e.target.value,
                          })
                        }
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </Box>
                    </Box>
                    <Box flex="1">
                      <Text
                        fontSize="2xs"
                        color="rgba(0, 255, 65, 0.4)"
                        mb="1"
                        letterSpacing="wider"
                      >
                        SCORE_IMPACT
                      </Text>
                      <Box
                        as="input"
                        type="number"
                        w="full"
                        bg="#0d0d0d"
                        border="1px solid rgba(0, 255, 65, 0.3)"
                        color="#FFB000"
                        fontSize="xs"
                        px="3"
                        py="2"
                        _focus={{
                          borderColor: "#00FF41",
                          boxShadow: "0 0 8px rgba(0, 255, 65, 0.3)",
                        }}
                        value={editingRule.score || 0}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEditingRule({
                            ...editingRule,
                            score: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </Box>
                  </Flex>

                  <Box>
                    <Text
                      fontSize="2xs"
                      color="rgba(0, 255, 65, 0.4)"
                      mb="1"
                      letterSpacing="wider"
                    >
                      LOGIC_CONDITION
                    </Text>
                    <Textarea
                      required
                      rows={3}
                      w="full"
                      bg="#050505"
                      border="1px solid rgba(0, 255, 65, 0.4)"
                      color="#00FF41"
                      fontSize="xs"
                      px="3"
                      py="2"
                      fontFamily="'IBM Plex Mono', monospace"
                      resize="none"
                      _focus={{
                        borderColor: "#00FF41",
                        boxShadow: "0 0 12px rgba(0, 255, 65, 0.3)",
                      }}
                      _placeholder={{ color: "rgba(0, 255, 65, 0.2)" }}
                      value={
                        typeof editingRule.conditions === "string"
                          ? editingRule.conditions
                          : formatConditions(editingRule.conditions)
                      }
                      onChange={(e) =>
                        setEditingRule({
                          ...editingRule,
                          conditions: e.target.value,
                        })
                      }
                      placeholder="e.g. amount > 5000 AND currency == 'USD'"
                    />
                    <Text fontSize="2xs" color="rgba(0, 255, 65, 0.25)" mt="1">
                      // Use standard logical operators (AND, OR, &gt;, &lt;,
                      ==)
                    </Text>
                  </Box>
                </VStack>
              </Box>
            </Box>

            {/* Modal footer */}
            <Flex
              px="5"
              py="3"
              borderTopWidth="1px"
              borderColor="rgba(0, 255, 65, 0.15)"
              justify="flex-end"
              gap="3"
              bg="rgba(0, 255, 65, 0.02)"
            >
              <Box
                as="button"
                px="4"
                py="2"
                border="1px solid rgba(0, 255, 65, 0.2)"
                color="rgba(0, 255, 65, 0.5)"
                fontSize="xs"
                fontWeight="bold"
                _hover={{
                  borderColor: "rgba(0, 255, 65, 0.4)",
                  color: "#00FF41",
                }}
                transition="all 0.15s"
                onClick={() => setIsModalOpen(false)}
              >
                CANCEL
              </Box>
              <Box
                as="button"
                type="submit"
                form="ruleForm"
                display="flex"
                alignItems="center"
                px="4"
                py="2"
                border="1px solid rgba(0, 255, 65, 0.4)"
                bg="rgba(0, 255, 65, 0.08)"
                color="#00FF41"
                fontSize="xs"
                fontWeight="bold"
                _hover={{
                  bg: "rgba(0, 255, 65, 0.15)",
                  borderColor: "#00FF41",
                  textShadow: "0 0 8px rgba(0, 255, 65, 0.5)",
                  boxShadow: "0 0 12px rgba(0, 255, 65, 0.2)",
                }}
                transition="all 0.15s"
              >
                <Icon boxSize="3.5" mr="2">
                  <Save />
                </Icon>
                SAVE RULE
              </Box>
            </Flex>
          </Box>
        </Box>
      )}
    </Box>
  );
}
