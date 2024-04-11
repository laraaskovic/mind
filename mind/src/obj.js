// EnvironmentalTask.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';



const EnvironmentalTask = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer;
    let raycaster, mouse;
    const trees = [];

    const init = () => {

      scene = new THREE.Scene();
      
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);

      // Initialize raycaster and mouse
      raycaster = new THREE.Raycaster();
      mouse = new THREE.Vector2();

      // Create ground
      const groundGeometry = new THREE.PlaneGeometry(100, 100);
      const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      scene.add(ground);

      // Event listeners
      mountRef.current.addEventListener('click', onCanvasClick, false);
      window.addEventListener('resize', onWindowResize, false);

      // Camera position
      camera.position.set(0, 10, 20);
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };


    const onCanvasClick = (event) => {
      // Calculate mouse position
      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
      // Raycast from camera to scene
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0) {
        // Plant a tree at the intersection point
        const treeGeometry = new THREE.CylinderGeometry(1, 1, 10, 8);
        const treeMaterial = new THREE.MeshBasicMaterial({ color: 0x663300 });
        const tree = new THREE.Mesh(treeGeometry, treeMaterial);
        tree.position.copy(intersects[0].point);
        scene.add(tree);
        trees.push(tree);
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);

      renderer.render(scene, camera);
    };

    init();
    animate();

    // Cleanup
    return () => {
      mountRef.current.removeEventListener('click', onCanvasClick);
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default EnvironmentalTask;
