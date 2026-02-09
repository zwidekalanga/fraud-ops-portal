import { useState, useEffect } from "react";
import { Box, Flex, VStack, HStack, Text, Icon } from "@chakra-ui/react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ShieldAlert,
  Scale,
  Settings,
  Terminal,
  ChevronRight,
} from "lucide-react";
import type { ReactNode, ElementType } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface NavItemProps {
  icon: ElementType;
  label: string;
  href: string;
  isActive: boolean;
  cmdKey: string;
}

function NavItem({
  icon: IconComponent,
  label,
  href,
  isActive,
  cmdKey,
}: NavItemProps) {
  return (
    <Link
      to={href}
      search={(prev: Record<string, unknown>) => prev}
      style={{ textDecoration: "none", width: "100%" }}
    >
      <HStack
        px="3"
        py="2.5"
        fontFamily="'IBM Plex Mono', monospace"
        bg={isActive ? "rgba(0, 255, 65, 0.08)" : "transparent"}
        color={isActive ? "#00FF41" : "rgba(0, 255, 65, 0.5)"}
        borderLeftWidth="2px"
        borderColor={isActive ? "#00FF41" : "transparent"}
        transition="all 0.15s"
        cursor="pointer"
        _hover={{
          bg: "rgba(0, 255, 65, 0.05)",
          color: "#00FF41",
        }}
      >
        <Text
          fontSize="xs"
          color="rgba(0, 255, 65, 0.3)"
          mr="1"
          fontFamily="'IBM Plex Mono', monospace"
        >
          {cmdKey}
        </Text>
        <Icon boxSize="4" mr="2">
          <IconComponent />
        </Icon>
        <Text
          fontSize="sm"
          fontWeight={isActive ? "bold" : "normal"}
          letterSpacing="wide"
          textShadow={isActive ? "0 0 8px rgba(0, 255, 65, 0.6)" : "none"}
        >
          {label}
        </Text>
        {isActive && (
          <Icon boxSize="3" ml="auto" color="#00FF41">
            <ChevronRight />
          </Icon>
        )}
      </HStack>
    </Link>
  );
}

interface LayoutProps {
  children: ReactNode;
}

