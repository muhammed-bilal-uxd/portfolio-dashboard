import "./App.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import LayoutApp from "./pages/layout/layout";
import { ThemeProvider } from "./pages/ThemeContext/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      {/* <Dashboard /> */}
      <LayoutApp />
    </ThemeProvider>
  );
}

export default App;
