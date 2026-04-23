// react
import React, { useState } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";

import "./OrbitLayout.css";
import { useTheme } from "../ThemeContext/ThemeContext";
// import PublishSection from "../../components/PublishSection/PublishSection";

//js

import version from "../../version";

// icons
import SearchIcon from "@mui/icons-material/Search";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import BusinessIcon from "@mui/icons-material/Business";
import MenuIcon from "@mui/icons-material/Menu";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { Avatar, Tooltip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button as MuiButton, Box, Menu, MenuItem, Typography, Divider, Stack } from "@mui/material";

import LanguageIcon from "@mui/icons-material/Language";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// pages
import ProjectPage from "../ProjectPage/ProjectPage";

const getFormattedDate = () => {
  const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
  return new Date().toLocaleDateString('en-GB', options);
};


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
  const [profileAnchor, setProfileAnchor] = useState(null);

  const handleProfileOpen = (e) => setProfileAnchor(e.currentTarget);
  const handleProfileClose = () => setProfileAnchor(null);

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
      {/* Main Container */}

      {/* Main */}
      <main className="ol-main">
        <header className="header">
          <div className="header-inner">
            <div className="topbar-left">
              <IconButton size="small" sx={{ color: 'var(--color-on-surface)', display: { xs: 'flex', md: 'none' } }}>
                <MenuIcon />
              </IconButton>

              <Box className="topbar-logo" sx={{ cursor: 'pointer', display: { xs: 'none', md: 'flex' }, alignItems: 'center' }} onClick={handleHomeClick}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="8" height="8" rx="2" fill="var(--color-tertiary)" />
                  <rect x="13" y="3" width="8" height="8" rx="2" fill="var(--color-on-surface-variant)" opacity="0.6" />
                  <rect x="3" y="13" width="8" height="8" rx="2" fill="var(--color-on-surface-variant)" opacity="0.6" />
                  <rect x="13" y="13" width="8" height="8" rx="2" fill="var(--color-tertiary)" />
                </svg>
              </Box>
              
              <div className="version-tag" style={{ display: 'flex' }}>
                <AccountTreeIcon sx={{ fontSize: 14, mr: 0.5, opacity: 0.8 }} />
                V{appVersion}
              </div>
            </div>

            <div className="topbar-right">
              {/* Date Pill - PC Only */}
              <Box className="header-date-pill" sx={{ display: { xs: 'none', md: 'flex' }, mr: 3 }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-on-surface)', opacity: 0.8 }}>
                  {getFormattedDate()}
                </Typography>
              </Box>

              {/* Language Selector - PC Only */}
              <Box className="header-tool-item" sx={{ display: { xs: 'none', md: 'flex' }, mr: 2.5 }}>
                <LanguageIcon sx={{ fontSize: 20, mr: 1, opacity: 0.8 }} />
                <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-on-surface)' }}>
                  English
                </Typography>
                <ExpandMoreIcon sx={{ fontSize: 18, ml: 0.5, opacity: 0.5 }} />
              </Box>

              {/* Action Icons - PC Only */}
              <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }}>
                <IconButton size="small" sx={{ color: 'var(--color-on-surface)', opacity: 0.7 }}>
                  <SearchIcon sx={{ fontSize: 22 }} />
                </IconButton>
                <IconButton size="small" sx={{ color: 'var(--color-on-surface)', opacity: 0.7 }}>
                  <NotificationsNoneIcon sx={{ fontSize: 22 }} />
                </IconButton>
              </Stack>

              {/* Theme Toggle Pill - PC Only */}
              <Box 
                className="header-theme-toggle" 
                onClick={toggleTheme}
                sx={{ 
                  display: { xs: 'none', md: 'flex' }, 
                  mr: 2.5,
                  cursor: 'pointer'
                }}
              >
                <WbSunnyIcon sx={{ fontSize: 16, mr: 1, color: mode === 'light' ? 'var(--color-tertiary)' : 'var(--color-on-surface-variant)' }} />
                <div className={`theme-switch-track ${mode === 'dark' ? 'is-dark' : 'is-light'}`}>
                   <div className="theme-switch-thumb">
                      {mode === 'dark' ? <DarkModeIcon sx={{ fontSize: 12, color: '#fff' }} /> : null}
                   </div>
                </div>
              </Box>

              <Avatar
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"
                onClick={handleProfileOpen}
                sx={{
                  width: 38,
                  height: 38,
                  border: '1.5px solid var(--color-outline-variant)',
                  cursor: 'pointer',
                  ml: 1
                }}
              />
            </div>
          </div>
        </header>

        {/* Profile Menu */}
        <Menu
          anchorEl={profileAnchor}
          open={Boolean(profileAnchor)}
          onClose={handleProfileClose}
          onClick={handleProfileClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          slotProps={{
            paper: {
              className: "profile-menu-paper",
              sx: {
                mt: 1.5,
                width: 240,
                overflow: 'visible',
                filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.15))',
                borderRadius: '16px',
                bgcolor: 'var(--color-surface-container-high)',
                backgroundImage: 'none',
                border: '1px solid var(--color-outline-variant)',
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1.5,
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: 'var(--color-on-surface)',
                  borderRadius: '10px',
                  mx: 1,
                  my: 0.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'var(--color-surface-container-highest)',
                  }
                }
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-on-surface)' }}>Muhammed Bilal</Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: 'var(--color-on-surface-variant)' }}>uxdesigner@bento.com</Typography>
          </Box>
          
          <Divider sx={{ my: 1, borderColor: 'var(--color-outline-variant)', opacity: 0.5 }} />
          
          <MenuItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={(e) => { e.stopPropagation(); toggleTheme(); }}>
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {mode === 'dark' ? <DarkModeIcon fontSize="small" /> : <WbSunnyIcon fontSize="small" />}
                <span>Theme</span>
             </Box>
             <div className="theme-toggle-mini">
                <div className={`theme-thumb-mini ${mode === 'dark' ? 'is-dark' : 'is-light'}`} />
             </div>
          </MenuItem>

          <MenuItem>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <PersonOutlineIcon fontSize="small" />
              <span>My Profile</span>
            </Box>
          </MenuItem>

          <MenuItem>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <SettingsIcon fontSize="small" />
              <span>Settings</span>
            </Box>
          </MenuItem>

          <Divider sx={{ my: 1, borderColor: 'var(--color-outline-variant)', opacity: 0.5 }} />

          <MenuItem sx={{ color: 'var(--color-error) !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <LogoutIcon fontSize="small" />
              <span>Log out</span>
            </Box>
          </MenuItem>
        </Menu>
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
            borderRadius: '24px',
            backgroundColor: 'var(--color-surface-container-high)',
            backgroundImage: 'none',
            border: '1px solid var(--color-outline-variant)',
            p: 1,
            boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '1.5rem', pb: 1 }}>
          Discard Progress?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'var(--color-on-surface-variant)', fontWeight: 500 }}>
            Are you sure you want to leave? Your chart configuration progress will be lost.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
          <MuiButton
            onClick={() => setShowConfirmHome(false)}
            sx={{
              borderRadius: '12px',
              color: 'var(--color-on-surface-variant)',
              fontWeight: 600,
              textTransform: 'none',
              px: 2,
              "&:hover": { bgcolor: 'var(--color-surface-container-highest)' }
            }}
          >
            Stay Here
          </MuiButton>
          <MuiButton
            onClick={confirmNavigateHome}
            variant="contained"
            color="error"
            sx={{
              borderRadius: '12px',
              fontWeight: 700,
              textTransform: 'none',
              px: 3,
              py: 1.25,
              boxShadow: '0 4px 12px rgba(255, 0, 0, 0.2)',
            }}
          >
            Discard & Go Home
          </MuiButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
