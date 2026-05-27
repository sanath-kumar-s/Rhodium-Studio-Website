import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { usePerformance } from '../../hooks/usePerformance';
import { cn } from '../../lib/utils';

// ── EASY CUSTOMIZATION ──────────────────────────
const CONFIG = {
  sphere1Size: 1.1,        // Half size
  sphere2Size: 0.45,       
  sphere3Size: 0.3,        
  mouseInfluence: 5.0,     
  lerpSpeed: [0.03, 0.08, 0.12], 
  glowOpacity: 0.4,
  iridescenceSpeed: 0.008, // Slower for minimal feel
  textContent: `CRAFTING DIGITAL\nEXPERIENCES THAT\nCAPTIVATE\nATTENTION\nAND DRIVE RESULTS`,
};
// ────────────────────────────────────────────────

const VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 baseColor;
  uniform float time;
  uniform float wobble;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vec3 updatedNormal = vNormal;
    updatedNormal.x += sin(vNormal.y * 10.0 + time) * 0.03 * wobble;
    updatedNormal.y += cos(vNormal.x * 10.0 + time) * 0.03 * wobble;
    updatedNormal = normalize(updatedNormal);

    float fresnel = pow(1.0 - max(dot(updatedNormal, vViewDir), 0.0), 3.0);
    
    // Minimal iridescent color shift (Liquid Mercury feel)
    vec3 iridescentColor = 0.85 + 0.15 * cos(
      6.28318 * (vec3(0.0, 0.1, 0.2) + fresnel * 1.2 + time * 0.05)
    );
    
    // Metallic/Chrome base
    vec3 color = mix(vec3(0.1, 0.1, 0.12), iridescentColor * 0.35, fresnel);
    
    // Sharp high-contrast speculars for chrome feel
    float spec1 = pow(max(dot(updatedNormal, normalize(vec3(0.5, 1.0, 0.8))), 0.0), 256.0);
    float spec2 = pow(max(dot(updatedNormal, normalize(vec3(-0.8, -0.5, 0.5))), 0.0), 64.0);
    
    color += vec3(spec1 * 3.5);
    color += vec3(spec2 * 0.6) * iridescentColor;
    
    gl_FragColor = vec4(color, 0.9 + fresnel * 0.1);
  }
