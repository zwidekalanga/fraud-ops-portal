import { useState } from "react";
import { Box, Flex, Text, HStack, VStack, Icon, Input } from "@chakra-ui/react";
import { Server, Database, Lock, Cpu, HardDrive, Wifi } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import type { SettingsData } from "../../hooks/useSettings";

function TerminalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      border="1px solid rgba(0, 255, 65, 0.2)"
      bg="rgba(0, 255, 65, 0.02)"
      overflow="hidden"
    >
      <Box
        px="5"
        py="3"
        borderBottomWidth="1px"
        borderColor="rgba(0, 255, 65, 0.15)"
        bg="rgba(0, 255, 65, 0.03)"
      >
        <Text
          fontSize="xs"
          fontWeight="bold"
          color="#00FF41"
          textShadow="0 0 6px rgba(0, 255, 65, 0.3)"
          letterSpacing="wider"
        >
          {title}
        </Text>
      </Box>
      <Box p="5">{children}</Box>
    </Box>
  );
}

export default function TerminalSettings({
  health,
  isLoading,
  config,
  isConfigLoading,
  updateConfig,
  isUpdating,
}: SettingsData) {
  const { hasRole } = useAuth();
  const canEditSettings = hasRole("admin");
  const threshold = config?.auto_escalation_threshold ?? 90;
  const retention = config?.data_retention_days ?? 90;
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  return (
    <Box pb="8" maxW="4xl">
      {/* Header */}
      <Text
        color="rgba(0, 255, 65, 0.3)"
        fontSize="2xs"
        mb="1"
        letterSpacing="widest"
      >
        {"// SYSTEM CONFIGURATION"}
      </Text>
      <Text
        color="#00FF41"
        fontSize="sm"
        mb="6"
        textShadow="0 0 6px rgba(0, 255, 65, 0.3)"
      >
        {">"} sentinel config --show
      </Text>

      <VStack gap="5" align="stretch">
        {/* System Status */}
        <TerminalSection title="SYSTEM STATUS">
          {isLoading ? (
            <Flex justify="center" py="8">
              <Text color="#00FF41" fontSize="xs" className="terminal-cursor">
                Polling system health...
              </Text>
            </Flex>
          ) : (
            <VStack gap="4" align="stretch">
              {/* Rule Engine API */}
              <Box
                p="4"
                border="1px solid"
                borderColor={
                  health?.status === "healthy"
                    ? "rgba(0, 255, 65, 0.3)"
                    : "rgba(255, 51, 51, 0.3)"
                }
                bg={
                  health?.status === "healthy"
                    ? "rgba(0, 255, 65, 0.03)"
                    : "rgba(255, 51, 51, 0.03)"
                }
              >
                <Flex justify="space-between" align="center">
                  <HStack gap="4">
                    <Icon
                      boxSize="5"
                      color={
                        health?.status === "healthy" ? "#00FF41" : "#FF3333"
                      }
                      style={{
                        filter: `drop-shadow(0 0 6px ${health?.status === "healthy" ? "rgba(0, 255, 65, 0.5)" : "rgba(255, 51, 51, 0.5)"})`,
                      }}
                    >
                      <Server />
                    </Icon>
                    <Box>
                      <Text
                        fontWeight="bold"
                        color={
                          health?.status === "healthy" ? "#00FF41" : "#FF3333"
                        }
                        fontSize="xs"
                      >
                        RULE ENGINE API
                      </Text>
                      <Text
                        fontSize="2xs"
                        color={
                          health?.status === "healthy"
                            ? "rgba(0, 255, 65, 0.5)"
                            : "rgba(255, 51, 51, 0.5)"
                        }
                      >
                        {health?.status === "healthy"
                          ? "OPERATIONAL"
                          : "OFFLINE"}{" "}
                        // {health?.version || "v1.0.0"}
                      </Text>
                    </Box>
                  </HStack>
                  <Text
                    fontSize="2xs"
                    fontWeight="bold"
                    color={health?.status === "healthy" ? "#00FF41" : "#FF3333"}
                    border="1px solid"
                    borderColor={
                      health?.status === "healthy"
                        ? "rgba(0, 255, 65, 0.3)"
                        : "rgba(255, 51, 51, 0.3)"
                    }
                    px="3"
                    py="1"
                    textShadow={`0 0 6px ${health?.status === "healthy" ? "rgba(0, 255, 65, 0.4)" : "rgba(255, 51, 51, 0.4)"}`}
                    letterSpacing="wider"
                  >
                    {health?.status === "healthy"
                      ? "CONNECTED"
                      : "DISCONNECTED"}
                  </Text>
                </Flex>
              </Box>

              {/* Transaction Data Stream */}
              <Box
                p="4"
                border="1px solid rgba(0, 255, 65, 0.2)"
                bg="rgba(0, 255, 65, 0.02)"
              >
                <Flex justify="space-between" align="center">
                  <HStack gap="4">
                    <Icon boxSize="5" color="rgba(0, 255, 65, 0.6)">
                      <Database />
                    </Icon>
                    <Box>
                      <Text fontWeight="bold" color="#00FF41" fontSize="xs">
                        TRANSACTION DATA STREAM
                      </Text>
                      <Text fontSize="2xs" color="rgba(0, 255, 65, 0.4)">
                        LATENCY: 45ms // THROUGHPUT: 1.2k/s
                      </Text>
                    </Box>
                  </HStack>
                  <Text
                    fontSize="2xs"
                    fontWeight="bold"
                    color="#FFB000"
                    border="1px solid rgba(255, 176, 0, 0.3)"
                    px="3"
                    py="1"
                    textShadow="0 0 6px rgba(255, 176, 0, 0.4)"
                    letterSpacing="wider"
                  >
                    ACTIVE
                  </Text>
                </Flex>
              </Box>

              {/* System Diagnostics */}
              <Box
                mt="2"
                border="1px solid rgba(0, 255, 65, 0.1)"
                p="4"
                bg="rgba(0, 255, 65, 0.01)"
              >
                <Text
                  fontSize="2xs"
                  color="rgba(0, 255, 65, 0.3)"
                  mb="3"
                  letterSpacing="wider"
                >
                  {">"} SYSTEM DIAGNOSTICS
                </Text>
                <HStack gap="6" flexWrap="wrap">
                  <HStack gap="2">
                    <Icon boxSize="3.5" color="rgba(0, 255, 65, 0.4)">
                      <Cpu />
                    </Icon>
                    <Text fontSize="2xs" color="rgba(0, 255, 65, 0.4)">
                      CPU:
                    </Text>
                    <Text fontSize="2xs" color="#00FF41">
                      23%
                    </Text>
                  </HStack>
                  <HStack gap="2">
                    <Icon boxSize="3.5" color="rgba(0, 255, 65, 0.4)">
                      <HardDrive />
                    </Icon>
                    <Text fontSize="2xs" color="rgba(0, 255, 65, 0.4)">
                      DISK:
                    </Text>
                    <Text fontSize="2xs" color="#00FF41">
                      67%
                    </Text>
                  </HStack>
                  <HStack gap="2">
                    <Icon boxSize="3.5" color="rgba(0, 255, 65, 0.4)">
                      <Wifi />
                    </Icon>
                    <Text fontSize="2xs" color="rgba(0, 255, 65, 0.4)">
                      NET:
                    </Text>
                    <Text fontSize="2xs" color="#00FF41">
                      STABLE
                    </Text>
                  </HStack>
                </HStack>
              </Box>
            </VStack>
          )}
        </TerminalSection>

        {/* Configuration */}
        <TerminalSection title="GENERAL CONFIGURATION">
          <VStack gap="0" align="stretch">
            <Flex
              justify="space-between"
              align="center"
              py="3"
              borderBottomWidth="1px"
              borderColor="rgba(0, 255, 65, 0.08)"
            >
              <Box>
                <Text fontWeight="bold" color="#00FF41" fontSize="xs">
                  auto_escalation_threshold
                </Text>
                <Text fontSize="2xs" color="rgba(0, 255, 65, 0.35)" mt="0.5">
                  // Risk score above which alerts auto-escalate
                </Text>
              </Box>
              <HStack gap="3">
                {editingField === "threshold" ? (
                  <>
                    <Input
                      type="number"
                      w="70px"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const num = Number(editValue);
                          if (!isNaN(num) && num >= 0 && num <= 100) {
                            updateConfig({ auto_escalation_threshold: num });
                            setEditingField(null);
                          }
                        } else if (e.key === "Escape") {
                          setEditingField(null);
                        }
                      }}
                      autoFocus
                      size="xs"
                      bg="transparent"
                      color="#00FF41"
                      borderColor="rgba(0, 255, 65, 0.4)"
                      fontFamily="mono"
                      textAlign="center"
                      _focus={{
                        borderColor: "#00FF41",
                        boxShadow: "0 0 6px rgba(0, 255, 65, 0.3)",
                      }}
                    />
                    <Box
                      as="button"
                      fontSize="2xs"
                      color="#00FF41"
                      textShadow="0 0 6px rgba(0, 255, 65, 0.4)"
                      _hover={{
                        textShadow: "0 0 10px rgba(0, 255, 65, 0.6)",
                      }}
                      transition="all 0.15s"
                      onClick={() => {
                        const num = Number(editValue);
                        if (!isNaN(num) && num >= 0 && num <= 100) {
                          updateConfig({ auto_escalation_threshold: num });
                          setEditingField(null);
                        }
                      }}
                    >
                      {isUpdating ? "[...]" : "[SAVE]"}
                    </Box>
                    <Box
                      as="button"
                      fontSize="2xs"
                      color="rgba(0, 255, 65, 0.5)"
                      _hover={{
                        color: "#00FF41",
                        textShadow: "0 0 6px rgba(0, 255, 65, 0.4)",
                      }}
                      transition="all 0.15s"
                      onClick={() => setEditingField(null)}
                    >
                      [CANCEL]
                    </Box>
                  </>
                ) : (
                  <>
                    <Text
                      fontSize="xs"
                      color="#FFB000"
                      border="1px solid rgba(255, 176, 0, 0.2)"
                      bg="rgba(255, 176, 0, 0.05)"
                      px="3"
                      py="1"
                      textShadow="0 0 6px rgba(255, 176, 0, 0.3)"
                    >
                      {isConfigLoading ? "..." : threshold}
                    </Text>
                    {canEditSettings && (
                      <Box
                        as="button"
                        fontSize="2xs"
                        color="rgba(0, 255, 65, 0.5)"
                        _hover={{
                          color: "#00FF41",
                          textShadow: "0 0 6px rgba(0, 255, 65, 0.4)",
                        }}
                        transition="all 0.15s"
                        onClick={() => {
                          setEditValue(String(threshold));
                          setEditingField("threshold");
                        }}
                      >
                        [EDIT]
                      </Box>
                    )}
                  </>
                )}
              </HStack>
            </Flex>

            <Flex
              justify="space-between"
              align="center"
              py="3"
              borderBottomWidth="1px"
              borderColor="rgba(0, 255, 65, 0.08)"
            >
              <Box>
                <Text fontWeight="bold" color="#00FF41" fontSize="xs">
                  data_retention_days
                </Text>
                <Text fontSize="2xs" color="rgba(0, 255, 65, 0.35)" mt="0.5">
                  // How long to store resolved alerts
                </Text>
              </Box>
              <HStack gap="3">
                {editingField === "retention" ? (
                  <>
                    <Input
                      type="number"
                      w="70px"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const num = Number(editValue);
                          if (!isNaN(num) && num > 0) {
                            updateConfig({ data_retention_days: num });
                            setEditingField(null);
                          }
                        } else if (e.key === "Escape") {
                          setEditingField(null);
                        }
                      }}
                      autoFocus
                      size="xs"
                      bg="transparent"
                      color="#00FF41"
                      borderColor="rgba(0, 255, 65, 0.4)"
                      fontFamily="mono"
                      textAlign="center"
                      _focus={{
                        borderColor: "#00FF41",
                        boxShadow: "0 0 6px rgba(0, 255, 65, 0.3)",
                      }}
                    />
                    <Text fontSize="xs" color="rgba(0, 255, 65, 0.5)">
                      days
                    </Text>
                    <Box
                      as="button"
                      fontSize="2xs"
                      color="#00FF41"
                      textShadow="0 0 6px rgba(0, 255, 65, 0.4)"
                      _hover={{
                        textShadow: "0 0 10px rgba(0, 255, 65, 0.6)",
                      }}
                      transition="all 0.15s"
                      onClick={() => {
                        const num = Number(editValue);
                        if (!isNaN(num) && num > 0) {
                          updateConfig({ data_retention_days: num });
                          setEditingField(null);
                        }
                      }}
                    >
                      {isUpdating ? "[...]" : "[SAVE]"}
                    </Box>
                    <Box
                      as="button"
                      fontSize="2xs"
                      color="rgba(0, 255, 65, 0.5)"
                      _hover={{
                        color: "#00FF41",
                        textShadow: "0 0 6px rgba(0, 255, 65, 0.4)",
                      }}
                      transition="all 0.15s"
                      onClick={() => setEditingField(null)}
                    >
                      [CANCEL]
                    </Box>
                  </>
                ) : (
                  <>
                    <Text
                      fontSize="xs"
                      color="#FFB000"
                      border="1px solid rgba(255, 176, 0, 0.2)"
                      bg="rgba(255, 176, 0, 0.05)"
                      px="3"
                      py="1"
                      textShadow="0 0 6px rgba(255, 176, 0, 0.3)"
                    >
                      {isConfigLoading ? "..." : `${retention} days`}
                    </Text>
                    {canEditSettings && (
                      <Box
                        as="button"
                        fontSize="2xs"
                        color="rgba(0, 255, 65, 0.5)"
                        _hover={{
                          color: "#00FF41",
                          textShadow: "0 0 6px rgba(0, 255, 65, 0.4)",
                        }}
                        transition="all 0.15s"
                        onClick={() => {
                          setEditValue(String(retention));
                          setEditingField("retention");
                        }}
                      >
                        [EDIT]
                      </Box>
                    )}
                  </>
                )}
              </HStack>
            </Flex>

            <Flex justify="space-between" align="center" py="3">
              <Box>
                <Text fontWeight="bold" color="#00FF41" fontSize="xs">
                  two_factor_auth
                </Text>
                <Text fontSize="2xs" color="rgba(0, 255, 65, 0.35)" mt="0.5">
                  // Required for all admin actions
                </Text>
              </Box>
              <HStack gap="2">
                <Icon boxSize="3.5" color="#00FF41">
                  <Lock />
                </Icon>
                <Text
                  fontWeight="bold"
                  fontSize="2xs"
                  color="#00FF41"
                  letterSpacing="wider"
                  textShadow="0 0 6px rgba(0, 255, 65, 0.4)"
                >
                  ENFORCED
                </Text>
              </HStack>
            </Flex>
          </VStack>
        </TerminalSection>

        {/* System Log */}
        <TerminalSection title="SYSTEM LOG (RECENT)">
          <Box>
            {[
              {
                time: "14:23:01",
                level: "INFO",
                msg: "Rule engine cache refreshed successfully",
              },
              {
                time: "14:22:45",
                level: "INFO",
                msg: "Health check passed - all services nominal",
              },
              {
                time: "14:20:12",
                level: "WARN",
                msg: "High alert volume detected - 35 alerts/min",
              },
              {
                time: "14:18:33",
                level: "INFO",
                msg: "Transaction stream reconnected to primary node",
              },
              {
                time: "14:15:00",
                level: "INFO",
                msg: "Automated backup completed - 2.3GB archived",
              },
            ].map((log, i) => (
              <HStack key={i} gap="3" py="1.5">
                <Text fontSize="2xs" color="rgba(0, 255, 65, 0.3)">
                  [{log.time}]
                </Text>
                <Text
                  fontSize="2xs"
                  fontWeight="bold"
                  color={
                    log.level === "WARN"
                      ? "#FFB000"
                      : log.level === "ERROR"
                        ? "#FF3333"
                        : "rgba(0, 255, 65, 0.5)"
                  }
                  minW="35px"
                >
                  {log.level}
                </Text>
                <Text fontSize="2xs" color="rgba(0, 255, 65, 0.5)">
                  {log.msg}
                </Text>
              </HStack>
            ))}
            <Text
              fontSize="2xs"
              color="rgba(0, 255, 65, 0.2)"
              mt="2"
              className="terminal-cursor"
            >
              {">"} Waiting for new events...
            </Text>
          </Box>
        </TerminalSection>
      </VStack>

      {/* ASCII footer */}
      <Text
        color="rgba(0, 255, 65, 0.1)"
        fontSize="2xs"
        mt="6"
        textAlign="center"
        letterSpacing="widest"
      >
        {"=".repeat(50)}
      </Text>
      <Text
        color="rgba(0, 255, 65, 0.2)"
        fontSize="2xs"
        mt="1"
        textAlign="center"
      >
        SENTINEL ENGINE // CONFIG v4.2.1 // ALL RIGHTS RESERVED
      </Text>
    </Box>
  );
}
