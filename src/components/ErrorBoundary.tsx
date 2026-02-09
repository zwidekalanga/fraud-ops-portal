import { Component, type ErrorInfo, type ReactNode } from "react";
import { Box, Button, Code, Heading, Text, VStack } from "@chakra-ui/react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box p={8} textAlign="center">
          <VStack gap={4}>
            <Heading size="lg">Something went wrong</Heading>
            <Text color="fg.muted">
              This component encountered an unexpected error.
            </Text>
            {this.state.error && (
              <Code
                variant="surface"
                colorPalette="red"
                p={3}
                maxW="600px"
                whiteSpace="pre-wrap"
                wordBreak="break-word"
              >
                {this.state.error.message}
              </Code>
            )}
            <Button onClick={this.handleReset} variant="outline" size="sm">
              Try Again
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}
