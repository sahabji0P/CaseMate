"use client";

import React, { useRef, forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  [key: string]: any;
}

export const Model = forwardRef<THREE.Group, ModelProps>((props, ref) => {
  const { nodes, materials } = useGLTF('/model/jason.glb');
  
  return (
    <group ref={ref} {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.227}>
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Object_2 as THREE.Mesh).geometry}
          material={materials.Jason_O_Material_u1_v1}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Object_3 as THREE.Mesh).geometry}
          material={materials.Jason_O_Material_u1_v1}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Object_4 as THREE.Mesh).geometry}
          material={materials.Jason_O_Material_u1_v1}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Object_5 as THREE.Mesh).geometry}
          material={materials.Jason_O_Material_u1_v1}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Object_6 as THREE.Mesh).geometry}
          material={materials.Jason_O_Material_u1_v1}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Object_7 as THREE.Mesh).geometry}
          material={materials.Jason_O_Material_u1_v1}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Object_8 as THREE.Mesh).geometry}
          material={materials.Jason_O_Material_u1_v1}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Object_9 as THREE.Mesh).geometry}
          material={materials.bottom}
        />
      </group>
    </group>
  );
});

Model.displayName = 'Model';

useGLTF.preload('/model/jason.glb'); 