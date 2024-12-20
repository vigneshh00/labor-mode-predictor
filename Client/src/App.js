import { useRef } from "react";
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import About from "./Components/About";
import Highlights from "./Components/Highlights";
import Model from "./Components/Model";
import Navbar from "./Components/Navbar";
import Predict from "./Components/Predict";
import Visualize from "./Components/Visualize";

function App() {
  const aboutRef = useRef(null);
  const highlightRef = useRef(null);
  const modelRef = useRef(null);
  const predictRef = useRef(null);
  const visRef = useRef(null);

  return (
    <div style={{ backgroundColor: '#ffe6e6' }}>
      <Navbar
        refs={{ aboutRef, highlightRef, modelRef, predictRef, visRef }}
      />
      
      <About ref={aboutRef} />
      <Highlights ref={highlightRef} />
      <Model ref={modelRef} />
      <Predict ref={predictRef} />
      <Visualize ref={visRef} />
    </div>
  );
}

export default App;
