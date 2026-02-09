import { useNavigate } from "@tanstack/react-router";
import { Box, Flex, Text, HStack, Icon, SimpleGrid } from "@chakra-ui/react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Scale,
  Shield,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DashboardData } from "../../hooks/useDashboardData";
import type { DailyVolume } from "../../services/api";

const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function toChartData(volume: DailyVolume[]) {
  return volume.map((d) => ({
    name: DAY_LABELS[new Date(d.date + "T00:00:00").getUTCDay()],
    alerts: d.alerts,
  }));
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  label: string;
}

function StatCard({ title, value, icon: IconComponent, label }: StatCardProps) {
  return (
    <Box
      border="1px solid rgba(0, 255, 65, 0.2)"
      bg="rgba(0, 255, 65, 0.02)"
      p="5"
      position="relative"
      overflow="hidden"
      _hover={{
        borderColor: "rgba(0, 255, 65, 0.4)",
        bg: "rgba(0, 255, 65, 0.04)",
      }}
      transition="all 0.2s"
    >
      {/* Corner decorations */}
      <Text
        position="absolute"
        top="0"
        left="0"
        fontSize="2xs"
        color="rgba(0, 255, 65, 0.15)"
        lineHeight="1"
      >
        {"+-"}
      </Text>
      <Text
        position="absolute"
        top="0"
        right="0"
        fontSize="2xs"
        color="rgba(0, 255, 65, 0.15)"
        lineHeight="1"
      >
        {"-+"}
      </Text>

      <Flex justify="space-between" align="start" mb="4">
        <Text
          fontSize="2xs"
          color="rgba(0, 255, 65, 0.4)"
          textTransform="uppercase"
          letterSpacing="widest"
        >
          {label}
        </Text>
        <Icon boxSize="4" color="rgba(0, 255, 65, 0.3)">
          <IconComponent />
        </Icon>
      </Flex>
      <Text
        fontSize="3xl"
        fontWeight="bold"
        color="#00FF41"
        textShadow="0 0 10px rgba(0, 255, 65, 0.5), 0 0 20px rgba(0, 255, 65, 0.2)"
        letterSpacing="tight"
        mb="1"
      >
        {value}
      </Text>
      <Text fontSize="xs" color="rgba(0, 255, 65, 0.5)">
        {title}
      </Text>
    </Box>
  );
}

