import React from 'react';
import './App.css';
import ModelCarousel from "./Components/ModelCarousel"
import { Canvas} from '@react-three/fiber'
function App() {


  return (
    <div>
    <Canvas>
      <ModelCarousel/>
    </Canvas>
    </div>
  )
}

export default App;
