import {
  Box,
  Flex,
  Text,
  HStack,
  Icon,
  Spinner,
  SimpleGrid,
} from "@chakra-ui/react";
import { format } from "date-fns";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  X,
} from "lucide-react";
import type { AlertsListData } from "../../hooks/useAlertsList";

function BrutalistStatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    confirmed: { bg: "#000", color: "#FAFAFA" },
    dismissed: { bg: "#FAFAFA", color: "#000" },
    escalated: { bg: "#FACC15", color: "#000" },
    pending: { bg: "#FACC15", color: "#000" },
  };
  const style = styles[status] || styles.pending;
  return (
    <Box
      as="span"
      display="inline-block"
      px="3"
      py="1"
      fontSize="2xs"
      fontWeight="800"
      fontFamily="'JetBrains Mono', monospace"
      textTransform="uppercase"
      letterSpacing="wider"
      border="2px solid #000"
      bg={style.bg}
      color={style.color}
      minW="90px"
      textAlign="center"
    >
      {status.toUpperCase()}
    </Box>
  );
}

export default function BrutalistAlerts(props: AlertsListData) {
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
            ALERTS
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
            {">"} Fraud detection alerts // {totalItems || 0} records
          </Text>
        </Box>
      </Flex>

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
        {/* Filters */}
        <Box p="5" borderBottom="3px solid #000" bg="#FAFAFA">
          <Flex
            direction={{ base: "column", md: "row" }}
            align={{ md: "flex-end" }}
            gap="4"
            justify="space-between"
          >
            <SimpleGrid columns={{ base: 1, md: 3 }} gap="4" flex="1">
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
                  Status
                </Text>
                <Box
                  as="select"
                  w="full"
                  appearance="none"
                  bg="#FAFAFA"
                  border="3px solid #000"
                  color="#000"
                  fontSize="sm"
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="700"
                  px="4"
                  py="2.5"
                  cursor="pointer"
                  _focus={{ outline: "none", boxShadow: "4px 4px 0px #FACC15" }}
                  value={statusFilter}
                  onChange={handleStatusChange}
                >
                  <option value="all">ALL STATUSES</option>
                  <option value="pending">PENDING</option>
                  <option value="confirmed">CONFIRMED</option>
                  <option value="dismissed">DISMISSED</option>
                  <option value="escalated">ESCALATED</option>
                </Box>
              </Box>
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
                  Search
                </Text>
                <Box position="relative">
                  <Box
                    as="input"
                    type="text"
                    placeholder="ACCOUNT NUMBER..."
                    w="full"
                    bg="#FAFAFA"
                    border="3px solid #000"
                    color="#000"
                    fontSize="sm"
                    fontFamily="'JetBrains Mono', monospace"
                    fontWeight="700"
                    px="4"
                    py="2.5"
                    pl="10"
                    _focus={{
                      outline: "none",
                      boxShadow: "4px 4px 0px #FACC15",
                    }}
                    _placeholder={{ color: "rgba(0,0,0,0.3)" }}
                    value={search}
                    onChange={handleSearchChange}
                  />
                  <Icon
                    position="absolute"
                    left="3"
                    top="50%"
                    transform="translateY(-50%)"
                    color="#000"
                    boxSize="4"
                  >
                    <Search />
                  </Icon>
                </Box>
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="flex-end"
              >
                <Box
                  as="button"
                  w="full"
                  bg="#FAFAFA"
                  border="3px solid #000"
                  color="#000"
                  _hover={{ bg: "#FACC15" }}
                  fontSize="xs"
                  fontWeight="800"
                  fontFamily="'JetBrains Mono', monospace"
                  textTransform="uppercase"
                  py="2.5"
                  px="4"
                  transition="all 0.1s"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  letterSpacing="wider"
                  onClick={handleViewAll}
                >
                  <Icon boxSize="4" mr="2">
                    <RefreshCw />
                  </Icon>
                  Reset Filters
                </Box>
              </Box>
            </SimpleGrid>
            <Box
              as="button"
              bg="#000"
              _hover={{ bg: "#FACC15", color: "#000" }}
              color="#FACC15"
              p="2.5"
              border="3px solid #000"
              transition="all 0.1s"
            >
              <Icon boxSize="5">
                <Search />
              </Icon>
            </Box>
          </Flex>
        </Box>

        {/* Bulk Action Bar */}
        {hasSelection && (
          <Flex
            px="5"
            py="3"
            bg="#FACC15"
            borderBottom="3px solid #000"
            align="center"
            justify="space-between"
          >
            <Text
              fontSize="xs"
              fontWeight="800"
              fontFamily="'JetBrains Mono', monospace"
              textTransform="uppercase"
              color="#000"
            >
              {selectedIds.size} selected
            </Text>
            <HStack gap="3">
              <Box
                as="button"
                bg="#000"
                color="#FACC15"
                border="3px solid #000"
                _hover={{ bg: "#FAFAFA", color: "#000" }}
                px="4"
                py="2"
                fontSize="xs"
                fontWeight="800"
                fontFamily="'JetBrains Mono', monospace"
                textTransform="uppercase"
                display="flex"
                alignItems="center"
                gap="2"
                transition="all 0.1s"
                onClick={exportSelected}
                opacity={isExporting ? 0.5 : 1}
                cursor={isExporting ? "wait" : "pointer"}
              >
                <Icon boxSize="4">
                  <Download />
                </Icon>
                {isExporting ? "Exporting..." : "Export"}
              </Box>
              <Box
                as="button"
                bg="transparent"
                color="#000"
                border="3px solid #000"
                _hover={{ bg: "#000", color: "#FACC15" }}
                px="4"
                py="2"
                fontSize="xs"
                fontWeight="800"
                fontFamily="'JetBrains Mono', monospace"
                textTransform="uppercase"
                display="flex"
                alignItems="center"
                gap="2"
                transition="all 0.1s"
                onClick={clearSelection}
              >
                <Icon boxSize="4">
                  <X />
                </Icon>
                Clear
              </Box>
            </HStack>
          </Flex>
        )}

        {/* Table */}
        <Box flex="1" overflowX="auto" className="brutal-scroll">
          {isLoading ? (
            <Flex flex="1" align="center" justify="center" minH="300px">
              <Box textAlign="center">
                <Spinner size="xl" color="#000" borderWidth="4px" />
                <Text
                  mt="3"
                  fontFamily="'JetBrains Mono', monospace"
                  fontSize="xs"
                  fontWeight="700"
                  textTransform="uppercase"
                  color="#000"
                >
                  Fetching records...
                </Text>
              </Box>
            </Flex>
          ) : (
            <Box
              as="table"
              w="full"
              textAlign="left"
              style={{ borderCollapse: "collapse" }}
            >
              <Box as="thead">
                <Box as="tr" bg="#000" borderBottom="3px solid #FACC15">
                  <Box as="th" px="3" py="3" w="12" textAlign="center">
                    <Box
                      as="input"
                      type="checkbox"
                      checked={allPageSelected}
                      onChange={toggleSelectAll}
                      cursor="pointer"
                      w="4"
                      h="4"
                      accentColor="#FACC15"
                    />
                  </Box>
                  {[
                    "#",
                    "ALERT ID",
                    "ACCOUNT",
                    "TRIGGERS",
                    "SCORE",
                    "REVIEWED BY",
                    "STATUS",
                  ].map((h, i) => (
                    <Box
                      key={h}
                      as="th"
                      px="5"
                      py="3"
                      fontSize="2xs"
                      fontWeight="800"
                      color="#FACC15"
                      textTransform="uppercase"
                      letterSpacing="widest"
                      fontFamily="'JetBrains Mono', monospace"
                      textAlign={i === 0 || i === 6 ? "center" : "left"}
                      w={i === 0 ? "16" : undefined}
                    >
                      {h}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box as="tbody">
                {data?.items?.length === 0 ? (
                  <Box as="tr">
                    <Box as="td" colSpan={8} px="6" py="24" textAlign="center">
                      <Flex direction="column" align="center">
                        <Box bg="#000" p="4" mb="4" border="3px solid #000">
                          <Icon boxSize="8" color="#FACC15">
                            <Search />
                          </Icon>
                        </Box>
                        <Text
                          fontWeight="800"
                          fontFamily="'JetBrains Mono', monospace"
                          textTransform="uppercase"
                          fontSize="sm"
                          color="#000"
                        >
                          No Results Found
                        </Text>
                        <Text
                          fontFamily="'JetBrains Mono', monospace"
                          fontSize="xs"
                          color="#000"
                          opacity={0.4}
                          mt="1"
                        >
                          Try adjusting your filters
                        </Text>
                      </Flex>
                    </Box>
                  </Box>
                ) : (
                  data?.items?.map((alert, index) => (
                    <Box
                      as="tr"
                      key={alert.id}
                      borderBottom="2px solid #000"
                      _hover={{ bg: "#FACC15" }}
                      cursor="pointer"
                      transition="background 0.05s"
                      bg={
                        selectedIds.has(alert.id)
                          ? "rgba(250, 204, 21, 0.15)"
                          : undefined
                      }
                      onClick={() =>
                        (window.location.href = `/alerts/${alert.id}${window.location.search}`)
                      }
                    >
                      <Box as="td" px="3" py="4" textAlign="center">
                        <Box
                          as="input"
                          type="checkbox"
                          checked={selectedIds.has(alert.id)}
                          onChange={() => toggleSelect(alert.id)}
                          onClick={(e: React.MouseEvent) => e.stopPropagation()}
                          cursor="pointer"
                          w="4"
                          h="4"
                          accentColor="#FACC15"
                        />
                      </Box>
                      <Box as="td" px="5" py="4" textAlign="center">
                        <Text
                          color="#000"
                          fontSize="xs"
                          fontWeight="800"
                          fontFamily="'JetBrains Mono', monospace"
                        >
                          {String(
                            (currentPage - 1) * itemsPerPage + index + 1,
                          ).padStart(3, "0")}
                        </Text>
                      </Box>
                      <Box as="td" px="5" py="4">
                        <Box>
                          <Text
                            fontWeight="800"
                            color="#000"
                            fontSize="sm"
                            fontFamily="'JetBrains Mono', monospace"
                          >
                            {alert.reference_number || alert.id.slice(0, 8)}
                          </Text>
                          <Text
                            fontSize="2xs"
                            color="#000"
                            opacity={0.4}
                            fontWeight="600"
                            fontFamily="'JetBrains Mono', monospace"
                            mt="0.5"
                          >
                            {format(new Date(alert.created_at), "dd/MM/yyyy")} |{" "}
                            {format(new Date(alert.created_at), "HH:mm")}
                          </Text>
                        </Box>
                      </Box>
                      <Box as="td" px="5" py="4">
                        <HStack>
                          <Box
                            w="8"
                            h="8"
                            bg="#000"
                            color="#FACC15"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            fontSize="xs"
                            fontWeight="800"
                            fontFamily="'Bebas Neue', sans-serif"
                            mr="2"
                            border="2px solid #000"
                          >
                            {(
                              alert.transaction?.account_number ||
                              alert.customer_id
                            ).slice(-2)}
                          </Box>
                          <Text
                            color="#000"
                            fontWeight="700"
                            fontSize="sm"
                            fontFamily="'JetBrains Mono', monospace"
                          >
                            {alert.transaction?.account_number ||
                              alert.customer_id}
                          </Text>
                        </HStack>
                      </Box>
                      <Box as="td" px="5" py="4">
                        <HStack>
                          <Text
                            fontSize="sm"
                            color="#000"
                            fontFamily="'JetBrains Mono', monospace"
                            fontWeight="600"
                          >
                            {alert.triggered_rules?.length > 0
                              ? alert.triggered_rules[0].name
                              : "No rules"}
                          </Text>
                          {(alert.triggered_rules?.length || 0) > 1 && (
                            <Box
                              as="span"
                              fontSize="2xs"
                              bg="#FACC15"
                              color="#000"
                              px="2"
                              py="0.5"
                              fontWeight="800"
                              fontFamily="'JetBrains Mono', monospace"
                              border="2px solid #000"
                            >
                              +{alert.triggered_rules.length - 1}
                            </Box>
                          )}
                        </HStack>
                      </Box>
                      <Box as="td" px="5" py="4">
                        <HStack>
                          <Box
                            w="3"
                            h="3"
                            mr="1"
                            border="2px solid #000"
                            bg={
                              alert.risk_score > 70
                                ? "#000"
                                : alert.risk_score > 40
                                  ? "#FACC15"
                                  : "#FAFAFA"
                            }
                          />
                          <Text
                            fontWeight="800"
                            color="#000"
                            fontSize="lg"
                            fontFamily="'Bebas Neue', sans-serif"
                            letterSpacing="wider"
                          >
                            {alert.risk_score}
                          </Text>
                        </HStack>
                      </Box>
                      <Box as="td" px="5" py="4">
                        <Text
                          fontWeight="700"
                          color="#000"
                          fontSize="xs"
                          fontFamily="'JetBrains Mono', monospace"
                        >
                          {alert.reviewed_by_username || "System"}
                        </Text>
                        <Text
                          fontSize="2xs"
                          color="#000"
                          opacity={0.4}
                          fontWeight="600"
                          fontFamily="'JetBrains Mono', monospace"
                          mt="0.5"
                        >
                          {alert.reviewed_at
                            ? format(
                                new Date(alert.reviewed_at),
                                "dd/MM/yyyy | HH:mm",
                              )
                            : "—"}
                        </Text>
                      </Box>
                      <Box as="td" px="5" py="4" textAlign="center">
                        <BrutalistStatusBadge status={alert.status} />
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
          p="4"
          borderTop="3px solid #000"
          bg="#000"
          align="center"
          justify="space-between"
        >
          <Text
            fontSize="xs"
            color="#FACC15"
            fontWeight="700"
            pl="2"
            fontFamily="'JetBrains Mono', monospace"
            textTransform="uppercase"
          >
            [{(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, totalItems)}] of {totalItems}
          </Text>
          <HStack gap="2">
            <Box
              as="button"
              p="2"
              color="#FACC15"
              border="2px solid #FACC15"
              _hover={{ bg: "#FACC15", color: "#000" }}
              disabled={currentPage === 1}
              opacity={currentPage === 1 ? 0.3 : 1}
              transition="all 0.1s"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: (prev.page || 1) - 1,
                }))
              }
            >
              <Icon boxSize="5">
                <ChevronLeft />
              </Icon>
            </Box>
            <Box
              px="4"
              py="1"
              bg="#FACC15"
              color="#000"
              border="2px solid #FACC15"
              fontSize="sm"
              fontWeight="800"
              fontFamily="'Bebas Neue', sans-serif"
              letterSpacing="wider"
            >
              {currentPage} / {totalPages}
            </Box>
            <Box
              as="button"
              p="2"
              color="#FACC15"
              border="2px solid #FACC15"
              _hover={{ bg: "#FACC15", color: "#000" }}
              disabled={currentPage === totalPages}
              opacity={currentPage === totalPages ? 0.3 : 1}
              transition="all 0.1s"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: (prev.page || 1) + 1,
                }))
              }
            >
              <Icon boxSize="5">
                <ChevronRight />
              </Icon>
            </Box>
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
}
