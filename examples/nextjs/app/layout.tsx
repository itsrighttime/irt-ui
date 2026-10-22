import type { ReactNode } from "react";
import "@itsrighttime/irt-ui/styles.css";
import { ThemeProvider } from "@itsrighttime/irt-ui/theme";
import { theme } from "./theme";

export const metadata = { title: "irt-ui · Next.js example" };

// Server component: ThemeProvider is a client component and renders its CSS
// variables into the server HTML (no flash, no hydration mismatch).
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme} defaultMode="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
