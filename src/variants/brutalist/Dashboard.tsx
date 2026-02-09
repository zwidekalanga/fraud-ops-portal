import { useNavigate } from "@tanstack/react-router";
import {
  Box,
  Flex,
  Text,
  HStack,
  Icon,
  Spinner,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Scale,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Terminal,
  Eye,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
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
  accent?: boolean;
  trend?: "up" | "down";
  delay?: number;
}

function StatCard({
  title,
  value,
  icon: IconComponent,
  accent,
  trend,
  delay = 0,
}: StatCardProps) {
  return (
    <Box
      bg={accent ? "#FACC15" : "#FAFAFA"}
      p="0"
      border="3px solid #000"
      boxShadow="8px 8px 0px #000"
      cursor="default"
      className="brutal-hover-lift brutal-animate-in"
      style={{ animationDelay: `${delay}ms` }}
      opacity={0}
      overflow="hidden"
    >
      {/* Header strip */}
      <Box
        bg="#000"
        px="4"
        py="2"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text
          fontSize="2xs"
          fontWeight="800"
          color={accent ? "#FACC15" : "#FAFAFA"}
          fontFamily="'JetBrains Mono', monospace"
          textTransform="uppercase"
          letterSpacing="widest"
        >
          {title}
        </Text>
        {trend && (
          <HStack gap="1">
            <Icon boxSize="3" color={trend === "up" ? "#FACC15" : "#FAFAFA"}>
              {trend === "up" ? <ArrowUpRight /> : <ArrowDownRight />}
            </Icon>
            <Text
              fontSize="2xs"
              fontWeight="800"
              color={trend === "up" ? "#FACC15" : "#FAFAFA"}
              fontFamily="'JetBrains Mono', monospace"
            >
              12%
            </Text>
          </HStack>
        )}
      </Box>

      {/* Content */}
      <Box p="5">
        <Flex justify="space-between" align="flex-end">
          <Box>
            <Text
              fontSize="4xl"
              fontWeight="800"
              color="#000"
              fontFamily="'Bebas Neue', sans-serif"
              letterSpacing="wider"
              lineHeight="1"
            >
              {value}
            </Text>
          </Box>
          <Box
            bg={accent ? "#000" : "#FACC15"}
            p="3"
            border="3px solid #000"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon boxSize="6" color={accent ? "#FACC15" : "#000"}>
              <IconComponent />
            </Icon>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

export default function BrutalistDashboard({
  stats,
  recentAlerts,
  dailyVolume,
  isLoading,
}: DashboardData) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Flex h="full" align="center" justify="center">
        <Box textAlign="center">
          <Spinner size="xl" color="#000" borderWidth="4px" />
          <Text
            mt="4"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="sm"
            color="#000"
            fontWeight="700"
            textTransform="uppercase"
          >
            Loading data...
          </Text>
        </Box>
      </Flex>
    );
  }

  const pendingAlerts =
    recentAlerts?.items?.filter((a) => a.status === "pending") || [];
  const chartData = dailyVolume ? toChartData(dailyVolume) : [];

  return (
    <Box pb="8">
      {/* Page Header */}
      <Flex
        mb="8"
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
            DASHBOARD
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
            {">"} System overview // real-time monitoring
          </Text>
        </Box>
        <Box
          px="4"
          py="2"
          bg="#FACC15"
          border="3px solid #000"
          boxShadow="4px 4px 0px #000"
          display={{ base: "none", md: "flex" }}
          alignItems="center"
          gap="2"
        >
          <Box w="2" h="2" bg="#000" />
          <Text
            fontSize="xs"
            fontWeight="800"
            color="#000"
            fontFamily="'JetBrains Mono', monospace"
            textTransform="uppercase"
          >
            LIVE
          </Text>
        </Box>
      </Flex>

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="6" mb="8">
        <StatCard
          title="Pending Reviews"
          value={stats?.by_status?.pending || 0}
          icon={Clock}
          accent
          trend="up"
          delay={50}
        />
        <StatCard
          title="Confirmed Fraud"
          value={stats?.by_status?.confirmed || 0}
          icon={AlertTriangle}
          trend="down"
          delay={100}
        />
        <StatCard
          title="Total Alerts"
          value={stats?.total || 0}
          icon={Activity}
          delay={150}
        />
        <StatCard
          title="Avg Risk Score"
          value={stats?.average_score?.toFixed(0) || 0}
          icon={Scale}
          delay={200}
        />
      </SimpleGrid>

      {/* Chart + Pending Alerts */}
      <SimpleGrid columns={{ base: 1, lg: 3 }} gap="6">
        {/* Chart */}
        <Box
          gridColumn={{ lg: "span 2" }}
          bg="#FAFAFA"
          border="3px solid #000"
          boxShadow="8px 8px 0px #000"
          display="flex"
          flexDirection="column"
          className="brutal-animate-in brutal-stagger-3"
          opacity={0}
        >
          {/* Chart Header */}
          <Flex
            px="6"
            py="4"
            borderBottom="3px solid #000"
            bg="#000"
            justify="space-between"
            align="center"
          >
            <HStack>
              <Icon boxSize="4" color="#FACC15">
                <Activity />
              </Icon>
              <Text
                fontSize="sm"
                fontWeight="800"
                color="#FACC15"
                fontFamily="'JetBrains Mono', monospace"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Alert Volume // 7-Day
              </Text>
            </HStack>
            <Text
              fontSize="2xs"
              color="rgba(250,204,21,0.5)"
              fontFamily="'JetBrains Mono', monospace"
              fontWeight="600"
            >
              [CHART]
            </Text>
          </Flex>

          <Box flex="1" p="6" minH="300px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap="20%">
                <XAxis
                  dataKey="name"
                  axisLine={{ stroke: "#000", strokeWidth: 2 }}
                  tickLine={false}
                  tick={{
                    fill: "#000",
                    fontSize: 11,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                  }}
                  dy={10}
                />
                <YAxis
                  axisLine={{ stroke: "#000", strokeWidth: 2 }}
                  tickLine={false}
                  tick={{
                    fill: "#000",
                    fontSize: 11,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    border: "3px solid #000",
                    borderRadius: 0,
                    boxShadow: "4px 4px 0px #000",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "12px",
                    fontWeight: 700,
                    background: "#FACC15",
                    color: "#000",
                  }}
                  cursor={{ fill: "rgba(250,204,21,0.1)" }}
                />
                <Bar dataKey="alerts" radius={0}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.alerts > 25 ? "#FACC15" : "#000"}
                      stroke="#000"
                      strokeWidth={2}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Pending Alerts */}
        <Box
          bg="#FAFAFA"
          border="3px solid #000"
          boxShadow="8px 8px 0px #000"
          display="flex"
          flexDirection="column"
          className="brutal-animate-in brutal-stagger-4"
          opacity={0}
          overflow="hidden"
        >
          <Flex
            px="6"
            py="4"
            borderBottom="3px solid #000"
            bg="#FACC15"
            justify="space-between"
            align="center"
          >
            <HStack>
              <Icon boxSize="4" color="#000">
                <Zap />
              </Icon>
              <Text
                fontSize="sm"
                fontWeight="800"
                color="#000"
                fontFamily="'JetBrains Mono', monospace"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Needs Attention
              </Text>
            </HStack>
            <Box
              as="button"
              fontSize="xs"
              color="#000"
              fontWeight="800"
              fontFamily="'JetBrains Mono', monospace"
              textTransform="uppercase"
              _hover={{ textDecoration: "underline" }}
              onClick={() => navigate({ to: "/alerts" })}
            >
              [VIEW ALL]
            </Box>
          </Flex>

          <Box flex="1" overflowY="auto" className="brutal-scroll">
            {pendingAlerts.length === 0 ? (
              <Flex
                direction="column"
                align="center"
                justify="center"
                h="full"
                p="8"
              >
                <Icon boxSize="12" mb="4" color="#000" opacity={0.15}>
                  <CheckCircle />
                </Icon>
                <Text
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="700"
                  color="#000"
                  textTransform="uppercase"
                  fontSize="sm"
                >
                  All Clear
                </Text>
                <Text
                  fontFamily="'JetBrains Mono', monospace"
                  fontSize="xs"
                  color="#000"
                  opacity={0.4}
                  mt="1"
                >
                  No pending alerts
                </Text>
              </Flex>
            ) : (
              <Box display="flex" flexDirection="column">
                {pendingAlerts.slice(0, 6).map((alert, i) => (
                  <Box
                    key={alert.id}
                    onClick={() => navigate({ to: `/alerts/${alert.id}` })}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    px="5"
                    py="4"
                    cursor="pointer"
                    borderBottom="2px solid #000"
                    transition="all 0.1s"
                    _hover={{
                      bg: "#FACC15",
                    }}
                    className="brutal-animate-in"
                    style={{ animationDelay: `${(i + 3) * 50}ms` }}
                    opacity={0}
                  >
                    <HStack gap="3">
                      <Box
                        w="3"
                        h="3"
                        bg={
                          alert.risk_score > 70
                            ? "#000"
                            : alert.risk_score > 40
                              ? "#FACC15"
                              : "#FAFAFA"
                        }
                        border="2px solid #000"
                      />
                      <Box>
                        <Text
                          fontWeight="800"
                          color="#000"
                          fontSize="xs"
                          fontFamily="'JetBrains Mono', monospace"
                          textTransform="uppercase"
                        >
                          {alert.id.slice(0, 12)}
                        </Text>
                        <Text
                          fontSize="2xs"
                          color="#000"
                          opacity={0.5}
                          fontFamily="'JetBrains Mono', monospace"
                          fontWeight="600"
                        >
                          {alert.customer_id}
                        </Text>
                      </Box>
                    </HStack>
                    <Box textAlign="right">
                      <Text
                        fontSize="lg"
                        fontWeight="800"
                        color="#000"
                        fontFamily="'Bebas Neue', sans-serif"
                        letterSpacing="wider"
                      >
                        {alert.risk_score}
                      </Text>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </SimpleGrid>

      {/* Status Banner */}
      <Box
        mt="6"
        bg="#000"
        border="3px solid #000"
        px="6"
        py="3"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        className="brutal-animate-in brutal-stagger-5"
        opacity={0}
      >
        <HStack>
          <Icon boxSize="4" color="#FACC15">
            <Terminal />
          </Icon>
          <Text
            fontSize="xs"
            fontWeight="700"
            color="#FACC15"
            fontFamily="'JetBrains Mono', monospace"
            textTransform="uppercase"
          >
            sentinel v2.0 // all systems nominal
          </Text>
        </HStack>
        <HStack gap="4">
          <HStack>
            <Box w="2" h="2" bg="#FACC15" />
            <Text
              fontSize="2xs"
              color="#FACC15"
              fontFamily="'JetBrains Mono', monospace"
              fontWeight="600"
            >
              ENGINE: OK
            </Text>
          </HStack>
          <HStack>
            <Box w="2" h="2" bg="#FACC15" />
            <Text
              fontSize="2xs"
              color="#FACC15"
              fontFamily="'JetBrains Mono', monospace"
              fontWeight="600"
            >
              API: OK
            </Text>
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
}
