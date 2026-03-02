import React, { useState } from "react";
import "./layout.css";
import Dashboard from "../Dashboard/Dashboard";
import { useTheme } from "../ThemeContext/ThemeContext";
import PublishSection from "../../components/PublishSection/PublishSection";

export default function OrbitLayout() {
  const { theme: mode, toggleTheme, themeArray } = useTheme();
  const theme = themeArray;
  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [games, setGames] = useState([]);

  const setMode = (modeOrFn) => {
    if (typeof modeOrFn === "function") {
      toggleTheme();
    } else if (
      (modeOrFn === "light" && mode === "dark") ||
      (modeOrFn === "dark" && mode === "light")
    ) {
      toggleTheme();
    }
  };

  const NavItem = ({ label, icon, hasCaret }) => {
    const isActive = active === label;

    return (
      <button
        type="button"
        className={`ol-navItem ${isActive ? "isActive" : ""}`}
        style={{
          color: theme.text,
          background: isActive ? theme.activeBg : "transparent",
        }}
        onClick={() => {
          setActive(label);
          setSidebarOpen(false);
        }}
      >
        <span
          className="ol-navIcon"
          style={{ color: isActive ? theme.text : theme.muted }}
        >
          {icon}
        </span>
        <span className="ol-navLabel">{label}</span>
        {hasCaret ? (
          <span className="ol-caret" style={{ color: theme.muted }}>
            ▾
          </span>
        ) : null}
      </button>
    );
  };

  return (
    <div
      className="ol-app"
      style={{ background: theme.appBg, color: theme.text }}
    >
      {/* Mobile/Tablet Top strip (only visible < 1024px) */}
      <div
        className="ol-mobileTop"
        style={{ background: theme.panelBg, borderColor: theme.stroke }}
      >
        <button
          className="ol-hamburger"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          style={{
            background: theme.chipBg,
            borderColor: theme.stroke,
            color: theme.text,
            padding: 0,
          }}
          type="button"
        >
          ☰
        </button>

        <div className="ol-mobileBrand">
          <span className="ol-mobileBrandIcon">⛓️</span>
          <span className="ol-mobileBrandText">ORBIT</span>
        </div>

        <div className="ol-mobileRight">
          <button
            className="ol-modeMini"
            onClick={() => setMode((m) => (m === "dark" ? "light" : "dark"))}
            style={{
              background: theme.chipBg,
              borderColor: theme.stroke,
              color: theme.text,
              padding: 0,
            }}
            type="button"
          >
            {mode === "dark" ? "🌙" : "☼"}
          </button>
        </div>
      </div>

      {/* Overlay for drawer */}
      {sidebarOpen && (
        <button
          className="ol-overlay"
          style={{ background: theme.overlay }}
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu overlay"
          type="button"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`ol-sidebar ${sidebarOpen ? "isOpen" : ""}`}
        style={{ background: theme.panelBg, borderColor: theme.stroke }}
      >
        <div className="ol-sidebarContent">
          <div className="ol-sidebarHeader">
            <div className="ol-brand">
              <div
                className="ol-brandIcon"
                style={{ borderColor: theme.stroke }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M10.5 13.5L13.5 10.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M7 17a4 4 0 0 1 0-6l2-2a4 4 0 0 1 6 0"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M17 7a4 4 0 0 1 0 6l-2 2a4 4 0 0 1-6 0"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="ol-brandName">ORBIT</div>
            </div>

            <button
              className="ol-close"
              onClick={() => setSidebarOpen(false)}
              style={{
                background: theme.chipBg,
                borderColor: theme.stroke,
                color: theme.text,
                padding: 0,
              }}
              aria-label="Close menu"
              type="button"
            >
              ✕
            </button>
          </div>

          <nav className="ol-nav">
            <NavItem
              label="Dashboard"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
            <NavItem
              label="Projects"
              hasCaret
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
            <NavItem
              label="Employees"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M22 21v-2a4 4 0 0 0-3-3.87"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M16 3.13a4 4 0 0 1 0 7.75"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              }
            />
            <NavItem
              label="Calender"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 3v2M17 3v2M4 7h16M6 5h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              }
            />
          </nav>

          <div className="ol-sidebarBottom">
            <div
              className="ol-themeToggle"
              style={{ background: theme.panel2Bg, borderColor: theme.stroke }}
            >
              <button
                className="ol-pill"
                style={{
                  background: mode === "light" ? theme.activeBg : "transparent",
                  color: theme.text,
                }}
                onClick={() => setMode("light")}
                type="button"
              >
                ☼ <span>Light</span>
              </button>
              <button
                className="ol-pill"
                style={{
                  background: mode === "dark" ? theme.activeBg : "transparent",
                  color: theme.text,
                }}
                onClick={() => setMode("dark")}
                type="button"
              >
                🌙 <span>Dark</span>
              </button>
            </div>

            <button
              className="ol-settings"
              style={{ color: theme.text }}
              onClick={() => setActive("Settings")}
              type="button"
            >
              <span className="ol-navIcon" style={{ color: theme.muted }}>
                ⚙️
              </span>
              <span className="ol-navLabel">Settings</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="ol-main">
        <header
          className="ol-topbar"
          style={{ background: theme.panelBg, borderColor: theme.stroke }}
        >
          <div
            className="ol-dateChip"
            style={{ background: theme.chipBg, borderColor: theme.stroke }}
          >
            16 Feb 2026
          </div>

          <div
            className="ol-search"
            style={{ background: theme.chipBg, borderColor: theme.stroke }}
          >
            <input
              className="ol-searchInput"
              placeholder="Search"
              style={{ color: theme.text }}
            />
            <span className="ol-searchIcon" style={{ color: theme.muted }}>
              🔍
            </span>
          </div>

          <div className="ol-actions">
            <button
              className="ol-actionBtn"
              style={{
                background: theme.chipBg,
                borderColor: theme.stroke,
                color: theme.text,
              }}
              type="button"
            >
              🇺🇸 <span className="ol-actionText">English</span>{" "}
              <span className="ol-actionText">▾</span>
            </button>
            <button
              className="ol-actionIcon"
              style={{
                background: theme.chipBg,
                borderColor: theme.stroke,
                padding: 0,
              }}
              type="button"
              aria-label="Notifications"
            >
              🔔
            </button>
            <div
              className="ol-avatar"
              style={{ background: theme.chipBg, borderColor: theme.stroke }}
              aria-label="Profile"
            >
              <div className="ol-avatarDot" />
            </div>
          </div>
        </header>
        <section className="ol-main-content">
          <section className="ol-publish-content">
            <div className="ol-publish-content-inner">
              <PublishSection games={games} />
            </div>
          </section>
          <section
            className="ol-content"
            style={{ background: theme.panel2Bg, borderColor: theme.stroke }}
          >
            <Dashboard onGamesLoaded={setGames} />
          </section>
        </section>
      </main>
    </div>
  );
}
