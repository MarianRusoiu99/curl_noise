import React, { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";


const CameraController = () => {
   const { camera, gl } = useThree();
   camera.rotateX +=100 ;
   useEffect(
      () => {
         const controls = new OrbitControls(camera, gl.domElement);
         controls.minDistance = 2;
         controls.maxDistance = 2;
        
         return () => {
           controls.dispose();
         };
      },
      [camera, gl]
   );
   return null;
};

export default CameraController