import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  retainSearchParams,
  useLocation,
  redirect,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import { useEffect } from "react";
import { Provider } from "../components/ui/provider";
import { Toaster } from "../components/ui/toaster";
import { Layout } from "../components/Layout";
import { TemplateSwitcher } from "../components/TemplateSwitcher";
import {
  TemplateProvider,
  type TemplateName,
} from "../contexts/TemplateContext";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

const STORAGE_KEY = "sentinel-template-preference";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
});

const templateEnum = z.enum(["brutalist", "terminal"]);

function getSavedTemplate(): TemplateName {
  if (typeof window === "undefined") return "brutalist";
  const saved = localStorage.getItem(STORAGE_KEY);
  const result = templateEnum.safeParse(saved);
  return result.success ? result.data : "brutalist";
}

const globalSearchSchema = z.object({
  template: templateEnum.optional().catch(undefined),
});

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  html {
    font-size: 100%;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  body {
    background-color: #ffffff;
    color: #1e293b;
    font-family: 'Inter', system-ui, sans-serif;
  }

  .animate-fade-in {
    animation: fadeIn 0.4s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export const Route = createRootRoute({
  validateSearch: zodValidator(globalSearchSchema),
  search: {
    middlewares: [retainSearchParams(["template"])],
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Sentinel Fraud Engine" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
    ],
  }),
  component: RootComponent,
});

// Inline script to prevent FOUC: hides body until client resolves the template.
// Only activates when there's no ?template= in the URL (i.e. localStorage lookup needed).
const antiFlickerScript = `
(function(){
  if(!new URLSearchParams(window.location.search).get('template')){
    document.documentElement.style.opacity='0';
    document.documentElement.style.transition='opacity 0.15s';
  }
})();
`;

/**
 * Route guard: redirects unauthenticated users to /login.
 * Renders nothing while auth state is loading to avoid flash.
 */
function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Don't guard the login route itself
  if (location.pathname === "/login") {
    return <>{children}</>;
  }

  // Show nothing while checking token validity
  if (isLoading) return null;

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

  return <>{children}</>;
}

/**
 * Conditionally wraps content in the Layout shell.
 * The /login route renders standalone (no sidebar/header).
 */
function ShellWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  if (location.pathname === "/login") {
    return <>{children}</>;
  }

  return <Layout>{children}</Layout>;
}

function RootComponent() {
  const { template: searchTemplate } = Route.useSearch();

  // Resolve actual template: explicit URL param > localStorage > default
  const resolvedTemplate: TemplateName = searchTemplate ?? getSavedTemplate();

  // Reveal the page once the client has resolved the correct template
  useEffect(() => {
    document.documentElement.style.opacity = "1";
  }, []);

  // Persist template choice to localStorage whenever it changes via URL param
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (searchTemplate && searchTemplate !== "brutalist") {
      localStorage.setItem(STORAGE_KEY, searchTemplate);
    } else if (searchTemplate === "brutalist") {
      localStorage.removeItem(STORAGE_KEY);
    }
    // Don't clear localStorage when searchTemplate is undefined (no param in URL)
  }, [searchTemplate]);

  return (
    <html lang="en">
      <head>
        <HeadContent />
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
        {/* Anti-flicker: hide page until client resolves template from localStorage */}
        <script dangerouslySetInnerHTML={{ __html: antiFlickerScript }} />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <Provider>
            <AuthProvider>
              <TemplateProvider value={resolvedTemplate}>
                <AuthGate>
                  <ShellWrapper>
                    <Outlet />
                  </ShellWrapper>
                </AuthGate>
                <TemplateSwitcher />
              </TemplateProvider>
            </AuthProvider>
            <Toaster />
          </Provider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
