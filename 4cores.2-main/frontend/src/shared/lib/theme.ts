export type Theme = "light" | "dark";
const themeKey = "4cores:theme";

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(themeKey, theme);
  } catch {
    /* preferência é opcional */
  }
}

export function toggleTheme(): Theme {
  const nextTheme = getTheme() === "light" ? "dark" : "light";
  setTheme(nextTheme);
  return nextTheme;
}
