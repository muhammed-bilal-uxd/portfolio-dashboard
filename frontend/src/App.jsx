import "./App.css";
import LayoutApp from "./pages/layout/layout";
import { ThemeProvider } from "./pages/ThemeContext/ThemeContext";
import { LoadingProvider } from "./context/LoadingContext";

import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <LoadingProvider>
        <ThemeProvider>
          <LayoutApp />
        </ThemeProvider>
      </LoadingProvider>
    </BrowserRouter>
  );
}

export default App;
