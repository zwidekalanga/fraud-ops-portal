import { useState } from "react";
import { Box, Flex, VStack, HStack, Text, Icon } from "@chakra-ui/react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ShieldAlert,
  Scale,
  Settings,
  LogOut,
  Menu,
  X,
  Terminal,
  Zap,
} from "lucide-react";
import type { ReactNode, ElementType } from "react";
import { useAuth } from "../../contexts/AuthContext";

const BRUTALIST_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap');

  :root {
    --brutal-black: #000000;
    --brutal-white: #FAFAFA;
    --brutal-yellow: #FACC15;
    --brutal-border: 3px solid #000000;
    --brutal-shadow: 8px 8px 0px #000000;
    --brutal-shadow-sm: 4px 4px 0px #000000;
    --brutal-shadow-yellow: 8px 8px 0px #FACC15;
  }

  .brutal-grid-bg {
    background-image:
      linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
    background-size: 24px 24px;
  }

  .brutal-grid-bg-dark {
    background-image:
      linear-gradient(rgba(250,204,21,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(250,204,21,0.06) 1px, transparent 1px);
    background-size: 24px 24px;
  }

  @keyframes brutal-slide-in {
    from { transform: translateX(-12px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes brutal-fade-up {
    from { transform: translateY(8px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes brutal-glitch {
    0%, 100% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(2px, -1px); }
    60% { transform: translate(-1px, -2px); }
    80% { transform: translate(1px, 1px); }
  }

  @keyframes brutal-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .brutal-animate-in {
    animation: brutal-fade-up 0.3s ease-out forwards;
  }

  .brutal-stagger-1 { animation-delay: 0.05s; opacity: 0; }
  .brutal-stagger-2 { animation-delay: 0.1s; opacity: 0; }
  .brutal-stagger-3 { animation-delay: 0.15s; opacity: 0; }
  .brutal-stagger-4 { animation-delay: 0.2s; opacity: 0; }
  .brutal-stagger-5 { animation-delay: 0.25s; opacity: 0; }

  .brutal-cursor::after {
    content: '_';
    animation: brutal-blink 1s step-end infinite;
    color: #FACC15;
    font-weight: 800;
  }

  .brutal-hover-lift {
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .brutal-hover-lift:hover {
    transform: translate(-2px, -2px);
    box-shadow: 10px 10px 0px #000000;
  }

  /* Scrollbar styling */
  .brutal-scroll::-webkit-scrollbar {
    width: 8px;
  }
  .brutal-scroll::-webkit-scrollbar-track {
    background: #FAFAFA;
    border-left: 3px solid #000;
  }
  .brutal-scroll::-webkit-scrollbar-thumb {
    background: #000;
    border: none;
  }
`;

interface NavItemProps {
  icon: ElementType;
  label: string;
  href: string;
  isActive: boolean;
  onClick?: () => void;
}

function NavItem({
  icon: IconComponent,
  label,
  href,
  isActive,
  onClick,
}: NavItemProps) {
  return (
    <Link
      to={href}
      search={(prev: Record<string, unknown>) => prev}
      style={{ textDecoration: "none", width: "100%" }}
      onClick={onClick}
    >
      <HStack
        px="4"
        py="3"
        bg={isActive ? "#FACC15" : "transparent"}
        color={isActive ? "#000" : "#FAFAFA"}
        fontWeight="800"
        fontFamily="'JetBrains Mono', monospace"
        fontSize="sm"
        textTransform="uppercase"
        letterSpacing="widest"
        cursor="pointer"
        border={isActive ? "3px solid #000" : "3px solid transparent"}
        transition="all 0.1s ease"
        _hover={{
          bg: isActive ? "#FACC15" : "rgba(250, 204, 21, 0.15)",
          color: isActive ? "#000" : "#FACC15",
          borderColor: isActive ? "#000" : "#FACC15",
        }}
      >
        <Icon boxSize="5" mr="2">
          <IconComponent />
        </Icon>
        <Text fontSize="xs" letterSpacing="widest" fontWeight="800">
          {label}
        </Text>
        {isActive && (
          <Text ml="auto" fontSize="xs" color="#000">
            {">>"}
          </Text>
        )}
      </HStack>
    </Link>
  );
}

interface LayoutProps {
  children: ReactNode;
}

export default function BrutalistLayout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const { user, logout, hasRole } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: ShieldAlert, label: "Alerts", href: "/alerts" },
    { icon: Scale, label: "Rules", href: "/rules" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ].filter((item) => item.href !== "/rules" || hasRole("admin", "analyst"));

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: BRUTALIST_STYLES }} />
      <Flex
        h="100vh"
        bg="#FAFAFA"
        fontFamily="'JetBrains Mono', monospace"
        overflow="hidden"
      >
        {/* Sidebar - Desktop */}
        <Box
          display={{ base: "none", md: "flex" }}
          flexDirection="column"
          w="72"
          bg="#000"
          color="#FAFAFA"
          zIndex={30}
          h="full"
          position="relative"
          borderRight="3px solid #FACC15"
          className="brutal-grid-bg-dark"
        >
          {/* Logo */}
          <Box
            h="20"
            px="6"
            display="flex"
            alignItems="center"
            borderBottom="3px solid #FACC15"
            bg="#000"
            position="relative"
          >
            <Box
              bg="#FACC15"
              p="2"
              mr="3"
              border="3px solid #FACC15"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon boxSize="6" color="#000">
                <ShieldAlert />
              </Icon>
            </Box>
            <Box>
              <Text
                fontSize="2xl"
                fontWeight="800"
                fontFamily="'Bebas Neue', sans-serif"
                letterSpacing="widest"
                color="#FACC15"
                lineHeight="1"
              >
                SENTINEL
              </Text>
              <Text
                fontSize="2xs"
                color="#FACC15"
                fontFamily="'JetBrains Mono', monospace"
                letterSpacing="widest"
                opacity={0.6}
              >
                FRAUD ENGINE
              </Text>
            </Box>
          </Box>

          {/* Terminal Prompt */}
          <Box px="6" py="3" borderBottom="1px solid rgba(250,204,21,0.2)">
            <Text
              fontSize="2xs"
              color="#FACC15"
              opacity={0.5}
              fontFamily="'JetBrains Mono', monospace"
            >
              root@sentinel:~$
            </Text>
          </Box>

          {/* Nav Items */}
          <VStack
            as="nav"
            flex="1"
            px="4"
            py="4"
            gap="1"
            overflowY="auto"
            align="stretch"
            className="brutal-scroll"
          >
            {navItems.map((item, i) => (
              <Box
                key={item.href}
                className={`brutal-animate-in brutal-stagger-${i + 1}`}
              >
                <NavItem
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  isActive={isActive(item.href)}
                />
              </Box>
            ))}
          </VStack>

          {/* Status Bar */}
          <Box
            px="6"
            py="3"
            borderTop="3px solid #FACC15"
            bg="rgba(250,204,21,0.05)"
          >
            <HStack justify="space-between" mb="2">
              <HStack>
                <Box w="2" h="2" bg="#FACC15" />
                <Text
                  fontSize="2xs"
                  color="#FACC15"
                  fontWeight="700"
                  textTransform="uppercase"
                >
                  System Active
                </Text>
              </HStack>
              <Icon boxSize="3" color="#FACC15">
                <Zap />
              </Icon>
            </HStack>
            <Box
              as="button"
              w="full"
              display="flex"
              alignItems="center"
              px="3"
              py="2"
              color="rgba(250,204,21,0.5)"
              fontFamily="'JetBrains Mono', monospace"
              fontSize="xs"
              fontWeight="700"
              textTransform="uppercase"
              border="1px solid rgba(250,204,21,0.2)"
              bg="transparent"
              _hover={{ color: "#FACC15", borderColor: "#FACC15" }}
              transition="all 0.1s"
              onClick={logout}
            >
              <Icon boxSize="4" mr="2">
                <LogOut />
              </Icon>
              Sign Out
            </Box>
          </Box>
        </Box>

        {/* Mobile Header */}
        <Box
          display={{ base: "flex", md: "none" }}
          position="fixed"
          top="0"
          left="0"
          right="0"
          h="16"
          bg="#000"
          zIndex={30}
          alignItems="center"
          justifyContent="space-between"
          px="4"
          borderBottom="3px solid #FACC15"
        >
          <HStack>
            <Box bg="#FACC15" p="1.5">
              <Icon boxSize="5" color="#000">
                <ShieldAlert />
              </Icon>
            </Box>
            <Text
              color="#FACC15"
              fontWeight="800"
              fontSize="lg"
              fontFamily="'Bebas Neue', sans-serif"
              letterSpacing="widest"
            >
              SENTINEL
            </Text>
          </HStack>
          <Box
            as="button"
            color="#FACC15"
            p="2"
            border="2px solid #FACC15"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Icon boxSize="5">{mobileMenuOpen ? <X /> : <Menu />}</Icon>
          </Box>
        </Box>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <Box
            display={{ base: "flex", md: "none" }}
            position="fixed"
            inset="0"
            bg="#000"
            zIndex={40}
            flexDirection="column"
            pt="24"
            px="6"
            className="brutal-grid-bg-dark"
          >
            <Box position="absolute" top="4" right="4">
              <Box
                as="button"
                color="#FACC15"
                p="2"
                border="2px solid #FACC15"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon boxSize="5">
                  <X />
                </Icon>
              </Box>
            </Box>
            <VStack as="nav" gap="2" align="stretch">
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  isActive={isActive(item.href)}
                  onClick={() => setMobileMenuOpen(false)}
                />
              ))}
            </VStack>
          </Box>
        )}

        {/* Main Content Area */}
        <Box
          as="main"
          flex="1"
          display="flex"
          flexDirection="column"
          h="full"
          position="relative"
          overflow="hidden"
          bg="#FAFAFA"
        >
          {/* Top Bar */}
          <Box
            as="header"
            h="20"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            px="8"
            bg="#FAFAFA"
            borderBottom="3px solid #000"
            zIndex={20}
            className="brutal-grid-bg"
          >
            <Box display={{ base: "none", md: "flex" }} alignItems="center">
              <Icon boxSize="4" color="#000" mr="2">
                <Terminal />
              </Icon>
              <Text
                fontSize="sm"
                fontWeight="700"
                color="#000"
                fontFamily="'JetBrains Mono', monospace"
                textTransform="uppercase"
                letterSpacing="wider"
                className="brutal-cursor"
              >
                {pathname === "/"
                  ? "~/dashboard"
                  : pathname.startsWith("/alerts/")
                    ? "~/alerts/detail"
                    : `~${pathname}`}
              </Text>
            </Box>

            <HStack gap="4">
              <Box
                px="3"
                py="1"
                bg="#FACC15"
                border="3px solid #000"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="xs"
                fontWeight="800"
                color="#000"
                textTransform="uppercase"
              >
                {user?.role ?? "User"}
              </Box>
              <Box
                w="10"
                h="10"
                bg="#000"
                border="3px solid #000"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="#FACC15"
                fontWeight="800"
                fontFamily="'Bebas Neue', sans-serif"
                fontSize="lg"
              >
                A
              </Box>
            </HStack>
          </Box>

          {/* Content */}
          <Box
            flex="1"
            overflowY="auto"
            p="8"
            pt={{ base: "24", md: "8" }}
            className="brutal-grid-bg brutal-scroll brutal-animate-in"
          >
            {children}
          </Box>
        </Box>
      </Flex>
    </>
  );
}
