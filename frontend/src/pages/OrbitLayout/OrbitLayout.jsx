// react
import React, { useState } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";

import "./OrbitLayout.css";
import { useTheme } from "../ThemeContext/ThemeContext";
// import PublishSection from "../../components/PublishSection/PublishSection";

//js

import version from "../../version";

// icons
import LanguageIcon from "@mui/icons-material/Language";
import SearchIcon from "@mui/icons-material/Search";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import BusinessIcon from "@mui/icons-material/Business";
import { Avatar, Tooltip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button as MuiButton } from "@mui/material";

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
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appVersion, setAppVersion] = useState(version || "");
  const [showConfirmHome, setShowConfirmHome] = useState(false);

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (location.pathname.includes("add-new-chart")) {
      setShowConfirmHome(true);
    } else {
      navigate("/");
    }
  };

  const confirmNavigateHome = () => {
    setShowConfirmHome(false);
    navigate("/");
  };

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
            <div className="ol-brand" style={{ cursor: 'pointer' }} onClick={handleHomeClick}>
              <div className="ol-brandIcon-modern">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="8" height="8" rx="2" fill="var(--color-tertiary)" />
                  <rect x="13" y="3" width="8" height="8" rx="2" fill="var(--color-on-surface-variant)" opacity="0.6" />
                  <rect x="3" y="13" width="8" height="8" rx="2" fill="var(--color-on-surface-variant)" opacity="0.6" />
                  <rect x="13" y="13" width="8" height="8" rx="2" fill="var(--color-tertiary)" />
                </svg>
              </div>
              <div className="ol-brandName-modern">BENTO</div>
              <div className="version-badge">
                {appVersion ? "v" + appVersion : "v1.0"}
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
        <header className="ol-topbar-modern">
          <div className="topbar-left">
            <div className="topbar-logo" style={{ cursor: 'pointer' }} onClick={handleHomeClick}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="8" height="8" rx="2" fill="var(--color-tertiary)" />
                <rect x="13" y="3" width="8" height="8" rx="2" fill="var(--color-on-surface-variant)" opacity="0.6" />
                <rect x="3" y="13" width="8" height="8" rx="2" fill="var(--color-on-surface-variant)" opacity="0.6" />
                <rect x="13" y="13" width="8" height="8" rx="2" fill="var(--color-tertiary)" />
              </svg>
            </div>
            
            <div className="version-tag">
              GIT-MODERN-V{appVersion}
            </div>
          </div>

          <div className="topbar-right">
            <div className="action-pill language-pill">
              <LanguageIcon sx={{ fontSize: 18 }} />
              <span>English</span>
              <KeyboardArrowDownIcon sx={{ fontSize: 14 }} />
            </div>

            <div className="action-icons">
              <Tooltip title="Search">
                <IconButton size="small" sx={{ color: 'var(--color-on-surface-variant)' }}>
                  <SearchIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Support">
                <IconButton size="small" sx={{ color: 'var(--color-on-surface-variant)' }}>
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Notifications">
                <IconButton size="small" sx={{ color: 'var(--color-on-surface-variant)' }}>
                  <NotificationsNoneIcon />
                </IconButton>
              </Tooltip>
            </div>

            <div className="theme-toggle-capsule" onClick={toggleTheme}>
              <div className={`theme-thumb ${mode === 'dark' ? 'is-dark' : 'is-light'}`}>
                {mode === 'dark' ? <DarkModeIcon sx={{ fontSize: 14 }} /> : <WbSunnyIcon sx={{ fontSize: 14 }} />}
              </div>
              <WbSunnyIcon sx={{ fontSize: 16, opacity: mode === 'light' ? 1 : 0.4 }} />
              <DarkModeIcon sx={{ fontSize: 16, opacity: mode === 'dark' ? 1 : 0.4 }} />
            </div>

            <Avatar 
              sx={{ 
                width: 32, 
                height: 32, 
                border: '1px solid var(--color-outline-variant)',
                cursor: 'pointer'
              }} 
            />
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
      <Dialog
        open={showConfirmHome}
        onClose={() => setShowConfirmHome(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            backgroundColor: 'var(--color-surface-container)',
            backgroundImage: 'none',
            border: '1px solid var(--color-outline-variant)'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Discard Progress?</DialogTitle>
        <DialogContent>
          Are you sure you want to leave? Your chart configuration progress will be lost.
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <MuiButton 
            onClick={() => setShowConfirmHome(false)}
            sx={{ borderRadius: '8px', color: 'var(--color-on-surface-variant)' }}
          >
            Stay Here
          </MuiButton>
          <MuiButton 
            onClick={confirmNavigateHome}
            variant="contained"
            color="error"
            sx={{ borderRadius: '8px' }}
          >
            Discard & Go Home
          </MuiButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
