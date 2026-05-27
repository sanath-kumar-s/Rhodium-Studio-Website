import { useState, useEffect } from 'react';

interface PerformanceProfile {
  isLowEnd: boolean;
  reducedMotion: boolean;
  isMobile: boolean;
}

export function usePerformance(): PerformanceProfile {
  const [profile, setProfile] = useState<PerformanceProfile>({
    isLowEnd: false,
    reducedMotion: false,
    isMobile: false
  });

  useEffect(() => {
    const checkPerformance = () => {
      // 1. Detect Reduced Motion preference
      const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const reducedMotion = reducedMotionQuery.matches;

      // 2. Detect Mobile
      const isMobile = window.innerWidth <= 768;

      // 3. Heuristic for Low-end device
      // - navigator.deviceMemory (RAM in GB) - usually < 4GB for budget devices
      // - navigator.hardwareConcurrency (CPU cores) - usually < 4 for budget devices
      const ram = (navigator as any).deviceMemory || 8;
      const cores = navigator.hardwareConcurrency || 8;
      
      const isLowEnd = isMobile && (ram < 4 || cores < 4 || reducedMotion);

      setProfile({
        isLowEnd,
        reducedMotion,
        isMobile
      });
    };

    checkPerformance();
    window.addEventListener('resize', checkPerformance);
    return () => window.removeEventListener('resize', checkPerformance);
  }, []);

  return profile;
}
