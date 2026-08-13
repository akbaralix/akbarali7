import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
const START_KEY = "visitor_session_started_at";
const SESSION_KEY = "visitor_session_id";
const PATH_KEY = "visitor_last_path";

let hasTrackedSession = false;

const getSessionId = () => {
  const savedSessionId = sessionStorage.getItem(SESSION_KEY);
  if (savedSessionId) return savedSessionId;

  const newSessionId =
    (typeof crypto !== "undefined" && crypto.randomUUID?.()) ||
    `visitor-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  sessionStorage.setItem(SESSION_KEY, newSessionId);
  return newSessionId;
};

const buildPayload = (currentPath, durationMs = 0) => ({
  sessionId: getSessionId(),
  currentPath,
  durationMs,
  userAgent: navigator.userAgent || "",
  platform: navigator.platform || "",
  language: navigator.language || "",
  screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
});

const sendVisitorPayload = (endpoint, payload) => {
  if (!API_URL) return;

  const url = `${API_URL}${endpoint}`;
  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
    return;
  }

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
};

function VisitorTracker() {
  const location = useLocation();

  useEffect(() => {
    const currentPath = `${location.pathname}${location.search}`;
    sessionStorage.setItem(PATH_KEY, currentPath);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (hasTrackedSession) return;
    hasTrackedSession = true;

    const startedAt = Date.now();
    sessionStorage.setItem(START_KEY, String(startedAt));
    const currentPath =
      sessionStorage.getItem(PATH_KEY) || window.location.pathname;

    sendVisitorPayload("/api/visitor/track", buildPayload(currentPath, 0));

    const handleBeforeUnload = () => {
      const savedStartedAt = Number(
        sessionStorage.getItem(START_KEY) || startedAt,
      );
      const durationMs = Math.max(0, Date.now() - savedStartedAt);
      const lastPath = sessionStorage.getItem(PATH_KEY) || window.location.pathname;

      sendVisitorPayload("/api/visitor/session", buildPayload(lastPath, durationMs));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null;
}

export default VisitorTracker;
