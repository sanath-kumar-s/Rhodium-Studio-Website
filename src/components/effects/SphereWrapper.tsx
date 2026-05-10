/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import ParticleSphere from "../ParticleSphere";
import bgImage from "../../assets/background_s3.jpg";

export default function SphereWrapper() {
  return (
    <>
      {/* Background Layer - behind everything */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-80"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      {/* Interactive Sphere Layer - on top for interaction */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden flex items-center justify-start">
        <div className="w-1/2 h-full flex items-center justify-center -ml-28 pointer-events-auto">
          <ParticleSphere 
            particlesCount={3000}
            scale={0.4}
            speed={0.4}
          />
        </div>
      </div>
    </>
  );
}
