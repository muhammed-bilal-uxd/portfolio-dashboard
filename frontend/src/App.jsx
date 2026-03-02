import "./App.css";
import Dashboard from "./pages/Dashboard";
import LayoutApp from "./pages/layout";
import { ThemeProvider } from "./pages/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      {/* <Dashboard /> */}
      <LayoutApp />
    </ThemeProvider>
  );
}

export default App;
