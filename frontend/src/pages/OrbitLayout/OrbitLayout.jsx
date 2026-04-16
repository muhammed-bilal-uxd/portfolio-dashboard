// react
import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

import "./OrbitLayout.css";
import { useTheme } from "../ThemeContext/ThemeContext";
// import PublishSection from "../../components/PublishSection/PublishSection";

//js

import version from "../../version";

// pages
import ProjectPage from "../ProjectPage/ProjectPage";

import "./OrbitLayout.css";
import Dashboard from "../../components/Dashboard/Dashboard";
import AddNewChart from "../../components/AddNewChart/AddNewChart";

const navLinks = [
  {
    label: "project",
    link: "",
    icon: "",
    hasCaret: false,
  },
  // {
  //   label: "dashboard",
  //   link: "dashboard/:id",
  //   icon: "",
  //   hasCaret: false,
  // },
  // {
  //   label: "dashboard",
  //   link: "dashboard",
  //   icon: "",
  //   hasCaret: false,
  // },
];

export default function OrbitLayout() {
  const { theme: mode, toggleTheme } = useTheme();
  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appVersion, setAppVersion] = useState(version || "");

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

  const NavItem = ({ label, icon, hasCaret, link, isActive }) => {
    return (
      <Link to={link}>
        <span
          className="ol-navIcon"
          data-active={isActive ? "true" : "false"}
        >
          {icon}
        </span>
        <span className="ol-navLabel">{label}</span>
        {hasCaret ? (
          <span className="ol-caret">
            ▾
          </span>
        ) : null}
      </Link>
    );
  };

  return (
    <div className="ol-app">
      {/* Mobile/Tablet Top strip (only visible < 1024px) */}
      <div className="ol-mobileTop">
        <button
          className="ol-hamburger ol-mobile-control"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
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
            className="ol-modeMini ol-mobile-control"
            onClick={() => setMode((m) => (m === "dark" ? "light" : "dark"))}
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
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu overlay"
          type="button"
        />
      )}

      {/* Sidebar */}
      <aside className={`ol-sidebar ${sidebarOpen ? "" : "isOpen"}`}>
        <div className="ol-sidebarContent">
          <div className="ol-sidebarHeader">
            <div className="ol-brand">
              <div className="ol-brandIcon">
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
              <div className="version">
                {appVersion ? " - v" + appVersion : "<app version>"}
              </div>
            </div>

            <button
              className="ol-close ol-mobile-control"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
              type="button"
            >
              ✕
            </button>
          </div>

          <nav className="ol-nav">
            {navLinks.map((nav, index) => {
              return (
                <div key={index}>
                  {/* <NavItem
                  key={index}
                  link={nav.link}
                  isActive={nav.link === active}
                  label={nav.label}
                  icon={nav.icon}
                  hasCaret={nav.hasCaret}
                  onClick={setActive(nav.link)}
                /> */}
                  <Link
                    key={index}
                    to={nav.link}
                    onClick={() => setActive(nav.link)}
                  >
                    <div
                      className={`ol-navItem ${
                        nav.link === active ? "ol-navItem-active" : ""
                      }`}
                    >
                      <span className="ol-navIcon">{nav.icon}</span>
                      <span className="ol-navLabel">{nav.label}</span>
                      {nav.hasCaret ? (
                        <span className="ol-caret">
                          ▾
                        </span>
                      ) : null}
                    </div>
                  </Link>
                </div>
              );
            })}
          </nav>

          <div className="ol-sidebarBottom">
            <div className="ol-themeToggle">
              <button
                className={`ol-pill ${mode === "light" ? "ol-pill-active" : ""}`}
                onClick={() => setMode("light")}
                type="button"
              >
                ☼ <span>Light</span>
              </button>
              <button
                className={`ol-pill ${mode === "dark" ? "ol-pill-active" : ""}`}
                onClick={() => setMode("dark")}
                type="button"
              >
                🌙 <span>Dark</span>
              </button>
            </div>

            <button
              className="ol-settings"
              onClick={() => setActive("Settings")}
              type="button"
            >
              <span className="ol-navIcon ol-navIcon-muted">
                ⚙️
              </span>
              <span className="ol-navLabel">Settings</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="ol-main">
        <header className="ol-topbar">
          <div className="topbar-part-1">
            <div className="ol-brandName">ORBIT</div>
            <div className="version">
              {appVersion ? " - v" + appVersion : "<app version>"}
            </div>

            <div>
              <Link to={"/"}>projects</Link>
            </div>

            <div className="switch-mode">
              <span
                className={
                  "cursor-pointer switch-day-night " +
                  (mode === "light" ? "switch-night" : "switch-day")
                }
                onClick={() => setMode(mode === "light" ? "dark" : "light")}
              >
                {mode === "light" ? <>🌙</> : <>☼</>}
              </span>
            </div>

            <div onClick={() => setActive("Settings")}>⚙️</div>
          </div>

          <div className="topbar-part-2">
            <div className="ol-dateChip-container">
              <div className="ol-dateChip">
                16 Feb 2026
              </div>
            </div>

            <div className="ol-search">
              <input
                className="ol-searchInput"
                placeholder="Search"
              />
              <span className="ol-searchIcon">
                🔍
              </span>
            </div>

            <div className="ol-actions">
              <button
                className="ol-actionBtn"
                type="button"
              >
                🇺🇸 <span className="ol-actionText">English</span>{" "}
                <span className="ol-actionText">▾</span>
              </button>
              <button
                className="ol-actionIcon"
                type="button"
                aria-label="Notifications"
              >
                🔔
              </button>
              <div className="ol-avatar" aria-label="Profile">
                <div className="ol-avatarDot" />
              </div>
            </div>
          </div>
        </header>
        <section className="ol-main-content">
          {/* <section className="ol-publish-content">
            <div className="ol-publish-content-inner">
              <PublishSection games={games} />
            </div>
          </section> */}
          <section className="ol-content">
            <Routes>
              <Route path="/" element={<ProjectPage />} />
              <Route path="/dashboard/:id" element={<Dashboard />} />
              <Route path="/add-new-chart/:id" element={<AddNewChart />} />
            </Routes>
          </section>
        </section>
      </main>
    </div>
  );
}
