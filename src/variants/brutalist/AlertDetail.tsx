import { useNavigate } from "@tanstack/react-router";
import {
  Box,
  Flex,
  Text,
  HStack,
  VStack,
  Icon,
  Spinner,
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
  Terminal,
  Zap,
  Eye,
} from "lucide-react";
import { SentinelBadge } from "../../components/ui/badge";
import { useAuth } from "../../contexts/AuthContext";
import type { AlertDetailData } from "../../hooks/useAlertDetail";

function formatAccountAge(days: number): string {
  const years = Math.floor(days / 365);
  const remaining = days % 365;
  if (years > 0 && remaining > 0) return `${years}y ${remaining}d`;
  if (years > 0) return `${years} year${years > 1 ? "s" : ""}`;
  return `${days} days`;
}

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

export default function BrutalistAlertDetail({
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
            Loading alert...
          </Text>
        </Box>
      </Flex>
    );
  }

  if (!alert) {
    return (
      <Box className="brutal-animate-in">
        <Box
          bg="#FAFAFA"
          border="3px solid #000"
          boxShadow="8px 8px 0px #000"
          p="8"
          textAlign="center"
        >
          <Text
            fontFamily="'Bebas Neue', sans-serif"
            fontSize="3xl"
            color="#000"
            letterSpacing="wider"
          >
            ALERT NOT FOUND
          </Text>
          <Text
            fontFamily="'JetBrains Mono', monospace"
            fontSize="xs"
            color="#000"
            opacity={0.5}
            mt="2"
          >
            The requested alert does not exist
          </Text>
          <Box
            as="button"
            mt="6"
            px="6"
            py="3"
            bg="#FACC15"
            border="3px solid #000"
            boxShadow="4px 4px 0px #000"
            color="#000"
            fontWeight="800"
            fontSize="sm"
            fontFamily="'JetBrains Mono', monospace"
            textTransform="uppercase"
            _hover={{
              transform: "translate(-2px,-2px)",
              boxShadow: "6px 6px 0px #000",
            }}
            transition="all 0.1s"
            onClick={() => navigate({ to: "/alerts" })}
          >
            {"<"}- BACK TO ALERTS
          </Box>
        </Box>
      </Box>
    );
  }

  const isPending = alert.status === "pending";
  const riskColor =
    alert.risk_score >= 70
      ? "#000"
      : alert.risk_score >= 40
        ? "#FACC15"
        : "#FAFAFA";

  return (
    <Box className="brutal-animate-in" pb="12">
      {/* Header */}
      <Flex
        mb="8"
        justify="space-between"
        align="start"
        flexWrap="wrap"
        gap="4"
      >
        <HStack gap="4" align="start">
          <Box
            as="button"
            p="3"
            bg="#FAFAFA"
            border="3px solid #000"
            boxShadow="4px 4px 0px #000"
            _hover={{
              bg: "#FACC15",
              transform: "translate(-2px,-2px)",
              boxShadow: "6px 6px 0px #000",
            }}
            transition="all 0.1s"
            color="#000"
            onClick={() => navigate({ to: "/alerts" })}
          >
            <Icon boxSize="5">
              <ArrowLeft />
            </Icon>
          </Box>
          <Box>
            <Text
              fontSize="4xl"
              fontWeight="800"
              color="#000"
              fontFamily="'Bebas Neue', sans-serif"
              letterSpacing="wider"
              lineHeight="1"
            >
              ALERT DETAIL
            </Text>
            <Text
              fontFamily="'JetBrains Mono', monospace"
              fontSize="xs"
              color="#000"
              opacity={0.5}
              fontWeight="600"
              mt="1"
            >
              {">"} {alert.id}
            </Text>
          </Box>
        </HStack>
        <Box
          px="4"
          py="2"
          border="3px solid #000"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="xs"
          fontWeight="800"
          textTransform="uppercase"
          letterSpacing="wider"
          bg={
            alert.status === "pending"
              ? "#FACC15"
              : alert.status === "confirmed"
                ? "#000"
                : "#FAFAFA"
          }
          color={alert.status === "confirmed" ? "#FACC15" : "#000"}
          boxShadow="4px 4px 0px #000"
        >
          {alert.status}
        </Box>
      </Flex>

      <SimpleGrid columns={{ base: 1, lg: 3 }} gap="6">
        <Box gridColumn={{ lg: "span 2" }}>
          <VStack gap="6" align="stretch">
            {/* Risk Analysis */}
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
                  <Shield />
                </Icon>
                <Text
                  fontSize="sm"
                  fontWeight="800"
                  color="#FACC15"
                  fontFamily="'JetBrains Mono', monospace"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Risk Analysis
                </Text>
              </Box>
              <Box p="6">
                <Flex align="center" gap="10" flexWrap="wrap">
                  {/* Risk Score */}
                  <Box textAlign="center">
                    <Box
                      w="32"
                      h="32"
                      border="6px solid #000"
                      bg={riskColor}
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      position="relative"
                    >
                      <Text
                        fontSize="6xl"
                        fontWeight="800"
                        color={alert.risk_score >= 70 ? "#FACC15" : "#000"}
                        fontFamily="'Bebas Neue', sans-serif"
                        lineHeight="1"
                      >
                        {alert.risk_score}
                      </Text>
                      <Text
                        fontSize="2xs"
                        fontWeight="800"
                        color={alert.risk_score >= 70 ? "#FACC15" : "#000"}
                        fontFamily="'JetBrains Mono', monospace"
                        textTransform="uppercase"
                        letterSpacing="widest"
                        opacity={0.7}
                      >
                        RISK
                      </Text>
                    </Box>
                  </Box>

                  {/* Decision */}
                  <Box>
                    <Text
                      fontSize="2xs"
                      color="#000"
                      opacity={0.4}
                      textTransform="uppercase"
                      letterSpacing="widest"
                      fontWeight="800"
                      fontFamily="'JetBrains Mono', monospace"
                      mb="1"
                    >
                      System Recommendation
                    </Text>
                    <Text
                      fontSize="5xl"
                      fontWeight="800"
                      fontFamily="'Bebas Neue', sans-serif"
                      letterSpacing="wider"
                      lineHeight="1"
                      color="#000"
                    >
                      {(
                        alert.decision_tier ||
                        alert.decision ||
                        ""
                      ).toUpperCase()}
                    </Text>
                    {alert.decision_tier_description && (
                      <Box
                        mt="3"
                        px="3"
                        py="2"
                        bg="#FACC15"
                        border="2px solid #000"
                        display="inline-block"
                      >
                        <Text
                          fontSize="xs"
                          color="#000"
                          fontWeight="700"
                          fontFamily="'JetBrains Mono', monospace"
                        >
                          {alert.decision_tier_description}
                        </Text>
                      </Box>
                    )}
                  </Box>
                </Flex>
              </Box>
            </Box>

            {/* Triggered Rules */}
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
                justifyContent="space-between"
              >
                <HStack>
                  <Icon boxSize="4" color="#FACC15" mr="1">
                    <Zap />
                  </Icon>
                  <Text
                    fontSize="sm"
                    fontWeight="800"
                    color="#FACC15"
                    fontFamily="'JetBrains Mono', monospace"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Triggered Rules
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
                  {alert.triggered_rules?.length || 0}
                </Box>
              </Box>
              <Box>
                {alert.triggered_rules?.length === 0 ? (
                  <Text
                    color="#000"
                    opacity={0.4}
                    textAlign="center"
                    py="8"
                    fontFamily="'JetBrains Mono', monospace"
                    fontWeight="700"
                    textTransform="uppercase"
                    fontSize="sm"
                  >
                    No Rules Triggered
                  </Text>
                ) : (
                  <VStack gap="0" align="stretch">
                    {alert.triggered_rules?.map((rule, index) => (
                      <Box
                        key={index}
                        p="5"
                        borderBottom="2px solid #000"
                        _hover={{ bg: "rgba(250,204,21,0.1)" }}
                        transition="background 0.1s"
                      >
                        <Flex justify="space-between" align="start">
                          <Box pr="4" flex="1">
                            <HStack mb="1" flexWrap="wrap" gap="2">
                              <Text
                                fontWeight="800"
                                color="#000"
                                fontSize="sm"
                                fontFamily="'JetBrains Mono', monospace"
                              >
                                {rule.name}
                              </Text>
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
                            </HStack>
                            {rule.description && (
                              <Text
                                fontSize="sm"
                                color="#000"
                                opacity={0.6}
                                mt="1"
                                fontFamily="'JetBrains Mono', monospace"
                                fontWeight="500"
                                lineHeight="relaxed"
                              >
                                {rule.description}
                              </Text>
                            )}
                          </Box>
                          <VStack align="end" gap="2" minW="80px">
                            <Box
                              px="3"
                              py="1"
                              bg={rule.score >= 50 ? "#000" : "#FACC15"}
                              color={rule.score >= 50 ? "#FACC15" : "#000"}
                              border="2px solid #000"
                              fontWeight="800"
                              fontSize="sm"
                              fontFamily="'Bebas Neue', sans-serif"
                              letterSpacing="wider"
                            >
                              +{rule.score}
                            </Box>
                            <SentinelBadge
                              color={getSeverityBadgeColor(rule.severity)}
                            >
                              {rule.severity}
                            </SentinelBadge>
                          </VStack>
                        </Flex>
                      </Box>
                    ))}
                  </VStack>
                )}
              </Box>
            </Box>

            {/* Transaction Details */}
            <Box
              bg="#FAFAFA"
              border="3px solid #000"
              boxShadow="8px 8px 0px #000"
              overflow="hidden"
              className="brutal-animate-in brutal-stagger-3"
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
                  <CreditCard />
                </Icon>
                <Text
                  fontSize="sm"
                  fontWeight="800"
                  color="#FACC15"
                  fontFamily="'JetBrains Mono', monospace"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Transaction Details
                </Text>
              </Box>
              <Box p="6">
                {alert.transaction ? (
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap="6" gapX="10">
                    <Box>
                      <Text
                        fontSize="2xs"
                        fontWeight="800"
                        color="#000"
                        opacity={0.4}
                        textTransform="uppercase"
                        letterSpacing="widest"
                        fontFamily="'JetBrains Mono', monospace"
                      >
                        Amount
                      </Text>
                      <Text
                        fontWeight="800"
                        fontSize="3xl"
                        color="#000"
                        fontFamily="'Bebas Neue', sans-serif"
                        letterSpacing="wider"
                        mt="1"
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
                        fontWeight="800"
                        color="#000"
                        opacity={0.4}
                        textTransform="uppercase"
                        letterSpacing="widest"
                        fontFamily="'JetBrains Mono', monospace"
                      >
                        Merchant
                      </Text>
                      <Text
                        fontWeight="700"
                        fontSize="md"
                        color="#000"
                        mt="1"
                        fontFamily="'JetBrains Mono', monospace"
                      >
                        {alert.transaction.merchant_name || "N/A"}
                      </Text>
                    </Box>
                    <Box>
                      <Text
                        fontSize="2xs"
                        fontWeight="800"
                        color="#000"
                        opacity={0.4}
                        textTransform="uppercase"
                        letterSpacing="widest"
                        fontFamily="'JetBrains Mono', monospace"
                      >
                        Type / Channel
                      </Text>
                      <Text
                        fontWeight="600"
                        color="#000"
                        mt="1"
                        fontFamily="'JetBrains Mono', monospace"
                        fontSize="sm"
                      >
                        {alert.transaction.transaction_type} via{" "}
                        {alert.transaction.channel}
                      </Text>
                    </Box>
                    <Box>
                      <Text
                        fontSize="2xs"
                        fontWeight="800"
                        color="#000"
                        opacity={0.4}
                        textTransform="uppercase"
                        letterSpacing="widest"
                        fontFamily="'JetBrains Mono', monospace"
                      >
                        Location
                      </Text>
                      <HStack mt="1">
                        <Icon boxSize="4" color="#000">
                          <MapPin />
                        </Icon>
                        <Text
                          fontWeight="600"
                          color="#000"
                          fontFamily="'JetBrains Mono', monospace"
                          fontSize="sm"
                        >
                          {alert.transaction.location_country || "N/A"}
                        </Text>
                      </HStack>
                    </Box>
                    <Box>
                      <Text
                        fontSize="2xs"
                        fontWeight="800"
                        color="#000"
                        opacity={0.4}
                        textTransform="uppercase"
                        letterSpacing="widest"
                        fontFamily="'JetBrains Mono', monospace"
                      >
                        Time
                      </Text>
                      <Text
                        fontWeight="600"
                        color="#000"
                        mt="1"
                        fontFamily="'JetBrains Mono', monospace"
                        fontSize="sm"
                      >
                        {format(
                          new Date(alert.transaction.transaction_time),
                          "dd/MM/yyyy, HH:mm:ss",
                        )}
                      </Text>
                    </Box>
                    <Box>
                      <Text
                        fontSize="2xs"
                        fontWeight="800"
                        color="#000"
                        opacity={0.4}
                        textTransform="uppercase"
                        letterSpacing="widest"
                        fontFamily="'JetBrains Mono', monospace"
                      >
                        Reference ID
                      </Text>
                      <Box
                        mt="1"
                        px="3"
                        py="1.5"
                        bg="#000"
                        border="2px solid #000"
                        display="inline-block"
                      >
                        <Text
                          fontFamily="'JetBrains Mono', monospace"
                          fontSize="xs"
                          color="#FACC15"
                          fontWeight="600"
                        >
                          {alert.transaction.external_id}
                        </Text>
                      </Box>
                    </Box>
                  </SimpleGrid>
                ) : (
                  <Text
                    color="#000"
                    opacity={0.4}
                    fontFamily="'JetBrains Mono', monospace"
                    fontWeight="700"
                    textTransform="uppercase"
                    fontSize="sm"
                  >
                    No transaction details available
                  </Text>
                )}
              </Box>
            </Box>
          </VStack>
        </Box>

        {/* Right Column */}
        <Box>
          <VStack gap="6" align="stretch" position="sticky" top="0">
            {/* Customer Profile */}
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
                  <User />
                </Icon>
                <Text
                  fontSize="sm"
                  fontWeight="800"
                  color="#FACC15"
                  fontFamily="'JetBrains Mono', monospace"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Customer
                </Text>
              </Box>
              <Box p="5">
                {isCustomerLoading ? (
                  <Flex justify="center" py="8">
                    <Spinner size="md" color="#000" borderWidth="3px" />
                  </Flex>
                ) : (
                  <>
                    <Flex
                      align="center"
                      mb="5"
                      p="4"
                      bg="#FACC15"
                      border="3px solid #000"
                    >
                      <Box
                        w="14"
                        h="14"
                        bg="#000"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color="#FACC15"
                        fontWeight="800"
                        fontSize="xl"
                        fontFamily="'Bebas Neue', sans-serif"
                        border="3px solid #000"
                      >
                        {(customer?.full_name || alert.customer_id)
                          .substring(0, 2)
                          .toUpperCase()}
                      </Box>
                      <Box ml="4">
                        {customer?.full_name && (
                          <Text
                            fontWeight="800"
                            color="#000"
                            fontSize="md"
                            fontFamily="'JetBrains Mono', monospace"
                          >
                            {customer.full_name}
                          </Text>
                        )}
                        <Text
                          fontWeight="600"
                          color="#000"
                          fontSize="2xs"
                          fontFamily="'JetBrains Mono', monospace"
                          opacity={customer?.full_name ? 0.5 : 1}
                        >
                          {alert.customer_id}
                        </Text>
                        <Text
                          fontSize="2xs"
                          bg="#000"
                          color="#FACC15"
                          px="2"
                          py="0.5"
                          fontWeight="800"
                          fontFamily="'JetBrains Mono', monospace"
                          textTransform="uppercase"
                          display="inline-block"
                          mt="1"
                        >
                          {customer?.tier || "N/A"}
                        </Text>
                      </Box>
                    </Flex>
                    <VStack gap="0" align="stretch" fontSize="sm">
                      <Flex
                        justify="space-between"
                        py="3"
                        borderBottom="2px solid #000"
                      >
                        <Text
                          color="#000"
                          opacity={0.5}
                          fontWeight="700"
                          fontFamily="'JetBrains Mono', monospace"
                          fontSize="xs"
                          textTransform="uppercase"
                        >
                          Account Age
                        </Text>
                        <Text
                          fontWeight="800"
                          color="#000"
                          fontFamily="'JetBrains Mono', monospace"
                          fontSize="xs"
                        >
                          {customer
                            ? formatAccountAge(customer.account_age_days)
                            : "N/A"}
                        </Text>
                      </Flex>
                      <Flex
                        justify="space-between"
                        py="3"
                        borderBottom="2px solid #000"
                      >
                        <Text
                          color="#000"
                          opacity={0.5}
                          fontWeight="700"
                          fontFamily="'JetBrains Mono', monospace"
                          fontSize="xs"
                          textTransform="uppercase"
                        >
                          Spend (30d)
                        </Text>
                        <Text
                          fontWeight="800"
                          color="#000"
                          fontFamily="'JetBrains Mono', monospace"
                          fontSize="xs"
                        >
                          {customer?.total_spend_30d
                            ? `R ${customer.total_spend_30d}`
                            : "N/A"}
                        </Text>
                      </Flex>
                      <Flex
                        justify="space-between"
                        py="3"
                        borderBottom="2px solid #000"
                      >
                        <Text
                          color="#000"
                          opacity={0.5}
                          fontWeight="700"
                          fontFamily="'JetBrains Mono', monospace"
                          fontSize="xs"
                          textTransform="uppercase"
                        >
                          Transactions (30d)
                        </Text>
                        <Box
                          px="2"
                          bg="#FACC15"
                          border="2px solid #000"
                          fontWeight="800"
                          fontFamily="'JetBrains Mono', monospace"
                          fontSize="xs"
                        >
                          {customer?.total_transactions_30d ?? "N/A"}
                        </Box>
                      </Flex>
                      <Flex
                        justify="space-between"
                        py="3"
                        borderBottom="2px solid #000"
                      >
                        <Text
                          color="#000"
                          opacity={0.5}
                          fontWeight="700"
                          fontFamily="'JetBrains Mono', monospace"
                          fontSize="xs"
                          textTransform="uppercase"
                        >
                          Risk Rating
                        </Text>
                        <Text
                          fontWeight="800"
                          color="#000"
                          fontFamily="'JetBrains Mono', monospace"
                          fontSize="xs"
                          textTransform="uppercase"
                        >
                          {customer?.risk_rating || "N/A"}
                        </Text>
                      </Flex>
                      <Flex justify="space-between" py="3">
                        <Text
                          color="#000"
                          opacity={0.5}
                          fontWeight="700"
                          fontFamily="'JetBrains Mono', monospace"
                          fontSize="xs"
                          textTransform="uppercase"
                        >
                          KYC Status
                        </Text>
                        <Text
                          fontWeight="800"
                          color="#000"
                          fontFamily="'JetBrains Mono', monospace"
                          fontSize="xs"
                          textTransform="uppercase"
                        >
                          {customer?.kyc_status || "N/A"}
                        </Text>
                      </Flex>
                    </VStack>
                  </>
                )}
              </Box>
            </Box>

            {/* Review Action */}
            <Box
              bg="#FAFAFA"
              border="3px solid #000"
              boxShadow="8px 8px 0px #000"
              overflow="hidden"
              opacity={!isPending ? 0.85 : undefined}
              className="brutal-animate-in brutal-stagger-3"
            >
              <Box
                px="6"
                py="4"
                bg={isPending ? "#FACC15" : "#000"}
                borderBottom="3px solid #000"
                display="flex"
                alignItems="center"
              >
                <Icon boxSize="4" color={isPending ? "#000" : "#FACC15"} mr="2">
                  <Flag />
                </Icon>
                <Text
                  fontSize="sm"
                  fontWeight="800"
                  color={isPending ? "#000" : "#FACC15"}
                  fontFamily="'JetBrains Mono', monospace"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Review Action
                </Text>
              </Box>
              <Box p="5">
                {isPending && canReview ? (
                  <>
                    <Box mb="5">
                      <Text
                        fontSize="2xs"
                        fontWeight="800"
                        color="#000"
                        mb="2"
                        fontFamily="'JetBrains Mono', monospace"
                        textTransform="uppercase"
                        letterSpacing="widest"
                      >
                        Investigation Notes
                      </Text>
                      <Textarea
                        placeholder="ENTER FINDINGS..."
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        rows={4}
                        bg="#FAFAFA"
                        border="3px solid #000"
                        borderRadius="0"
                        fontSize="sm"
                        fontFamily="'JetBrains Mono', monospace"
                        fontWeight="600"
                        resize="none"
                        _focus={{
                          outline: "none",
                          boxShadow: "4px 4px 0px #FACC15",
                        }}
                        _placeholder={{ color: "rgba(0,0,0,0.25)" }}
                      />
                    </Box>
                    <VStack gap="3" align="stretch">
                      <Box
                        as="button"
                        w="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap="2"
                        py="3"
                        bg="#000"
                        color="#FACC15"
                        border="3px solid #000"
                        boxShadow="4px 4px 0px #FACC15"
                        fontWeight="800"
                        fontSize="xs"
                        fontFamily="'JetBrains Mono', monospace"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        _hover={{
                          transform: "translate(-2px,-2px)",
                          boxShadow: "6px 6px 0px #FACC15",
                        }}
                        _active={{
                          transform: "translate(0,0)",
                          boxShadow: "2px 2px 0px #FACC15",
                        }}
                        transition="all 0.1s"
                        disabled={isReviewing}
                        opacity={isReviewing ? 0.6 : 1}
                        onClick={() => handleReview("confirmed")}
                      >
                        <Icon boxSize="4">
                          <XCircle />
                        </Icon>
                        Confirm Fraud
                      </Box>
                      <Box
                        as="button"
                        w="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap="2"
                        py="3"
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
                        disabled={isReviewing}
                        opacity={isReviewing ? 0.6 : 1}
                        onClick={() => handleReview("dismissed")}
                      >
                        <Icon boxSize="4">
                          <CheckCircle />
                        </Icon>
                        Dismiss as Safe
                      </Box>
                      <Box
                        as="button"
                        w="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap="2"
                        py="3"
                        bg="#FAFAFA"
                        color="#000"
                        border="3px solid #000"
                        boxShadow="4px 4px 0px #000"
                        fontWeight="800"
                        fontSize="xs"
                        fontFamily="'JetBrains Mono', monospace"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        _hover={{
                          bg: "#FACC15",
                          transform: "translate(-2px,-2px)",
                          boxShadow: "6px 6px 0px #000",
                        }}
                        _active={{
                          transform: "translate(0,0)",
                          boxShadow: "2px 2px 0px #000",
                        }}
                        transition="all 0.1s"
                        disabled={isReviewing}
                        opacity={isReviewing ? 0.6 : 1}
                        onClick={() => handleReview("escalated")}
                      >
                        Escalate
                      </Box>
                    </VStack>
                  </>
                ) : isPending && !canReview ? (
                  <Box textAlign="center" py="6">
                    <Text
                      fontWeight="900"
                      textTransform="uppercase"
                      letterSpacing="0.15em"
                      color="#000"
                      fontSize="lg"
                    >
                      Pending Review
                    </Text>
                    <Text
                      fontSize="xs"
                      fontWeight="700"
                      textTransform="uppercase"
                      letterSpacing="0.1em"
                      color="#000"
                      opacity="0.5"
                      mt="2"
                    >
                      You do not have permission to review alerts.
                    </Text>
                  </Box>
                ) : (
                  <Box textAlign="center" py="6">
                    <Box
                      w="16"
                      h="16"
                      mx="auto"
                      mb="4"
                      border="3px solid #000"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bg={alert.status === "confirmed" ? "#000" : "#FACC15"}
                      color={alert.status === "confirmed" ? "#FACC15" : "#000"}
                    >
                      <Icon boxSize="8">
                        {alert.status === "confirmed" ? (
                          <AlertTriangle />
                        ) : (
                          <CheckCircle />
                        )}
                      </Icon>
                    </Box>
                    <Text
                      fontWeight="800"
                      color="#000"
                      textTransform="uppercase"
                      fontSize="xl"
                      fontFamily="'Bebas Neue', sans-serif"
                      letterSpacing="wider"
                    >
                      Alert {alert.status}
                    </Text>
                    <Box
                      mt="4"
                      fontSize="xs"
                      color="#000"
                      bg="#FAFAFA"
                      p="4"
                      border="2px solid #000"
                      fontFamily="'JetBrains Mono', monospace"
                      textAlign="left"
                    >
                      <Text fontWeight="800" mb="1">
                        Reviewed by: {alert.reviewed_by || "System"}
                      </Text>
                      <Text fontSize="2xs" opacity={0.5} mb="2">
                        {alert.reviewed_at
                          ? format(
                              new Date(alert.reviewed_at),
                              "dd/MM/yyyy, HH:mm:ss",
                            )
                          : ""}
                      </Text>
                      {alert.review_notes && (
                        <Box mt="2" pt="2" borderTop="1px solid #000">
                          <Text
                            fontWeight="600"
                            fontStyle="italic"
                            opacity={0.7}
                          >
                            "{alert.review_notes}"
                          </Text>
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </VStack>
        </Box>
      </SimpleGrid>

      {/* Detection timestamp bar */}
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
        <Text
          fontSize="xs"
          fontWeight="700"
          color="#FACC15"
          fontFamily="'JetBrains Mono', monospace"
          textTransform="uppercase"
        >
          detected: {format(new Date(alert.created_at), "dd/MM/yyyy, HH:mm:ss")}
        </Text>
        <HStack>
          <Box w="2" h="2" bg="#FACC15" />
          <Text
            fontSize="2xs"
            color="#FACC15"
            fontFamily="'JetBrains Mono', monospace"
            fontWeight="600"
          >
            {alert.triggered_rules?.length || 0} RULES MATCHED
          </Text>
        </HStack>
      </Box>
    </Box>
  );
}
