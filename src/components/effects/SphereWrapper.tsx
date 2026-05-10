/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import ParticleSphere from "../ParticleSphere";

export default function SphereWrapper() {
  return (
    <div className="absolute left-0 top-0 w-full h-full z-20 pointer-events-none overflow-hidden flex items-center justify-start">
      <div className="w-1/2 h-full flex items-center justify-center -ml-28 pointer-events-auto">
        <ParticleSphere 
          particlesCount={3000}
          scale={0.4}
          speed={0.4}
        />
      </div>
    </div>
  );
}
