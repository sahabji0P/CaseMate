"use client";

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Model } from './3d-model';
import * as THREE from 'three';

interface ModelViewerProps {
  className?: string;
}

export function ModelViewer({ className }: ModelViewerProps) {
  return (
    <div className={`w-24 h-24 ${className}`}>
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <RotatingModelWrapper />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Wrapper component to handle rotation
function RotatingModelWrapper() {
  const modelRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.5; // Adjust speed here
    }
  });
  
  return <Model ref={modelRef} position={[0, -9.0, 0]} scale={5} />;
} 