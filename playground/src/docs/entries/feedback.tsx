import { useState } from "react";
import {
  Alert,
  AlertContainer,
  Badge,
  Button,
  ErrorMsg,
  ErrorPage,
  IconError,
  Loading,
  LoadingBorder,
  Tooltip,
  type AlertItem,
  type AlertPosition,
  type AlertType,
  type BadgeTone,
  type LoaderType,
} from "@itsrighttime/irt-ui/atoms";
import type { IconName } from "@itsrighttime/irt-ui/icons";
import { useLog } from "../../state/events";
import { changed, jsx } from "../jsx";
import type { Control, ControlValues, DocEntry } from "../types";

const alertControls: Control[] = [
  { type: "select", name: "type", default: "success", options: ["success", "info", "warning", "error"], group: "Content" },
  { type: "text", name: "title", default: "Changes saved", group: "Content" },
  { type: "text", name: "message", default: "Your profile is now visible to your team.", group: "Content" },
  { type: "boolean", name: "action", label: "action (Undo)", default: false, group: "Content" },
  { type: "boolean", name: "icon", default: true, group: "Appearance" },
  { type: "boolean", name: "dismissible", default: true, group: "Behavior" },
  { type: "number", name: "duration", label: "duration (s)", default: 0, min: 0, max: 15, group: "Behavior", hint: "0 = stays until dismissed; hover pauses the timer" },
  { type: "select", name: "position", default: "top-right", options: ["top-right", "top-left", "top-center", "bottom-right", "bottom-left", "bottom-center"], group: "AlertContainer" },
];

function AlertsDemo({ v }: { v: ControlValues }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [inlineKey, setInlineKey] = useState(0);
  const log = useLog();
  const add = (type: AlertType) =>
    setAlerts((list) => [
      ...list,
      {
        id: `${Date.now()}-${Math.random()}`,
        type,
        title: `${type[0]?.toUpperCase()}${type.slice(1)}`,
        message: "Something happened in the background.",
        duration: (Number(v.duration) || 5) * 1000,
      },
    ]);
  return (
    <div className="pg-stack pg-alert-demo">
      <Alert
        key={inlineKey}
        type={v.type as AlertType}
        title={String(v.title) || undefined}
        message={String(v.message)}
        icon={Boolean(v.icon)}
        dismissible={Boolean(v.dismissible)}
        duration={Number(v.duration) * 1000}
        action={
          v.action ? (
            <Button size="small" variant="secondary" onClick={() => log("action.onClick")}>
              Undo
            </Button>
          ) : undefined
        }
        onDismiss={() => {
          log("onDismiss");
          setTimeout(() => setInlineKey((k) => k + 1), 800);
        }}
      />
      <div className="pg-row">
        <span className="pg-muted">Toast stack:</span>
        {(["success", "info", "warning", "error"] as const).map((t) => (
          <Button key={t} size="small" variant="ghost" onClick={() => add(t)}>
            {t}
          </Button>
        ))}
      </div>
      <AlertContainer
        position={v.position as AlertPosition}
        alertContainer={alerts}
        removeAlert={(id) => {
          log("removeAlert", id);
          setAlerts((list) => list.filter((a) => a.id !== id));
        }}
      />
    </div>
  );
}

const badgeControls: Control[] = [
  { type: "text", name: "children", label: "children", default: "Active", group: "Content" },
  { type: "select", name: "icon", default: "none", options: ["none", "check", "clock", "alertTriangle", "star"], group: "Content" },
  { type: "boolean", name: "dot", default: false, group: "Content" },
  { type: "select", name: "tone", default: "success", options: ["neutral", "primary", "success", "warning", "danger", "info"], group: "Appearance", libDefault: "neutral" },
  { type: "select", name: "variant", default: "soft", options: ["soft", "solid", "outline"], group: "Appearance" },
  { type: "select", name: "size", default: "medium", options: ["small", "medium"], group: "Appearance" },
  { type: "color", name: "color", default: "", group: "Appearance", hint: "Overrides tone" },
];

