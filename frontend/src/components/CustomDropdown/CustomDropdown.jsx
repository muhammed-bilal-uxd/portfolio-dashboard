import React from "react";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

/**
 * CustomDropdown
 * Fully keyboard-accessible drop-down conforming to Architectural Lens Design System AA.
 * Internally utilizes MUI's highly accessible Select component with exact styling requirements.
 */
function CustomDropdown({
  options = [],
  value,
  onChange,
  headerLabel = "",
  placeholder = "Select...",
  disabled = false,
  className = "",
}) {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 1 }} className={className}>
      {headerLabel && (
        <label
          style={{
            fontSize: "0.875rem", /* text-sm */
            fontWeight: 500,
            color: "var(--color-on-surface-variant)",
            fontFamily: "var(--font-body)",
          }}
        >
          {headerLabel}
        </label>
      )}
      <FormControl fullWidth size="small" disabled={disabled}>
        {/* We rely on the MUI OutlinedInput styling baked into muiTheme.js */}
        <Select
          value={value}
          onChange={handleChange}
          displayEmpty
          IconComponent={ExpandMoreIcon} // Sleek standard vector instead of default
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: "rgba(25, 26, 26, 0.8)", // Glassmorphism backdrop
                backdropFilter: "blur(20px)",
                borderRadius: "12px",
                border: "1px solid var(--color-outline-variant)",
                boxShadow: "0 0 40px -10px rgba(0,0,0,0.4)",
              },
            },
          }}
          sx={{
            "& .MuiSelect-select": {
              color: value === "" ? "var(--color-placeholder)" : "var(--color-on-surface)",
              fontFamily: "var(--font-body)",
            },
          }}
        >
          {placeholder && (
            <MenuItem value="" disabled>
              <em>{placeholder}</em>
            </MenuItem>
          )}
          {options.map((opt, idx) => {
            // Support both array of strings OR array of simple objects {value, label, disabled}
            const isObj = typeof opt === "object" && opt !== null;
            const itemVal = isObj ? opt.value : opt;
            const itemLabel = isObj ? opt.label : opt;
            const itemDisabled = isObj ? !!opt.disabled : false;

            return (
              <MenuItem key={idx} value={itemVal} disabled={itemDisabled}>
                {itemLabel}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}

export default CustomDropdown;
