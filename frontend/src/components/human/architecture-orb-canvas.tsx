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
      const testCanvas = document.createElement('canvas');
      const gl =
        testCanvas.getContext('webgl') ||
        testCanvas.getContext('experimental-webgl');
      if (!gl) {
        onWebGLErrorRef.current?.();
        return;
      }

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      onWebGLErrorRef.current?.();
      return;
    }

    const width = container.clientWidth || (variant === 'hero' ? 420 : 280);
    const height = container.clientHeight || (variant === 'hero' ? 420 : 280);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, variant === 'hero' ? 6.2 : 6.6);

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

    // Interaction state
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let scrollRotation = 0;
    let isVisible = true;
    let frameCount = 0;
    let rafId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      scrollRotation = window.scrollY * 0.0012;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (!renderer) return;
        const { width: nextW, height: nextH } = entry.contentRect;
        if (nextW > 0 && nextH > 0) {
          camera.aspect = nextW / nextH;
          camera.updateProjectionMatrix();
          renderer.setSize(nextW, nextH);
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
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    const clock = new THREE.Clock();

    const animate = () => {
      rafId = window.requestAnimationFrame(animate);
      if (!isVisible || !renderer) return;

      const elapsed = clock.getElapsedTime();

      currentMouseX += (targetMouseX - currentMouseX) * 0.06;
      currentMouseY += (targetMouseY - currentMouseY) * 0.06;

      rootGroup.rotation.y =
        elapsed * 0.18 + currentMouseX * 0.45 + scrollRotation;
      rootGroup.rotation.x =
        Math.sin(elapsed * 0.35) * 0.12 -
        currentMouseY * 0.35 +
        scrollRotation * 0.4;

      coreMesh.rotation.y = -elapsed * 0.28;
      coreMesh.rotation.z = elapsed * 0.14;

      ring1.rotation.z = elapsed * 0.24;
      ring2.rotation.z = -elapsed * 0.32;

      renderer.render(scene, camera);

      frameCount++;
      if (frameCount % 20 === 0 && onTelemetryUpdate) {
        onTelemetryUpdateRef.current?.({
          rx: (rootGroup.rotation.x * 57.2958).toFixed(1),
          ry: ((rootGroup.rotation.y * 57.2958) % 360).toFixed(1),
          nodes: 12,
        });
      }
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  return (
    <div
      ref={containerRef}
      data-testid="orb-webgl-canvas"
      className="relative h-full w-full select-none"
      aria-hidden="true"
    />
  );
}

export default ArchitectureOrbCanvas;
