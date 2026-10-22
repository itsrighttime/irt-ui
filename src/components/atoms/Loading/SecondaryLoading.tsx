import { CubesLoader } from "./LoadingStyle";

/** Full-viewport centered cube loader (e.g. route-level fallback). */
export function SecondaryLoading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      style={{ height: "100vh", width: "100vw", display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <CubesLoader />
    </div>
  );
}
