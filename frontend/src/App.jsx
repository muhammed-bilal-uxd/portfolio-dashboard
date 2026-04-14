import "./App.css";
import { ThemeProvider } from "./pages/ThemeContext/ThemeContext";
import { LoadingProvider } from "./context/LoadingContext";

import { BrowserRouter } from "react-router-dom";
import OrbitLayout from "./pages/OrbitLayout/OrbitLayout";

function App() {
  return (
    <BrowserRouter>
      <LoadingProvider>
        <ThemeProvider>
          <OrbitLayout />
        </ThemeProvider>
      </LoadingProvider>
    </BrowserRouter>
  );
}

export default App;
