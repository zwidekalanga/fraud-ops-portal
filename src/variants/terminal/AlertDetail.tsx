import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../contexts/AuthContext";
import {
  Box,
  Flex,
  Text,
  HStack,
  VStack,
  Icon,
  SimpleGrid,
  Textarea,
} from "@chakra-ui/react";
import { format } from "date-fns";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  CreditCard,
  User,
  Flag,
  MapPin,
} from "lucide-react";
import type { AlertDetailData } from "../../hooks/useAlertDetail";

function formatAccountAge(days: number): string {
  const years = Math.floor(days / 365);
  const remaining = days % 365;
  if (years > 0 && remaining > 0) return `${years}y ${remaining}d`;
  if (years > 0) return `${years} year${years > 1 ? "s" : ""}`;
  return `${days} days`;
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: "#FF0040",
  high: "#FF6600",
  medium: "#FFB000",
  low: "#00FF41",
};

function TerminalBox({
  title,
  icon: IconComponent,
  children,
}: {
  title: string;
  icon?: React.ElementType;
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
        <HStack gap="2">
          {IconComponent && (
            <Icon boxSize="4" color="rgba(0, 255, 65, 0.5)">
              <IconComponent />
            </Icon>
          )}
          <Text
            fontSize="xs"
            fontWeight="bold"
            color="#00FF41"
            textShadow="0 0 6px rgba(0, 255, 65, 0.3)"
            letterSpacing="wider"
          >
            {title}
          </Text>
        </HStack>
      </Box>
      <Box p="5">{children}</Box>
    </Box>
  );
}

