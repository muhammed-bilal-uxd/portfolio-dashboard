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
      appBg: isDark ? "#111118" : "#f4f5f7",
      panelBg: isDark ? "#1c1c27" : "#ffffff",
      panel2Bg: isDark ? "#22222f" : "#f3f4f6",
      stroke: isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)",
      text: isDark ? "#e9e9ee" : "#111827",
      muted: isDark ? "rgba(233,233,238,.65)" : "rgba(17,24,39,.65)",
      chipBg: isDark ? "#2a2a3a" : "#eef0f3",
      activeBg: isDark ? "#2c2c3c" : "#e7e9ee",
      overlay: isDark ? "rgba(0,0,0,.55)" : "rgba(0,0,0,.35)",
      // Dashboard & Modal
      bg: isDark ? "#111118" : "#f4f5f7",
      card: isDark ? "#1c1c27" : "#ffffff",
      grid: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
      subText: isDark ? "#9494a8" : "#6b7280",
      modelBg: isDark ? "#1c1c27" : "#ffffff",
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

