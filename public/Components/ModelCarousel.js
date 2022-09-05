import React, {Suspense, useEffect, useRef,useState} from 'react'
// import model from "../Assets/forest_house.glb"
import { Canvas, useFrame, useThree } from '@react-three/fiber'

import Model from "./Model"
import Camera from './Camera';
function ModelCarousel() {
    function importAll(r) {
        let models = {};
        r.keys().map((item, index) => ( models[item.replace('./', '')] = r(item) ));
        return models;
      }
      const models = importAll(require.context('../Assets', false, /\.(glb|gltf|obj)$/));  
    //   console.log(models)
      var keys = Object.keys(models).map((key)=>(models[key]));
    //   console.log(keys)


      const positions = [[0,0,0],[10,0,0],[120,30,-30],[30,0,0]]
 
     

  return (
    <div className='carousel'>
        <Suspense fallback={null}>
<Canvas style={{ background: "#171717" }}>
   
    <ambientLight />
    <pointLight></pointLight>
    {keys.map((model,index)=>(<Model  path={model} scale position={positions[index]}/>))}
    <Camera />
</Canvas>
</Suspense>

    </div>
   
  )
}

export default ModelCarousel