import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Hero3D() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Group to hold all 3D floating objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Center Glass 3D Card
    const cardGeometry = new THREE.BoxGeometry(3.2, 2.0, 0.15);
    
    // Glass physical material
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x2563eb,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.9, // Translucency
      thickness: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
      transparent: true,
      opacity: 0.85
    });

    const cardMesh = new THREE.Mesh(cardGeometry, glassMaterial);
    cardMesh.rotation.x = 0.2;
    cardMesh.rotation.y = -0.3;
    cardGroupAdd(cardMesh);

    // 2. Glossy Metallic Ring Surrounding the Card
    const torusGeometry = new THREE.TorusGeometry(2.4, 0.05, 16, 100);
    const torusMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4
    });
    const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
    torusMesh.rotation.x = Math.PI / 3;
    mainGroup.add(torusMesh);

    // 3. Floating Orb Nodes (Representing Approvals & Employees)
    const orbGroup = new THREE.Group();
    const orbColors = [0x10b981, 0x3b82f6, 0xf59e0b, 0x8b5cf6];
    const orbs = [];

    for (let i = 0; i < 6; i++) {
      const radius = 0.25 + Math.random() * 0.15;
      const orbGeo = new THREE.SphereGeometry(radius, 32, 32);
      const orbMat = new THREE.MeshStandardMaterial({
        color: orbColors[i % orbColors.length],
        metalness: 0.8,
        roughness: 0.2,
        emissive: orbColors[i % orbColors.length],
        emissiveIntensity: 0.3
      });
      const orb = new THREE.Mesh(orbGeo, orbMat);

      // Random spherical distribution
      const angle = (i / 6) * Math.PI * 2;
      const dist = 2.2 + Math.random() * 0.5;
      orb.position.set(
        Math.cos(angle) * dist,
        (Math.sin(angle * 2) * 0.8),
        Math.sin(angle) * dist * 0.5
      );

      orb.userData = {
        baseY: orb.position.y,
        speed: 0.001 + Math.random() * 0.002,
        offset: Math.random() * Math.PI * 2
      };

      orbs.push(orb);
      orbGroup.add(orb);
    }
    mainGroup.add(orbGroup);

    function cardGroupAdd(mesh) {
      mainGroup.add(mesh);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x38bdf8, 3, 20);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 2.5, 20);
    pointLight2.position.set(-5, -3, 3);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x10b981, 2, 15);
    pointLight3.position.set(0, 4, -3);
    scene.add(pointLight3);

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      mouseX = (x / rect.width) * 2;
      mouseY = -(y / rect.height) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      mainGroup.rotation.y = targetX * 0.4 + elapsedTime * 0.15;
      mainGroup.rotation.x = targetY * 0.3 + Math.sin(elapsedTime * 0.5) * 0.1;
      torusMesh.rotation.z = elapsedTime * 0.2;

      // Floating Orbs animation
      orbs.forEach(orb => {
        orb.position.y = orb.userData.baseY + Math.sin(elapsedTime * 2 + orb.userData.offset) * 0.15;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '420px' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', absolute: 'inset-0' }} />
      {/* Floating 3D Badge Overlay */}
      <div 
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(18, 26, 44, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '8px 18px',
          borderRadius: '9999px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap'
        }}
      >
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>
          Real-Time Leave Balance Engine Active
        </span>
      </div>
    </div>
  );
}
