import type { CSSProperties, ElementType, MouseEvent, MouseEventHandler, ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons/Icon";
import { getErrorIcon, getErrorTitle } from "./error";
import styles from "./ErrorPage.module.css";

export { getErrorIcon, getErrorTitle } from "./error";

export interface ErrorPageProps {
  /** HTTP status code. @default "404" */
  statusCode?: string | number;
  /** Completes "The page you are looking for was …". @default "not found" */
  errorMsg?: string;
  statusDetail?: string | null;
  responseCode?: string | number | null;
  /**
   * Where the recovery link goes: a URL/path, or a click handler.
   * With a URL, `onNavigate` (e.g. your router's `navigate`) is used when
   * given; otherwise a normal link is rendered.
   */
  handleNavigate: string | MouseEventHandler<HTMLButtonElement>;
  /** Client-side navigation for string `handleNavigate` values. */
  onNavigate?: (href: string) => void;
  /** Link label. @default "Home Page" */
  navigateTo?: string;
  /** Override the heading (defaults to a title derived from the status code). */
  title?: ReactNode;
  /** Override the explanatory sentence ("The page you are looking for was …"). */
  description?: ReactNode;
  /** Extra actions under the text (e.g. a "Try again" Button). */
  actions?: ReactNode;
  /** Accent colour of the code and icon. @default var(--irt-color-danger) */
  color?: string;
  /**
   * Root element. Use `"section"`/`"div"` when the page already has a `<main>`.
   * @default "main"
   */
  as?: "main" | "section" | "div";
  /** Fill the viewport height. Set `false` to embed in a container. @default true */
  fullHeight?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** Full-page HTTP error view. Router-agnostic. */
export function ErrorPage({
  statusCode = "404",
  errorMsg = "not found",
  statusDetail = null,
  responseCode = null,
  handleNavigate,
  onNavigate,
  navigateTo = "Home Page",
  title,
  description,
  actions,
  color,
  as = "main",
  fullHeight = true,
  className,
  style,
}: ErrorPageProps) {
  const Root: ElementType = as;
  const numericStatusCode = typeof statusCode === "string" ? Number.parseInt(statusCode, 10) : statusCode;

  let link;
  if (typeof handleNavigate === "string") {
    const href = handleNavigate;
    link = (
      <a
        className={styles.link}
        href={href}
        onClick={
          onNavigate
            ? (event: MouseEvent<HTMLAnchorElement>) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
                event.preventDefault();
                onNavigate(href);
              }
            : undefined
        }
      >
        {navigateTo}
      </a>
    );
  } else {
    link = (
      <button type="button" className={styles.link} onClick={handleNavigate}>
        {navigateTo}
      </button>
    );
  }

  return (
    <Root
      className={cx(styles.container, fullHeight && styles.fullHeight, className)}
      style={color ? { ...style, ["--irt-c-error-color" as string]: color } : style}
    >
      <div className={styles.content}>
        <div className={styles.message}>
          <div className={styles.title} aria-hidden="true">
            <span className={styles.iconBadge}>
              <Icon name={getErrorIcon(numericStatusCode)} size={28} />
            </span>
          </div>
          <p className={styles.errorCode}>{statusCode}</p>

          {responseCode !== null && <p className={styles.description}>{responseCode}</p>}

          <h1 className={styles.titleText}>{title ?? getErrorTitle(numericStatusCode)}</h1>

          <p className={styles.description}>{description ?? <>The page you are looking for was {errorMsg}.</>}</p>

          {statusDetail && (
            <p className={styles.description}>
              <strong>Detail:</strong> {statusDetail}
            </p>
          )}

          <p className={styles.instruction}>
            You may return to {link} or try using the correct URL.
          </p>

          {actions != null && <div className={styles.actions}>{actions}</div>}
        </div>
      </div>
    </Root>
  );
}
