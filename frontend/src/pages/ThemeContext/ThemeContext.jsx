// ThemeContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const themeArray = useMemo(() => {
    const isDark = theme === "dark";
    return {
      appBg: isDark ? "#121212" : "#f4f5f7",
      panelBg: isDark ? "#1b1b1b" : "#ffffff",
      panel2Bg: isDark ? "#232323" : "#f3f4f6",
      stroke: isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)",
      text: isDark ? "#e9e9e9" : "#111827",
      muted: isDark ? "rgba(255,255,255,.65)" : "rgba(17,24,39,.65)",
      chipBg: isDark ? "#2a2a2a" : "#eef0f3",
      activeBg: isDark ? "#2c2c2c" : "#e7e9ee",
      overlay: isDark ? "rgba(0,0,0,.55)" : "rgba(0,0,0,.35)",
      // Dashboard & Modal
      bg: isDark ? "#0f172a" : "#f8fafc",
      card: isDark ? "#1e293b" : "#ffffff",
      grid: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
      subText: isDark ? "#94a3b8" : "#64748b",
      modelBg: isDark ? "rgb(30, 41, 59)" : "#ffffff",
    };
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeArray }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

