"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

interface ClarityAnalyticsProps {
  projectId: string;
}

export function ClarityAnalytics({ projectId }: ClarityAnalyticsProps) {
  useEffect(() => {
    if (!projectId) return;
    Clarity.init(projectId);
  }, [projectId]);

  return null;
}
