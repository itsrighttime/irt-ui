import { ErrorMsg, LoadingBorder } from "@itsrighttime/irt-ui/atoms";
import { Icon } from "@itsrighttime/irt-ui/icons";
import { Interactive } from "./Interactive";

// Server component using server-safe and client components side by side.
export default function Page() {
  return (
    <main style={{ padding: 24, display: "grid", gap: 16, maxWidth: 640 }}>
      <h1 id="title">
        <Icon name="home" label="Home" /> irt-ui Next.js example
      </h1>
      <ErrorMsg message="Server-rendered error message" />
      <LoadingBorder loading>
        <p style={{ padding: 8 }}>Wrapped content</p>
      </LoadingBorder>
      <Interactive />
    </main>
  );
}
