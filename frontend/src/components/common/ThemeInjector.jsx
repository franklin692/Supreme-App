import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const DEFAULT_THEME = {
  mode: "light",
  color_gold: "#BE9E5E",
  color_gold_strong: "#A5823F",
  color_ink: "#16150F",
  color_bg: "#F6F4EE",
  color_surface: "#FFFFFF",
  color_text: "#16150F",
  color_emerald: "#10B981",
  color_amber: "#F59E0B",
  font_display: "Sora",
  font_body: "Manrope",
  radius: 20,
};

export const FONT_STACK = {
  Sora: "'Sora', system-ui, sans-serif",
  "Playfair Display": "'Playfair Display', Georgia, serif",
  "Cormorant Garamond": "'Cormorant Garamond', Georgia, serif",
  "DM Serif Display": "'DM Serif Display', Georgia, serif",
  Poppins: "'Poppins', system-ui, sans-serif",
  Montserrat: "'Montserrat', system-ui, sans-serif",
  Manrope: "'Manrope', system-ui, sans-serif",
  Inter: "'Inter', system-ui, sans-serif",
  "Work Sans": "'Work Sans', system-ui, sans-serif",
  "DM Sans": "'DM Sans', system-ui, sans-serif",
  "Nunito Sans": "'Nunito Sans', system-ui, sans-serif",
};

const fontStack = (name) => FONT_STACK[name] || `'${name}', system-ui, sans-serif`;

export const applyTheme = (theme) => {
  const t = { ...DEFAULT_THEME, ...(theme || {}) };
  const root = document.documentElement;
  const set = (k, v) => root.style.setProperty(k, v);
  set("--sh-gold", t.color_gold);
  set("--sh-gold-strong", t.color_gold_strong);
  set("--sh-ink", t.color_ink);
  set("--sh-bg", t.color_bg);
  set("--sh-surface", t.color_surface);
  set("--sh-text", t.color_text);
  set("--sh-emerald", t.color_emerald);
  set("--sh-amber", t.color_amber);
  set("--sh-radius", `${t.radius}px`);
  set("--sh-font-display", fontStack(t.font_display));
  set("--sh-font-body", fontStack(t.font_body));
};

export const ThemeInjector = () => {
  const { data } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await api.get("/content/settings")).data,
  });
  const theme = data?.theme;
  useEffect(() => {
    if (theme) applyTheme(theme);
  }, [JSON.stringify(theme)]);
  return null;
};
