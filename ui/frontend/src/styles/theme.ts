/**
 * The two token values that must exist outside CSS: the browser's theme-color meta tag
 * cannot read CSS variables. Keep these equal to --ns-bg in theme.css (light and dark).
 */
export const browserThemeColor = {
  light: "#f5f8fc",
  dark: "#00151a",
} as const;
