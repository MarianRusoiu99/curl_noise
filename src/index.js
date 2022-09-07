
import './styles.css'
import App from './App'
import React from 'react';
import ReactDOM from 'react-dom/client';


// extend(THREE)

// window.addEventListener('resize', () =>
//   render(<App />, document.querySelector('canvas'), {
//     events,
//     linear: true,
//     camera: { fov: 25, position: [0, 0, 6] },
//     // https://barradeau.com/blog/?p=621
//     // This examples needs WebGL1 (?)
//     gl: new THREE.WebGL1Renderer({
//       canvas: document.querySelector('canvas'),
//       antialias: true,
//       alpha: true
//     })
//   })
// )

// window.dispatchEvent(new Event('resize'))

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);
// extend(THREE)

// window.addEventListener('resize', () =>
//   render(<App />, document.querySelector('canvas'), {
//     events,
//     linear: true,
//     camera: { fov: 25, position: [0, 0, 6] },
//     // https://barradeau.com/blog/?p=621
//     // This examples needs WebGL1 (?)
//     gl: new THREE.WebGL1Renderer({
//       canvas: document.querySelector('canvas'),
//       antialias: true,
//       alpha: true
//     })
//   })
// ,{ passive: true})

// window.dispatchEvent(new Event('resize'))
