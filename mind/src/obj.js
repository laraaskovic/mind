import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const EnvironmentalTask = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer;
    let raycaster, mouse;
    const trees = [];

    const init = () => {
      // Initialize scene, camera, and renderer
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);

      // Initialize raycaster and mouse
      raycaster = new THREE.Raycaster();
      mouse = new THREE.Vector2();

      // Create ground
      const groundGeometry = new THREE.PlaneGeometry(100, 100);
      const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      scene.add(ground);

      // Ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      // Directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      // Event listeners
      window.addEventListener('resize', onWindowResize);
      mountRef.current.addEventListener('click', onCanvasClick);

      // Camera position
      camera.position.set(0, 10, 20);
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const onCanvasClick = (event) => {
      // Calculate mouse position relative to the canvas
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Raycast from camera to scene
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0) {
        // Plant a tree at the intersection point
        const tree = createTree();
        tree.position.copy(intersects[0].point);
        scene.add(tree);
        trees.push(tree);
      }
    };

    const createTree = () => {
      const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 16);
      const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);

      const crownGeometry = new THREE.ConeGeometry(3, 8, 16);
      const crownMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22 });
      const crown = new THREE.Mesh(crownGeometry, crownMaterial);

      crown.position.y = 6; // Set crown position on top of the trunk

      const tree = new THREE.Group();
      tree.add(trunk);
      tree.add(crown);

      return tree;
    };

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    init();
    // Start the animation loop
    animate();

    // Cleanup
    return () => {
      // Remove event listeners
      window.removeEventListener('resize', onWindowResize);
      mountRef.current.removeEventListener('click', onCanvasClick);
      // Clean up Three.js objects
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} />;
};

export default EnvironmentalTask;
