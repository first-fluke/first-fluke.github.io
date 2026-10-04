"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

interface ClarityAnalyticsProps {
  projectId: string;
}

export function ClarityAnalytics({ projectId }: ClarityAnalyticsProps) {
  useEffect(() => {
    if (!projectId) return;
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    const initialize = () => Clarity.init(projectId);
    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(initialize, { timeout: 2000 });
      } else {
        timeoutId = window.setTimeout(initialize, 0);
      }
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      window.removeEventListener("load", schedule);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [projectId]);

  return null;
}
