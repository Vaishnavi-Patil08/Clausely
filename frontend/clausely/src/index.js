// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import "./index.css";
   
// add the extension or remove the line if the file is gone
import App from './App.js';                  // ⬅ add “.js”
import reportWebVitals from './reportWebVitals.js';  // ⬅ add “.js” or remove both lines

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// call only if you kept the file
reportWebVitals();
