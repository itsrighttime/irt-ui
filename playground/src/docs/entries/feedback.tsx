import { useState } from "react";
import {
  Alert,
  AlertContainer,
  Button,
  ErrorMsg,
  ErrorPage,
  IconError,
  Loading,
  LoadingBorder,
  Tooltip,
  type AlertItem,
  type AlertType,
  type LoaderType,
} from "@itsrighttime/irt-ui/atoms";
import type { IconName } from "@itsrighttime/irt-ui/icons";
import { changed, jsx } from "../jsx";
import type { Control, ControlValues, DocEntry } from "../types";

function AlertsDemo({ v }: { v: ControlValues }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const add = (type: AlertType) =>
    setAlerts((list) => [...list, { id: `${Date.now()}-${Math.random()}`, type, message: `${type[0]?.toUpperCase()}${type.slice(1)}: something happened`, duration: Number(v.duration) * 1000 }]);
  return (
    <div className="pg-stack">
      <div className="pg-row">
        {(["success", "info", "warning", "error"] as const).map((t) => (
          <Button key={t} size="small" variant={t === "error" ? "destructive" : "secondary"} onClick={() => add(t)}>
            Show {t}
          </Button>
        ))}
      </div>
      <p className="pg-muted">Alerts appear in the top-right corner.</p>
      <div style={{ maxWidth: 320 }}>
        <Alert type="info" message="Inline alert (no auto-dismiss)" duration={0} onDismiss={() => undefined} />
      </div>
      <AlertContainer alertContainer={alerts} removeAlert={(id) => setAlerts((list) => list.filter((a) => a.id !== id))} />
    </div>
  );
}

const loadingControls: Control[] = [
  { type: "select", name: "type", default: "CubesLoader", options: ["CubesLoader", "FoldingLoader", "BounceLoader", "PulseLoader", "LoadingChat"] },
  { type: "boolean", name: "showText", default: true },
  { type: "text", name: "text", default: "Loading" },
  { type: "select", name: "color", default: "theme", options: ["theme", "var(--irt-color-secondary)", "var(--irt-color-danger)", "#7c3aed"] },
];

function BorderDemo() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="pg-stack">
      <LoadingBorder loading={loading}>
        <div style={{ padding: 16, width: 280, borderRadius: 12, background: "var(--irt-color-surface-muted)" }}>Card content</div>
      </LoadingBorder>
      <Button size="small" variant="secondary" onClick={() => setLoading((l) => !l)}>
        Toggle loading
      </Button>
    </div>
  );
}

