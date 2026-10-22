import type { WorkspaceConfig, WorkspaceVisibility } from "@itsrighttime/irt-ui/layout";

/** Example navigation previously hardcoded in the library. */
export const workspaceLayoutConfig: WorkspaceConfig = {
  topPrimary: {
    end: [{ type: "icon", icon: "logout", label: "Log Out", id: "logout" }],
  },
  leftPrimary: {
    start: [
      { type: "icon", icon: "home", label: "Home", id: "home", route: "/workspace/" },
      { type: "icon", icon: "fileText", label: "Documents", id: "documents", route: "/workspace/documents" },
      { type: "icon", icon: "target", label: "Lead Management", id: "lead-management", route: "/workspace/lead/" },
    ],
    end: [{ type: "icon", icon: "userCircle", label: "Profile", id: "profile", route: "/workspace/user/profile" }],
  },
  leftSidebar: [
    {
      id: "contactus",
      type: "group",
      title: "Contact Us",
      children: [{ type: "label", id: "contactus.list", route: "contactus/list", text: "List" }],
      collapsible: true,
      defaultOpen: true,
    },
    {
      id: "user-management",
      type: "group",
      title: "User Management",
      children: [
        { type: "label", id: "user/create", route: "user/create", text: "Create Account" },
        { type: "label", id: "user/list", route: "user/list", text: "Accounts" },
        { type: "label", id: "user/update", route: "user/update", text: "Update Account" },
      ],
      collapsible: true,
      defaultOpen: true,
    },
  ],
};

/** Example context-aware visibility previously in `ws.visibility.ts`. */
export const workspaceVisibility: WorkspaceVisibility = {
  alwaysVisible: ["logout", "profile", "home", "documents", "lead-management"],
  map: {
    documents: ["documents"],
    home: [],
    "lead-management": ["lead-management", "user-management", "user/create", "user/list", "user/update"],
  },
  initialTab: "home",
};
