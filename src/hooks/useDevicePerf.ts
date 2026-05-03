import { useEffect, useState } from "react";

export type PerfTier = "low" | "medium" | "high";

interface DevicePerf {
  tier: PerfTier;
  isMobile: boolean;
  isTablet: boolean;
  reducedMotion: boolean;
  /** Multiplier (0..1) to scale particle counts / animations */
  scale: number;
}

/**
 * Detects device capability once on mount and returns a tier
 * to allow components to scale animations / particle counts.
 */
export const useDevicePerf = (): DevicePerf => {
  const [perf, setPerf] = useState<DevicePerf>({
    tier: "high",
    isMobile: false,
    isTablet: false,
    reducedMotion: false,
    scale: 1,
  });

  useEffect(() => {
    const w = window.innerWidth;
    const isMobile = w < 768;
    const isTablet = w >= 768 && w < 1024;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // @ts-expect-error - deviceMemory is non-standard but widely supported
    const memory: number | undefined = navigator.deviceMemory;
    const cores = navigator.hardwareConcurrency || 4;

    let tier: PerfTier = "high";
    if (reducedMotion) tier = "low";
    else if (isMobile || (memory && memory <= 2) || cores <= 2) tier = "low";
    else if (isTablet || (memory && memory <= 4) || cores <= 4) tier = "medium";

    const scale = tier === "low" ? 0.25 : tier === "medium" ? 0.6 : 1;

    setPerf({ tier, isMobile, isTablet, reducedMotion, scale });
  }, []);

  return perf;
};