export default function TerminalLayout({ children }: LayoutProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const [bootComplete, setBootComplete] = useState(false);
  const { user, logout, hasRole } = useAuth();
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const navItems = [
    { icon: LayoutDashboard, label: "DASHBOARD", href: "/", cmdKey: "F1" },
    { icon: ShieldAlert, label: "ALERTS", href: "/alerts", cmdKey: "F2" },
    { icon: Scale, label: "RULES", href: "/rules", cmdKey: "F3" },
    { icon: Settings, label: "CONFIG", href: "/settings", cmdKey: "F4" },
  ].filter((item) => item.href !== "/rules" || hasRole("admin", "analyst"));

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const getPagePath = () => {
    if (pathname === "/") return "/sys/dashboard";
    if (pathname.startsWith("/alerts/"))
      return `/sys/alerts/${pathname.split("/").pop()}`;
    if (pathname.startsWith("/alerts")) return "/sys/alerts";
    if (pathname.startsWith("/rules")) return "/sys/rules";
    if (pathname.startsWith("/settings")) return "/sys/config";
    return "/sys/unknown";
  };

  useEffect(() => {
    const lines = [
      "SENTINEL FRAUD ENGINE v4.2.1",
      "Initializing kernel modules...",
      "Loading threat detection matrix... OK",
      "Mounting fraud rule database... OK",
      "Calibrating risk scoring engine... OK",
      "Neural pattern analyzer: ONLINE",
      "Transaction monitor: ACTIVE",
      `System ready. Welcome, ${user?.username ?? "operator"}.`,
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setBootLines((prev) => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBootComplete(true), 300);
      }
    }, 120);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const terminalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&display=swap');

    .terminal-root {
      font-family: 'IBM Plex Mono', monospace !important;
    }

    .terminal-root * {
      font-family: 'IBM Plex Mono', monospace !important;
    }

    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }

    @keyframes blink-cursor {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }

    @keyframes flicker {
      0% { opacity: 0.97; }
      5% { opacity: 0.95; }
      10% { opacity: 0.98; }
      15% { opacity: 0.96; }
      20% { opacity: 0.99; }
      80% { opacity: 0.98; }
      85% { opacity: 0.95; }
      90% { opacity: 0.97; }
      95% { opacity: 0.99; }
      100% { opacity: 0.98; }
    }

    @keyframes glow-pulse {
      0%, 100% { text-shadow: 0 0 4px rgba(0, 255, 65, 0.4), 0 0 8px rgba(0, 255, 65, 0.2); }
      50% { text-shadow: 0 0 8px rgba(0, 255, 65, 0.6), 0 0 16px rgba(0, 255, 65, 0.3); }
    }

    @keyframes boot-text {
      from { opacity: 0; transform: translateY(2px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .terminal-cursor::after {
      content: '\\2588';
      animation: blink-cursor 1s step-end infinite;
      color: #00FF41;
    }

    .terminal-scanlines {
      pointer-events: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      background: repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.12) 0px,
        rgba(0, 0, 0, 0.12) 1px,
        transparent 1px,
        transparent 3px
      );
    }

    .terminal-vignette {
      pointer-events: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9998;
      background: radial-gradient(
        ellipse at center,
        transparent 60%,
        rgba(0, 0, 0, 0.5) 100%
      );
    }

    .terminal-flicker {
      animation: flicker 8s infinite;
    }

    .boot-line {
      animation: boot-text 0.15s ease-out forwards;
    }

    /* Scrollbar styling */
    .terminal-root ::-webkit-scrollbar {
      width: 6px;
    }
    .terminal-root ::-webkit-scrollbar-track {
      background: #0a0a0a;
      border-left: 1px solid rgba(0, 255, 65, 0.1);
    }
    .terminal-root ::-webkit-scrollbar-thumb {
      background: rgba(0, 255, 65, 0.3);
      border-radius: 0;
    }
    .terminal-root ::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 255, 65, 0.5);
    }

    .terminal-root select,
    .terminal-root input,
    .terminal-root textarea {
      background: #0d0d0d !important;
      color: #00FF41 !important;
      border: 1px solid rgba(0, 255, 65, 0.3) !important;
      font-family: 'IBM Plex Mono', monospace !important;
      outline: none !important;
    }
    .terminal-root select:focus,
    .terminal-root input:focus,
    .terminal-root textarea:focus {
      border-color: #00FF41 !important;
      box-shadow: 0 0 8px rgba(0, 255, 65, 0.3) !important;
    }
    .terminal-root select option {
      background: #0a0a0a !important;
      color: #00FF41 !important;
    }
  `;

  if (!bootComplete) {
    return (
      <>
        <Box
          as="div"
          dangerouslySetInnerHTML={{
            __html: `<style>${terminalStyles}</style>`,
          }}
        />
        <Flex
          className="terminal-root"
          h="100vh"
          bg="#0a0a0a"
          align="center"
          justify="center"
          overflow="hidden"
          position="relative"
        >
          <Box className="terminal-scanlines" />
          <Box className="terminal-vignette" />
          <Box maxW="600px" w="full" px="8">
            <Text
              color="#00FF41"
              fontSize="xs"
              mb="6"
              textShadow="0 0 10px rgba(0, 255, 65, 0.5)"
              letterSpacing="widest"
            >
              {">"} SENTINEL BOOT SEQUENCE
            </Text>
            <Box
              border="1px solid rgba(0, 255, 65, 0.2)"
              p="6"
              bg="rgba(0, 255, 65, 0.02)"
            >
              {bootLines.map((line, i) => (
                <Text
                  key={i}
                  className="boot-line"
                  color={
                    i === bootLines.length - 1
                      ? "#00FF41"
                      : "rgba(0, 255, 65, 0.6)"
                  }
                  fontSize="xs"
                  mb="1"
                  textShadow={
                    i === bootLines.length - 1
                      ? "0 0 8px rgba(0, 255, 65, 0.5)"
                      : "none"
                  }
                >
                  [{String(i).padStart(3, "0")}] {line}
                </Text>
              ))}
              {bootLines.length < 8 && (
                <Text
                  color="#00FF41"
                  fontSize="xs"
                  className="terminal-cursor"
                />
              )}
            </Box>
          </Box>
        </Flex>
      </>
    );
  }

  return (
    <>
      <Box
        as="div"
        dangerouslySetInnerHTML={{ __html: `<style>${terminalStyles}</style>` }}
      />
      <Flex
        className="terminal-root terminal-flicker"
        h="100vh"
        bg="#0a0a0a"
        overflow="hidden"
        position="relative"
      >
        <Box className="terminal-scanlines" />
        <Box className="terminal-vignette" />

        {/* Sidebar */}
        <Box
          display={{ base: "none", md: "flex" }}
          flexDirection="column"
          w="64"
          bg="#0a0a0a"
          borderRightWidth="1px"
          borderColor="rgba(0, 255, 65, 0.15)"
          zIndex={30}
          h="full"
          position="relative"
        >
          {/* Logo area */}
          <Box
            px="4"
            py="5"
            borderBottomWidth="1px"
            borderColor="rgba(0, 255, 65, 0.15)"
          >
            <Text
              color="rgba(0, 255, 65, 0.3)"
              fontSize="2xs"
              fontFamily="'IBM Plex Mono', monospace"
              mb="1"
            >
              {"// FRAUD DETECTION SYSTEM"}
            </Text>
            <HStack gap="3">
              <Box
                p="1.5"
                border="1px solid rgba(0, 255, 65, 0.4)"
                bg="rgba(0, 255, 65, 0.05)"
              >
                <Icon boxSize="5" color="#00FF41">
                  <Terminal />
                </Icon>
              </Box>
              <Box>
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  color="#00FF41"
                  letterSpacing="widest"
                  textShadow="0 0 10px rgba(0, 255, 65, 0.5), 0 0 20px rgba(0, 255, 65, 0.2)"
                >
                  SENTINEL
                </Text>
                <Text
                  fontSize="2xs"
                  color="rgba(0, 255, 65, 0.4)"
                  letterSpacing="wider"
                >
                  v4.2.1 // ACTIVE
                </Text>
              </Box>
            </HStack>
          </Box>

          {/* ASCII separator */}
          <Text
            color="rgba(0, 255, 65, 0.15)"
            fontSize="2xs"
            px="4"
            py="2"
            fontFamily="'IBM Plex Mono', monospace"
            letterSpacing="0"
          >
            {"+--------------------------+"}
          </Text>

          {/* Navigation */}
          <VStack
            as="nav"
            flex="1"
            px="2"
            gap="0.5"
            overflowY="auto"
            align="stretch"
          >
            <Text
              fontSize="2xs"
              color="rgba(0, 255, 65, 0.25)"
              textTransform="uppercase"
              letterSpacing="widest"
              px="3"
              mb="1"
            >
              {">"} Navigation
            </Text>
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={isActive(item.href)}
                cmdKey={item.cmdKey}
              />
            ))}
          </VStack>

          {/* User + Logout */}
          <Box
            px="4"
            py="3"
            borderTopWidth="1px"
            borderColor="rgba(0, 255, 65, 0.15)"
          >
            <Text fontSize="2xs" color="rgba(0, 255, 65, 0.3)" mb="1">
              OPERATOR
            </Text>
            <Text fontSize="2xs" color="#00FF41" mb="1" fontFamily="monospace">
              {user?.username ?? "unknown"}@sentinel ~ [{user?.role ?? ""}]
            </Text>
            <Box
              as="button"
              display="flex"
              alignItems="center"
              fontSize="2xs"
              color="rgba(0, 255, 65, 0.4)"
              _hover={{ color: "#00FF41" }}
              transition="color 0.2s"
              onClick={logout}
            >
              <Text mr="1">$</Text>
              <Text>logout</Text>
            </Box>
          </Box>

          {/* System status footer */}
          <Box
            px="4"
            py="3"
            borderTopWidth="1px"
            borderColor="rgba(0, 255, 65, 0.15)"
          >
            <Text fontSize="2xs" color="rgba(0, 255, 65, 0.3)" mb="1">
              SYS STATUS
            </Text>
            <HStack justify="space-between" mb="1">
              <Text fontSize="2xs" color="rgba(0, 255, 65, 0.5)">
                CPU
              </Text>
              <Text fontSize="2xs" color="#00FF41">
                23%
              </Text>
            </HStack>
            <Box w="full" h="2px" bg="rgba(0, 255, 65, 0.1)" mb="2">
              <Box
                w="23%"
                h="full"
                bg="#00FF41"
                boxShadow="0 0 4px rgba(0, 255, 65, 0.5)"
              />
            </Box>
            <HStack justify="space-between">
              <Text fontSize="2xs" color="rgba(0, 255, 65, 0.5)">
                MEM
              </Text>
              <Text fontSize="2xs" color="#00FF41">
                1.2GB
              </Text>
            </HStack>
            <Box w="full" h="2px" bg="rgba(0, 255, 65, 0.1)">
              <Box
                w="45%"
                h="full"
                bg="#00FF41"
                boxShadow="0 0 4px rgba(0, 255, 65, 0.5)"
              />
            </Box>
          </Box>
        </Box>

        {/* Main Content Area */}
        <Box
          as="main"
          flex="1"
          display="flex"
          flexDirection="column"
          h="full"
          position="relative"
          overflow="hidden"
          bg="#0a0a0a"
        >
          {/* Top bar */}
          <Box
            h="12"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            px="6"
            borderBottomWidth="1px"
            borderColor="rgba(0, 255, 65, 0.15)"
            bg="rgba(0, 255, 65, 0.02)"
            zIndex={20}
          >
            <HStack gap="4">
              <Text
                fontSize="xs"
                color="#00FF41"
                textShadow="0 0 6px rgba(0, 255, 65, 0.4)"
              >
                operator@sentinel:~$
              </Text>
              <Text fontSize="xs" color="rgba(0, 255, 65, 0.6)">
                cd {getPagePath()}
              </Text>
              <Text fontSize="xs" className="terminal-cursor" />
            </HStack>

            <HStack gap="6">
              <Text fontSize="2xs" color="rgba(0, 255, 65, 0.4)">
                UPTIME: 47d 12h 33m
              </Text>
              <Text
                fontSize="xs"
                color="#00FF41"
                fontFamily="'IBM Plex Mono', monospace"
                textShadow="0 0 6px rgba(0, 255, 65, 0.4)"
              >
                {currentTime.toLocaleTimeString("en-US", { hour12: false })}
              </Text>
              <Box
                w="2"
                h="2"
                bg="#00FF41"
                borderRadius="full"
                boxShadow="0 0 6px #00FF41, 0 0 12px rgba(0, 255, 65, 0.3)"
              />
            </HStack>
          </Box>

          {/* Content */}
          <Box flex="1" overflowY="auto" p="6">
            {children}
          </Box>

          {/* Bottom status bar */}
          <Box
            h="7"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            px="6"
            borderTopWidth="1px"
            borderColor="rgba(0, 255, 65, 0.15)"
            bg="rgba(0, 255, 65, 0.02)"
          >
            <HStack gap="6">
              <Text fontSize="2xs" color="rgba(0, 255, 65, 0.4)">
                THREAT LEVEL: ELEVATED
              </Text>
              <Text fontSize="2xs" color="#FFB000">
                {"|||||||"}
              </Text>
            </HStack>
            <HStack gap="6">
              <Text fontSize="2xs" color="rgba(0, 255, 65, 0.4)">
                ENCRYPTED CHANNEL
              </Text>
              <Text fontSize="2xs" color="rgba(0, 255, 65, 0.4)">
                NODE: ZA-PRIMARY
              </Text>
              <Text fontSize="2xs" color="#00FF41">
                CONNECTED
              </Text>
            </HStack>
          </Box>
        </Box>
      </Flex>
    </>
  );
}
