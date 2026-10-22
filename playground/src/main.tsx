import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@itsrighttime/irt-ui/styles.css";
import "./playground.css";
import { App } from "./App";
import { PlaygroundThemeProvider } from "./state/themeStore";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <PlaygroundThemeProvider>
      <App />
    </PlaygroundThemeProvider>
  </StrictMode>,
);
