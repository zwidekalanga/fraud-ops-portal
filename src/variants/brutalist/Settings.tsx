import { useState } from "react";
import {
  Box,
  Flex,
  Text,
  HStack,
  VStack,
  Icon,
  Input,
  Spinner,
} from "@chakra-ui/react";
import {
  Server,
  Database,
  Lock,
  Terminal,
  Zap,
  Shield,
  Settings as SettingsIcon,
  Cpu,
} from "lucide-react";
import type { SettingsData } from "../../hooks/useSettings";
import { useAuth } from "../../contexts/AuthContext";

export default function BrutalistSettings({
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
      {/* Page Header */}
      <Box mb="8" className="brutal-animate-in">
        <Text
          fontSize="5xl"
          fontWeight="800"
          color="#000"
          fontFamily="'Bebas Neue', sans-serif"
          letterSpacing="wider"
          lineHeight="1"
        >
          SETTINGS
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
          {">"} System configuration // health monitoring
        </Text>
      </Box>

      <VStack gap="6" align="stretch">
        {/* System Status */}
        <Box
          bg="#FAFAFA"
          border="3px solid #000"
          boxShadow="8px 8px 0px #000"
          overflow="hidden"
          className="brutal-animate-in brutal-stagger-1"
          opacity={0}
        >
          <Box
            px="6"
            py="4"
            bg="#000"
            borderBottom="3px solid #FACC15"
            display="flex"
            alignItems="center"
          >
            <Icon boxSize="4" color="#FACC15" mr="2">
              <Cpu />
            </Icon>
            <Text
              fontSize="sm"
              fontWeight="800"
              color="#FACC15"
              fontFamily="'JetBrains Mono', monospace"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              System Status
            </Text>
          </Box>
          <Box p="6">
            {isLoading ? (
              <Flex justify="center" py="8">
                <Box textAlign="center">
                  <Spinner size="lg" color="#000" borderWidth="4px" />
                  <Text
                    mt="3"
                    fontFamily="'JetBrains Mono', monospace"
                    fontSize="xs"
                    fontWeight="700"
                    textTransform="uppercase"
                    color="#000"
                  >
                    Checking systems...
                  </Text>
                </Box>
              </Flex>
            ) : (
              <VStack gap="4" align="stretch">
                {/* Rule Engine API */}
                <Box
                  p="4"
                  border="3px solid #000"
                  bg={health?.status === "healthy" ? "#FACC15" : "#FAFAFA"}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  className="brutal-hover-lift"
                >
                  <HStack gap="4">
                    <Box
                      p="2"
                      bg="#000"
                      border="2px solid #000"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon
                        boxSize="5"
                        color={
                          health?.status === "healthy" ? "#FACC15" : "#FAFAFA"
                        }
                      >
                        <Server />
                      </Icon>
                    </Box>
                    <Box>
                      <Text
                        fontWeight="800"
                        color="#000"
                        fontFamily="'JetBrains Mono', monospace"
                        fontSize="sm"
                      >
                        Rule Engine API
                      </Text>
                      <Text
                        fontSize="xs"
                        color="#000"
                        opacity={0.6}
                        fontFamily="'JetBrains Mono', monospace"
                        fontWeight="600"
                      >
                        Operational // {health?.version || "v1.0.0"}
                      </Text>
                    </Box>
                  </HStack>
                  <Box
                    px="4"
                    py="1.5"
                    bg="#000"
                    color={health?.status === "healthy" ? "#FACC15" : "#FAFAFA"}
                    fontSize="2xs"
                    fontWeight="800"
                    fontFamily="'JetBrains Mono', monospace"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    border="2px solid #000"
                  >
                    {health?.status === "healthy"
                      ? "CONNECTED"
                      : "DISCONNECTED"}
                  </Box>
                </Box>

                {/* Transaction Data Stream */}
                <Box
                  p="4"
                  border="3px solid #000"
                  bg="#FAFAFA"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  className="brutal-hover-lift"
                >
                  <HStack gap="4">
                    <Box
                      p="2"
                      bg="#000"
                      border="2px solid #000"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon boxSize="5" color="#FACC15">
                        <Database />
                      </Icon>
                    </Box>
                    <Box>
                      <Text
                        fontWeight="800"
                        color="#000"
                        fontFamily="'JetBrains Mono', monospace"
                        fontSize="sm"
                      >
                        Transaction Data Stream
                      </Text>
                      <Text
                        fontSize="xs"
                        color="#000"
                        opacity={0.6}
                        fontFamily="'JetBrains Mono', monospace"
                        fontWeight="600"
                      >
                        Latency: 45ms
                      </Text>
                    </Box>
                  </HStack>
                  <Box
                    px="4"
                    py="1.5"
                    bg="#FACC15"
                    color="#000"
                    fontSize="2xs"
                    fontWeight="800"
                    fontFamily="'JetBrains Mono', monospace"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    border="2px solid #000"
                  >
                    ACTIVE
                  </Box>
                </Box>

                {/* System Uptime */}
                <Box
                  p="4"
                  border="3px solid #000"
                  bg="#FAFAFA"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  className="brutal-hover-lift"
                >
                  <HStack gap="4">
                    <Box
                      p="2"
                      bg="#000"
                      border="2px solid #000"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon boxSize="5" color="#FACC15">
                        <Zap />
                      </Icon>
                    </Box>
                    <Box>
                      <Text
                        fontWeight="800"
                        color="#000"
                        fontFamily="'JetBrains Mono', monospace"
                        fontSize="sm"
                      >
                        Fraud Detection Pipeline
                      </Text>
                      <Text
                        fontSize="xs"
                        color="#000"
                        opacity={0.6}
                        fontFamily="'JetBrains Mono', monospace"
                        fontWeight="600"
                      >
                        Throughput: 1,200 txn/s
                      </Text>
                    </Box>
                  </HStack>
                  <Box
                    px="4"
                    py="1.5"
                    bg="#FACC15"
                    color="#000"
                    fontSize="2xs"
                    fontWeight="800"
                    fontFamily="'JetBrains Mono', monospace"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    border="2px solid #000"
                  >
                    RUNNING
                  </Box>
                </Box>
              </VStack>
            )}
          </Box>
        </Box>

        {/* General Configuration */}
        <Box
          bg="#FAFAFA"
          border="3px solid #000"
          boxShadow="8px 8px 0px #000"
          overflow="hidden"
          className="brutal-animate-in brutal-stagger-2"
          opacity={0}
        >
          <Box
            px="6"
            py="4"
            bg="#000"
            borderBottom="3px solid #FACC15"
            display="flex"
            alignItems="center"
          >
            <Icon boxSize="4" color="#FACC15" mr="2">
              <SettingsIcon />
            </Icon>
            <Text
              fontSize="sm"
              fontWeight="800"
              color="#FACC15"
              fontFamily="'JetBrains Mono', monospace"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              Configuration
            </Text>
          </Box>
          <Box p="6">
            <VStack gap="0" align="stretch">
              <Flex
                justify="space-between"
                align="center"
                py="4"
                borderBottom="2px solid #000"
              >
                <Box>
                  <Text
                    fontWeight="800"
                    color="#000"
                    fontFamily="'JetBrains Mono', monospace"
                    fontSize="sm"
                  >
                    Auto-Escalation Threshold
                  </Text>
                  <Text
                    fontSize="xs"
                    color="#000"
                    opacity={0.4}
                    fontFamily="'JetBrains Mono', monospace"
                    fontWeight="600"
                  >
                    Risk score above which alerts auto-escalate
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
                          }
                          if (e.key === "Escape") {
                            setEditingField(null);
                          }
                        }}
                        autoFocus
                        fontFamily="'Bebas Neue', sans-serif"
                        fontSize="xl"
                        fontWeight="800"
                        border="3px solid #000"
                        bg="#FACC15"
                        color="#000"
                        px="2"
                        py="1"
                        borderRadius="0"
                        _focus={{
                          outline: "none",
                          boxShadow: "none",
                          borderColor: "#000",
                        }}
                      />
                      <Box
                        as="button"
                        color="#000"
                        fontSize="xs"
                        fontWeight="800"
                        fontFamily="'JetBrains Mono', monospace"
                        textTransform="uppercase"
                        border="2px solid #000"
                        px="3"
                        py="1"
                        _hover={{ bg: "#FACC15" }}
                        transition="all 0.1s"
                        onClick={() => {
                          const num = Number(editValue);
                          if (!isNaN(num) && num >= 0 && num <= 100) {
                            updateConfig({ auto_escalation_threshold: num });
                            setEditingField(null);
                          }
                        }}
                      >
                        {isUpdating ? "..." : "Save"}
                      </Box>
                      <Box
                        as="button"
                        color="#000"
                        fontSize="xs"
                        fontWeight="800"
                        fontFamily="'JetBrains Mono', monospace"
                        textTransform="uppercase"
                        border="2px solid #000"
                        px="3"
                        py="1"
                        opacity={0.5}
                        _hover={{ opacity: 1, bg: "#FAFAFA" }}
                        transition="all 0.1s"
                        onClick={() => setEditingField(null)}
                      >
                        Cancel
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box
                        fontFamily="'Bebas Neue', sans-serif"
                        bg="#FACC15"
                        border="3px solid #000"
                        px="4"
                        py="1"
                        fontSize="xl"
                        fontWeight="800"
                        letterSpacing="wider"
                        color="#000"
                      >
                        {isConfigLoading ? "..." : threshold}
                      </Box>
                      {canEditSettings && (
                        <Box
                          as="button"
                          color="#000"
                          fontSize="xs"
                          fontWeight="800"
                          fontFamily="'JetBrains Mono', monospace"
                          textTransform="uppercase"
                          border="2px solid #000"
                          px="3"
                          py="1"
                          _hover={{ bg: "#FACC15" }}
                          transition="all 0.1s"
                          onClick={() => {
                            setEditValue(String(threshold));
                            setEditingField("threshold");
                          }}
                        >
                          Edit
                        </Box>
                      )}
                    </>
                  )}
                </HStack>
              </Flex>

              <Flex
                justify="space-between"
                align="center"
                py="4"
                borderBottom="2px solid #000"
              >
                <Box>
                  <Text
                    fontWeight="800"
                    color="#000"
                    fontFamily="'JetBrains Mono', monospace"
                    fontSize="sm"
                  >
                    Data Retention
                  </Text>
                  <Text
                    fontSize="xs"
                    color="#000"
                    opacity={0.4}
                    fontFamily="'JetBrains Mono', monospace"
                    fontWeight="600"
                  >
                    How long to store resolved alerts
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
                          }
                          if (e.key === "Escape") {
                            setEditingField(null);
                          }
                        }}
                        autoFocus
                        fontFamily="'JetBrains Mono', monospace"
                        fontSize="sm"
                        fontWeight="800"
                        border="3px solid #000"
                        bg="#FAFAFA"
                        color="#000"
                        px="2"
                        py="1"
                        borderRadius="0"
                        _focus={{
                          outline: "none",
                          boxShadow: "none",
                          borderColor: "#000",
                        }}
                      />
                      <Text
                        fontFamily="'JetBrains Mono', monospace"
                        fontSize="sm"
                        fontWeight="800"
                        color="#000"
                        textTransform="uppercase"
                      >
                        Days
                      </Text>
                      <Box
                        as="button"
                        color="#000"
                        fontSize="xs"
                        fontWeight="800"
                        fontFamily="'JetBrains Mono', monospace"
                        textTransform="uppercase"
                        border="2px solid #000"
                        px="3"
                        py="1"
                        _hover={{ bg: "#FACC15" }}
                        transition="all 0.1s"
                        onClick={() => {
                          const num = Number(editValue);
                          if (!isNaN(num) && num > 0) {
                            updateConfig({ data_retention_days: num });
                            setEditingField(null);
                          }
                        }}
                      >
                        {isUpdating ? "..." : "Save"}
                      </Box>
                      <Box
                        as="button"
                        color="#000"
                        fontSize="xs"
                        fontWeight="800"
                        fontFamily="'JetBrains Mono', monospace"
                        textTransform="uppercase"
                        border="2px solid #000"
                        px="3"
                        py="1"
                        opacity={0.5}
                        _hover={{ opacity: 1, bg: "#FAFAFA" }}
                        transition="all 0.1s"
                        onClick={() => setEditingField(null)}
                      >
                        Cancel
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box
                        fontFamily="'JetBrains Mono', monospace"
                        bg="#FAFAFA"
                        border="3px solid #000"
                        px="3"
                        py="1"
                        fontSize="sm"
                        fontWeight="800"
                        color="#000"
                      >
                        {isConfigLoading ? "..." : `${retention} DAYS`}
                      </Box>
                      {canEditSettings && (
                        <Box
                          as="button"
                          color="#000"
                          fontSize="xs"
                          fontWeight="800"
                          fontFamily="'JetBrains Mono', monospace"
                          textTransform="uppercase"
                          border="2px solid #000"
                          px="3"
                          py="1"
                          _hover={{ bg: "#FACC15" }}
                          transition="all 0.1s"
                          onClick={() => {
                            setEditValue(String(retention));
                            setEditingField("retention");
                          }}
                        >
                          Edit
                        </Box>
                      )}
                    </>
                  )}
                </HStack>
              </Flex>

              <Flex justify="space-between" align="center" py="4">
                <Box>
                  <Text
                    fontWeight="800"
                    color="#000"
                    fontFamily="'JetBrains Mono', monospace"
                    fontSize="sm"
                  >
                    Two-Factor Authentication
                  </Text>
                  <Text
                    fontSize="xs"
                    color="#000"
                    opacity={0.4}
                    fontFamily="'JetBrains Mono', monospace"
                    fontWeight="600"
                  >
                    Required for all admin actions
                  </Text>
                </Box>
                <HStack
                  gap="2"
                  bg="#000"
                  border="3px solid #000"
                  px="4"
                  py="1.5"
                >
                  <Icon boxSize="4" color="#FACC15">
                    <Lock />
                  </Icon>
                  <Text
                    fontWeight="800"
                    fontSize="xs"
                    color="#FACC15"
                    fontFamily="'JetBrains Mono', monospace"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Enforced
                  </Text>
                </HStack>
              </Flex>
            </VStack>
          </Box>
        </Box>

        {/* System Info */}
        <Box
          bg="#000"
          border="3px solid #000"
          overflow="hidden"
          className="brutal-animate-in brutal-stagger-3"
          opacity={0}
        >
          <Box p="6">
            <HStack justify="space-between" mb="4">
              <HStack>
                <Icon boxSize="4" color="#FACC15" mr="1">
                  <Terminal />
                </Icon>
                <Text
                  fontSize="sm"
                  fontWeight="800"
                  color="#FACC15"
                  fontFamily="'JetBrains Mono', monospace"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  System Info
                </Text>
              </HStack>
            </HStack>
            <VStack gap="2" align="stretch">
              <Flex justify="space-between">
                <Text
                  fontSize="xs"
                  color="#FACC15"
                  opacity={0.5}
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="600"
                >
                  {">"} service
                </Text>
                <Text
                  fontSize="xs"
                  color="#FACC15"
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="700"
                >
                  {health?.service || "sentinel-engine"}
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Text
                  fontSize="xs"
                  color="#FACC15"
                  opacity={0.5}
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="600"
                >
                  {">"} version
                </Text>
                <Text
                  fontSize="xs"
                  color="#FACC15"
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="700"
                >
                  {health?.version || "v1.0.0"}
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Text
                  fontSize="xs"
                  color="#FACC15"
                  opacity={0.5}
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="600"
                >
                  {">"} status
                </Text>
                <Text
                  fontSize="xs"
                  color="#FACC15"
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="700"
                >
                  {health?.status || "unknown"}
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Text
                  fontSize="xs"
                  color="#FACC15"
                  opacity={0.5}
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="600"
                >
                  {">"} environment
                </Text>
                <Text
                  fontSize="xs"
                  color="#FACC15"
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="700"
                >
                  production
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Text
                  fontSize="xs"
                  color="#FACC15"
                  opacity={0.5}
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="600"
                >
                  {">"} uptime
                </Text>
                <Text
                  fontSize="xs"
                  color="#FACC15"
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="700"
                >
                  99.97%
                </Text>
              </Flex>
            </VStack>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
}
