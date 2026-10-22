/**
 * Compile-time checks of the published type declarations
 * (run by `npm run typecheck`; every @ts-expect-error must be a real error).
 */
import { Button, Icon, type IconName, type ThemeConfig } from "@itsrighttime/irt-ui";
import { Calendar } from "@itsrighttime/irt-ui/atoms";
import { ThemeProvider, type Theme } from "@itsrighttime/irt-ui/theme";

export const okIcon: IconName = "search";
// @ts-expect-error unknown icon names are rejected
export const badIcon: IconName = "not-an-icon";

export const typedElements = (
  <>
    <Icon name="close" size={16} />
    {/* @ts-expect-error unknown icon name */}
    <Icon name="nope" />
    <Button variant="ghost">ok</Button>
    {/* @ts-expect-error invalid variant */}
    <Button variant="huge">bad</Button>
    <Button as="a" href="/x">
      link
    </Button>
    {/* @ts-expect-error href is not a button attribute */}
    <Button href="/x">bad</Button>
    {/* @ts-expect-error setResult is required */}
    <Calendar />
    <ThemeProvider theme={{ colors: { primary: "#000" } }} />
  </>
);

export const partialTheme: ThemeConfig = { spacing: { md: "12px" }, dark: { colors: { background: "#000" } } };
// @ts-expect-error theme values must be strings
export const badTheme: ThemeConfig = { colors: { primary: 1 } };
export const fullTheme = (t: Theme): string => t.colors.primary;
