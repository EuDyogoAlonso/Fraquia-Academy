import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // Importa o App do arquivo vizinho

// Injeta o componente principal (App) dentro da div com id="root" no index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
