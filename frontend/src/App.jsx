import "./App.css";
import { ThemeProvider as AppThemeProvider, useTheme } from "./pages/ThemeContext/ThemeContext";
import { LoadingProvider } from "./context/LoadingContext";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useMemo } from "react";
import { buildMuiTheme } from "./theme/muiTheme";

import { BrowserRouter } from "react-router-dom";
import OrbitLayout from "./pages/OrbitLayout/OrbitLayout";

/** Inner bridge: reads the app theme mode → builds & applies MUI theme */
function MuiBridge({ children }) {
  const { theme: mode } = useTheme();
  const muiTheme = useMemo(() => buildMuiTheme(mode), [mode]);
  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme />
      {children}
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LoadingProvider>
        <AppThemeProvider>
          <MuiBridge>
            <OrbitLayout />
          </MuiBridge>
        </AppThemeProvider>
      </LoadingProvider>
    </BrowserRouter>
  );
}

export default App;
