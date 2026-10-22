import { useEffect, useState } from "react";

/** Current hash path, e.g. `#/components/button` → `/components/button`. */
const readPath = () => {
  const raw = window.location.hash.replace(/^#/, "");
  return raw.startsWith("/") ? raw : `/${raw}`;
};

/** Minimal hash router (GitHub Pages serves a single static index.html). */
export function useHashPath(): string {
  const [path, setPath] = useState(readPath);
  useEffect(() => {
    const onChange = () => {
      setPath(readPath());
      document.querySelector("main")?.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return path;
}

export const navigate = (path: string) => {
  window.location.hash = path;
};
