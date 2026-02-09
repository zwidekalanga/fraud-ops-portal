import { useState, useEffect } from "react";
import { Box, Flex, VStack, HStack, Text, Input, Icon } from "@chakra-ui/react";
import { ShieldAlert, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useLoginForm } from "../../hooks/useLoginForm";

const scanlineBg = `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.03) 2px, rgba(0,255,65,0.03) 3px)`;
const vignette = `radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.6) 100%)`;

const bootLines = [
  "SENTINEL FRAUD ENGINE v3.2.1",
  "Initializing secure connection...",
  "Loading authentication module...",
  "Verifying TLS certificates... OK",
  "System ready. Awaiting credentials.",
];

export default function TerminalLogin() {
  const f = useLoginForm();
  const [bootStep, setBootStep] = useState(0);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    if (bootStep < bootLines.length) {
      const timer = setTimeout(() => setBootStep((s) => s + 1), 140);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setBooted(true), 300);
      return () => clearTimeout(timer);
    }
  }, [bootStep]);

  if (f.isAuthenticated) return null;

  return (
    <Flex
      minH="100vh"
      bg="#0a0a0a"
      backgroundImage={scanlineBg}
      alignItems="center"
      justifyContent="center"
      px="4"
      fontFamily="'IBM Plex Mono', monospace"
      position="relative"
    >
      {/* Vignette overlay */}
      <Box
        position="fixed"
        inset="0"
        backgroundImage={vignette}
        pointerEvents="none"
        zIndex="1"
      />

      <Box w="full" maxW="500px" zIndex="2">
        {/* Boot sequence */}
        <Box mb="6">
          {bootLines.slice(0, bootStep).map((line, i) => (
            <Text
              key={i}
              fontSize="xs"
              color={i === 0 ? "#00FF41" : "rgba(0,255,65,0.6)"}
              fontWeight={i === 0 ? "700" : "400"}
              letterSpacing="0.05em"
              textShadow={
                i === 0
                  ? "0 0 10px rgba(0,255,65,0.5)"
                  : "0 0 5px rgba(0,255,65,0.2)"
              }
              mb="1"
            >
              {i === 0 ? `> ${line}` : `  ${line}`}
            </Text>
          ))}
          {bootStep < bootLines.length && (
            <Text fontSize="xs" color="#00FF41" opacity="0.7">
              {"█"}
            </Text>
          )}
        </Box>

        {/* Login form - appears after boot */}
        {booted && (
          <Box
            border="1px solid rgba(0,255,65,0.3)"
            bg="rgba(0,255,65,0.02)"
            p="8"
            position="relative"
          >
            {/* Corner decorations */}
            <Text
              position="absolute"
              top="-1"
              left="2"
              fontSize="xs"
              color="rgba(0,255,65,0.3)"
            >
              {"+-"}
            </Text>
            <Text
              position="absolute"
              bottom="-1"
              right="2"
              fontSize="xs"
              color="rgba(0,255,65,0.3)"
            >
              {"-+"}
            </Text>

            <HStack gap="3" mb="6">
              <Icon boxSize="6" color="#00FF41">
                <ShieldAlert />
              </Icon>
              <Box>
                <Text
                  fontSize="lg"
                  fontWeight="700"
                  color="#00FF41"
                  letterSpacing="0.1em"
                  textShadow="0 0 10px rgba(0,255,65,0.5)"
                >
                  AUTH_LOGIN
                </Text>
                <Text
                  fontSize="xs"
                  color="rgba(0,255,65,0.5)"
                  letterSpacing="0.05em"
                >
                  SECURE AUTHENTICATION PORTAL
                </Text>
              </Box>
            </HStack>

            <Box h="1px" bg="rgba(0,255,65,0.2)" mb="6" />

            <form onSubmit={f.handleSubmit}>
              <VStack gap="5" alignItems="stretch">
                {f.error && (
                  <HStack
                    bg="rgba(255,0,0,0.1)"
                    border="1px solid rgba(255,0,0,0.4)"
                    px="4"
                    py="3"
                    gap="3"
                  >
                    <Icon boxSize="4" color="#FF4444">
                      <AlertCircle />
                    </Icon>
                    <Text
                      fontSize="xs"
                      color="#FF4444"
                      letterSpacing="0.05em"
                      textShadow="0 0 5px rgba(255,0,0,0.3)"
                    >
                      ERROR: {f.error.toUpperCase()}
                    </Text>
                  </HStack>
                )}

                <Box>
                  <Text
                    fontSize="xs"
                    color="rgba(0,255,65,0.6)"
                    letterSpacing="0.1em"
                    mb="2"
                  >
                    $ USERNAME
                  </Text>
                  <Input
                    value={f.username}
                    onChange={(e) => f.setUsername(e.target.value)}
                    placeholder="enter_username"
                    fontFamily="'IBM Plex Mono', monospace"
                    fontSize="sm"
                    letterSpacing="0.05em"
                    bg="rgba(0,255,65,0.03)"
                    color="#00FF41"
                    border="1px solid rgba(0,255,65,0.2)"
                    borderRadius="0"
                    h="12"
                    _focus={{
                      borderColor: "#00FF41",
                      bg: "rgba(0,255,65,0.05)",
                      boxShadow: "0 0 10px rgba(0,255,65,0.15)",
                      outline: "none",
                    }}
                    _placeholder={{ color: "rgba(0,255,65,0.25)" }}
                    required
                    autoComplete="username"
                    autoFocus
                  />
                </Box>

                <Box>
                  <Text
                    fontSize="xs"
                    color="rgba(0,255,65,0.6)"
                    letterSpacing="0.1em"
                    mb="2"
                  >
                    $ PASSWORD
                  </Text>
                  <Box position="relative">
                    <Input
                      type={f.showPassword ? "text" : "password"}
                      value={f.password}
                      onChange={(e) => f.setPassword(e.target.value)}
                      placeholder="enter_password"
                      fontFamily="'IBM Plex Mono', monospace"
                      fontSize="sm"
                      letterSpacing="0.05em"
                      bg="rgba(0,255,65,0.03)"
                      color="#00FF41"
                      border="1px solid rgba(0,255,65,0.2)"
                      borderRadius="0"
                      h="12"
                      pr="12"
                      _focus={{
                        borderColor: "#00FF41",
                        bg: "rgba(0,255,65,0.05)",
                        boxShadow: "0 0 10px rgba(0,255,65,0.15)",
                        outline: "none",
                      }}
                      _placeholder={{ color: "rgba(0,255,65,0.25)" }}
                      required
                      autoComplete="current-password"
                    />
                    <Box
                      as="button"
                      type="button"
                      position="absolute"
                      right="3"
                      top="50%"
                      transform="translateY(-50%)"
                      color="rgba(0,255,65,0.5)"
                      _hover={{ color: "#00FF41" }}
                      onClick={f.toggleShowPassword}
                    >
                      <Icon boxSize="5">
                        {f.showPassword ? <EyeOff /> : <Eye />}
                      </Icon>
                    </Box>
                  </Box>
                </Box>

                <Box
                  as="button"
                  type="submit"
                  w="full"
                  bg="rgba(0,255,65,0.1)"
                  color="#00FF41"
                  fontFamily="'IBM Plex Mono', monospace"
                  fontWeight="700"
                  fontSize="sm"
                  letterSpacing="0.1em"
                  py="3"
                  border="1px solid rgba(0,255,65,0.4)"
                  transition="all 0.2s"
                  textShadow="0 0 10px rgba(0,255,65,0.5)"
                  _hover={{
                    bg: "rgba(0,255,65,0.15)",
                    borderColor: "#00FF41",
                    boxShadow: "0 0 20px rgba(0,255,65,0.2)",
                  }}
                  _disabled={{ opacity: 0.3, cursor: "not-allowed" }}
                  disabled={f.isSubmitting || !f.username || !f.password}
                >
                  {f.isSubmitting
                    ? "> AUTHENTICATING..."
                    : "> EXECUTE LOGIN"}
                </Box>
              </VStack>
            </form>
          </Box>
        )}

        {/* Demo credentials */}
        {booted && (
          <Box
            mt="4"
            border="1px solid rgba(0,255,65,0.15)"
            bg="rgba(0,255,65,0.02)"
            p="4"
          >
            <Text
              fontSize="xs"
              color="rgba(0,255,65,0.5)"
              letterSpacing="0.05em"
              mb="2"
            >
              # DEMO ACCESS CREDENTIALS
            </Text>
            <VStack gap="1" align="start">
              {[
                { user: "admin", pass: "admin123", role: "root" },
                { user: "analyst", pass: "analyst123", role: "analyst" },
                { user: "viewer", pass: "viewer123", role: "readonly" },
              ].map(({ user, pass, role }) => (
                <Text
                  key={user}
                  fontSize="xs"
                  color="rgba(0,255,65,0.6)"
                  letterSpacing="0.03em"
                >
                  {user}:{pass}{" "}
                  <Box as="span" color="rgba(0,255,65,0.3)">
                    [{role}]
                  </Box>
                </Text>
              ))}
            </VStack>
          </Box>
        )}
      </Box>
    </Flex>
  );
}
