import React from 'react'

import { useLoader } from '@react-three/fiber'
import { GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

function Model(props) {
    

    
        const gltf = useLoader(GLTFLoader, props.path);
        // console.log(gltf)    
        
  return (
   
    <primitive object={gltf.scene} scale={3} position={props.position} />
  
  )
}

export default Model