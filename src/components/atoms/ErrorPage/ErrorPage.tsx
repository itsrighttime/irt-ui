import type { MouseEvent, MouseEventHandler } from "react";
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
}: ErrorPageProps) {
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
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.message}>
          <h1 className={styles.title}>
            <Icon name={getErrorIcon(numericStatusCode)} size={35} />
          </h1>
          <p className={styles.errorCode}>{statusCode}</p>

          {responseCode !== null && <p className={styles.description}>{responseCode}</p>}

          <span className={styles.titleText}>{getErrorTitle(numericStatusCode)}</span>

          <p className={styles.description}>The page you are looking for was {errorMsg}.</p>

          {statusDetail && (
            <p className={styles.description}>
              <strong>Detail:</strong> {statusDetail}
            </p>
          )}

          <p className={styles.instruction}>
            You may return to {link} or try using the correct URL.
          </p>
        </div>
      </div>
    </main>
  );
}
