import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// O "!" no final diz ao TypeScript: "Eu garanto que este elemento existe"
const rootElement = document.getElementById('root')!;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)