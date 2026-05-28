import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { usePerformance } from '../../hooks/usePerformance';

// ========================================
// TOGGLE 3D TEXT HERE
// ========================================
const ENABLE_3D_TEXT = false;

export default function Interactive3DText() {

  const containerRef =
    useRef<HTMLDivElement>(null);

  const {
    isLowEnd,
    isMobile
  } = usePerformance();

  const [isLoaded, setIsLoaded] =
    useState(false);

  const [hasWebGL, setHasWebGL] =
    useState(true);

  // ========================================
  // SIMPLE TEXT MODE
  // ========================================
  if (!ENABLE_3D_TEXT) {

    return (
      <div className="w-full flex items-center justify-center py-10 select-none">

        <h1
          className="
            text-white
            text-[18vw]
            md:text-[12vw]
            font-black
            uppercase
            leading-none
            tracking-[-0.08em]
            whitespace-nowrap
          "
        >
          RHODIUM
        </h1>

      </div>
    );
  }

  useEffect(() => {

    // ========================================
    // WEBGL CHECK
    // ========================================
    try {

      const canvas =
        document.createElement('canvas');

      const gl =
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');

      if (!gl) {

        setHasWebGL(false);

        return;
      }

    } catch {

      setHasWebGL(false);

      return;
    }

    if (
      isLowEnd ||
      isMobile ||
      !containerRef.current
    ) {
      return;
    }

    const container =
      containerRef.current;

    let width =
      container.clientWidth ||
      window.innerWidth;

    let height =
      container.clientHeight ||
      600;

    // ========================================
    // SCENE
    // ========================================
    const scene =
      new THREE.Scene();

    scene.fog =
      new THREE.Fog(
        0x000000,
        12,
        22
      );

    // ========================================
    // CAMERA
    // ========================================
    const camera =
      new THREE.PerspectiveCamera(
        42,
        width / height,
        0.1,
        100
      );

    camera.position.set(
      0,
      0.2,
      7.2
    );

    // ========================================
    // RENDERER
    // ========================================
    const renderer =
      new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference:
          'high-performance'
      });

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );

    renderer.setSize(
      width,
      height
    );

    renderer.shadowMap.enabled = true;

    renderer.shadowMap.type =
      THREE.PCFSoftShadowMap;

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    renderer.toneMapping =
      THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure = 1.15;

    container.appendChild(
      renderer.domElement
    );

    // ========================================
    // LIGHTING
    // ========================================

    const ambientLight =
      new THREE.AmbientLight(
        0xffffff,
        0.18
      );

    scene.add(ambientLight);

    const spotlight =
      new THREE.SpotLight(
        0xffffff,
        22,
        40,
        Math.PI / 5,
        0.35,
        1
      );

    spotlight.position.set(
      0,
      8,
      10
    );

    spotlight.castShadow = true;

    spotlight.shadow.mapSize.width = 2048;
    spotlight.shadow.mapSize.height = 2048;

    scene.add(spotlight);

    const fillLight =
      new THREE.DirectionalLight(
        0x4455aa,
        1.8
      );

    fillLight.position.set(
      0,
      -10,
      5
    );

    scene.add(fillLight);

    const rimLight =
      new THREE.PointLight(
        0xffffff,
        5,
        20
      );

    rimLight.position.set(
      0,
      2,
      -5
    );

    scene.add(rimLight);

    const topLight =
      new THREE.DirectionalLight(
        0xffffff,
        2.2
      );

    topLight.position.set(
      0,
      12,
      8
    );

    scene.add(topLight);

    // ========================================
    // MOUSE
    // ========================================
    const mouse = {

      x: 0,
      y: 0,

      targetX: 0,
      targetY: 0,
    };

    const handleMouseMove = (
      event: MouseEvent
    ) => {

      const rect =
        container.getBoundingClientRect();

      const relativeX =
        event.clientX - rect.left;

      const relativeY =
        event.clientY - rect.top;

      mouse.targetX =
        (relativeX / width - 0.5) * 2;

      mouse.targetY =
        (relativeY / height - 0.5) * 2;
    };

    window.addEventListener(
      'mousemove',
      handleMouseMove
    );

    // ========================================
    // TEXT
    // ========================================
    let textMesh:
      THREE.Mesh | null = null;

    const loader =
      new FontLoader();

    loader.load(

      'https://cdn.jsdelivr.net/npm/three@0.145.0/examples/fonts/helvetiker_bold.typeface.json',

      (font) => {

        const getFontSize = () => {

          if (width > 1600)
            return 1.4;

          if (width > 1200)
            return 1.3;

          if (width > 768)
            return 1.45;

          return 1.05;
        };

        const getDepth = () => {

          if (width > 1600)
            return 0.85;

          if (width > 1200)
            return 0.7;

          return 0.55;
        };

        const geometry =
          new TextGeometry(
            'RHODIUM',
            {
              font,

              size:
                getFontSize(),

              depth:
                getDepth(),

              curveSegments: 18,

              bevelEnabled: true,

              bevelThickness: 0.06,

              bevelSize: 0.035,

              bevelOffset: 0,

              bevelSegments: 8,
            }
          );

        geometry.computeBoundingBox();

        if (geometry.boundingBox) {

          const centerOffset =
            -0.5 *
            (
              geometry.boundingBox.max.x -
              geometry.boundingBox.min.x
            );

          const yOffset =
            -0.5 *
            (
              geometry.boundingBox.max.y -
              geometry.boundingBox.min.y
            );

          geometry.translate(
            centerOffset,
            yOffset,
            0
          );
        }

        // ========================================
        // MATERIAL
        // ========================================
        const material =
          new THREE.MeshPhysicalMaterial({

            color: 0xffffff,

            metalness: 0.92,

            roughness: 0.08,

            clearcoat: 1,

            clearcoatRoughness: 0.02,

            reflectivity: 1,

            envMapIntensity: 3.5,

            sheen: 1,

            sheenRoughness: 0.08,

            sheenColor:
              new THREE.Color(
                0xffffff
              ),

            specularIntensity: 1.4,

            specularColor:
              new THREE.Color(
                0xffffff
              ),
          });

        textMesh =
          new THREE.Mesh(
            geometry,
            material
          );

        textMesh.castShadow = true;

        textMesh.receiveShadow = true;

        scene.add(textMesh);

        setIsLoaded(true);
      },

      undefined,

      (err) => {

        console.error(
          'Failed to load font:',
          err
        );
      }
    );

    // ========================================
    // ANIMATION
    // ========================================
    let animationFrameId: number;

    const clock =
      new THREE.Clock();

    const animate = () => {

      animationFrameId =
        requestAnimationFrame(
          animate
        );

      const elapsedTime =
        clock.getElapsedTime();

      // Smooth mouse lerp
      mouse.x +=
        (mouse.targetX - mouse.x) *
        0.025;

      mouse.y +=
        (mouse.targetY - mouse.y) *
        0.025;

      if (textMesh) {

        // Rotation
        textMesh.rotation.y =
          mouse.x * 0.16;

        textMesh.rotation.x =
          mouse.y * 0.10;

        // Floating tilt
        textMesh.rotation.z =
          Math.sin(
            elapsedTime * 0.7
          ) * 0.015;

        // Float
        textMesh.position.y =
          Math.sin(
            elapsedTime * 1.5
          ) * 0.08;

        // Horizontal movement
        textMesh.position.x =
          mouse.x * 0.08;

        // Depth movement
        textMesh.position.z =
          Math.abs(mouse.x) * -0.12;

        // Breathing
        const scale =
          1 +
          Math.sin(
            elapsedTime * 1.2
          ) * 0.012;

        textMesh.scale.set(
          scale,
          scale,
          scale
        );
      }

      // Light movement
      spotlight.position.x =
        mouse.x * 6;

      spotlight.position.y =
        8 - mouse.y * 3;

      renderer.render(
        scene,
        camera
      );
    };

    animate();

    // ========================================
    // RESIZE
    // ========================================
    const handleResize = () => {

      if (!containerRef.current)
        return;

      width =
        containerRef.current.clientWidth ||
        window.innerWidth;

      height =
        containerRef.current.clientHeight ||
        600;

      camera.aspect =
        width / height;

      camera.updateProjectionMatrix();

      renderer.setSize(
        width,
        height
      );
    };

    window.addEventListener(
      'resize',
      handleResize
    );

    // ========================================
    // CLEANUP
    // ========================================
    return () => {

      window.removeEventListener(
        'mousemove',
        handleMouseMove
      );

      window.removeEventListener(
        'resize',
        handleResize
      );

      cancelAnimationFrame(
        animationFrameId
      );

      if (textMesh) {

        textMesh.geometry.dispose();

        if (
          Array.isArray(
            textMesh.material
          )
        ) {

          textMesh.material.forEach(
            (m) => m.dispose()
          );

        } else {

          textMesh.material.dispose();
        }

        scene.remove(textMesh);
      }

      renderer.dispose();

      if (
        container.contains(
          renderer.domElement
        )
      ) {

        container.removeChild(
          renderer.domElement
        );
      }
    };

  }, [isLowEnd, isMobile]);

  // ========================================
  // FALLBACK
  // ========================================
  const useFallback =
    isMobile ||
    isLowEnd ||
    !hasWebGL;

  if (useFallback) {

    return (
      <div className="w-full flex items-center justify-center py-10 select-none pointer-events-none">

        <h2
          className="
            text-white
            text-[18vw]
            md:text-[12vw]
            font-black
            uppercase
            leading-none
            tracking-[-0.08em]
            whitespace-nowrap
          "
        >
          RHODIUM
        </h2>

      </div>
    );
  }

  return (

    <div className="relative w-full h-[420px] md:h-[720px] flex items-center justify-center overflow-hidden">

      {/* BACKGROUND GLOW */}
      <>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none z-0" />

        <div className="absolute left-1/2 top-1/2 w-[900px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.025] blur-[140px] pointer-events-none z-0" />
      </>

      {/* CANVAS */}
      <div
        ref={containerRef}
        className="w-full h-full z-10 transition-opacity duration-1000 ease-out"
        style={{
          opacity:
            isLoaded
              ? 1
              : 0
        }}
      />

      {/* LOADING */}
      {!isLoaded && (

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">

          <h2
            className="
              text-white/10
              text-[18vw]
              md:text-[12vw]
              font-black
              uppercase
              leading-none
              tracking-[-0.08em]
              whitespace-nowrap
              animate-pulse
            "
          >
            RHODIUM
          </h2>

        </div>
      )}
    </div>
  );
}