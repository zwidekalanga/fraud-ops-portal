import {
  Box,
  Flex,
  Text,
  HStack,
  VStack,
  Icon,
  Spinner,
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
  Zap,
  Terminal,
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

export default function BrutalistRules(props: RulesData) {
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
        <Box textAlign="center">
          <Spinner size="xl" color="#000" borderWidth="4px" />
          <Text
            mt="4"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="sm"
            fontWeight="700"
            textTransform="uppercase"
            color="#000"
          >
            Loading rules...
          </Text>
        </Box>
      </Flex>
    );
  }

  return (
    <Box h="full" display="flex" flexDirection="column" position="relative">
      {/* Page Header */}
      <Flex
        mb="6"
        align="center"
        justify="space-between"
        className="brutal-animate-in"
      >
        <Box>
          <Text
            fontSize="5xl"
            fontWeight="800"
            color="#000"
            fontFamily="'Bebas Neue', sans-serif"
            letterSpacing="wider"
            lineHeight="1"
          >
            RULES ENGINE
          </Text>
          <Text
            fontSize="xs"
            color="#000"
            fontFamily="'JetBrains Mono', monospace"
            fontWeight="600"
            mt="1"
            opacity={0.5}
            textTransform="uppercase"
          >
            {">"} Detection rules // {rules.length} definitions loaded
          </Text>
        </Box>
        {canManageRules && (
          <Box
            as="button"
            display="flex"
            alignItems="center"
            px="5"
            py="3"
            bg="#FACC15"
            color="#000"
            border="3px solid #000"
            boxShadow="4px 4px 0px #000"
            fontSize="xs"
            fontWeight="800"
            fontFamily="'JetBrains Mono', monospace"
            textTransform="uppercase"
            letterSpacing="wider"
            _hover={{
              transform: "translate(-2px,-2px)",
              boxShadow: "6px 6px 0px #000",
            }}
            _active={{
              transform: "translate(0,0)",
              boxShadow: "2px 2px 0px #000",
            }}
            transition="all 0.1s"
            onClick={openNewRuleModal}
          >
            <Icon boxSize="4" mr="2">
              <Plus />
            </Icon>
            New Rule
          </Box>
        )}
      </Flex>

      {/* Rules List */}
      <Box
        bg="#FAFAFA"
        border="3px solid #000"
        boxShadow="8px 8px 0px #000"
        flex="1"
        display="flex"
        flexDirection="column"
        overflow="hidden"
        className="brutal-animate-in brutal-stagger-1"
        opacity={0}
      >
        {/* List header */}
        <Flex
          px="6"
          py="4"
          borderBottom="3px solid #000"
          bg="#000"
          justify="space-between"
          align="center"
        >
          <HStack>
            <Icon boxSize="4" color="#FACC15" mr="1">
              <Sliders />
            </Icon>
            <Text
              fontSize="sm"
              fontWeight="800"
              color="#FACC15"
              fontFamily="'JetBrains Mono', monospace"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              Rule Definitions
            </Text>
          </HStack>
          <Box
            px="3"
            py="1"
            bg="#FACC15"
            color="#000"
            fontSize="xs"
            fontWeight="800"
            fontFamily="'JetBrains Mono', monospace"
            border="2px solid #FACC15"
          >
            {rules.length}
          </Box>
        </Flex>

        <Box flex="1" overflowY="auto" className="brutal-scroll">
          {rules.map((rule, ruleIndex) => (
            <Box
              key={rule.code}
              p="5"
              display="flex"
              flexDirection={{ base: "column", md: "row" }}
              alignItems={{ md: "center" }}
              justifyContent="space-between"
              borderBottom="2px solid #000"
              _hover={{ bg: "rgba(250,204,21,0.08)" }}
              transition="background 0.1s"
              role="group"
              className="brutal-animate-in"
              style={{ animationDelay: `${ruleIndex * 40}ms` }}
              opacity={0}
            >
              <Box
                flex="1"
                pr="6"
                cursor={canManageRules ? "pointer" : "default"}
                onClick={() => canManageRules && openEditRuleModal(rule as any)}
              >
                <HStack mb="2" flexWrap="wrap" gap="2">
                  <Text
                    fontSize="md"
                    fontWeight="800"
                    color="#000"
                    fontFamily="'JetBrains Mono', monospace"
                    _groupHover={{ color: "#000" }}
                    transition="color 0.1s"
                  >
                    {rule.name}
                  </Text>
                  <SentinelBadge color={getSeverityBadgeColor(rule.severity)}>
                    {rule.severity.toUpperCase()}
                  </SentinelBadge>
                  <Box
                    px="2"
                    py="0.5"
                    bg="#FAFAFA"
                    border="2px solid #000"
                    fontSize="2xs"
                    fontFamily="'JetBrains Mono', monospace"
                    fontWeight="700"
                    color="#000"
                  >
                    {rule.code}
                  </Box>
                  {canManageRules && (
                    <Icon
                      boxSize="3"
                      color="#000"
                      opacity={0}
                      _groupHover={{ opacity: 0.4 }}
                      transition="opacity 0.1s"
                    >
                      <Edit2 />
                    </Icon>
                  )}
                </HStack>
                <Text
                  color="#000"
                  opacity={0.5}
                  fontSize="sm"
                  fontWeight="500"
                  fontFamily="'JetBrains Mono', monospace"
                  mb="3"
                  lineHeight="relaxed"
                >
                  {rule.description}
                </Text>
                <HStack gap="3" flexWrap="wrap">
                  <Box
                    display="flex"
                    alignItems="center"
                    px="3"
                    py="1.5"
                    bg="#FAFAFA"
                    border="2px solid #000"
                  >
                    <Text
                      fontSize="2xs"
                      fontWeight="800"
                      color="#000"
                      opacity={0.4}
                      textTransform="uppercase"
                      mr="2"
                      letterSpacing="wider"
                      fontFamily="'JetBrains Mono', monospace"
                    >
                      Cat:
                    </Text>
                    <Text
                      fontSize="2xs"
                      color="#000"
                      fontWeight="700"
                      fontFamily="'JetBrains Mono', monospace"
                    >
                      {rule.category}
                    </Text>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    px="3"
                    py="1.5"
                    bg="#FACC15"
                    border="2px solid #000"
                  >
                    <Text
                      fontSize="2xs"
                      fontWeight="800"
                      color="#000"
                      opacity={0.6}
                      textTransform="uppercase"
                      mr="2"
                      letterSpacing="wider"
                      fontFamily="'JetBrains Mono', monospace"
                    >
                      Score:
                    </Text>
                    <Text
                      fontSize="2xs"
                      color="#000"
                      fontWeight="800"
                      fontFamily="'Bebas Neue', sans-serif"
                      letterSpacing="wider"
                    >
                      +{rule.score}
                    </Text>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    px="3"
                    py="1.5"
                    bg="#000"
                    border="2px solid #000"
                    maxW="sm"
                  >
                    <Text
                      fontSize="2xs"
                      fontWeight="800"
                      color="#FACC15"
                      opacity={0.6}
                      textTransform="uppercase"
                      mr="2"
                      letterSpacing="wider"
                      fontFamily="'JetBrains Mono', monospace"
                    >
                      {">"}_
                    </Text>
                    <Text
                      fontSize="2xs"
                      fontFamily="'JetBrains Mono', monospace"
                      color="#FACC15"
                      fontWeight="600"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {formatConditions(rule.conditions)}
                    </Text>
                  </Box>
                </HStack>
              </Box>
              <Flex
                mt={{ base: "4", md: "0" }}
                alignItems="center"
                pl="4"
                borderLeft={{ md: "3px solid #000" }}
              >
                <Box
                  as="button"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  transition="all 0.1s"
                  p="3"
                  border="3px solid #000"
                  bg={rule.enabled ? "#FACC15" : "#FAFAFA"}
                  color="#000"
                  opacity={canManageRules ? 1 : 0.4}
                  cursor={canManageRules ? "pointer" : "not-allowed"}
                  _hover={{
                    boxShadow: "4px 4px 0px #000",
                    transform: "translate(-2px,-2px)",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (canManageRules) toggleRule(rule.code);
                  }}
                >
                  <Icon boxSize="6">
                    {rule.enabled ? <ToggleRight /> : <ToggleLeft />}
                  </Icon>
                  <Text
                    fontSize="2xs"
                    fontWeight="800"
                    textTransform="uppercase"
                    letterSpacing="widest"
                    mt="1"
                    fontFamily="'JetBrains Mono', monospace"
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
            bg="#000"
            opacity={0.8}
            onClick={() => setIsModalOpen(false)}
          />
          <Box
            position="relative"
            bg="#FAFAFA"
            border="3px solid #000"
            boxShadow="12px 12px 0px #FACC15"
            w="full"
            maxW="2xl"
            overflow="hidden"
            display="flex"
            flexDirection="column"
            maxH="90vh"
            className="brutal-animate-in"
          >
            {/* Modal Header */}
            <Flex
              px="6"
              py="4"
              borderBottom="3px solid #000"
              bg="#000"
              justify="space-between"
              align="center"
            >
              <HStack>
                <Icon boxSize="4" color="#FACC15" mr="1">
                  <Terminal />
                </Icon>
                <Text
                  fontWeight="800"
                  color="#FACC15"
                  fontSize="sm"
                  fontFamily="'JetBrains Mono', monospace"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  {editingRule.created_at ? "Edit Rule" : "New Rule"}
                </Text>
              </HStack>
              <Box
                as="button"
                p="1"
                color="#FACC15"
                _hover={{ color: "#FAFAFA" }}
                onClick={() => setIsModalOpen(false)}
              >
                <Icon boxSize="5">
                  <X />
                </Icon>
              </Box>
            </Flex>

            {/* Modal Body */}
            <Box p="6" overflowY="auto" className="brutal-scroll">
              <Box as="form" id="ruleForm" onSubmit={handleSaveRule}>
                <VStack gap="5" align="stretch">
                  <Flex gap="5" direction={{ base: "column", md: "row" }}>
                    <Box flex="1">
                      <Text
                        fontSize="2xs"
                        fontWeight="800"
                        color="#000"
                        textTransform="uppercase"
                        letterSpacing="widest"
                        mb="1.5"
                        fontFamily="'JetBrains Mono', monospace"
                      >
                        Rule Name
                      </Text>
                      <Box
                        as="input"
                        required
                        type="text"
                        w="full"
                        bg="#FAFAFA"
                        border="3px solid #000"
                        color="#000"
                        fontSize="sm"
                        fontFamily="'JetBrains Mono', monospace"
                        fontWeight="700"
                        px="4"
                        py="2.5"
                        _focus={{
                          outline: "none",
                          boxShadow: "4px 4px 0px #FACC15",
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
                        fontWeight="800"
                        color="#000"
                        textTransform="uppercase"
                        letterSpacing="widest"
                        mb="1.5"
                        fontFamily="'JetBrains Mono', monospace"
                      >
                        Rule Code
                      </Text>
                      <Box
                        as="input"
                        required
                        type="text"
                        w="full"
                        bg={
                          editingRule.created_at
                            ? "rgba(0,0,0,0.05)"
                            : "#FAFAFA"
                        }
                        border="3px solid #000"
                        color="#000"
                        fontSize="sm"
                        fontFamily="'JetBrains Mono', monospace"
                        fontWeight="700"
                        px="4"
                        py="2.5"
                        _focus={{
                          outline: "none",
                          boxShadow: "4px 4px 0px #FACC15",
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
                      fontWeight="800"
                      color="#000"
                      textTransform="uppercase"
                      letterSpacing="widest"
                      mb="1.5"
                      fontFamily="'JetBrains Mono', monospace"
                    >
                      Description
                    </Text>
                    <Textarea
                      required
                      rows={2}
                      w="full"
                      bg="#FAFAFA"
                      border="3px solid #000"
                      borderRadius="0"
                      color="#000"
                      fontSize="sm"
                      fontFamily="'JetBrains Mono', monospace"
                      fontWeight="600"
                      px="4"
                      py="2.5"
                      resize="none"
                      _focus={{
                        outline: "none",
                        boxShadow: "4px 4px 0px #FACC15",
                      }}
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

                  <Flex gap="5" direction={{ base: "column", md: "row" }}>
                    <Box flex="1">
                      <Text
                        fontSize="2xs"
                        fontWeight="800"
                        color="#000"
                        textTransform="uppercase"
                        letterSpacing="widest"
                        mb="1.5"
                        fontFamily="'JetBrains Mono', monospace"
                      >
                        Category
                      </Text>
                      <Box
                        as="select"
                        w="full"
                        bg="#FAFAFA"
                        border="3px solid #000"
                        color="#000"
                        fontSize="sm"
                        fontFamily="'JetBrains Mono', monospace"
                        fontWeight="700"
                        px="4"
                        py="2.5"
                        appearance="none"
                        cursor="pointer"
                        _focus={{
                          outline: "none",
                          boxShadow: "4px 4px 0px #FACC15",
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
                        fontWeight="800"
                        color="#000"
                        textTransform="uppercase"
                        letterSpacing="widest"
                        mb="1.5"
                        fontFamily="'JetBrains Mono', monospace"
                      >
                        Severity
                      </Text>
                      <Box
                        as="select"
                        w="full"
                        bg="#FAFAFA"
                        border="3px solid #000"
                        color="#000"
                        fontSize="sm"
                        fontFamily="'JetBrains Mono', monospace"
                        fontWeight="700"
                        px="4"
                        py="2.5"
                        appearance="none"
                        cursor="pointer"
                        _focus={{
                          outline: "none",
                          boxShadow: "4px 4px 0px #FACC15",
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
                        fontWeight="800"
                        color="#000"
                        textTransform="uppercase"
                        letterSpacing="widest"
                        mb="1.5"
                        fontFamily="'JetBrains Mono', monospace"
                      >
                        Score Impact
                      </Text>
                      <Box
                        as="input"
                        type="number"
                        w="full"
                        bg="#FAFAFA"
                        border="3px solid #000"
                        color="#000"
                        fontSize="sm"
                        fontFamily="'JetBrains Mono', monospace"
                        fontWeight="700"
                        px="4"
                        py="2.5"
                        _focus={{
                          outline: "none",
                          boxShadow: "4px 4px 0px #FACC15",
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
                      fontWeight="800"
                      color="#000"
                      textTransform="uppercase"
                      letterSpacing="widest"
                      mb="1.5"
                      fontFamily="'JetBrains Mono', monospace"
                    >
                      Logic Condition
                    </Text>
                    <Textarea
                      required
                      rows={3}
                      w="full"
                      bg="#000"
                      border="3px solid #000"
                      borderRadius="0"
                      color="#FACC15"
                      fontSize="sm"
                      fontFamily="'JetBrains Mono', monospace"
                      fontWeight="600"
                      px="4"
                      py="3"
                      _focus={{
                        outline: "none",
                        boxShadow: "4px 4px 0px #FACC15",
                      }}
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
                    <Text
                      fontSize="2xs"
                      color="#000"
                      opacity={0.3}
                      mt="1"
                      fontFamily="'JetBrains Mono', monospace"
                    >
                      Use standard logical operators (AND, OR, &gt;, &lt;, ==)
                    </Text>
                  </Box>
                </VStack>
              </Box>
            </Box>

            {/* Modal Footer */}
            <Flex
              px="6"
              py="4"
              bg="#FAFAFA"
              borderTop="3px solid #000"
              justify="flex-end"
              gap="3"
            >
              <Box
                as="button"
                px="5"
                py="2.5"
                border="3px solid #000"
                color="#000"
                fontWeight="800"
                fontSize="xs"
                fontFamily="'JetBrains Mono', monospace"
                textTransform="uppercase"
                bg="#FAFAFA"
                _hover={{ bg: "rgba(0,0,0,0.05)" }}
                transition="all 0.1s"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Box>
              <Box
                as="button"
                type="submit"
                form="ruleForm"
                display="flex"
                alignItems="center"
                px="5"
                py="2.5"
                bg="#FACC15"
                color="#000"
                border="3px solid #000"
                boxShadow="4px 4px 0px #000"
                fontWeight="800"
                fontSize="xs"
                fontFamily="'JetBrains Mono', monospace"
                textTransform="uppercase"
                letterSpacing="wider"
                _hover={{
                  transform: "translate(-2px,-2px)",
                  boxShadow: "6px 6px 0px #000",
                }}
                _active={{
                  transform: "translate(0,0)",
                  boxShadow: "2px 2px 0px #000",
                }}
                transition="all 0.1s"
              >
                <Icon boxSize="4" mr="2">
                  <Save />
                </Icon>
                Save Rule
              </Box>
            </Flex>
          </Box>
        </Box>
      )}
    </Box>
  );
}
