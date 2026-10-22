"use client";

import type { KeyboardEvent } from "react";
import { Icon } from "../../../../icons/Icon";
import { cssVars } from "../../../../utils/cssVars";
import { IconButton } from "../../../atoms/Button/IconButton";
import styles from "./TabLabel.module.css";
import type { TabIconItem, TabLabelProps, TabToken } from "./TabBar.types";

function renderIcons(items?: TabIconItem[]) {
  if (!items?.length) return null;
  return (
    <div className={styles.iconGroup}>
      {items.map((item, i) =>
        item.clickable !== false && item.onClick ? (
          <IconButton
            key={i}
            icon={item.icon}
            onClick={(event) => {
              event.stopPropagation();
              item.onClick?.();
            }}
            color={item.color}
            label={item.label}
            disabled={item.disabled}
            size={1}
          />
        ) : (
          <span
            key={i}
            className={styles.icon}
            style={{ color: item.color ?? "var(--irt-color-text-subtle)", display: "inline-flex" }}
            title={item.label}
            role={item.label ? "img" : undefined}
            aria-label={item.label}
            aria-hidden={item.label ? undefined : true}
          >
            <Icon name={item.icon} size="1em" />
          </span>
        ),
      )}
    </div>
  );
}

function renderTokens(tokens?: TabToken[]) {
  if (!tokens?.length) return null;
  return (
    <div className={styles.tokens}>
      {tokens.map((token, i) => (
        <span key={i} className={styles.token} style={{ color: token.color, background: token.background }}>
          {token.text}
        </span>
      ))}
    </div>
  );
}

/** Label tab: text + optional left/right icons and token badges. */
export function TabLabel({ leftIcons, rightIcons, tokens, text, onClick, background = null, border = null }: TabLabelProps) {
  const interactive = Boolean(onClick);
  return (
    <div
      className={styles.wrapper}
      onClick={onClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (event: KeyboardEvent<HTMLDivElement>) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      style={cssVars({ "--irt-c-background": background ?? undefined, "--irt-c-border": border ?? "none" })}
    >
      {renderIcons(leftIcons)}
      <span className={styles.text} title={text}>
        {text}
      </span>
      {renderTokens(tokens)}
      {renderIcons(rightIcons)}
    </div>
  );
}
