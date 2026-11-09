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

  // Keep latest callbacks in refs so state updates in parent never recreate the WebGL context
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
    camera.position.set(0, 0, variant === 'hero' ? 6.0 : 6.4);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const geometriesToDispose: THREE.BufferGeometry[] = [];
    const materialsToDispose: THREE.Material[] = [];

    // Lighting in studio palette
    const ambientLight = new THREE.AmbientLight(0xeee6e2, 1.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xeee6e2, 2.0);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf7623d, 1.6);
    rimLight.position.set(-5, -3, 4);
    scene.add(rimLight);

    // 1. Outer wireframe geodesic icosahedron in deep teal #1E5A54
    const outerGeo = new THREE.IcosahedronGeometry(1.78, 1);
    const outerWireGeo = new THREE.WireframeGeometry(outerGeo);
    const outerWireMat = new THREE.LineBasicMaterial({
      color: 0x1e5a54,
      transparent: true,
      opacity: 0.5,
    });
    const outerWireMesh = new THREE.LineSegments(outerWireGeo, outerWireMat);
    rootGroup.add(outerWireMesh);
    geometriesToDispose.push(outerGeo, outerWireGeo);
    materialsToDispose.push(outerWireMat);

    // 2. Inner faceted core octasphere in warm matte teal #1E5A54
    const coreGeo = new THREE.IcosahedronGeometry(0.96, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x1e5a54,
      roughness: 0.55,
      metalness: 0.18,
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
      opacity: 0.65,
    });
    const coreEdges = new THREE.LineSegments(coreEdgesGeo, coreEdgesMat);
    coreMesh.add(coreEdges);
    geometriesToDispose.push(coreEdgesGeo);
    materialsToDispose.push(coreEdgesMat);

    // 3. Two tilted orbital rings in #1E5A54 and #F7623D
    const ringGeo1 = new THREE.TorusGeometry(2.15, 0.016, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x1e5a54,
      transparent: true,
      opacity: 0.6,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2.7;
    ring1.rotation.y = Math.PI / 7;
    rootGroup.add(ring1);
    geometriesToDispose.push(ringGeo1);
    materialsToDispose.push(ringMat1);

    const ringGeo2 = new THREE.TorusGeometry(2.34, 0.018, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xf7623d,
      transparent: true,
      opacity: 0.85,
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

    const nodeSphereGeo = new THREE.SphereGeometry(0.075, 16, 16);
    const orangeNodeMat = new THREE.MeshBasicMaterial({ color: 0xf7623d });
    const tealNodeMat = new THREE.MeshBasicMaterial({ color: 0x1e5a54 });
    const strutMat = new THREE.LineBasicMaterial({
      color: 0x1e5a54,
      transparent: true,
      opacity: 0.32,
    });
    geometriesToDispose.push(nodeSphereGeo);
    materialsToDispose.push(orangeNodeMat, tealNodeMat, strutMat);

    const nodeMeshes: THREE.Mesh[] = [];
    uniqueVertices.slice(0, 12).forEach((vertex, idx) => {
      const isAccent = idx % 3 === 0;
      const nodeMesh = new THREE.Mesh(
        nodeSphereGeo,
        isAccent ? orangeNodeMat : tealNodeMat
      );
      nodeMesh.position.copy(vertex);
      rootGroup.add(nodeMesh);
      nodeMeshes.push(nodeMesh);

      const strutPoints = [
        vertex.clone().multiplyScalar(0.54),
        vertex.clone(),
      ];
      const strutGeo = new THREE.BufferGeometry().setFromPoints(strutPoints);
      const strutLine = new THREE.Line(strutGeo, strutMat);
      rootGroup.add(strutLine);
      geometriesToDispose.push(strutGeo);
    });

    // Interaction state (hover + click-and-drag orbit)
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let scrollRotation = 0;
    let frameCount = 0;
    let rafId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
      container.setPointerCapture?.(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevPointerX;
      const dy = e.clientY - prevPointerY;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
      dragOffsetY += dx * 0.012;
      dragOffsetX += dy * 0.012;
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      container.releasePointerCapture?.(e.pointerId);
    };

    const handleScroll = () => {
      scrollRotation = window.scrollY * 0.0015;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('pointerdown', handlePointerDown);
    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('pointercancel', handlePointerUp);

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

    const clock = new THREE.Clock();

    const animate = () => {
      rafId = window.requestAnimationFrame(animate);
      if (!renderer) return;

      const elapsed = clock.getElapsedTime();

      currentMouseX += (targetMouseX - currentMouseX) * 0.08;
      currentMouseY += (targetMouseY - currentMouseY) * 0.08;

      // Smooth continuous 3D rotation + interactive pointer & drag control
      rootGroup.rotation.y =
        elapsed * 0.42 + currentMouseX * 0.55 + dragOffsetY + scrollRotation;
      rootGroup.rotation.x =
        Math.sin(elapsed * 0.5) * 0.22 -
        currentMouseY * 0.45 +
        dragOffsetX +
        scrollRotation * 0.4;

      // Counter-rotating inner faceted core
      coreMesh.rotation.y = -elapsed * 0.65;
      coreMesh.rotation.z = elapsed * 0.35;

      // Dynamic orbital rings
      ring1.rotation.z = elapsed * 0.55;
      ring1.rotation.x = Math.PI / 2.7 + Math.sin(elapsed * 0.4) * 0.15;
      ring2.rotation.z = -elapsed * 0.68;
      ring2.rotation.y = -Math.PI / 5 + Math.cos(elapsed * 0.45) * 0.15;

      // Subtle node pulse
      const pulse = 1 + Math.sin(elapsed * 3.0) * 0.14;
      nodeMeshes.forEach((mesh, idx) => {
        if (idx % 3 === 0) {
          mesh.scale.setScalar(pulse);
        }
      });

      renderer.render(scene, camera);

      frameCount++;
      if (frameCount % 12 === 0 && onTelemetryUpdateRef.current) {
        const degX = ((rootGroup.rotation.x * 57.2958) % 360).toFixed(1);
        const degY = (((rootGroup.rotation.y * 57.2958) % 360 + 360) % 360).toFixed(1);
        onTelemetryUpdateRef.current({
          rx: degX,
          ry: degY,
          nodes: 12,
        });
      }
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      container.removeEventListener('pointerdown', handlePointerDown);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('pointercancel', handlePointerUp);
      resizeObserver.disconnect();

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
      title="Drag to rotate 3D Node Topology"
      className="relative h-full w-full select-none cursor-grab active:cursor-grabbing touch-none"
    />
  );
}

export default ArchitectureOrbCanvas;
