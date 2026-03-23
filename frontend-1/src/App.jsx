import "./App.css";
import LayoutApp from "./pages/layout/layout";
import { ThemeProvider } from "./pages/ThemeContext/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <LayoutApp />
    </ThemeProvider>
  );
}

export default App;
