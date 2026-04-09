import "./App.css";
import LayoutApp from "./pages/layout/layout";
import { ThemeProvider } from "./pages/ThemeContext/ThemeContext";

import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LayoutApp />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
