import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

export interface LoggedEvent {
  id: number;
  name: string;
  payload: string;
  time: string;
}

interface EventsValue {
  events: LoggedEvent[];
  log: (name: string, payload?: unknown) => void;
  clear: () => void;
}

const EventsContext = createContext<EventsValue>({ events: [], log: () => undefined, clear: () => undefined });

const MAX_EVENTS = 50;

const stringify = (payload: unknown): string => {
  if (payload === undefined) return "";
  if (payload instanceof File) return `File { name: "${payload.name}", size: ${payload.size}, type: "${payload.type}" }`;
  if (Array.isArray(payload) && payload.some((p) => p instanceof File)) {
    return `[${payload.map((p) => (p instanceof File ? `File("${p.name}")` : JSON.stringify(p))).join(", ")}]`;
  }
  try {
    return JSON.stringify(payload);
  } catch {
    return String(payload);
  }
};

/** Collects callback calls made by the demos on a component page. */
export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<LoggedEvent[]>([]);
  const nextId = useRef(1);
  const log = useCallback((name: string, payload?: unknown) => {
    const event: LoggedEvent = {
      id: nextId.current++,
      name,
      payload: stringify(payload),
      time: new Date().toLocaleTimeString([], { hour12: false }),
    };
    setEvents((prev) => [event, ...prev].slice(0, MAX_EVENTS));
  }, []);
  const clear = useCallback(() => setEvents([]), []);
  const value = useMemo(() => ({ events, log, clear }), [events, log, clear]);
  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

/** `log("setResult", value)` — shows the call in the page's Events tab. */
export function useLog(): (name: string, payload?: unknown) => void {
  return useContext(EventsContext).log;
}

export function useEvents(): EventsValue {
  return useContext(EventsContext);
}
