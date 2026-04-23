import { createTheme } from "@mui/material/styles";

/**
 * Creates a Material UI theme for the given mode.
 * AntiGravity Design System - Architectural Lens.
 * Matches CSS variables defined in index.css.
 */
export function buildMuiTheme(mode) {
  const isDark = mode === "dark";

  // Tokens
  const surface = isDark ? "#0E0E0E" : "#FFFFFF";
  const surfaceContainer = isDark ? "#191A1A" : "#F1F3F4";
  const surfaceContainerLow = isDark ? "#131313" : "#F8F9FA";
  const surfaceContainerHighest = isDark ? "#252626" : "#DADCE0";

  const onSurface = isDark ? "#C6C6C7" : "#1F1F1F";
  const onSurfaceVariant = isDark ? "#B0B0B0" : "#5F6368";
  const tertiary = "#679CFF"; // Accent
  const errorColor = "#EC7C8A";
  
  const disabledBg = isDark ? "#252626" : "#E8EAED";
  const disabledText = isDark ? "#888888" : "#767676";

  const outlineVariant = "#484848";

  return createTheme({
    palette: {
      mode,

      // Maps MUI's "primary" to our "tertiary" UI accent
      primary: {
        main: tertiary,
        contrastText: "#1F1F1F", // Dark text on light blue accent
      },

      // Maps MUI's "secondary" to our "primary" text-level accent
      secondary: {
        main: "#C6C6C7",
        contrastText: "#1F1F1F",
      },

      error: {
        main: errorColor,
        contrastText: "#1F1F1F",
      },

      background: {
        default: surfaceContainerLow,
        paper: surfaceContainer,
      },

      text: {
        primary: onSurface,
        secondary: onSurfaceVariant,
        disabled: disabledText,
      },

      divider: outlineVariant,
    },

    shape: {
      borderRadius: 12, // xl for main containers (0.75rem = 12px)
    },

    typography: {
      fontFamily: `"Inter", ui-sans-serif, system-ui, sans-serif`,
      fontWeightMedium: 500,
      fontWeightSemiBold: 600,
      button: {
        textTransform: "none",
        fontWeight: 600,
        fontFamily: `"Inter", ui-sans-serif, system-ui, sans-serif`,
      },
      // Override headlines to Manrope
      h1: { fontFamily: `"Manrope", ui-sans-serif, system-ui, sans-serif`, fontWeight: 800 },
      h2: { fontFamily: `"Manrope", ui-sans-serif, system-ui, sans-serif`, fontWeight: 700 },
      h3: { fontFamily: `"Manrope", ui-sans-serif, system-ui, sans-serif`, fontWeight: 600 },
      h4: { fontFamily: `"Manrope", ui-sans-serif, system-ui, sans-serif`, fontWeight: 600 },
    },

    components: {
      /* ── Button ── */
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 9999, // Curved CTA (pill-shaped) from docs
            paddingLeft: "24px",
            paddingRight: "24px",
            fontSize: "0.875rem",
            textTransform: "none",
          },
          containedPrimary: {
            background: tertiary,
            borderTop: "1px solid rgba(255,255,255,0.3)", // The 3D inner-glow detail
            color: "#1F1F1F",
            "&:hover": {
              background: "#4f7cd1", // slightly darker
            },
          },
          outlinedSecondary: {
            borderColor: outlineVariant,
            color: onSurfaceVariant,
            "&:hover": {
              backgroundColor: "rgba(198, 198, 199, 0.08)",
              borderColor: onSurfaceVariant,
            },
          },
          outlinedError: {
            borderColor: "rgba(236,124,138,0.5)",
            color: errorColor,
            "&:hover": {
              backgroundColor: "rgba(236,124,138,0.08)",
            },
          },
          textInherit: {
            color: onSurfaceVariant,
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.05)",
            },
          },
        },
      },

      /* ── TextField ── */
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
          size: "small",
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8, // md config for internals
            backgroundColor: surfaceContainerHighest,
            color: onSurface,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: tertiary,
              borderWidth: "2px",
            },
          },
          notchedOutline: {
            borderWidth: "1px",
            borderColor: `rgba(72,72,72, 0.15)`, // ghost border fallback
          },
          input: {
            "&::placeholder": {
              color: disabledText,
              opacity: 1,
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: onSurfaceVariant,
            fontFamily: `"Inter", ui-sans-serif, system-ui, sans-serif`,
            fontSize: "0.875rem",
            "&.Mui-focused": {
              color: tertiary,
            },
          },
        },
      },

      /* ── Card / Paper ── */
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none", 
            backgroundColor: surfaceContainer,
            color: onSurface,
            borderRadius: 12, // xl config
            boxShadow: "none", // Ambient shadows managed manually where applied
          },
        },
      },

      /* ── Dialog ── */
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: surfaceContainer,
            color: onSurface,
            borderRadius: 12,
            boxShadow: "0 0 40px -10px rgba(0,0,0,0.4)", // Level 3 shadow
          },
        },
      },

      /* ── Accordion ── */
      MuiAccordion: {
        styleOverrides: {
          root: {
            backgroundColor: surfaceContainer,
            color: onSurface,
            borderRadius: "12px !important",
            "&:before": { display: "none" },   // remove the divider line MUI adds
            boxShadow: "none", 
            "&.Mui-expanded": {
              margin: '0 !important',
            },
          },
        },
      },
      MuiAccordionSummary: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            "&.Mui-expanded": {
              minHeight: "48px",
            },
          },
          content: {
            "&.Mui-expanded": {
              margin: "12px 0",
            },
          },
        },
      },

      /* ── Menu ── */
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: "rgba(25, 26, 26, 0.8)", // glassmorphism 80%
            backdropFilter: "blur(20px)",
            borderRadius: 12,
            boxShadow: "0 0 40px -10px rgba(0,0,0,0.4)", // Level 3 shadow
            border: "none",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontFamily: `"Inter", ui-sans-serif, system-ui, sans-serif`,
            fontSize: "0.875rem",
            color: onSurface,
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.06)",
            },
          },
        },
      },
    },
  });
}
