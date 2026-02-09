import { createContext, useContext } from "react";

export const TEMPLATE_NAMES = ["brutalist", "terminal"] as const;

export type TemplateName = (typeof TEMPLATE_NAMES)[number];

const TemplateContext = createContext<TemplateName>("brutalist");

export const TemplateProvider = TemplateContext.Provider;

export function useTemplate(): TemplateName {
  return useContext(TemplateContext);
}