const loadingControls: Control[] = [
  { type: "select", name: "type", default: "CubesLoader", options: ["CubesLoader", "FoldingLoader", "BounceLoader", "PulseLoader", "LoadingChat"], group: "Appearance" },
  { type: "select", name: "color", default: "theme", options: ["theme", "var(--irt-color-secondary)", "var(--irt-color-danger)", "#7c3aed"], group: "Appearance" },
  { type: "boolean", name: "showText", default: true, group: "Content" },
  { type: "text", name: "text", default: "Loading", libDefault: "Loading", group: "Content" },
  { type: "select", name: "display", default: "center", options: ["center", "top"], group: "Layout" },
];

const borderControls: Control[] = [{ type: "boolean", name: "loading", default: true, group: "State" }];

const tooltipControls: Control[] = [
  { type: "text", name: "content", default: "Copies the link to your clipboard", group: "Content" },
  { type: "number", name: "delay", default: 300, min: 0, max: 2000, step: 100, group: "Behavior" },
  { type: "text", name: "width", default: "240px", group: "Appearance", hint: "Max width before wrapping" },
  { type: "color", name: "backgroundColor", default: "", group: "Appearance" },
  { type: "color", name: "color", default: "", group: "Appearance" },
];

const errorMsgControls: Control[] = [
  { type: "text", name: "message", default: "This field is required", group: "Content" },
  { type: "boolean", name: "bold", default: true, group: "Appearance" },
  { type: "number", name: "fontSize", default: 0.8, min: 0.6, max: 1.5, step: 0.1, group: "Appearance" },
  { type: "select", name: "textAlign", default: "left", options: ["left", "center", "right"], group: "Appearance" },
  { type: "text", name: "padding", default: "10px", libDefault: "10px", group: "Appearance" },
];

const iconErrorControls: Control[] = [
  { type: "select", name: "icon", default: "inbox", options: ["inbox", "imageOff", "videoOff", "wifiOff", "alertTriangle", "search"], group: "Content" },
  { type: "text", name: "message", default: "Nothing to show yet", group: "Content" },
  { type: "number", name: "size", default: 2, min: 1, max: 5, step: 0.5, group: "Appearance" },
  { type: "text", name: "width", default: "280px", group: "Appearance" },
  { type: "text", name: "height", default: "180px", group: "Appearance" },
];

const errorPageControls: Control[] = [
  { type: "select", name: "statusCode", default: "404", options: ["400", "401", "403", "404", "500", "502", "503", "504"], group: "Content" },
  { type: "text", name: "title", default: "", group: "Content", placeholder: "derived from status" },
  { type: "text", name: "errorMsg", default: "not found", libDefault: "not found", group: "Content" },
  { type: "text", name: "statusDetail", default: "", group: "Content", placeholder: "none" },
  { type: "text", name: "navigateTo", default: "Home Page", libDefault: "Home Page", group: "Content" },
  { type: "boolean", name: "actions", label: "actions (Try again)", default: true, group: "Content" },
  { type: "color", name: "color", default: "", group: "Appearance" },
  { type: "select", name: "as", default: "section", options: ["main", "section", "div"], group: "Layout", hint: "Use section/div inside an app shell" },
];

