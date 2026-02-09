import { Box, Flex, Text, HStack, Icon } from "@chakra-ui/react";
import { format } from "date-fns";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Download,
  X,
} from "lucide-react";
import type { AlertsListData } from "../../hooks/useAlertsList";

function TerminalStatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; label: string }> = {
    confirmed: { color: "#FF3333", label: "CONFIRMED" },
    dismissed: { color: "#00FF41", label: "DISMISSED" },
    escalated: { color: "#FFB000", label: "ESCALATED" },
    pending: { color: "#FFB000", label: "PENDING" },
  };
  const { color, label } = config[status] || config.pending;
  return (
    <Text
      as="span"
      fontSize="2xs"
      fontWeight="bold"
      color={color}
      textShadow={`0 0 6px ${color}44`}
      letterSpacing="wider"
    >
      [{label}]
    </Text>
  );
}

export default function TerminalAlerts(props: AlertsListData) {
  const {
    data,
    isLoading,
    filters,
    setFilters,
    search,
    statusFilter,
    handleStatusChange,
    handleSearchChange,
    handleViewAll,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    exportSelected,
    isExporting,
  } = props;

  const pageIds = data?.items?.map((a) => a.id) ?? [];
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
  const hasSelection = selectedIds.size > 0;

  return (
    <Box h="full" display="flex" flexDirection="column">
      {/* Header */}
      <Text
        color="rgba(0, 255, 65, 0.3)"
        fontSize="2xs"
        mb="1"
        letterSpacing="widest"
      >
        {"// ALERT MANAGEMENT CONSOLE"}
      </Text>
      <Text
        color="#00FF41"
        fontSize="sm"
        mb="4"
        textShadow="0 0 6px rgba(0, 255, 65, 0.3)"
      >
        {">"} sentinel alerts --list --interactive
      </Text>

      <Box
        border="1px solid rgba(0, 255, 65, 0.2)"
        bg="rgba(0, 255, 65, 0.02)"
        flex="1"
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        {/* Filters */}
        <Box
          p="4"
          borderBottomWidth="1px"
          borderColor="rgba(0, 255, 65, 0.15)"
          bg="rgba(0, 255, 65, 0.02)"
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            gap="4"
            align={{ md: "flex-end" }}
          >
            <Flex gap="4" flex="1" direction={{ base: "column", md: "row" }}>
              {/* Status filter */}
              <Box flex="1">
                <Text
                  fontSize="2xs"
                  color="rgba(0, 255, 65, 0.4)"
                  mb="1"
                  letterSpacing="wider"
                >
                  {">"} FILTER:STATUS
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
                  _focus={{
                    borderColor: "#00FF41",
                    boxShadow: "0 0 8px rgba(0, 255, 65, 0.3)",
                  }}
                  value={statusFilter}
                  onChange={handleStatusChange}
                >
                  <option value="all">ALL STATUSES</option>
                  <option value="pending">PENDING REVIEW</option>
                  <option value="confirmed">CONFIRMED FRAUD</option>
                  <option value="dismissed">DISMISSED</option>
                  <option value="escalated">ESCALATED</option>
                </Box>
              </Box>

              {/* Search */}
              <Box flex="1">
                <Text
                  fontSize="2xs"
                  color="rgba(0, 255, 65, 0.4)"
                  mb="1"
                  letterSpacing="wider"
                >
                  {">"} SEARCH:ACCOUNT
                </Text>
                <Box position="relative">
                  <Box
                    as="input"
                    type="text"
                    placeholder="grep customer_id..."
                    w="full"
                    bg="#0d0d0d"
                    border="1px solid rgba(0, 255, 65, 0.3)"
                    color="#00FF41"
                    fontSize="xs"
                    px="3"
                    py="2"
                    pl="8"
                    _placeholder={{ color: "rgba(0, 255, 65, 0.25)" }}
                    _focus={{
                      borderColor: "#00FF41",
                      boxShadow: "0 0 8px rgba(0, 255, 65, 0.3)",
                    }}
                    value={search}
                    onChange={handleSearchChange}
                  />
                  <Icon
                    position="absolute"
                    left="2.5"
                    top="50%"
                    transform="translateY(-50%)"
                    color="rgba(0, 255, 65, 0.3)"
                    boxSize="3.5"
                  >
                    <Search />
                  </Icon>
                </Box>
              </Box>

              {/* Reset */}
              <Box display="flex" alignItems="flex-end">
                <Box
                  as="button"
                  display="flex"
                  alignItems="center"
                  px="4"
                  py="2"
                  border="1px solid rgba(0, 255, 65, 0.3)"
                  color="#00FF41"
                  bg="transparent"
                  fontSize="xs"
                  fontWeight="bold"
                  _hover={{
                    borderColor: "#00FF41",
                    bg: "rgba(0, 255, 65, 0.05)",
                    textShadow: "0 0 8px rgba(0, 255, 65, 0.5)",
                  }}
                  transition="all 0.15s"
                  onClick={handleViewAll}
                >
                  <Icon boxSize="3.5" mr="2">
                    <RefreshCw />
                  </Icon>
                  RESET
                </Box>
              </Box>
            </Flex>
          </Flex>
        </Box>

        {/* Bulk Action Bar */}
        {hasSelection && (
          <Flex
            px="4"
            py="2.5"
            borderBottomWidth="1px"
            borderColor="rgba(0, 255, 65, 0.3)"
            bg="rgba(0, 255, 65, 0.08)"
            align="center"
            justify="space-between"
          >
            <Text
              fontSize="xs"
              fontWeight="bold"
              color="#00FF41"
              textShadow="0 0 6px rgba(0, 255, 65, 0.4)"
            >
              {selectedIds.size} selected
            </Text>
            <HStack gap="2">
              <Box
                as="button"
                display="flex"
                alignItems="center"
                px="4"
                py="1.5"
                border="1px solid #00FF41"
                color="#00FF41"
                bg="rgba(0, 255, 65, 0.1)"
                fontSize="xs"
                fontWeight="bold"
                _hover={{
                  bg: "rgba(0, 255, 65, 0.2)",
                  textShadow: "0 0 8px rgba(0, 255, 65, 0.5)",
                }}
                transition="all 0.15s"
                onClick={exportSelected}
                opacity={isExporting ? 0.5 : 1}
                cursor={isExporting ? "wait" : "pointer"}
              >
                <Icon boxSize="3.5" mr="2">
                  <Download />
                </Icon>
                {isExporting ? "EXPORTING..." : "EXPORT"}
              </Box>
              <Box
                as="button"
                display="flex"
                alignItems="center"
                px="4"
                py="1.5"
                border="1px solid rgba(0, 255, 65, 0.3)"
                color="rgba(0, 255, 65, 0.6)"
                bg="transparent"
                fontSize="xs"
                fontWeight="bold"
                _hover={{
                  borderColor: "#00FF41",
                  color: "#00FF41",
                }}
                transition="all 0.15s"
                onClick={clearSelection}
              >
                <Icon boxSize="3.5" mr="2">
                  <X />
                </Icon>
                CLEAR
              </Box>
            </HStack>
          </Flex>
        )}

        {/* Table */}
        <Box flex="1" overflowX="auto" overflowY="auto">
          {isLoading ? (
            <Flex flex="1" align="center" justify="center" minH="300px">
              <Text color="#00FF41" fontSize="xs" className="terminal-cursor">
                Querying alert database...
              </Text>
            </Flex>
          ) : (
            <Box
              as="table"
              w="full"
              textAlign="left"
              style={{ borderCollapse: "collapse" }}
            >
              <Box as="thead">
                <Box
                  as="tr"
                  borderBottomWidth="1px"
                  borderColor="rgba(0, 255, 65, 0.2)"
                  bg="rgba(0, 255, 65, 0.03)"
                >
                  <Box as="th" px="3" py="3" w="10" textAlign="center">
                    <Box
                      as="input"
                      type="checkbox"
                      checked={allPageSelected}
                      onChange={toggleSelectAll}
                      cursor="pointer"
                      w="3.5"
                      h="3.5"
                      accentColor="#00FF41"
                    />
                  </Box>
                  {[
                    "#",
                    "ALERT_ID",
                    "ACCOUNT",
                    "RULES",
                    "SCORE",
                    "REVIEWED_BY",
                    "STATUS",
                  ].map((h, i) => (
                    <Box
                      key={h}
                      as="th"
                      px="4"
                      py="3"
                      fontSize="2xs"
                      fontWeight="bold"
                      color="rgba(0, 255, 65, 0.4)"
                      textTransform="uppercase"
                      letterSpacing="widest"
                      textAlign={i === 0 || i === 6 ? "center" : "left"}
                      w={i === 0 ? "14" : undefined}
                    >
                      {h}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box as="tbody">
                {data?.items?.length === 0 ? (
                  <Box as="tr">
                    <Box as="td" colSpan={8} px="4" py="16" textAlign="center">
                      <Text color="rgba(0, 255, 65, 0.3)" fontSize="xs">
                        {">"} No results found. Adjust query parameters.
                      </Text>
                    </Box>
                  </Box>
                ) : (
                  data?.items?.map((alert, index) => (
                    <Box
                      as="tr"
                      key={alert.id}
                      borderBottomWidth="1px"
                      borderColor="rgba(0, 255, 65, 0.08)"
                      cursor="pointer"
                      transition="all 0.1s"
                      bg={
                        selectedIds.has(alert.id)
                          ? "rgba(0, 255, 65, 0.08)"
                          : undefined
                      }
                      _hover={{
                        bg: "rgba(0, 255, 65, 0.05)",
                      }}
                      onClick={() =>
                        (window.location.href = `/alerts/${alert.id}${window.location.search}`)
                      }
                    >
                      <Box as="td" px="3" py="3" textAlign="center">
                        <Box
                          as="input"
                          type="checkbox"
                          checked={selectedIds.has(alert.id)}
                          onChange={() => toggleSelect(alert.id)}
                          onClick={(e: React.MouseEvent) => e.stopPropagation()}
                          cursor="pointer"
                          w="3.5"
                          h="3.5"
                          accentColor="#00FF41"
                        />
                      </Box>
                      <Box as="td" px="4" py="3" textAlign="center">
                        <Text color="rgba(0, 255, 65, 0.3)" fontSize="xs">
                          {String(
                            (currentPage - 1) * itemsPerPage + index + 1,
                          ).padStart(3, "0")}
                        </Text>
                      </Box>
                      <Box as="td" px="4" py="3">
                        <Text
                          fontWeight="bold"
                          color="#00FF41"
                          fontSize="xs"
                          textShadow="0 0 4px rgba(0, 255, 65, 0.3)"
                        >
                          {alert.reference_number || alert.id.slice(0, 8)}
                        </Text>
                        <Text
                          fontSize="2xs"
                          color="rgba(0, 255, 65, 0.35)"
                          mt="0.5"
                        >
                          {format(new Date(alert.created_at), "yyyy-MM-dd")} |{" "}
                          {format(new Date(alert.created_at), "HH:mm:ss")}
                        </Text>
                      </Box>
                      <Box as="td" px="4" py="3">
                        <Text color="rgba(0, 255, 65, 0.6)" fontSize="xs">
                          {alert.transaction?.account_number ||
                            alert.customer_id}
                        </Text>
                      </Box>
                      <Box as="td" px="4" py="3">
                        <HStack>
                          <Text fontSize="xs" color="rgba(0, 255, 65, 0.5)">
                            {alert.triggered_rules?.length > 0
                              ? alert.triggered_rules[0].name
                              : "---"}
                          </Text>
                          {(alert.triggered_rules?.length || 0) > 1 && (
                            <Text fontSize="2xs" color="#FFB000">
                              +{alert.triggered_rules.length - 1}
                            </Text>
                          )}
                        </HStack>
                      </Box>
                      <Box as="td" px="4" py="3">
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
                              ? "0 0 6px rgba(255, 51, 51, 0.4)"
                              : alert.risk_score > 40
                                ? "0 0 6px rgba(255, 176, 0, 0.4)"
                                : "0 0 6px rgba(0, 255, 65, 0.4)"
                          }
                        >
                          {alert.risk_score}
                        </Text>
                      </Box>
                      <Box as="td" px="4" py="3">
                        <Text
                          fontWeight="bold"
                          color="#00FF41"
                          fontSize="xs"
                          textShadow="0 0 4px rgba(0, 255, 65, 0.3)"
                        >
                          {alert.reviewed_by_username || "System"}
                        </Text>
                        <Text
                          fontSize="2xs"
                          color="rgba(0, 255, 65, 0.35)"
                          mt="0.5"
                        >
                          {alert.reviewed_at
                            ? format(
                                new Date(alert.reviewed_at),
                                "yyyy-MM-dd | HH:mm",
                              )
                            : "—"}
                        </Text>
                      </Box>
                      <Box as="td" px="4" py="3" textAlign="center">
                        <TerminalStatusBadge status={alert.status} />
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          )}
        </Box>

        {/* Pagination */}
        <Flex
          p="3"
          borderTopWidth="1px"
          borderColor="rgba(0, 255, 65, 0.15)"
          bg="rgba(0, 255, 65, 0.02)"
          align="center"
          justify="space-between"
        >
          <Text fontSize="2xs" color="rgba(0, 255, 65, 0.4)">
            SHOWING{" "}
            <Text as="span" color="#00FF41">
              {(currentPage - 1) * itemsPerPage + 1}
            </Text>
            -
            <Text as="span" color="#00FF41">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </Text>{" "}
            OF {totalItems} RECORDS
          </Text>
          <HStack gap="2">
            <Box
              as="button"
              p="1.5"
              color={currentPage === 1 ? "rgba(0, 255, 65, 0.15)" : "#00FF41"}
              border="1px solid"
              borderColor={
                currentPage === 1
                  ? "rgba(0, 255, 65, 0.1)"
                  : "rgba(0, 255, 65, 0.3)"
              }
              _hover={currentPage !== 1 ? { bg: "rgba(0, 255, 65, 0.1)" } : {}}
              disabled={currentPage === 1}
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))
              }
            >
              <Icon boxSize="4">
                <ChevronLeft />
              </Icon>
            </Box>
            <Text
              fontSize="xs"
              color="#00FF41"
              px="3"
              py="1"
              border="1px solid rgba(0, 255, 65, 0.3)"
              bg="rgba(0, 255, 65, 0.05)"
              textShadow="0 0 6px rgba(0, 255, 65, 0.4)"
            >
              {currentPage}/{totalPages}
            </Text>
            <Box
              as="button"
              p="1.5"
              color={
                currentPage === totalPages
                  ? "rgba(0, 255, 65, 0.15)"
                  : "#00FF41"
              }
              border="1px solid"
              borderColor={
                currentPage === totalPages
                  ? "rgba(0, 255, 65, 0.1)"
                  : "rgba(0, 255, 65, 0.3)"
              }
              _hover={
                currentPage !== totalPages
                  ? { bg: "rgba(0, 255, 65, 0.1)" }
                  : {}
              }
              disabled={currentPage === totalPages}
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))
              }
            >
              <Icon boxSize="4">
                <ChevronRight />
              </Icon>
            </Box>
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
}