export const feedbackEntries: DocEntry[] = [
  {
    id: "alert",
    title: "Alert",
    group: "Feedback",
    description: "Dismissible notifications with an auto-dismiss progress bar. `AlertContainer` renders a fixed top-right stack from your alert list.",
    imports: 'import { Alert, AlertContainer, type AlertItem } from "@itsrighttime/irt-ui";',
    controls: [{ type: "number", name: "duration", label: "duration (s)", default: 5, min: 0, max: 15 }],
    props: [
      { name: "alertContainer", type: "AlertItem[]", description: "`{ id, message, type, duration? }`" },
      { name: "removeAlert", type: "(id: string) => void", description: "Called after an alert fades out" },
      { name: "duration", type: "number (ms)", description: "`0` disables auto-dismiss", default: "theme (10 000)" },
    ],
    render: (v) => <AlertsDemo v={v} />,
    code: () =>
      [
        "const [alerts, setAlerts] = useState<AlertItem[]>([]);",
        "const notify = (message: string, type: AlertType) =>",
        "  setAlerts((list) => [...list, { id: crypto.randomUUID(), message, type }]);",
        "",
        "<AlertContainer",
        "  alertContainer={alerts}",
        "  removeAlert={(id) => setAlerts((list) => list.filter((a) => a.id !== id))}",
        "/>",
      ].join("\n"),
  },
  {
    id: "loading",
    title: "Loading",
    group: "Feedback",
    description: "Five loader styles with optional animated text (`role=\"status\"`). The individual loaders (`CubesLoader`, …) are exported too.",
    imports: 'import { Loading } from "@itsrighttime/irt-ui";',
    controls: loadingControls,
    render: (v) => (
      <div style={{ position: "relative", height: 220, width: "100%" }}>
        <Loading
          type={v.type as LoaderType}
          showText={Boolean(v.showText)}
          text={String(v.text)}
          color={v.color === "theme" ? undefined : String(v.color)}
          display="center"
          position="absolute"
        />
      </div>
    ),
    code: (v) => jsx("Loading", [...changed(loadingControls, v).map(([n, x]) => [n, n === "color" && x === "theme" ? undefined : x] as [string, unknown]), ["display", "center"]]),
  },
  {
    id: "loading-border",
    title: "LoadingBorder",
    group: "Feedback",
    description: "Wraps any content with an animated scanning border while loading.",
    imports: 'import { LoadingBorder } from "@itsrighttime/irt-ui";',
    render: () => <BorderDemo />,
    code: () => "<LoadingBorder loading={isLoading}>\n  <Card />\n</LoadingBorder>",
  },
  {
    id: "tooltip",
    title: "Tooltip",
    group: "Feedback",
    description: "Shows content next to its child on hover (after `delay`) and immediately on focus. Flips to stay in the viewport; links `aria-describedby`.",
    imports: 'import { Tooltip } from "@itsrighttime/irt-ui";',
    controls: [
      { type: "text", name: "content", default: "Copies the link to your clipboard" },
      { type: "number", name: "delay", default: 300, min: 0, max: 2000, step: 100 },
      { type: "text", name: "width", default: "300px" },
    ],
    render: (v) => (
      <Tooltip content={String(v.content)} delay={Number(v.delay)} width={String(v.width)}>
        <Button variant="secondary" iconLeft="copy">
          Hover or focus me
        </Button>
      </Tooltip>
    ),
    code: (v) => jsx("Tooltip", [["content", v.content], ["delay", v.delay]], '<Button iconLeft="copy">Copy link</Button>'),
  },
  {
    id: "error-msg",
    title: "ErrorMsg",
    group: "Feedback",
    description: "Inline error text (`role=\"alert\"`). Server-component safe.",
    imports: 'import { ErrorMsg } from "@itsrighttime/irt-ui";',
    controls: [
      { type: "text", name: "message", default: "This field is required" },
      { type: "boolean", name: "bold", default: true },
      { type: "number", name: "fontSize", default: 0.8, min: 0.6, max: 1.5, step: 0.1 },
      { type: "select", name: "textAlign", default: "left", options: ["left", "center", "right"] },
    ],
    render: (v) => <ErrorMsg message={String(v.message)} bold={Boolean(v.bold)} fontSize={Number(v.fontSize)} textAlign={v.textAlign as "left"} />,
    code: (v) => jsx("ErrorMsg", [["message", v.message], ["bold", v.bold ? undefined : false], ["fontSize", v.fontSize === 0.8 ? undefined : v.fontSize]]),
  },
  {
    id: "icon-error",
    title: "IconError",
    group: "Feedback",
    description: "Icon + message placeholder for empty or failed content.",
    imports: 'import { IconError } from "@itsrighttime/irt-ui";',
    controls: [
      { type: "select", name: "icon", default: "imageOff", options: ["imageOff", "videoOff", "wifiOff", "alertTriangle", "search"] },
      { type: "text", name: "message", default: "Nothing to show yet" },
      { type: "number", name: "size", default: 2, min: 1, max: 5, step: 0.5 },
    ],
    render: (v) => (
      <div style={{ width: 280, height: 180 }}>
        <IconError icon={v.icon as IconName} message={String(v.message)} size={Number(v.size)} />
      </div>
    ),
    code: (v) => jsx("IconError", [["icon", v.icon], ["message", v.message], ["size", v.size === 2 ? undefined : v.size]]),
  },
  {
    id: "error-page",
    title: "ErrorPage",
    group: "Feedback",
    description: "Full-page HTTP error view. A string `handleNavigate` renders a link; pass `onNavigate` (your router) for client-side navigation.",
    imports: 'import { ErrorPage } from "@itsrighttime/irt-ui";',
    controls: [
      { type: "select", name: "statusCode", default: "404", options: ["400", "401", "403", "404", "500", "502", "503", "504"] },
      { type: "text", name: "errorMsg", default: "not found" },
      { type: "text", name: "navigateTo", default: "Home Page" },
    ],
    render: (v) => (
      <div className="pg-contained">
        <ErrorPage statusCode={String(v.statusCode)} errorMsg={String(v.errorMsg)} navigateTo={String(v.navigateTo)} handleNavigate="#/" />
      </div>
    ),
    code: (v) => jsx("ErrorPage", [["statusCode", v.statusCode], ["handleNavigate", "/"], ["onNavigate", "{router.push}"], ["navigateTo", v.navigateTo === "Home Page" ? undefined : v.navigateTo]]),
  },
];