function ErrorPageDemo({ v }: { v: ControlValues }) {
  const log = useLog();
  return (
    <div className="pg-frame">
      <ErrorPage
        as={v.as as "section"}
        fullHeight={false}
        statusCode={String(v.statusCode)}
        title={String(v.title) || undefined}
        errorMsg={String(v.errorMsg)}
        statusDetail={String(v.statusDetail) || null}
        navigateTo={String(v.navigateTo)}
        color={String(v.color) || undefined}
        handleNavigate="/"
        onNavigate={(href) => log("onNavigate", href)}
        actions={
          v.actions ? (
            <Button size="small" iconLeft="refresh" onClick={() => log("Try again")}>
              Try again
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}

export const feedbackEntries: DocEntry[] = [
  {
    id: "alert",
    title: "Alert",
    group: "Feedback",
    description:
      "Notification with a type icon, optional title and action, and an auto-dismiss progress bar that pauses on hover/focus. `AlertContainer` renders a fixed stack (six positions) from your alert list.",
    imports: 'import { Alert, AlertContainer, type AlertItem } from "@itsrighttime/irt-ui";',
    components: ["Alert", "AlertContainer"],
    controls: alertControls,
    render: (v) => <AlertsDemo v={v} />,
    code: (v) =>
      [
        jsx("Alert", [
          ["type", v.type],
          ...changed(alertControls, v, ["title", "icon", "dismissible"]),
          ["message", v.message],
          ["duration", Number(v.duration) * 1000],
          ["action", v.action ? '{<Button size="small" variant="secondary">Undo</Button>}' : undefined],
          ["onDismiss", "{close}"],
        ]),
        "",
        "// Toasts: keep a list and render one container at the app root",
        "const [alerts, setAlerts] = useState<AlertItem[]>([]);",
        "const notify = (message: string, type: AlertType) =>",
        "  setAlerts((list) => [...list, { id: crypto.randomUUID(), message, type }]);",
        "",
        jsx("AlertContainer", [
          ["position", v.position === "top-right" ? undefined : v.position],
          ["alertContainer", "{alerts}"],
          ["removeAlert", "{(id) => setAlerts((list) => list.filter((a) => a.id !== id))}"],
        ]),
      ].join("\n"),
  },
  {
    id: "badge",
    title: "Badge",
    group: "Feedback",
    description: "Small status label or count with six tones, three variants, an optional icon or status dot. Server-component safe.",
    imports: 'import { Badge } from "@itsrighttime/irt-ui";',
    controls: badgeControls,
    render: (v) => (
      <Badge
        tone={v.tone as BadgeTone}
        variant={v.variant as "soft"}
        size={v.size as "medium"}
        dot={Boolean(v.dot)}
        icon={v.icon === "none" ? undefined : (v.icon as IconName)}
        color={String(v.color) || undefined}
      >
        {String(v.children)}
      </Badge>
    ),
    code: (v) => jsx("Badge", changed(badgeControls, v, ["tone", "variant", "size", "dot", "icon", "color"]).map(([n, x]) => [n, n === "icon" && x === "none" ? undefined : x] as [string, unknown]), String(v.children)),
    examples: [
      {
        title: "Tones",
        render: () => (
          <>
            {(["neutral", "primary", "success", "warning", "danger", "info"] as const).map((tone) => (
              <Badge key={tone} tone={tone}>
                {tone}
              </Badge>
            ))}
          </>
        ),
        code: '<Badge tone="success">Active</Badge>\n<Badge tone="danger">Suspended</Badge>',
      },
      {
        title: "Variants",
        render: () => (
          <>
            <Badge tone="primary">Soft</Badge>
            <Badge tone="primary" variant="solid">
              Solid
            </Badge>
            <Badge tone="primary" variant="outline">
              Outline
            </Badge>
          </>
        ),
        code: '<Badge tone="primary" variant="solid">Solid</Badge>',
      },
      {
        title: "Status and counts",
        render: () => (
          <>
            <Badge tone="success" dot>
              Online
            </Badge>
            <Badge tone="warning" icon="clock">
              Pending
            </Badge>
            <Badge tone="danger" variant="solid" size="small">
              12
            </Badge>
          </>
        ),
        code: '<Badge tone="success" dot>Online</Badge>\n<Badge tone="warning" icon="clock">Pending</Badge>\n<Badge tone="danger" variant="solid" size="small">12</Badge>',
      },
    ],
  },
  {
    id: "loading",
    title: "Loading",
    group: "Feedback",
    description: "Five loader styles with optional animated text (`role=\"status\"`). The individual loaders (`CubesLoader`, …) are exported too. Animations slow down under `prefers-reduced-motion`.",
    imports: 'import { Loading } from "@itsrighttime/irt-ui";',
    controls: loadingControls,
    render: (v) => (
      <div style={{ position: "relative", height: 220, width: "100%" }}>
        <Loading
          type={v.type as LoaderType}
          showText={Boolean(v.showText)}
          text={String(v.text)}
          color={v.color === "theme" ? undefined : String(v.color)}
          display={v.display as "center"}
          position="absolute"
        />
      </div>
    ),
    code: (v) =>
      jsx("Loading", [
        ...changed(loadingControls, v).map(([n, x]) => [n, n === "color" && x === "theme" ? undefined : x] as [string, unknown]),
        ["display", v.display],
      ]),
  },
  {
    id: "loading-border",
    title: "LoadingBorder",
    group: "Feedback",
    description: "Wraps any content with an animated scanning border while `loading` is true — useful for cards that refresh in place.",
    imports: 'import { LoadingBorder } from "@itsrighttime/irt-ui";',
    controls: borderControls,
    render: (v) => (
      <LoadingBorder loading={Boolean(v.loading)}>
        <div className="pg-card" style={{ width: 280 }}>
          <strong>Monthly revenue</strong>
          <p className="pg-muted" style={{ margin: "4px 0 0" }}>
            Refreshing figures…
          </p>
        </div>
      </LoadingBorder>
    ),
    code: (v) => jsx("LoadingBorder", [["loading", v.loading ? "{isLoading}" : "{false}"]], "<Card />"),
  },
  {
    id: "tooltip",
    title: "Tooltip",
    group: "Feedback",
    description:
      "Shows content next to its child on hover (after `delay`) and immediately on focus. Flips to stay in the viewport, links `aria-describedby` and renders in a portal. The child must accept a ref (DOM element or forwardRef component).",
    imports: 'import { Tooltip } from "@itsrighttime/irt-ui";',
    controls: tooltipControls,
    render: (v) => (
      <Tooltip
        content={String(v.content)}
        delay={Number(v.delay)}
        width={String(v.width)}
        backgroundColor={String(v.backgroundColor) || undefined}
        color={String(v.color) || undefined}
      >
        <Button variant="secondary" iconLeft="copy">
          Hover or focus me
        </Button>
      </Tooltip>
    ),
    code: (v) => jsx("Tooltip", changed(tooltipControls, v), '<Button iconLeft="copy">Copy link</Button>'),
  },
  {
    id: "error-msg",
    title: "ErrorMsg",
    group: "Feedback",
    description: "Inline error text (`role=\"alert\"`) for form-level or custom messages. Server-component safe.",
    imports: 'import { ErrorMsg } from "@itsrighttime/irt-ui";',
    controls: errorMsgControls,
    render: (v) => (
      <ErrorMsg message={String(v.message)} bold={Boolean(v.bold)} fontSize={Number(v.fontSize)} textAlign={v.textAlign as "left"} padding={String(v.padding)} />
    ),
    code: (v) => jsx("ErrorMsg", [["message", v.message], ...changed(errorMsgControls, v, ["bold", "fontSize", "textAlign", "padding"])]),
  },
  {
    id: "icon-error",
    title: "IconError",
    group: "Feedback",
    description: "Icon + message placeholder for empty or failed content (`role=\"img\"` with the message as its name).",
    imports: 'import { IconError } from "@itsrighttime/irt-ui";',
    controls: iconErrorControls,
    render: (v) => (
      <IconError icon={v.icon as IconName} message={String(v.message)} size={Number(v.size)} width={String(v.width)} height={String(v.height)} />
    ),
    code: (v) => jsx("IconError", [["icon", v.icon], ["message", v.message], ...changed(iconErrorControls, v, ["size", "width", "height"])]),
  },
  {
    id: "error-page",
    title: "ErrorPage",
    group: "Feedback",
    description:
      "HTTP error view. A string `handleNavigate` renders a link; pass `onNavigate` (your router) for client-side navigation. Use `as=\"section\"` and `fullHeight={false}` inside an app shell, and `actions` for retry buttons.",
    imports: 'import { ErrorPage } from "@itsrighttime/irt-ui";',
    controls: errorPageControls,
    align: "stretch",
    render: (v) => <ErrorPageDemo v={v} />,
    code: (v) =>
      jsx("ErrorPage", [
        ["statusCode", v.statusCode],
        ...changed(errorPageControls, v, ["title", "errorMsg", "statusDetail", "navigateTo", "color", "as"]),
        ["handleNavigate", "/"],
        ["onNavigate", "{router.push}"],
        ["actions", v.actions ? '{<Button iconLeft="refresh" onClick={retry}>Try again</Button>}' : undefined],
      ]),
  },
];
