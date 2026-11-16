'use client';

import * as React from 'react';
import * as THREE from 'three';

export interface ArchitectureOrbCanvasProps {
  variant?: 'hero' | 'compact';
  onWebGLError?: () => void;
  onTelemetryUpdate?: (coords: { rx: string; ry: string; nodes: number }) => void;
}

export function ArchitectureOrbCanvas({
  variant = 'hero',
  onWebGLError,
  onTelemetryUpdate,
}: ArchitectureOrbCanvasProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const onWebGLErrorRef = React.useRef(onWebGLError);
  const onTelemetryUpdateRef = React.useRef(onTelemetryUpdate);
  React.useEffect(() => {
    onWebGLErrorRef.current = onWebGLError;
    onTelemetryUpdateRef.current = onTelemetryUpdate;
  }, [onWebGLError, onTelemetryUpdate]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'default',
      });
    } catch {
      onWebGLErrorRef.current?.();
      return;
    }

    const rect = container.getBoundingClientRect();
    const width = Math.max(rect.width || container.clientWidth || (variant === 'hero' ? 360 : 260), 200);
    const height = Math.max(rect.height || container.clientHeight || (variant === 'hero' ? 320 : 240), 200);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);

    const canvasEl = renderer.domElement;
    canvasEl.style.width = '100%';
    canvasEl.style.height = '100%';
    canvasEl.style.display = 'block';
    canvasEl.style.touchAction = 'none';
    canvasEl.style.cursor = 'grab';

    container.innerHTML = '';
    container.appendChild(canvasEl);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);

    // Dynamically adjust camera distance so orbital rings (radius 2.34) never clip vertically or horizontally
    const updateCameraDistance = (w: number, h: number) => {
      const aspect = w / Math.max(h, 1);
      const baseZ = variant === 'hero' ? 7.45 : 7.8;
      camera.aspect = aspect;
      camera.position.set(0, 0, aspect < 1 ? baseZ / Math.max(aspect, 0.72) : baseZ);
      camera.updateProjectionMatrix();
    };
    updateCameraDistance(width, height);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const geometriesToDispose: THREE.BufferGeometry[] = [];
    const materialsToDispose: THREE.Material[] = [];

    // Lighting in studio palette
    const ambientLight = new THREE.AmbientLight(0xeee6e2, 1.35);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xeee6e2, 1.8);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf7623d, 1.4);
    rimLight.position.set(-5, -3, 4);
    scene.add(rimLight);

    // 1. Outer wireframe geodesic icosahedron in deep teal #1E5A54
    const outerGeo = new THREE.IcosahedronGeometry(1.78, 1);
    const outerWireGeo = new THREE.WireframeGeometry(outerGeo);
    const outerWireMat = new THREE.LineBasicMaterial({
      color: 0x1e5a54,
      transparent: true,
      opacity: 0.45,
    });
    const outerWireMesh = new THREE.LineSegments(outerWireGeo, outerWireMat);
    rootGroup.add(outerWireMesh);
    geometriesToDispose.push(outerGeo, outerWireGeo);
    materialsToDispose.push(outerWireMat);

    // 2. Inner faceted core octasphere in warm matte teal #1E5A54
    const coreGeo = new THREE.IcosahedronGeometry(0.96, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x1e5a54,
      roughness: 0.62,
      metalness: 0.12,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);
    geometriesToDispose.push(coreGeo);
    materialsToDispose.push(coreMat);

    // Core wireframe accent overlay in cream #EEE6E2
    const coreEdgesGeo = new THREE.EdgesGeometry(coreGeo);
    const coreEdgesMat = new THREE.LineBasicMaterial({
      color: 0xeee6e2,
      transparent: true,
      opacity: 0.55,
    });
    const coreEdges = new THREE.LineSegments(coreEdgesGeo, coreEdgesMat);
    coreMesh.add(coreEdges);
    geometriesToDispose.push(coreEdgesGeo);
    materialsToDispose.push(coreEdgesMat);

    // 3. Two tilted orbital rings in #1E5A54 and #F7623D
    const ringGeo1 = new THREE.TorusGeometry(2.15, 0.014, 12, 96);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x1e5a54,
      transparent: true,
      opacity: 0.55,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2.7;
    ring1.rotation.y = Math.PI / 7;
    rootGroup.add(ring1);
    geometriesToDispose.push(ringGeo1);
    materialsToDispose.push(ringMat1);

    const ringGeo2 = new THREE.TorusGeometry(2.34, 0.016, 12, 96);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xf7623d,
      transparent: true,
      opacity: 0.72,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 3.1;
    ring2.rotation.y = -Math.PI / 5;
    rootGroup.add(ring2);
    geometriesToDispose.push(ringGeo2);
    materialsToDispose.push(ringMat2);

    // 4. 12 satellite telemetry nodes + vector struts
    const baseIco = new THREE.IcosahedronGeometry(1.78, 0);
    const posAttr = baseIco.getAttribute('position');
    const uniqueVertices: THREE.Vector3[] = [];
    for (let i = 0; i < posAttr.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(posAttr, i);
      if (!uniqueVertices.some((u) => u.distanceTo(v) < 0.05)) {
        uniqueVertices.push(v);
      }
    }
    geometriesToDispose.push(baseIco);

    const nodeSphereGeo = new THREE.SphereGeometry(0.068, 12, 12);
    const orangeNodeMat = new THREE.MeshBasicMaterial({ color: 0xf7623d });
    const tealNodeMat = new THREE.MeshBasicMaterial({ color: 0x1e5a54 });
    const strutMat = new THREE.LineBasicMaterial({
      color: 0x1e5a54,
      transparent: true,
      opacity: 0.28,
    });
    geometriesToDispose.push(nodeSphereGeo);
    materialsToDispose.push(orangeNodeMat, tealNodeMat, strutMat);

    uniqueVertices.slice(0, 12).forEach((vertex, idx) => {
      const isAccent = idx % 3 === 0;
      const nodeMesh = new THREE.Mesh(
        nodeSphereGeo,
        isAccent ? orangeNodeMat : tealNodeMat
      );
      nodeMesh.position.copy(vertex);
      rootGroup.add(nodeMesh);

      const strutPoints = [
        vertex.clone().multiplyScalar(0.54),
        vertex.clone(),
      ];
      const strutGeo = new THREE.BufferGeometry().setFromPoints(strutPoints);
      const strutLine = new THREE.Line(strutGeo, strutMat);
      rootGroup.add(strutLine);
      geometriesToDispose.push(strutGeo);
    });

    // Theme reactivity: dynamically adapt 3D materials to light / dark theme
    const updateColorsForTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        outerWireMat.color.setHex(0x292d32);
        coreMat.color.setHex(0x1d2025);
        coreEdgesMat.color.setHex(0xd9dde2);
        ringMat1.color.setHex(0x292d32);
        ringMat2.color.setHex(0xff642d);
        orangeNodeMat.color.setHex(0xff642d);
        tealNodeMat.color.setHex(0xd9dde2);
        strutMat.color.setHex(0x292d32);
        ambientLight.color.setHex(0x15181c);
        keyLight.color.setHex(0xf5f1ea);
        rimLight.color.setHex(0xff642d);
      } else {
        outerWireMat.color.setHex(0x1e5a54);
        coreMat.color.setHex(0x1e5a54);
        coreEdgesMat.color.setHex(0xeee6e2);
        ringMat1.color.setHex(0x1e5a54);
        ringMat2.color.setHex(0xf7623d);
        orangeNodeMat.color.setHex(0xf7623d);
        tealNodeMat.color.setHex(0x1e5a54);
        strutMat.color.setHex(0x1e5a54);
        ambientLight.color.setHex(0xeee6e2);
        keyLight.color.setHex(0xeee6e2);
        rimLight.color.setHex(0xf7623d);
      }
    };
    updateColorsForTheme();

    const themeObserver = new MutationObserver(() => {
      updateColorsForTheme();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Unified Desktop Mouse + Mobile/iPad Touch & Drag Interaction State
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let dragOffsetY = 0;
    let dragOffsetX = 0;
    let targetDragY = 0;
    let targetDragX = 0;
    let isDragging = false;
    let lastTouchX = 0;
    let lastTouchY = 0;
    let scrollRotation = 0;
    let isVisible = true;
    let frameCount = 0;
    let rafId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - lastTouchX;
        const dy = e.clientY - lastTouchY;
        lastTouchX = e.clientX;
        lastTouchY = e.clientY;
        targetDragY += dx * 0.012;
        targetDragX += dy * 0.012;
      }
      targetMouseX = (e.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
      targetMouseY = -(e.clientY / Math.max(window.innerHeight, 1)) * 2 + 1;
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastTouchX = e.clientX;
      lastTouchY = e.clientY;
      canvasEl.style.cursor = 'grabbing';
    };

    const handleMouseUp = () => {
      isDragging = false;
      canvasEl.style.cursor = 'grab';
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        isDragging = true;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return;
      if (e.cancelable) e.preventDefault();
      const touch = e.touches[0];
      const dx = touch.clientX - lastTouchX;
      const dy = touch.clientY - lastTouchY;
      lastTouchX = touch.clientX;
      lastTouchY = touch.clientY;

      targetDragY += dx * 0.016;
      targetDragX += dy * 0.016;

      const cRect = container.getBoundingClientRect();
      if (cRect.width > 0 && cRect.height > 0) {
        targetMouseX = ((touch.clientX - cRect.left) / cRect.width) * 2 - 1;
        targetMouseY = -((touch.clientY - cRect.top) / cRect.height) * 2 + 1;
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    const handleScroll = () => {
      scrollRotation = window.scrollY * 0.0012;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    canvasEl.addEventListener('mousedown', handleMouseDown);
    canvasEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvasEl.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvasEl.addEventListener('touchend', handleTouchEnd, { passive: true });
    canvasEl.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (!renderer) return;
        const { width: nextW, height: nextH } = entry.contentRect;
        if (nextW > 0 && nextH > 0) {
          updateCameraDistance(nextW, nextH);
          renderer.setSize(nextW, nextH, false);
        }
      }
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.01 }
    );
    intersectionObserver.observe(container);

    const clock = new THREE.Clock();

    const animate = () => {
      rafId = window.requestAnimationFrame(animate);
      if (!isVisible || !renderer) return;

      const elapsed = clock.getElapsedTime();

      currentMouseX += (targetMouseX - currentMouseX) * 0.08;
      currentMouseY += (targetMouseY - currentMouseY) * 0.08;
      dragOffsetY += (targetDragY - dragOffsetY) * 0.12;
      dragOffsetX += (targetDragX - dragOffsetX) * 0.12;

      rootGroup.rotation.y =
        elapsed * 0.22 + currentMouseX * 0.45 + dragOffsetY + scrollRotation;
      rootGroup.rotation.x =
        Math.sin(elapsed * 0.35) * 0.12 -
        currentMouseY * 0.35 +
        dragOffsetX +
        scrollRotation * 0.4;

      coreMesh.rotation.y = -elapsed * 0.28 - dragOffsetY * 0.5;
      coreMesh.rotation.z = elapsed * 0.14;

      ring1.rotation.z = elapsed * 0.24 + dragOffsetY * 0.3;
      ring2.rotation.z = -elapsed * 0.32 - dragOffsetX * 0.3;

      renderer.render(scene, camera);

      frameCount++;
      if (frameCount % 15 === 0 && onTelemetryUpdateRef.current) {
        onTelemetryUpdateRef.current({
          rx: (rootGroup.rotation.x * 57.2958).toFixed(1),
          ry: (((rootGroup.rotation.y * 57.2958) % 360 + 360) % 360).toFixed(1),
          nodes: 12,
        });
      }
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('scroll', handleScroll);
      canvasEl.removeEventListener('mousedown', handleMouseDown);
      canvasEl.removeEventListener('touchstart', handleTouchStart);
      canvasEl.removeEventListener('touchmove', handleTouchMove);
      canvasEl.removeEventListener('touchend', handleTouchEnd);
      canvasEl.removeEventListener('touchcancel', handleTouchEnd);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();

      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, [variant]);

  return (
    <div
      ref={containerRef}
      data-testid="orb-webgl-canvas"
      className="relative h-full w-full select-none touch-none"
      aria-hidden="true"
    />
  );
}

export default ArchitectureOrbCanvas;
