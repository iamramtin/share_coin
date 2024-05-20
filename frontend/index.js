import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { initContract } from './near-api'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';

const reactRoot = createRoot(document.querySelector('#root'));

window.nearInitPromise = initContract()
  .then(() => {
    reactRoot.render(<App/>);
  })
  .catch(e => {
    reactRoot.render(<div style={{color: 'red'}}>Error: <code>{e.message}</code></div>);
    console.error(e);
  });
