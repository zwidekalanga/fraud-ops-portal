import { lazy, Suspense, type ComponentType } from "react";
import { useTemplate, type TemplateName } from "../contexts/TemplateContext";
import { Flex, Spinner } from "@chakra-ui/react";
import { ErrorBoundary } from "../components/ErrorBoundary";

function Fallback() {
  return (
    <Flex h="full" align="center" justify="center" minH="200px">
      <Spinner size="xl" color="brand.500" borderWidth="4px" />
    </Flex>
  );
}

export function createVariantSwitcher<P extends object>(
  importMap: Record<TemplateName, () => Promise<{ default: ComponentType<P> }>>,
) {
  const components: Record<
    string,
    React.LazyExoticComponent<ComponentType<P>>
  > = {};
  for (const [key, loader] of Object.entries(importMap)) {
    components[key] = lazy(loader);
  }

  return function VariantSwitcher(props: P) {
    const template = useTemplate();
    const Component = components[template] || components.brutalist;
    return (
      <ErrorBoundary>
        <Suspense fallback={<Fallback />}>
          <Component {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}
