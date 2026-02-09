import { Box, Flex, VStack, HStack, Text, Input, Icon } from "@chakra-ui/react";
import { ShieldAlert, LogIn, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useLoginForm } from "../../hooks/useLoginForm";

const gridBg = `repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(0,0,0,0.03) 23px, rgba(0,0,0,0.03) 24px), repeating-linear-gradient(90deg, transparent, transparent 23px, rgba(0,0,0,0.03) 23px, rgba(0,0,0,0.03) 24px)`;

export default function BrutalistLogin() {
  const f = useLoginForm();

  if (f.isAuthenticated) return null;

  return (
    <Flex
      minH="100vh"
      bg="#FAFAFA"
      backgroundImage={gridBg}
      alignItems="center"
      justifyContent="center"
      px="4"
      fontFamily="'JetBrains Mono', monospace"
    >
      <Box w="full" maxW="420px">
        {/* Header */}
        <VStack gap="0" mb="6" alignItems="start">
          <HStack gap="3" mb="3">
            <Box
              w="14"
              h="14"
              bg="#FACC15"
              border="3px solid #000"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="4px 4px 0px #000"
            >
              <Icon boxSize="7" color="#000">
                <ShieldAlert />
              </Icon>
            </Box>
            <Box>
              <Text
                fontSize="2xl"
                fontWeight="900"
                fontFamily="'Bebas Neue', 'JetBrains Mono', monospace"
                letterSpacing="0.15em"
                textTransform="uppercase"
                color="#000"
              >
                SENTINEL
              </Text>
              <Text
                fontSize="xs"
                fontWeight="700"
                textTransform="uppercase"
                letterSpacing="0.2em"
                color="#000"
                opacity="0.6"
              >
                Fraud Engine // Login
              </Text>
            </Box>
          </HStack>
          <Box w="full" h="3px" bg="#000" />
        </VStack>

        {/* Login Card */}
        <Box
          bg="#FFF"
          border="3px solid #000"
          boxShadow="8px 8px 0px #000"
          p="8"
        >
          <Text
            fontSize="xs"
            fontWeight="700"
            textTransform="uppercase"
            letterSpacing="0.2em"
            color="#000"
            mb="6"
          >
            {">>"} Authenticate
          </Text>

          <form onSubmit={f.handleSubmit}>
            <VStack gap="5" alignItems="stretch">
              {f.error && (
                <HStack
                  bg="#FEE2E2"
                  border="3px solid #000"
                  px="4"
                  py="3"
                  gap="3"
                >
                  <Icon boxSize="4" color="#000">
                    <AlertCircle />
                  </Icon>
                  <Text
                    fontSize="xs"
                    fontWeight="700"
                    textTransform="uppercase"
                    letterSpacing="0.05em"
                    color="#000"
                  >
                    {f.error}
                  </Text>
                </HStack>
              )}

              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="700"
                  textTransform="uppercase"
                  letterSpacing="0.15em"
                  color="#000"
                  mb="2"
                >
                  Username
                </Text>
                <Input
                  value={f.username}
                  onChange={(e) => f.setUsername(e.target.value)}
                  placeholder="ENTER USERNAME"
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="700"
                  fontSize="sm"
                  textTransform="uppercase"
                  letterSpacing="0.05em"
                  bg="#FAFAFA"
                  border="3px solid #000"
                  borderRadius="0"
                  h="12"
                  _focus={{
                    bg: "#FACC15",
                    borderColor: "#000",
                    boxShadow: "4px 4px 0px #000",
                    outline: "none",
                  }}
                  _placeholder={{ color: "rgba(0,0,0,0.3)" }}
                  required
                  autoComplete="username"
                  autoFocus
                />
              </Box>

              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="700"
                  textTransform="uppercase"
                  letterSpacing="0.15em"
                  color="#000"
                  mb="2"
                >
                  Password
                </Text>
                <Box position="relative">
                  <Input
                    type={f.showPassword ? "text" : "password"}
                    value={f.password}
                    onChange={(e) => f.setPassword(e.target.value)}
                    placeholder="ENTER PASSWORD"
                    fontFamily="'JetBrains Mono', monospace"
                    fontWeight="700"
                    fontSize="sm"
                    letterSpacing="0.05em"
                    bg="#FAFAFA"
                    border="3px solid #000"
                    borderRadius="0"
                    h="12"
                    pr="12"
                    _focus={{
                      bg: "#FACC15",
                      borderColor: "#000",
                      boxShadow: "4px 4px 0px #000",
                      outline: "none",
                    }}
                    _placeholder={{ color: "rgba(0,0,0,0.3)" }}
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
                    color="#000"
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
                bg="#FACC15"
                color="#000"
                fontFamily="'JetBrains Mono', monospace"
                fontWeight="900"
                fontSize="sm"
                textTransform="uppercase"
                letterSpacing="0.15em"
                py="3.5"
                border="3px solid #000"
                boxShadow="6px 6px 0px #000"
                transition="all 0.1s"
                _hover={{
                  transform: "translate(2px, 2px)",
                  boxShadow: "4px 4px 0px #000",
                }}
                _active={{
                  transform: "translate(6px, 6px)",
                  boxShadow: "0px 0px 0px #000",
                }}
                _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
                disabled={f.isSubmitting || !f.username || !f.password}
              >
                <HStack justifyContent="center" gap="3">
                  <Icon boxSize="4">
                    <LogIn />
                  </Icon>
                  <Text>
                    {f.isSubmitting ? "AUTHENTICATING..." : ">> LOGIN"}
                  </Text>
                </HStack>
              </Box>
            </VStack>
          </form>
        </Box>

        {/* Demo Accounts */}
        <Box mt="5" border="3px solid #000" bg="#FFF" p="4">
          <Text
            fontSize="xs"
            fontWeight="700"
            textTransform="uppercase"
            letterSpacing="0.15em"
            color="#000"
            mb="3"
          >
            Demo Credentials
          </Text>
          <Box h="2px" bg="#000" mb="3" />
          <VStack gap="2" align="start">
            {[
              { user: "admin", pass: "admin123", role: "FULL ACCESS" },
              { user: "analyst", pass: "analyst123", role: "REVIEW ALERTS" },
              { user: "viewer", pass: "viewer123", role: "READ-ONLY" },
            ].map(({ user, pass, role }) => (
              <HStack key={user} gap="2" fontSize="xs" color="#000">
                <Text fontWeight="900" bg="#FACC15" px="1">
                  {user}
                </Text>
                <Text fontWeight="700">/</Text>
                <Text fontWeight="700">{pass}</Text>
                <Text opacity="0.5">{"// " + role}</Text>
              </HStack>
            ))}
          </VStack>
        </Box>
      </Box>
    </Flex>
  );
}