export default function TerminalDashboard({
  stats,
  recentAlerts,
  dailyVolume,
  isLoading,
}: DashboardData) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Flex h="full" align="center" justify="center" direction="column">
        <Text
          color="#00FF41"
          fontSize="sm"
          textShadow="0 0 8px rgba(0, 255, 65, 0.5)"
          className="terminal-cursor"
        >
          Loading system data...
        </Text>
      </Flex>
    );
  }

  const pendingAlerts = (
    recentAlerts?.items?.filter((a) => a.status === "pending") || []
  ).sort((a, b) => b.risk_score - a.risk_score);
  const chartData = dailyVolume ? toChartData(dailyVolume) : [];

  return (
    <Box pb="8">
      {/* Section header */}
      <Text
        color="rgba(0, 255, 65, 0.3)"
        fontSize="2xs"
        mb="1"
        letterSpacing="widest"
      >
        {"// SYSTEM OVERVIEW"}
      </Text>
      <Text
        color="#00FF41"
        fontSize="sm"
        mb="6"
        textShadow="0 0 6px rgba(0, 255, 65, 0.3)"
      >
        {">"} sentinel --status --verbose
      </Text>

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="4" mb="6">
        <StatCard
          label="QUEUE"
          title="Pending Reviews"
          value={stats?.by_status?.pending || 0}
          icon={Clock}
        />
        <StatCard
          label="THREAT"
          title="Confirmed Fraud"
          value={stats?.by_status?.confirmed || 0}
          icon={AlertTriangle}
        />
        <StatCard
          label="TOTAL"
          title="Total Alerts"
          value={stats?.total || 0}
          icon={Activity}
        />
        <StatCard
          label="RISK"
          title="Avg. Risk Score"
          value={stats?.average_score?.toFixed(0) || 0}
          icon={Scale}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 3 }} gap="4">
        {/* Chart Area */}
        <Box
          gridColumn={{ lg: "span 2" }}
          border="1px solid rgba(0, 255, 65, 0.2)"
          bg="rgba(0, 255, 65, 0.02)"
          p="6"
          display="flex"
          flexDirection="column"
        >
          <Flex justify="space-between" align="center" mb="2">
            <Box>
              <Text
                fontSize="2xs"
                color="rgba(0, 255, 65, 0.3)"
                letterSpacing="widest"
                mb="1"
              >
                {"// TELEMETRY"}
              </Text>
              <Text
                fontSize="sm"
                fontWeight="bold"
                color="#00FF41"
                textShadow="0 0 6px rgba(0, 255, 65, 0.3)"
              >
                ALERT VOLUME - 7 DAY SCAN
              </Text>
            </Box>
            <Text fontSize="2xs" color="rgba(0, 255, 65, 0.3)">
              REALTIME
            </Text>
          </Flex>
          <Text color="rgba(0, 255, 65, 0.15)" fontSize="2xs" mb="4">
            {"+-------------------------------------------------+"}
          </Text>
          <Box flex="1" w="full" minH="280px">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="terminalGreen"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#00FF41" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#00FF41" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "rgba(0, 255, 65, 0.4)",
                    fontSize: 10,
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "rgba(0, 255, 65, 0.4)",
                    fontSize: 10,
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0a0a0a",
                    border: "1px solid rgba(0, 255, 65, 0.4)",
                    borderRadius: "0",
                    padding: "8px 12px",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "12px",
                    color: "#00FF41",
                    boxShadow: "0 0 12px rgba(0, 255, 65, 0.2)",
                  }}
                  labelStyle={{ color: "rgba(0, 255, 65, 0.6)" }}
                  cursor={{ stroke: "rgba(0, 255, 65, 0.3)", strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="alerts"
                  stroke="#00FF41"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#terminalGreen)"
                  dot={{ fill: "#00FF41", stroke: "#00FF41", r: 3 }}
                  activeDot={{
                    r: 5,
                    fill: "#00FF41",
                    stroke: "#0a0a0a",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Pending Alerts */}
        <Box
          border="1px solid rgba(0, 255, 65, 0.2)"
          bg="rgba(0, 255, 65, 0.02)"
          p="5"
          display="flex"
          flexDirection="column"
        >
          <Flex justify="space-between" align="center" mb="1">
            <Text
              fontSize="2xs"
              color="rgba(0, 255, 65, 0.3)"
              letterSpacing="widest"
            >
              {"// PRIORITY QUEUE"}
            </Text>
            <Box
              as="button"
              fontSize="2xs"
              color="#FFB000"
              _hover={{ textShadow: "0 0 8px rgba(255, 176, 0, 0.5)" }}
              onClick={() =>
                navigate({ to: "/alerts", search: (prev) => prev })
              }
            >
              [VIEW ALL]
            </Box>
          </Flex>
          <Text
            fontSize="sm"
            fontWeight="bold"
            color="#00FF41"
            mb="4"
            textShadow="0 0 6px rgba(0, 255, 65, 0.3)"
          >
            NEEDS ATTENTION
          </Text>

          <Box flex="1" overflowY="auto">
            {pendingAlerts.length === 0 ? (
              <Flex
                direction="column"
                align="center"
                justify="center"
                h="full"
                py="8"
              >
                <Icon boxSize="10" color="rgba(0, 255, 65, 0.15)" mb="3">
                  <CheckCircle />
                </Icon>
                <Text color="rgba(0, 255, 65, 0.4)" fontSize="xs">
                  QUEUE EMPTY - ALL CLEAR
                </Text>
              </Flex>
            ) : (
              <Box display="flex" flexDirection="column" gap="2">
                {pendingAlerts.slice(0, 5).map((alert, i) => (
                  <Box
                    key={alert.id}
                    onClick={() =>
                      navigate({
                        to: `/alerts/${alert.id}`,
                        search: (prev) => prev,
                      })
                    }
                    p="3"
                    border="1px solid rgba(0, 255, 65, 0.1)"
                    bg="rgba(0, 255, 65, 0.02)"
                    cursor="pointer"
                    transition="all 0.15s"
                    _hover={{
                      borderColor: "rgba(0, 255, 65, 0.3)",
                      bg: "rgba(0, 255, 65, 0.05)",
                    }}
                  >
                    <Flex justify="space-between" align="center" mb="1">
                      <HStack gap="2">
                        <Text fontSize="2xs" color="rgba(0, 255, 65, 0.3)">
                          [{String(i + 1).padStart(2, "0")}]
                        </Text>
                        <Text
                          fontSize="xs"
                          color="#00FF41"
                          fontWeight="bold"
                          textShadow="0 0 4px rgba(0, 255, 65, 0.3)"
                        >
                          {alert.reference_number || alert.id.slice(0, 8)}
                        </Text>
                      </HStack>
                      <Text
                        fontSize="xs"
                        fontWeight="bold"
                        color={
                          alert.risk_score > 70
                            ? "#FF3333"
                            : alert.risk_score > 40
                              ? "#FFB000"
                              : "#00FF41"
                        }
                        textShadow={
                          alert.risk_score > 70
                            ? "0 0 8px rgba(255, 51, 51, 0.5)"
                            : alert.risk_score > 40
                              ? "0 0 8px rgba(255, 176, 0, 0.5)"
                              : "0 0 8px rgba(0, 255, 65, 0.5)"
                        }
                      >
                        RISK:{alert.risk_score}
                      </Text>
                    </Flex>
                    <Text fontSize="2xs" color="rgba(0, 255, 65, 0.4)">
                      CID:{" "}
                      {alert.transaction?.account_number || alert.customer_id}
                    </Text>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </SimpleGrid>

      {/* ASCII footer */}
      <Text
        color="rgba(0, 255, 65, 0.1)"
        fontSize="2xs"
        mt="6"
        textAlign="center"
        letterSpacing="widest"
      >
        {"=".repeat(60)}
      </Text>
      <Text
        color="rgba(0, 255, 65, 0.2)"
        fontSize="2xs"
        mt="1"
        textAlign="center"
      >
        <Icon boxSize="3" display="inline" mr="1" verticalAlign="middle">
          <Shield />
        </Icon>
        SENTINEL FRAUD ENGINE // ALL SYSTEMS NOMINAL
      </Text>
    </Box>
  );
}
