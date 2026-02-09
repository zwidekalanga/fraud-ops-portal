import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#f0f7ff" },
          100: { value: "#e0effe" },
          200: { value: "#bae0fd" },
          300: { value: "#7cc2fb" },
          400: { value: "#36a2f7" },
          500: { value: "#0c87eb" },
          600: { value: "#0766ab" },
          700: { value: "#06528c" },
          800: { value: "#084574" },
          900: { value: "#0c3a61" },
          950: { value: "#082540" },
        },
        slate: {
          50: { value: "#f8fafc" },
          100: { value: "#f1f5f9" },
          200: { value: "#e2e8f0" },
          300: { value: "#cbd5e1" },
          400: { value: "#94a3b8" },
          500: { value: "#64748b" },
          600: { value: "#475569" },
          700: { value: "#334155" },
          800: { value: "#1e293b" },
          900: { value: "#0f172a" },
        },
      },
      fonts: {
        body: { value: "'Inter', system-ui, sans-serif" },
        heading: { value: "'Inter', system-ui, sans-serif" },
      },
      fontSizes: {
        "3xs": { value: "0.5625rem" }, // 9px (was ~12px)
        "2xs": { value: "0.625rem" }, // 10px (was ~13px)
        xs: { value: "0.6875rem" }, // 11px (was ~14px)
        sm: { value: "0.75rem" }, // 12px (was 14px) - base text
        md: { value: "0.8125rem" }, // 13px (was 16px)
        lg: { value: "0.9375rem" }, // 15px (was 18px)
        xl: { value: "1.125rem" }, // 18px (was 20px)
        "2xl": { value: "1.3125rem" }, // 21px (was 24px)
        "3xl": { value: "1.5rem" }, // 24px (was 30px)
        "4xl": { value: "1.875rem" }, // 30px (was 36px)
        "5xl": { value: "2.25rem" }, // 36px (was 48px)
      },
      shadows: {
        soft: { value: "0 4px 30px rgba(0, 0, 0, 0.05)" },
        card: { value: "0 0 20px rgba(0, 0, 0, 0.03)" },
        sidebar: { value: "4px 0 24px rgba(0, 0, 0, 0.08)" },
      },
      radii: {
        sm: { value: "0.25rem" },
        md: { value: "0.375rem" },
        lg: { value: "0.5rem" },
        xl: { value: "0.75rem" },
        "2xl": { value: "1rem" },
        "3xl": { value: "1.5rem" },
      },
      spacing: {
        "0.5": { value: "0.09375rem" },
        "1": { value: "0.1875rem" },
        "1.5": { value: "0.28125rem" },
        "2": { value: "0.375rem" },
        "2.5": { value: "0.46875rem" },
        "3": { value: "0.5625rem" },
        "3.5": { value: "0.65625rem" },
        "4": { value: "0.75rem" },
        "5": { value: "0.9375rem" },
        "6": { value: "1.125rem" },
        "7": { value: "1.3125rem" },
        "8": { value: "1.5rem" },
        "9": { value: "1.6875rem" },
        "10": { value: "1.875rem" },
        "12": { value: "2.25rem" },
        "14": { value: "2.625rem" },
        "16": { value: "3rem" },
        "20": { value: "3.75rem" },
        "24": { value: "4.5rem" },
      },
    },
    semanticTokens: {
      colors: {
        "bg.page": {
          value: { base: "#ffffff", _dark: "#0f172a" },
        },
        "bg.card": {
          value: { base: "#ffffff", _dark: "#1e293b" },
        },
        "bg.sidebar": {
          value: { base: "#0766ab", _dark: "#084574" },
        },
        "text.primary": {
          value: { base: "#1e293b", _dark: "#f1f5f9" },
        },
        "text.muted": {
          value: { base: "#64748b", _dark: "#94a3b8" },
        },
        "border.default": {
          value: { base: "#e2e8f0", _dark: "#334155" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
