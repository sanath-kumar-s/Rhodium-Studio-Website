/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense } from "react";

// @ts-ignore - External Framer component
const ParticleSphere = lazy(() => import("https://framer.com/m/ParticlesSphere-prod-zwwbNg.js"));

export default function SphereWrapper() {
  return (
    <div className="absolute left-0 top-0 w-full h-full z-[2] pointer-events-none overflow-hidden">
      <Suspense fallback={null}>
        <ParticleSphere />
      </Suspense>
    </div>
  );
}