`;

export default function IridescentSpheres() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const pulseRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const { isMobile, isLowEnd } = usePerformance();

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const isMob = isMobile;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: !isLowEnd,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowEnd ? 1 : 2));
    renderer.setClearColor(0x000000, 0);

    const geoDetail = isLowEnd ? 32 : 64;

    // Spheres
    const createSphere = (radius: number, pos: THREE.Vector3) => {
      const scaleFactor = isMob ? 0.45 : 1; 
      const geometry = new THREE.SphereGeometry(radius * scaleFactor, geoDetail, geoDetail);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          wobble: { value: 1.0 },
          baseColor: { value: new THREE.Color(0x111111) },
        },
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(pos.clone().multiplyScalar(scaleFactor));
      return { mesh, material, target: pos.clone().multiplyScalar(scaleFactor), baseScale: scaleFactor };
    };

    const s1 = createSphere(CONFIG.sphere1Size, new THREE.Vector3(1.8, 0.2, 0));
    const s2 = createSphere(CONFIG.sphere2Size, new THREE.Vector3(3, 1, 0.5));
    const s3 = createSphere(CONFIG.sphere3Size, new THREE.Vector3(4, -1, -0.5));

    scene.add(s1.mesh, s2.mesh, s3.mesh);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(2, 3, 2);
    scene.add(keyLight);
    const fillLight = new THREE.PointLight(0x6644ff, 2.0, 10);
    fillLight.position.set(-3, 1, 1);
    scene.add(fillLight);
    const rimLight = new THREE.PointLight(0x00ffee, 1.5, 8);
    rimLight.position.set(0, -2, 2);
    scene.add(rimLight);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isMob) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
      });
    };

    window.addEventListener('resize', handleResize);
    if (!isMob) window.addEventListener('mousemove', handleMouseMove);

    let t = 0;
    let animationFrameId: number;

    const animate = (time: number) => {
      t = time * 0.001;
      animationFrameId = requestAnimationFrame(animate);

      // Update Uniforms
      s1.material.uniforms.time.value = t;
      s2.material.uniforms.time.value = t;
      s3.material.uniforms.time.value = t;

      // Random floating movement for mobile, Mouse parallax for desktop
      let mx, my;
      if (isMob) {
        mx = Math.sin(t * 0.4) * 0.5;
        my = Math.cos(t * 0.25) * 0.4;
      } else {
        mx = mouse.current.x * 4.0;
        my = mouse.current.y * 2.5;
      }

      const offset = isMob ? new THREE.Vector3(0, 0, 0) : new THREE.Vector3(1.8, 0.2, 0);
      s1.target.set(mx + offset.x, my + offset.y, 0);
      s1.mesh.position.lerp(s1.target, isMob ? 0.02 : CONFIG.lerpSpeed[0]);

      // Orbit Logic
      const orbitSpeed2 = 0.6;
      const orbitSpeed3 = -0.4;
      const orbitRadius2 = 1.6;
      const orbitRadius3 = 2.2;

      s2.target.set(
        s1.mesh.position.x + Math.cos(t * orbitSpeed2) * orbitRadius2,
        s1.mesh.position.y + Math.sin(t * orbitSpeed2) * orbitRadius2,
        s1.mesh.position.z + 0.5
      );
      s3.target.set(
        s1.mesh.position.x + Math.cos(t * orbitSpeed3 + 2.0) * orbitRadius3,
        s1.mesh.position.y + Math.sin(t * orbitSpeed3 + 2.0) * orbitRadius3,
        s1.mesh.position.z - 0.5
      );

      s2.mesh.position.lerp(s2.target, 0.05);
      s3.mesh.position.lerp(s3.target, 0.03);

      const velocity = new THREE.Vector3().subVectors(s1.mesh.position, s1.target).length();
      s1.material.uniforms.wobble.value = 1.0 + velocity * 2.0;

      s1.mesh.rotation.y = t * 0.1 + (isMob ? 0 : mx * 0.1);
      s1.mesh.rotation.x = isMob ? t * 0.05 : my * 0.1;
      s2.mesh.rotation.z = t * 0.2;

      if (pulseRef.current && !isLowEnd) {
        const pulse = 0.08 + Math.sin(t * 0.6) * 0.04;
        pulseRef.current.style.opacity = pulse.toString();
      }

      // Update CSS Glow Positions
      [s1, s2, s3].forEach((s, i) => {
        const glow = glowRefs[i].current;
        if (glow) {
          const vector = s.mesh.position.clone();
          vector.project(camera);
          const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
          const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;
          
          const zDepth = 1.0 - (s.mesh.position.z / 5);
          const size = s.baseScale * 250 * zDepth;
          glow.style.width = `${size}px`;
          glow.style.height = `${size}px`;
          glow.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
          if (!isLowEnd) glow.style.opacity = (CONFIG.glowOpacity * zDepth).toString();
        }
      });

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(animationFrameId);
      scene.clear();
      renderer.dispose();
    };
  }, [isMobile, isLowEnd]);

  return (
    <section ref={containerRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black will-change-transform">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_60%_40%,_#0a0a0a_0%,_#000000_100%)] opacity-100" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_bottom_right,_rgba(255,255,255,0.02)_0%,_transparent_40%,_transparent_60%,_rgba(255,255,255,0.01)_100%)]" />
      
      {!isLowEnd && (
        <div 
          ref={pulseRef}
          className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08)_0%,_transparent_70%)] pointer-events-none transition-opacity duration-1000"
        />
      )}

      <div className="absolute inset-0 z-0 flex items-center justify-center px-10">
        <h2 
          className="font-display font-extrabold text-white leading-[0.9] tracking-[-0.01em] uppercase whitespace-pre-wrap text-center lg:text-left lg:ml-[-10vw]"
          style={{ fontSize: 'clamp(3rem, 8vw, 7.5rem)' }}
        >
          {CONFIG.textContent}
        </h2>
      </div>

      <div className="absolute inset-0 z-[5] pointer-events-none mix-blend-overlay opacity-20">
        <div className="w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-10 pointer-events-none select-none"
      />

      <div 
        ref={glowRefs[0]} 
        className={cn(
          "absolute top-0 left-0 z-[1] bg-white/5 rounded-full pointer-events-none transition-transform duration-100 ease-out border border-white/10 shadow-[0_0_100px_rgba(255,255,255,0.05)]",
          !isLowEnd && "backdrop-blur-[25px] saturate-[1.5] brightness-[1.1]"
        )} 
      />
      <div 
        ref={glowRefs[1]} 
        className={cn(
          "absolute top-0 left-0 z-[1] bg-white/5 rounded-full pointer-events-none transition-transform duration-100 ease-out border border-white/5",
          !isLowEnd && "backdrop-blur-[15px] saturate-[1.2] brightness-[1.05]"
        )} 
      />
      <div 
        ref={glowRefs[2]} 
        className={cn(
          "absolute top-0 left-0 z-[1] bg-white/5 rounded-full pointer-events-none transition-transform duration-100 ease-out border border-white/5",
          !isLowEnd && "backdrop-blur-[10px] saturate-[1.2] brightness-[1.05]"
        )} 
      />
    </section>
  );
}
