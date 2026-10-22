import type { ThemeLayout } from "../types";

export const layout: ThemeLayout = {
  container: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px" },
  breakpoints: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px" },
  gridGap: { sm: "0.5rem", md: "1rem", lg: "1.5rem" },
  zIndex: {
    base: "0",
    dropdown: "1000",
    sticky: "1100",
    drawer: "1200",
    modal: "1300",
    popover: "1400",
    toast: "1500",
    tooltip: "1600",
  },
  control: {
    height: { small: "32px", medium: "40px", large: "48px" },
    width: "300px",
  },
  workspace: {
    barSize: "40px",
    sidebarSize: "200px",
    tabPadding: "5px",
  },
};
