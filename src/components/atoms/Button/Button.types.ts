import type { ComponentPropsWithoutRef, ComponentPropsWithRef, ElementType, ReactElement, ReactNode } from "react";
import type { BaseProps } from "../../../types/base-props";
import type { IconLike } from "../../../icons/renderIcon";
import type { ButtonVariant } from "../../../theme/types";

export type { ButtonVariant };

export type PolymorphicRef<C extends ElementType> = ComponentPropsWithRef<C>["ref"];

export type PolymorphicProps<C extends ElementType, Props = object> = Props &
  Omit<ComponentPropsWithoutRef<C>, keyof Props | "as"> & {
    /** Render as another element or component (e.g. `"a"` or a router `Link`). */
    as?: C;
  };

export type ButtonOwnProps = BaseProps & {
  children?: ReactNode;
  /** Visual style. @default theme `components.button.variant` ("primary") */
  variant?: ButtonVariant;
  /** Icon before the label — a registry name (`"plus"`) or any node. */
  iconLeft?: IconLike;
  /** Icon after the label. */
  iconRight?: IconLike;
  /** Hide the label and render a square icon button (requires `ariaLabel` or `tooltip`). */
  iconOnly?: boolean;
  /** Stretch to the container width. */
  block?: boolean;
};

export type ButtonProps<C extends ElementType = "button"> = PolymorphicProps<C, ButtonOwnProps>;

export type ButtonComponent = (<C extends ElementType = "button">(
  props: ButtonProps<C> & { ref?: PolymorphicRef<C> },
) => ReactElement | null) & { displayName?: string };
