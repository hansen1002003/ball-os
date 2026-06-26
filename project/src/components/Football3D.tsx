import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Football3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current || rendererRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 5, 5);
    keyLight.castShadow = false;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x4fc3f7, 0.6);
    fillLight.position.set(-5, 2, 5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x81d4fa, 0.8);
    rimLight.position.set(0, -5, -5);
    scene.add(rimLight);

    const backLight = new THREE.PointLight(0x00bcd4, 0.5, 10);
    backLight.position.set(-2, 3, -2);
    scene.add(backLight);

    // Ball Group
    const ballGroup = new THREE.Group();
    scene.add(ballGroup);

    // Create ball geometry using icosahedron for panel pattern
    const ballRadius = 1;
    const ballGeometry = new THREE.IcosahedronGeometry(ballRadius, 2);

    // Create canvas texture for the ball pattern
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Draw base white
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, 1024, 512);

    // Draw subtle noise/grain
    for (let i = 0; i < 5000; i++) {
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.03})`;
      ctx.fillRect(Math.random() * 1024, Math.random() * 512, 2, 2);
    }

    // Draw hexagonal pattern
    const hexRadius = 55;
    const cols = 18;
    const rows = 9;

    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        const xOffset = (c % 2) * hexRadius * 0.5;
        const cx = c * hexRadius * 1.5 + 50;
        const cy = r * hexRadius * Math.sqrt(3) + xOffset + 50;

        if (cx < 0 || cx > 1024 || cy < 0 || cy > 512) continue;

        const pattern = (r + c) % 3;

        if (pattern === 0) {
          // Black hex
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const px = cx + hexRadius * 0.85 * Math.cos(angle);
            const py = cy + hexRadius * 0.85 * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fillStyle = '#1a1a2e';
          ctx.fill();
          ctx.strokeStyle = '#2d2d4a';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (pattern === 1) {
          // Neon blue hex
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const px = cx + hexRadius * 0.85 * Math.cos(angle);
            const py = cy + hexRadius * 0.85 * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, hexRadius);
          gradient.addColorStop(0, '#00d4ff');
          gradient.addColorStop(0.7, '#0099cc');
          gradient.addColorStop(1, '#0066aa');
          ctx.fillStyle = gradient;
          ctx.fill();
          ctx.strokeStyle = '#00eeff';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Inner glow
          ctx.beginPath();
          ctx.arc(cx, cy, hexRadius * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
          ctx.fill();
        } else {
          // White hex with subtle outline
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const px = cx + hexRadius * 0.85 * Math.cos(angle);
            const py = cy + hexRadius * 0.85 * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fillStyle = '#e8e8e8';
          ctx.fill();
          ctx.strokeStyle = '#cccccc';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Draw subtle seam lines
    ctx.strokeStyle = 'rgba(100,100,100,0.15)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(0, Math.random() * 512);
      ctx.lineTo(1024, Math.random() * 512);
      ctx.stroke();
    }

    const ballTexture = new THREE.CanvasTexture(canvas);
    ballTexture.wrapS = THREE.RepeatWrapping;
    ballTexture.wrapT = THREE.RepeatWrapping;
    ballTexture.anisotropy = 16;

    // Normal map for texture
    const normalCanvas = document.createElement('canvas');
    normalCanvas.width = 512;
    normalCanvas.height = 256;
    const nCtx = normalCanvas.getContext('2d')!;
    nCtx.fillStyle = '#8080ff';
    nCtx.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 256;
      const r = Math.random() * 3;
      nCtx.fillStyle = `rgba(128,128,${Math.floor(200 + Math.random() * 55)},255)`;
      nCtx.fillRect(x, y, r, r);
    }
    const normalMap = new THREE.CanvasTexture(normalCanvas);

    const ballMaterial = new THREE.MeshStandardMaterial({
      map: ballTexture,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.3, 0.3),
      roughness: 0.35,
      metalness: 0.05,
      envMapIntensity: 1.0,
    });

    const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
    ballGroup.add(ballMesh);

    // Subtle specular highlight ring
    const ringGeometry = new THREE.RingGeometry(1.01, 1.03, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    ballGroup.add(ring);

    // Outer glow
    const glowGeometry = new THREE.SphereGeometry(1.15, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.03,
      side: THREE.BackSide,
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    ballGroup.add(glowMesh);

    // Floating particles
    const particleCount = 40;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5 + Math.random() * 0.8;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      particleSizes[i] = Math.random() * 0.03 + 0.01;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00d4ff,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    ballGroup.add(particles);

    // Animation
    const clock = new THREE.Clock();

    function animate() {
      frameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth rotation
      ballGroup.rotation.y = elapsed * 0.4;
      ballGroup.rotation.x = Math.sin(elapsed * 0.3) * 0.15;
      ballGroup.rotation.z = Math.cos(elapsed * 0.2) * 0.05;

      // Floating effect
      ballGroup.position.y = Math.sin(elapsed * 0.8) * 0.08;

      // Ring pulse
      ring.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.02);
      ringMaterial.opacity = 0.05 + Math.sin(elapsed * 1.5) * 0.03;

      // Glow pulse
      glowMaterial.opacity = 0.02 + Math.sin(elapsed * 1.2) * 0.015;

      // Particle rotation
      particles.rotation.y = -elapsed * 0.1;
      particles.rotation.x = elapsed * 0.05;

      renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      rendererRef.current = null;
      ballGeometry.dispose();
      ballMaterial.dispose();
      ballTexture.dispose();
      normalMap.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  );
}