export default function TerminalAlertDetail({
  alert,
  isLoading,
  customer,
  isCustomerLoading,
  reviewNotes,
  setReviewNotes,
  handleReview,
  isReviewing,
}: AlertDetailData) {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const canReview = hasRole("admin", "analyst");

  if (isLoading) {
    return (
      <Flex h="full" align="center" justify="center">
        <Text color="#00FF41" fontSize="xs" className="terminal-cursor">
          Fetching alert record...
        </Text>
      </Flex>
    );
  }

  if (!alert) {
    return (
      <Box>
        <Text color="#FF3333" fontSize="xs" mb="4">
          {">"} ERROR: Alert record not found in database.
        </Text>
        <Box
          as="button"
          px="4"
          py="2"
          border="1px solid rgba(0, 255, 65, 0.3)"
          color="#00FF41"
          fontSize="xs"
          _hover={{ bg: "rgba(0, 255, 65, 0.05)" }}
          onClick={() => navigate({ to: "/alerts" })}
        >
          [RETURN TO ALERTS]
        </Box>
      </Box>
    );
  }

  const isPending = alert.status === "pending";
  const riskColor =
    alert.risk_score >= 70
      ? "#FF3333"
      : alert.risk_score >= 40
        ? "#FFB000"
        : "#00FF41";

  return (
    <Box pb="8">
      {/* Header */}
      <Text
        color="rgba(0, 255, 65, 0.3)"
        fontSize="2xs"
        mb="1"
        letterSpacing="widest"
      >
        {"// ALERT INVESTIGATION TERMINAL"}
      </Text>

      <Flex
        mb="6"
        justify="space-between"
        align="center"
        flexWrap="wrap"
        gap="4"
      >
        <HStack gap="4">
          <Box
            as="button"
            p="2"
            border="1px solid rgba(0, 255, 65, 0.3)"
            color="#00FF41"
            _hover={{ bg: "rgba(0, 255, 65, 0.05)", borderColor: "#00FF41" }}
            transition="all 0.15s"
            onClick={() => navigate({ to: "/alerts" })}
          >
            <Icon boxSize="4">
              <ArrowLeft />
            </Icon>
          </Box>
          <Box>
            <HStack gap="3" mb="1">
              <Text
                fontSize="sm"
                fontWeight="bold"
                color="#00FF41"
                textShadow="0 0 8px rgba(0, 255, 65, 0.4)"
              >
                {">"} cat /alerts/{alert.id}
              </Text>
              <Text
                fontSize="2xs"
                fontWeight="bold"
                color={
                  alert.status === "pending"
                    ? "#FFB000"
                    : alert.status === "confirmed"
                      ? "#FF3333"
                      : alert.status === "dismissed"
                        ? "#00FF41"
                        : "#FFB000"
                }
                textShadow={`0 0 6px ${
                  alert.status === "pending"
                    ? "rgba(255, 176, 0, 0.4)"
                    : alert.status === "confirmed"
                      ? "rgba(255, 51, 51, 0.4)"
                      : alert.status === "dismissed"
                        ? "rgba(0, 255, 65, 0.4)"
                        : "rgba(255, 176, 0, 0.4)"
                }`}
              >
                [{alert.status.toUpperCase()}]
              </Text>
            </HStack>
            <Text color="rgba(0, 255, 65, 0.4)" fontSize="2xs">
              TIMESTAMP:{" "}
              {format(new Date(alert.created_at), "yyyy-MM-dd HH:mm:ss")} UTC
            </Text>
          </Box>
        </HStack>
      </Flex>

      <SimpleGrid columns={{ base: 1, lg: 3 }} gap="5">
        <Box gridColumn={{ lg: "span 2" }}>
          <VStack gap="5" align="stretch">
            {/* Risk Analysis */}
            <TerminalBox title="RISK ANALYSIS" icon={Shield}>
              <Flex align="center" gap="10" flexWrap="wrap">
                {/* ASCII risk meter */}
                <Box>
                  <Text fontSize="2xs" color="rgba(0, 255, 65, 0.4)" mb="2">
                    THREAT LEVEL INDICATOR
                  </Text>
                  <Box
                    border="1px solid rgba(0, 255, 65, 0.2)"
                    p="4"
                    bg="rgba(0, 255, 65, 0.02)"
                    textAlign="center"
                    minW="140px"
                  >
                    <Text
                      fontSize="4xl"
                      fontWeight="bold"
                      color={riskColor}
                      textShadow={`0 0 15px ${riskColor}88, 0 0 30px ${riskColor}44`}
                      lineHeight="1"
                      mb="2"
                    >
                      {alert.risk_score}
                    </Text>
                    <Text
                      fontSize="2xs"
                      color="rgba(0, 255, 65, 0.4)"
                      letterSpacing="widest"
                    >
                      RISK SCORE
                    </Text>
                    {/* ASCII bar */}
                    <Box mt="3">
                      <Text
                        fontSize="2xs"
                        color="rgba(0, 255, 65, 0.3)"
                        fontFamily="monospace"
                      >
                        [
                        <Text as="span" color={riskColor}>
                          {"#".repeat(Math.round(alert.risk_score / 5))}
                        </Text>
                        <Text as="span" color="rgba(0, 255, 65, 0.1)">
                          {".".repeat(20 - Math.round(alert.risk_score / 5))}
                        </Text>
                        ]
                      </Text>
                    </Box>
                  </Box>
                </Box>

                <Box>
                  <Text
                    fontSize="2xs"
                    color="rgba(0, 255, 65, 0.4)"
                    mb="1"
                    letterSpacing="wider"
                  >
                    SYSTEM RECOMMENDATION
                  </Text>
                  <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    color={
                      (alert.decision_tier || alert.decision) === "FLAG"
                        ? "#FF3333"
                        : (alert.decision_tier || alert.decision) === "REVIEW"
                          ? "#FFB000"
                          : "#00FF41"
                    }
                    textShadow={`0 0 10px ${
                      (alert.decision_tier || alert.decision) === "FLAG"
                        ? "rgba(255, 51, 51, 0.5)"
                        : (alert.decision_tier || alert.decision) === "REVIEW"
                          ? "rgba(255, 176, 0, 0.5)"
                          : "rgba(0, 255, 65, 0.5)"
                    }`}
                    letterSpacing="widest"
                    mb="2"
                  >
                    {(
                      alert.decision_tier ||
                      alert.decision ||
                      ""
                    ).toUpperCase()}
                  </Text>
                  {alert.decision_tier_description && (
                    <Text
                      fontSize="xs"
                      color="rgba(0, 255, 65, 0.5)"
                      border="1px solid rgba(0, 255, 65, 0.1)"
                      px="3"
                      py="1"
                      bg="rgba(0, 255, 65, 0.02)"
                      display="inline-block"
                    >
                      {alert.decision_tier_description}
                    </Text>
                  )}
                </Box>
              </Flex>
            </TerminalBox>

            {/* Triggered Rules */}
            <TerminalBox
              title={`TRIGGERED RULES [${alert.triggered_rules?.length || 0}]`}
              icon={AlertTriangle}
            >
              {alert.triggered_rules?.length === 0 ? (
                <Text color="rgba(0, 255, 65, 0.3)" fontSize="xs">
                  {">"} No rules triggered for this alert.
                </Text>
              ) : (
                <VStack gap="0" align="stretch">
                  {alert.triggered_rules?.map((rule, index) => (
                    <Box
                      key={index}
                      py="3"
                      borderBottomWidth={
                        index < (alert.triggered_rules?.length || 0) - 1
                          ? "1px"
                          : "0"
                      }
                      borderColor="rgba(0, 255, 65, 0.08)"
                    >
                      <Flex justify="space-between" align="start" mb="1">
                        <Box pr="4">
                          <HStack gap="2" mb="1">
                            <Text fontSize="2xs" color="rgba(0, 255, 65, 0.3)">
                              [{String(index + 1).padStart(2, "0")}]
                            </Text>
                            <Text
                              fontWeight="bold"
                              color="#00FF41"
                              fontSize="xs"
                            >
                              {rule.name}
                            </Text>
                            <Text
                              fontSize="2xs"
                              color="rgba(0, 255, 65, 0.3)"
                              border="1px solid rgba(0, 255, 65, 0.1)"
                              px="1.5"
                              py="0.5"
                            >
                              {rule.code}
                            </Text>
                          </HStack>
                          {rule.description && (
                            <Text
                              fontSize="2xs"
                              color="rgba(0, 255, 65, 0.4)"
                              ml="8"
                            >
                              {rule.description}
                            </Text>
                          )}
                        </Box>
                        <VStack align="end" gap="1" minW="80px">
                          <Text
                            fontSize="xs"
                            fontWeight="bold"
                            color={rule.score >= 50 ? "#FF3333" : "#FFB000"}
                            textShadow={`0 0 6px ${rule.score >= 50 ? "rgba(255, 51, 51, 0.4)" : "rgba(255, 176, 0, 0.4)"}`}
                          >
                            +{rule.score}
                          </Text>
                          <Text
                            as="span"
                            fontSize="2xs"
                            fontWeight="bold"
                            letterSpacing="wider"
                            color={SEVERITY_COLORS[rule.severity] || "#00FF41"}
                            border="1px solid"
                            borderColor={
                              SEVERITY_COLORS[rule.severity] || "#00FF41"
                            }
                            px="1.5"
                            py="0.5"
                            textShadow={`0 0 6px ${SEVERITY_COLORS[rule.severity] || "#00FF41"}`}
                          >
                            {rule.severity.toUpperCase()}
                          </Text>
                        </VStack>
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              )}
            </TerminalBox>

            {/* Transaction Details */}
            <TerminalBox title="TRANSACTION DATA" icon={CreditCard}>
              {alert.transaction ? (
                <SimpleGrid columns={{ base: 1, md: 2 }} gap="5" gapX="10">
                  <Box>
                    <Text
                      fontSize="2xs"
                      color="rgba(0, 255, 65, 0.35)"
                      letterSpacing="wider"
                      mb="1"
                    >
                      AMOUNT
                    </Text>
                    <Text
                      fontWeight="bold"
                      fontSize="xl"
                      color="#FFB000"
                      textShadow="0 0 8px rgba(255, 176, 0, 0.4)"
                    >
                      {alert.transaction.amount.toLocaleString("en-US", {
                        style: "currency",
                        currency: alert.transaction.currency || "USD",
                      })}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      fontSize="2xs"
                      color="rgba(0, 255, 65, 0.35)"
                      letterSpacing="wider"
                      mb="1"
                    >
                      MERCHANT
                    </Text>
                    <Text fontWeight="bold" fontSize="sm" color="#00FF41">
                      {alert.transaction.merchant_name || "N/A"}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      fontSize="2xs"
                      color="rgba(0, 255, 65, 0.35)"
                      letterSpacing="wider"
                      mb="1"
                    >
                      TYPE / CHANNEL
                    </Text>
                    <Text fontSize="xs" color="rgba(0, 255, 65, 0.6)">
                      {alert.transaction.transaction_type} via{" "}
                      {alert.transaction.channel}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      fontSize="2xs"
                      color="rgba(0, 255, 65, 0.35)"
                      letterSpacing="wider"
                      mb="1"
                    >
                      LOCATION
                    </Text>
                    <HStack>
                      <Icon boxSize="3" color="rgba(0, 255, 65, 0.3)">
                        <MapPin />
                      </Icon>
                      <Text fontSize="xs" color="rgba(0, 255, 65, 0.6)">
                        {alert.transaction.location_country || "N/A"}
                      </Text>
                    </HStack>
                  </Box>
                  <Box>
                    <Text
                      fontSize="2xs"
                      color="rgba(0, 255, 65, 0.35)"
                      letterSpacing="wider"
                      mb="1"
                    >
                      TIMESTAMP
                    </Text>
                    <Text fontSize="xs" color="rgba(0, 255, 65, 0.6)">
                      {format(
                        new Date(alert.transaction.transaction_time),
                        "yyyy-MM-dd HH:mm:ss",
                      )}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      fontSize="2xs"
                      color="rgba(0, 255, 65, 0.35)"
                      letterSpacing="wider"
                      mb="1"
                    >
                      REFERENCE_ID
                    </Text>
                    <Text
                      fontSize="2xs"
                      color="rgba(0, 255, 65, 0.5)"
                      bg="rgba(0, 255, 65, 0.03)"
                      border="1px solid rgba(0, 255, 65, 0.1)"
                      px="2"
                      py="1"
                      display="inline-block"
                    >
                      {alert.transaction.external_id}
                    </Text>
                  </Box>
                </SimpleGrid>
              ) : (
                <Text color="rgba(0, 255, 65, 0.3)" fontSize="xs">
                  {">"} No transaction data available.
                </Text>
              )}
            </TerminalBox>
          </VStack>
        </Box>

        {/* Right column */}
        <Box>
          <VStack gap="5" align="stretch" position="sticky" top="0">
            {/* Customer Profile */}
            <TerminalBox title="SUBJECT PROFILE" icon={User}>
              {isCustomerLoading ? (
                <Text
                  color="rgba(0, 255, 65, 0.5)"
                  fontSize="xs"
                  className="terminal-cursor"
                >
                  {">"} Fetching subject profile...
                </Text>
              ) : (
                <>
                  <Box
                    p="3"
                    border="1px solid rgba(0, 255, 65, 0.1)"
                    bg="rgba(0, 255, 65, 0.02)"
                    mb="4"
                  >
                    <HStack gap="3">
                      <Box
                        w="10"
                        h="10"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        border="1px solid rgba(0, 255, 65, 0.3)"
                        color="#00FF41"
                        fontWeight="bold"
                        fontSize="sm"
                        textShadow="0 0 6px rgba(0, 255, 65, 0.4)"
                      >
                        {(customer?.full_name || alert.customer_id)
                          .substring(0, 2)
                          .toUpperCase()}
                      </Box>
                      <Box>
                        {customer?.full_name && (
                          <Text fontWeight="bold" color="#00FF41" fontSize="sm">
                            {customer.full_name}
                          </Text>
                        )}
                        <Text
                          fontSize="2xs"
                          color={
                            customer?.full_name
                              ? "rgba(0, 255, 65, 0.4)"
                              : "#00FF41"
                          }
                          fontWeight={customer?.full_name ? "normal" : "bold"}
                        >
                          {alert.customer_id}
                        </Text>
                        <Text fontSize="2xs" color="#FFB000">
                          TIER: {customer?.tier?.toUpperCase() || "N/A"}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>

                  <VStack gap="2" align="stretch" fontSize="xs">
                    <Flex
                      justify="space-between"
                      py="1.5"
                      borderBottomWidth="1px"
                      borderColor="rgba(0, 255, 65, 0.06)"
                    >
                      <Text color="rgba(0, 255, 65, 0.4)">Account Age</Text>
                      <Text color="#00FF41">
                        {customer
                          ? formatAccountAge(customer.account_age_days)
                          : "N/A"}
                      </Text>
                    </Flex>
                    <Flex
                      justify="space-between"
                      py="1.5"
                      borderBottomWidth="1px"
                      borderColor="rgba(0, 255, 65, 0.06)"
                    >
                      <Text color="rgba(0, 255, 65, 0.4)">Spend (30d)</Text>
                      <Text color="#00FF41">
                        {customer?.total_spend_30d
                          ? `R ${customer.total_spend_30d}`
                          : "N/A"}
                      </Text>
                    </Flex>
                    <Flex
                      justify="space-between"
                      py="1.5"
                      borderBottomWidth="1px"
                      borderColor="rgba(0, 255, 65, 0.06)"
                    >
                      <Text color="rgba(0, 255, 65, 0.4)">
                        Transactions (30d)
                      </Text>
                      <Text color="#00FF41">
                        {customer?.total_transactions_30d ?? "N/A"}
                      </Text>
                    </Flex>
                    <Flex
                      justify="space-between"
                      py="1.5"
                      borderBottomWidth="1px"
                      borderColor="rgba(0, 255, 65, 0.06)"
                    >
                      <Text color="rgba(0, 255, 65, 0.4)">Risk Rating</Text>
                      <Text
                        color={
                          customer?.risk_rating === "high"
                            ? "#FF3333"
                            : customer?.risk_rating === "medium"
                              ? "#FFB000"
                              : "#00FF41"
                        }
                        textTransform="uppercase"
                      >
                        {customer?.risk_rating || "N/A"}
                      </Text>
                    </Flex>
                    <Flex justify="space-between" py="1.5">
                      <Text color="rgba(0, 255, 65, 0.4)">KYC Status</Text>
                      <Text color="#00FF41" textTransform="uppercase">
                        {customer?.kyc_status || "N/A"}
                      </Text>
                    </Flex>
                  </VStack>
                </>
              )}
            </TerminalBox>

            {/* Review Action */}
            <TerminalBox title="REVIEW ACTION" icon={Flag}>
              {isPending && canReview ? (
                <>
                  <Box mb="4">
                    <Text
                      fontSize="2xs"
                      color="rgba(0, 255, 65, 0.4)"
                      mb="2"
                      letterSpacing="wider"
                    >
                      {">"} INVESTIGATION NOTES
                    </Text>
                    <Textarea
                      placeholder="Enter findings..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      rows={4}
                      bg="#0d0d0d"
                      border="1px solid rgba(0, 255, 65, 0.3)"
                      color="#00FF41"
                      fontSize="xs"
                      resize="none"
                      _focus={{
                        borderColor: "#00FF41",
                        boxShadow: "0 0 8px rgba(0, 255, 65, 0.3)",
                      }}
                      _placeholder={{ color: "rgba(0, 255, 65, 0.2)" }}
                    />
                  </Box>
                  <VStack gap="2" align="stretch">
                    <Box
                      as="button"
                      w="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      gap="2"
                      py="2.5"
                      border="1px solid rgba(255, 51, 51, 0.4)"
                      bg="rgba(255, 51, 51, 0.05)"
                      color="#FF3333"
                      fontWeight="bold"
                      fontSize="xs"
                      letterSpacing="wider"
                      _hover={{
                        bg: "rgba(255, 51, 51, 0.1)",
                        borderColor: "#FF3333",
                        textShadow: "0 0 8px rgba(255, 51, 51, 0.5)",
                      }}
                      transition="all 0.15s"
                      disabled={isReviewing}
                      opacity={isReviewing ? 0.5 : 1}
                      onClick={() => handleReview("confirmed")}
                    >
                      <Icon boxSize="4">
                        <XCircle />
                      </Icon>
                      CONFIRM FRAUD
                    </Box>
                    <Box
                      as="button"
                      w="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      gap="2"
                      py="2.5"
                      border="1px solid rgba(0, 255, 65, 0.4)"
                      bg="rgba(0, 255, 65, 0.05)"
                      color="#00FF41"
                      fontWeight="bold"
                      fontSize="xs"
                      letterSpacing="wider"
                      _hover={{
                        bg: "rgba(0, 255, 65, 0.1)",
                        borderColor: "#00FF41",
                        textShadow: "0 0 8px rgba(0, 255, 65, 0.5)",
                      }}
                      transition="all 0.15s"
                      disabled={isReviewing}
                      opacity={isReviewing ? 0.5 : 1}
                      onClick={() => handleReview("dismissed")}
                    >
                      <Icon boxSize="4">
                        <CheckCircle />
                      </Icon>
                      DISMISS AS SAFE
                    </Box>
                    <Box
                      as="button"
                      w="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      gap="2"
                      py="2.5"
                      border="1px solid rgba(255, 176, 0, 0.4)"
                      bg="rgba(255, 176, 0, 0.05)"
                      color="#FFB000"
                      fontWeight="bold"
                      fontSize="xs"
                      letterSpacing="wider"
                      _hover={{
                        bg: "rgba(255, 176, 0, 0.1)",
                        borderColor: "#FFB000",
                        textShadow: "0 0 8px rgba(255, 176, 0, 0.5)",
                      }}
                      transition="all 0.15s"
                      disabled={isReviewing}
                      opacity={isReviewing ? 0.5 : 1}
                      onClick={() => handleReview("escalated")}
                    >
                      ESCALATE FOR REVIEW
                    </Box>
                  </VStack>
                </>
              ) : isPending && !canReview ? (
                <Box textAlign="center" py="6">
                  <Text
                    color="#00FF41"
                    fontWeight="700"
                    letterSpacing="0.1em"
                    textShadow="0 0 10px rgba(0,255,65,0.5)"
                    fontSize="lg"
                  >
                    PENDING REVIEW
                  </Text>
                  <Text
                    fontSize="xs"
                    color="rgba(0,255,65,0.5)"
                    letterSpacing="0.05em"
                    mt="2"
                  >
                    ACCESS DENIED: Insufficient permissions to review alerts.
                  </Text>
                </Box>
              ) : (
                <Box textAlign="center" py="4">
                  <Box
                    w="14"
                    h="14"
                    mx="auto"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mb="3"
                    border="1px solid"
                    borderColor={
                      alert.status === "confirmed"
                        ? "rgba(255, 51, 51, 0.3)"
                        : "rgba(0, 255, 65, 0.3)"
                    }
                    color={alert.status === "confirmed" ? "#FF3333" : "#00FF41"}
                  >
                    <Icon boxSize="7">
                      {alert.status === "confirmed" ? (
                        <AlertTriangle />
                      ) : (
                        <CheckCircle />
                      )}
                    </Icon>
                  </Box>
                  <Text
                    fontWeight="bold"
                    color={alert.status === "confirmed" ? "#FF3333" : "#00FF41"}
                    textTransform="uppercase"
                    fontSize="sm"
                    letterSpacing="wider"
                    textShadow={`0 0 8px ${alert.status === "confirmed" ? "rgba(255, 51, 51, 0.4)" : "rgba(0, 255, 65, 0.4)"}`}
                    mb="3"
                  >
                    ALERT {alert.status.toUpperCase()}
                  </Text>
                  <Box
                    fontSize="2xs"
                    color="rgba(0, 255, 65, 0.5)"
                    border="1px solid rgba(0, 255, 65, 0.1)"
                    p="3"
                    bg="rgba(0, 255, 65, 0.02)"
                    textAlign="left"
                  >
                    <Text mb="1">
                      REVIEWED_BY: {alert.reviewed_by || "SYSTEM"}
                    </Text>
                    <Text mb="1">
                      REVIEWED_AT:{" "}
                      {alert.reviewed_at
                        ? format(
                            new Date(alert.reviewed_at),
                            "yyyy-MM-dd HH:mm:ss",
                          )
                        : "N/A"}
                    </Text>
                    {alert.review_notes && (
                      <Text
                        color="rgba(0, 255, 65, 0.4)"
                        mt="2"
                        fontStyle="italic"
                      >
                        NOTES: "{alert.review_notes}"
                      </Text>
                    )}
                  </Box>
                </Box>
              )}
            </TerminalBox>
          </VStack>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
