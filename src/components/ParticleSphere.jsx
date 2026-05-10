import React, { useEffect, useRef, useMemo } from "react";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  Points,
  BufferGeometry,
  Float32BufferAttribute,
  PointsMaterial,
  SphereGeometry,
  MeshBasicMaterial,
  InstancedMesh,
  Matrix4,
  Group,
  Vector3,
  AdditiveBlending,
} from "three";

// CSS variable token and color parsing (hex/rgba/var())
const cssVariableRegex = /var\s*\(\s*(--[\w-]+)(?:\s*,\s*((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*))?\s*\)/;

function extractDefaultValue(cssVar) {
  if (!cssVar || !cssVar.startsWith("var(")) return cssVar;
  const match = cssVariableRegex.exec(cssVar);
  if (!match) return cssVar;
  const fallback = (match[2] || "").trim();
  if (fallback.startsWith("var(")) return extractDefaultValue(fallback);
  return fallback || cssVar;
}

function resolveTokenColor(input) {
  if (typeof input !== "string") return input;
  if (!input.startsWith("var(")) return input;
  return extractDefaultValue(input);
}

// Parse color string to RGBA values (0-1 range)
function parseColorToRgba(input) {
  if (!input || input.trim() === "") return { r: 0, g: 0, b: 0, a: 0 };
  const str = input.trim();
  // Handle rgba() format
  const rgbaMatch = str.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/i);
  if (rgbaMatch) {
    const r = Math.max(0, Math.min(255, parseFloat(rgbaMatch[1]))) / 255;
    const g = Math.max(0, Math.min(255, parseFloat(rgbaMatch[2]))) / 255;
    const b = Math.max(0, Math.min(255, parseFloat(rgbaMatch[3]))) / 255;
    const a = rgbaMatch[4] !== undefined ? Math.max(0, Math.min(1, parseFloat(rgbaMatch[4]))) : 1;
    return { r, g, b, a };
  }
  // Handle hex formats
  const hex = str.replace(/^#/, "");
  if (hex.length === 8) {
    return {
      r: parseInt(hex.slice(0, 2), 16) / 255,
      g: parseInt(hex.slice(2, 4), 16) / 255,
      b: parseInt(hex.slice(4, 6), 16) / 255,
      a: parseInt(hex.slice(6, 8), 16) / 255,
    };
  }
  if (hex.length === 6) {
    return {
      r: parseInt(hex.slice(0, 2), 16) / 255,
      g: parseInt(hex.slice(2, 4), 16) / 255,
      b: parseInt(hex.slice(4, 6), 16) / 255,
      a: 1,
    };
  }
  if (hex.length === 4) {
    return {
      r: parseInt(hex[0] + hex[0], 16) / 255,
      g: parseInt(hex[1] + hex[1], 16) / 255,
      b: parseInt(hex[2] + hex[2], 16) / 255,
      a: parseInt(hex[3] + hex[3], 16) / 255,
    };
  }
  if (hex.length === 3) {
    return {
      r: parseInt(hex[0] + hex[0], 16) / 255,
      g: parseInt(hex[1] + hex[1], 16) / 255,
      b: parseInt(hex[2] + hex[2], 16) / 255,
      a: 1,
    };
  }
  return { r: 0, g: 0, b: 0, a: 1 };
}

// Value mapping functions
function mapLinear(value, inMin, inMax, outMin, outMax) {
  if (inMax === inMin) return outMin;
  const t = (value - inMin) / (inMax - inMin);
  return outMin + t * (outMax - outMin);
}

// Speed: UI [0.1..1] → internal [0.01..0.05] (rotation speed multiplier)
function mapSpeedUiToInternal(ui) {
  return mapLinear(ui, 0.1, 1, 0.01, 0.05);
}

// Scale: UI [0..1] → scale multiplier [0.5..3.0] (overall sphere size multiplier)
function mapScaleUiToMultiplier(ui) {
  const clamped = Math.max(0, Math.min(1, ui));
  return mapLinear(clamped, 0, 1, 0.25, 1.25);
}

// Particle Size: UI [0.1..1] → size [0.01..0.1] (individual particle size)
function mapParticleSizeUiToInternal(ui) {
  const clamped = Math.max(0.1, Math.min(1, ui));
  return mapLinear(clamped, 0.1, 1, 0.01, 0.1);
}

// Cursor Strength: UI [0..1] → force multiplier [0..15]
function mapCursorStrengthUiToMultiplier(ui) {
  const clamped = Math.max(0, Math.min(1, ui));
  return mapLinear(clamped, 0, 1, 0, 15);
}

// Cursor interaction constants
const CURSOR_PHYSICS = { RETURN_FORCE: 0.015, FRICTION: 0.94 };

export default function ParticleSphere({
  preview = false,
  particlesCount = 1000,
  speed = 0.5,
  smoothing = 1,
  scale = 0.5,
  stopOnHover = true,
  rotationDirection = "clockwise",
  dragSpeed = 0.5,
  drag = true,
  particles: particlesConfig = { scale: 0.5, shape: "sphere" },
  cursorConfig = { enabled: true, radius: 150, strength: 0.3, clickForce: 10 },
  sphereColor = "#ffffff",
  style,
}) {
  const containerRef = useRef(null);
  const zoomProbeRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const particlesRef = useRef(null);
  const particlesGroupRef = useRef(null);
  const animationFrameRef = useRef(null);
  const animateFnRef = useRef(null);
  const startAnimationRef = useRef(null);
  const lastResizeRef = useRef({ ts: 0, zoom: 0, w: 0, h: 0, aspect: 0 });
  const mouseRef = useRef(null);
  const baseParticlePositionsRef = useRef([]);
  const particleDisplacementsRef = useRef([]);
  const particleScatterVelocitiesRef = useRef([]);

  // Local environment setup
  const isCanvas = false;

  // Map UI speed to internal speed
  const rotationSpeed = useMemo(() => {
    const baseSpeed = mapSpeedUiToInternal(speed);
    return rotationDirection === "anticlockwise" ? -baseSpeed : baseSpeed;
  }, [speed, rotationDirection]);

  // Map UI scale to internal scale multiplier (overall sphere size)
  const scaleMultiplier = useMemo(() => mapScaleUiToMultiplier(scale), [scale]);

  // Map UI particle size to internal particle size
  const particleSize = useMemo(() => mapParticleSizeUiToInternal(particlesConfig.scale), [particlesConfig.scale]);

  // Cursor radius in pixels
  const cursorRadius = useMemo(() => Math.max(0, Math.min(600, cursorConfig.radius)), [cursorConfig.radius]);

  // Map UI cursor strength to force multiplier
  const cursorStrength = useMemo(() => mapCursorStrengthUiToMultiplier(cursorConfig.strength), [cursorConfig.strength]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth || container.offsetWidth || 400;
    const containerHeight = container.clientHeight || container.offsetHeight || 400;

    const canvasOverflowMultiplier = 2.5;
    const canvasWidth = containerWidth * canvasOverflowMultiplier;
    const canvasHeight = containerHeight * canvasOverflowMultiplier;

    const scene = new Scene();
    sceneRef.current = scene;

    const baseFOV = 50;
    const adjustedFOV =
      2 * Math.atan(Math.tan((baseFOV * Math.PI) / 180 / 2) * canvasOverflowMultiplier) * (180 / Math.PI);
    const camera = new PerspectiveCamera(adjustedFOV, canvasWidth / canvasHeight, 0.1, 1000);

    const baseCameraDistance = 3;
    const currentSphereRadius = 1 * scaleMultiplier;
    const cameraDistance = Math.max(baseCameraDistance, currentSphereRadius + 1);
    camera.position.z = cameraDistance;
    cameraRef.current = camera;

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = "srgb";
    const canvas = renderer.domElement;
    canvas.style.position = "absolute";

    const offsetX = (canvasWidth - containerWidth) / 2;
    const offsetY = (canvasHeight - containerHeight) / 2;
    canvas.style.left = `-${offsetX}px`;
    canvas.style.top = `-${offsetY}px`;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    canvas.style.display = "block";
    container.appendChild(canvas);
    rendererRef.current = renderer;

    const resolvedSphereColor = resolveTokenColor(sphereColor);
    const sphereRgba = parseColorToRgba(resolvedSphereColor || sphereColor);
    const baseColorObj = resolvedSphereColor
      ? new Color(resolvedSphereColor)
      : new Color(sphereRgba.r, sphereRgba.g, sphereRgba.b);
    const particleOpacity = sphereRgba.a;

    const vertices = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const sphereRadius = 1 * scaleMultiplier;

    baseParticlePositionsRef.current = [];
    particleDisplacementsRef.current = [];
    particleScatterVelocitiesRef.current = [];

    for (let i = 0; i < particlesCount; i++) {
      const y = 1 - (i / (particlesCount - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;

      const posX = x * sphereRadius;
      const posY = y * sphereRadius;
      const posZ = z * sphereRadius;
      vertices.push(posX, posY, posZ);

      baseParticlePositionsRef.current.push(new Vector3(posX, posY, posZ));
      particleDisplacementsRef.current.push(new Vector3(0, 0, 0));
      particleScatterVelocitiesRef.current.push(new Vector3(0, 0, 0));
    }

    const particleShape = particlesConfig.shape || "sphere";
    let particles;

    if (particleShape === "sphere") {
      const pRadius = particleSize * 0.15;
      const sphereGeometry = new SphereGeometry(pRadius, 8, 8);
      const sphereMaterial = new MeshBasicMaterial({
        color: 0xffffff,
        blending: AdditiveBlending,
        transparent: particleOpacity < 1,
        opacity: particleOpacity,
      });
      particles = new InstancedMesh(sphereGeometry, sphereMaterial, particlesCount);

      const matrix = new Matrix4();
      for (let i = 0; i < particlesCount; i++) {
        const idx = i * 3;
        matrix.setPosition(vertices[idx], vertices[idx + 1], vertices[idx + 2]);
        particles.setMatrixAt(i, matrix);
      }
      particles.instanceMatrix.needsUpdate = true;

      const instanceColors = new Float32Array(particlesCount * 3);
      for (let i = 0; i < particlesCount; i++) {
        const idx = i * 3;
        instanceColors[idx] = baseColorObj.r;
        instanceColors[idx + 1] = baseColorObj.g;
        instanceColors[idx + 2] = baseColorObj.b;
      }
      particles.instanceColor = new Float32BufferAttribute(instanceColors, 3);
      particles.instanceColor.needsUpdate = true;
    } else {
      const particlesGeometry = new BufferGeometry();
      particlesGeometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
      const colors = new Float32Array(particlesCount * 3);
      for (let i = 0; i < particlesCount; i++) {
        const idx = i * 3;
        colors[idx] = baseColorObj.r;
        colors[idx + 1] = baseColorObj.g;
        colors[idx + 2] = baseColorObj.b;
      }
      particlesGeometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
      const particlesMaterial = new PointsMaterial({
        size: particleSize,
        color: 0xffffff,
        blending: AdditiveBlending,
        depthTest: false,
        transparent: particleOpacity < 1,
        opacity: particleOpacity,
        vertexColors: true,
      });
      particles = new Points(particlesGeometry, particlesMaterial);
    }

    particlesRef.current = particles;
    const particlesGroup = new Group();
    particlesGroupRef.current = particlesGroup;
    particlesGroup.add(particles);
    scene.add(particlesGroup);

    const rotation = { x: 0, y: 0 };
    const targetRotation = { x: 0, y: 0 };
    const velocity = { x: 0, y: 0 };
    let isDragging = false;
    let isHovering = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let lastDragTime = 0;
    let animationFrameId = null;

    let lastFrameTime = performance.now();
    const targetDeltaTime = 1000 / 60;
    const lerpFactor = smoothing === 0 ? 1 : mapLinear(smoothing, 0, 1, 0.4, 0.03);
    const velocityDecay = mapLinear(smoothing, 0, 1, 0.7, 0.96);

    const animate = () => {
      const now = performance.now();
      const deltaTime = now - lastFrameTime;
      lastFrameTime = now;
      const deltaFactor = deltaTime / targetDeltaTime;
      let needsRender = false;
      const threshold = 0.01;

      if (!isDragging && rotationSpeed !== 0 && (!stopOnHover || !isHovering)) {
        targetRotation.x += rotationSpeed * 0.1 * deltaFactor;
      }

      if (!isDragging && smoothing > 0) {
        if (Math.abs(velocity.x) > threshold || Math.abs(velocity.y) > threshold) {
          targetRotation.x += velocity.x * deltaFactor;
          targetRotation.y += velocity.y * deltaFactor;
          targetRotation.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotation.y));
          const decayFactor = Math.pow(velocityDecay, deltaFactor);
          velocity.x *= decayFactor;
          velocity.y *= decayFactor;
        } else {
          velocity.x = 0;
          velocity.y = 0;
        }
      }

      const dx = targetRotation.x - rotation.x;
      const dy = targetRotation.y - rotation.y;
      if (Math.abs(dx) > threshold || Math.abs(dy) > threshold || rotationSpeed !== 0 || isDragging) {
        const timeLerpFactor = 1 - Math.pow(1 - lerpFactor, deltaFactor);
        rotation.x += dx * timeLerpFactor;
        rotation.y += dy * timeLerpFactor;
        rotation.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.y));
        needsRender = true;
      }

      particlesGroup.rotation.y = rotation.x;
      particlesGroup.rotation.x = rotation.y;
      particlesGroup.updateMatrixWorld(true);

      const curContainerWidth = containerRef.current?.clientWidth || 400;
      const curContainerHeight = containerRef.current?.clientHeight || 400;
      const curCanvasWidth = curContainerWidth * canvasOverflowMultiplier;
      const curCanvasHeight = curContainerHeight * canvasOverflowMultiplier;
      const curCamera = cameraRef.current;
      const cRadiusSq = cursorRadius * cursorRadius;

      if (cursorConfig.enabled && baseParticlePositionsRef.current.length > 0) {
        for (let i = 0; i < baseParticlePositionsRef.current.length; i++) {
          const basePos = baseParticlePositionsRef.current[i];
          const displacement = particleDisplacementsRef.current[i];

          if (mouseRef.current) {
            const mouse = mouseRef.current;
            const currentLocalPos = new Vector3().copy(basePos).add(displacement);
            const worldPos = currentLocalPos.clone().applyMatrix4(particlesGroup.matrixWorld);
            const projected = worldPos.project(curCamera);
            const screenX = (projected.x * 0.5 + 0.5) * curCanvasWidth;
            const screenY = (-projected.y * 0.5 + 0.5) * curCanvasHeight;

            const pdx = mouse.x - screenX;
            const pdy = mouse.y - screenY;
            const distSq = pdx * pdx + pdy * pdy;

            if (distSq < cRadiusSq && distSq > 0) {
              const dist = Math.sqrt(distSq);
              const force = (cursorRadius - dist) / cursorRadius;
              const angle = Math.atan2(pdy, pdx);

              const cameraRight = new Vector3();
              const cameraUp = new Vector3();
              cameraRight.setFromMatrixColumn(curCamera.matrixWorld, 0).normalize();
              cameraUp.setFromMatrixColumn(curCamera.matrixWorld, 1).normalize();

              const repulsion2D = force * cursorStrength * speed * deltaFactor;
              const repulsionX = -Math.cos(angle) * repulsion2D * 0.01;
              const repulsionY = Math.sin(angle) * repulsion2D * 0.01;

              const worldRepulsion = new Vector3()
                .addScaledVector(cameraRight, repulsionX)
                .addScaledVector(cameraUp, repulsionY);
              const localRepulsion = worldRepulsion.clone().applyMatrix4(new Matrix4().copy(particlesGroup.matrixWorld).invert());
              displacement.add(localRepulsion);
            }
          }

          const frictionFactor = Math.pow(CURSOR_PHYSICS.FRICTION, deltaFactor);
          const returnForce = CURSOR_PHYSICS.RETURN_FORCE * speed * deltaFactor;
          displacement.multiplyScalar(frictionFactor);
          displacement.multiplyScalar(1 - returnForce);
        }
      }

      if (particleScatterVelocitiesRef.current.length > 0) {
        for (let i = 0; i < particleScatterVelocitiesRef.current.length; i++) {
          const sVel = particleScatterVelocitiesRef.current[i];
          const disp = particleDisplacementsRef.current[i];
          disp.addScaledVector(sVel, deltaFactor * 0.1);
          const sFriction = Math.pow(0.95, deltaFactor);
          sVel.multiplyScalar(sFriction);
          const sReturn = CURSOR_PHYSICS.RETURN_FORCE * speed * deltaFactor;
          sVel.multiplyScalar(1 - sReturn);
        }
      }

      if (particleShape === "sphere" && particlesRef.current) {
        const matrix = new Matrix4();
        for (let i = 0; i < baseParticlePositionsRef.current.length; i++) {
          const bPos = baseParticlePositionsRef.current[i];
          const dPos = particleDisplacementsRef.current[i];
          matrix.setPosition(bPos.x + dPos.x, bPos.y + dPos.y, bPos.z + dPos.z);
          particlesRef.current.setMatrixAt(i, matrix);
        }
        particlesRef.current.instanceMatrix.needsUpdate = true;
      } else if (particlesRef.current?.geometry?.attributes?.position) {
        const posAttr = particlesRef.current.geometry.attributes.position;
        for (let i = 0; i < baseParticlePositionsRef.current.length; i++) {
          const bPos = baseParticlePositionsRef.current[i];
          const dPos = particleDisplacementsRef.current[i];
          posAttr.setXYZ(i, bPos.x + dPos.x, bPos.y + dPos.y, bPos.z + dPos.z);
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
      animationFrameRef.current = animationFrameId;
    };

    animateFnRef.current = animate;
    const startAnimation = () => {
      if (animationFrameId === null) {
        lastFrameTime = performance.now();
        animationFrameId = requestAnimationFrame(animate);
        animationFrameRef.current = animationFrameId;
      }
    };
    startAnimationRef.current = startAnimation;
    startAnimation();

    const handleMouseDown = (e) => {
      if (!drag) return;
      isDragging = true;
      velocity.x = 0;
      velocity.y = 0;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      lastDragTime = performance.now();

      const onMouseMove = (me) => {
        const now = performance.now();
        const dt = now - lastDragTime;
        const sens = mapLinear(dragSpeed, 0, 1, 0.001, 0.02);
        const dx = me.clientX - lastMouseX;
        const dy = me.clientY - lastMouseY;
        targetRotation.x += dx * sens;
        targetRotation.y += dy * sens;
        targetRotation.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotation.y));

        if (dt > 0) {
          const norm = targetDeltaTime / dt;
          velocity.x = dx * sens * 0.3 * norm;
          velocity.y = dy * sens * 0.3 * norm;
        }
        lastMouseX = me.clientX;
        lastMouseY = me.clientY;
        lastDragTime = now;
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        isDragging = false;
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    if (drag) canvas.addEventListener("mousedown", handleMouseDown);

    const onHoverMove = (e) => {
      if (!stopOnHover) return;
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      isHovering = mx >= 0 && mx <= rect.width && my >= 0 && my <= rect.height;
    };
    if (stopOnHover) canvas.addEventListener("mousemove", onHoverMove);

    const onCursorMove = (e) => {
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      if (mx >= 0 && mx <= rect.width && my >= 0 && my <= rect.height) {
        mouseRef.current = { x: mx + offsetX, y: my + offsetY };
      } else {
        mouseRef.current = null;
      }
    };
    const onCursorLeave = () => {
      mouseRef.current = null;
    };

    const onClick = (e) => {
      if (!cursorConfig.enabled || !cursorConfig.clickForce) return;
      const rect = container.getBoundingClientRect();
      const cx = e.clientX - rect.left + offsetX;
      const cy = e.clientY - rect.top + offsetY;
      const cRadiusSq = cursorRadius * cursorRadius;
      const cForce = cursorConfig.clickForce || 10;
      const curCanvasWidth = (container.clientWidth || 400) * canvasOverflowMultiplier;
      const curCanvasHeight = (container.clientHeight || 400) * canvasOverflowMultiplier;
      const curCamera = cameraRef.current;

      const ndcX = (cx / curCanvasWidth) * 2 - 1;
      const ndcY = 1 - (cy / curCanvasHeight) * 2;
      const ray = new Vector3(ndcX, ndcY, 0.5).unproject(curCamera);
      const camPos = new Vector3().setFromMatrixPosition(curCamera.matrixWorld);
      const dir = new Vector3().subVectors(ray, camPos).normalize();
      const spherePos = camPos.clone().addScaledVector(dir, camPos.distanceTo(new Vector3(0, 0, 0)));

      for (let i = 0; i < baseParticlePositionsRef.current.length; i++) {
        const bPos = baseParticlePositionsRef.current[i];
        const dPos = particleDisplacementsRef.current[i];
        const sVel = particleScatterVelocitiesRef.current[i];
        const worldPos = new Vector3().copy(bPos).add(dPos).applyMatrix4(particlesGroup.matrixWorld);
        const proj = worldPos.project(curCamera);
        const sx = (proj.x * 0.5 + 0.5) * curCanvasWidth;
        const sy = (-proj.y * 0.5 + 0.5) * curCanvasHeight;

        const dx = cx - sx;
        const dy = cy - sy;
        const distSq = dx * dx + dy * dy;
        if (distSq < cRadiusSq) {
          const sDist = Math.sqrt(distSq);
          const f = ((cursorRadius - sDist) / cursorRadius) * cForce;
          const rDir = new Vector3().subVectors(worldPos, spherePos);
          if (rDir.length() > 0.001) {
            rDir.normalize();
            const lScatter = rDir.multiplyScalar(f * 0.5).applyMatrix4(new Matrix4().copy(particlesGroup.matrixWorld).invert());
            sVel.add(lScatter);
          }
        }
      }
    };

    if (cursorConfig.enabled) {
      canvas.addEventListener("mousemove", onCursorMove);
      canvas.addEventListener("mouseleave", onCursorLeave);
      canvas.addEventListener("click", onClick);
    }

    const handleResize = () => {
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 400;
      const cw = w * canvasOverflowMultiplier;
      const ch = h * canvasOverflowMultiplier;
      const ox = (cw - w) / 2;
      const oy = (ch - h) / 2;

      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
      const camDist = Math.max(3, 1 * scaleMultiplier + 1);
      camera.position.z = camDist;

      renderer.setSize(cw, ch);
      canvas.style.left = `-${ox}px`;
      canvas.style.top = `-${oy}px`;
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
    };

    const ro = new ResizeObserver(() => handleResize());
    ro.observe(container);
    window.addEventListener("resize", handleResize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (drag) canvas.removeEventListener("mousedown", handleMouseDown);
      if (stopOnHover) canvas.removeEventListener("mousemove", onHoverMove);
      if (cursorConfig.enabled) {
        canvas.removeEventListener("mousemove", onCursorMove);
        canvas.removeEventListener("mouseleave", onCursorLeave);
        canvas.removeEventListener("click", onClick);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
      if (particlesRef.current) {
        if (particlesRef.current.geometry) particlesRef.current.geometry.dispose();
        if (particlesRef.current.material) {
          if (Array.isArray(particlesRef.current.material)) {
            particlesRef.current.material.forEach((m) => m.dispose());
          } else {
            particlesRef.current.material.dispose();
          }
        }
      }
    };
  }, [
    particlesCount,
    speed,
    smoothing,
    scale,
    stopOnHover,
    rotationDirection,
    dragSpeed,
    drag,
    particlesConfig,
    cursorConfig,
    cursorRadius,
    cursorStrength,
    sphereColor,
    rotationSpeed,
    scaleMultiplier,
    particleSize,
  ]);

  const containerStyle = {
    ...style,
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  };

  return (
    <div style={containerStyle}>
      <div ref={zoomProbeRef} style={{ position: "absolute", width: 20, height: 20, opacity: 0, pointerEvents: "none" }} />
      <div ref={containerRef} style={{ width: "100%", height: "100%", position: "relative", overflow: "visible" }} />
    </div>
  );
}
