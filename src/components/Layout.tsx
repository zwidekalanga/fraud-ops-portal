import { lazy, Suspense, type ReactNode } from "react";
import { Flex, Spinner } from "@chakra-ui/react";
import { useTemplate } from "../contexts/TemplateContext";

function LayoutFallback({ children }: { children: ReactNode }) {
  return (
    <Flex h="100vh" align="center" justify="center">
      <Spinner size="xl" color="brand.500" borderWidth="4px" />
    </Flex>
  );
}

const layouts = {
  brutalist: lazy(() => import("../variants/brutalist/Layout")),
  terminal: lazy(() => import("../variants/terminal/Layout")),
};

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const template = useTemplate();
  const LayoutComponent = layouts[template] || layouts.brutalist;

  return (
    <Suspense fallback={<LayoutFallback>{children}</LayoutFallback>}>
      <LayoutComponent>{children}</LayoutComponent>
    </Suspense>
  );
}
