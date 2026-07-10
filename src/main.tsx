import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { initializeReferenceData } from './lib/db'

async function bootstrap() {
  await initializeReferenceData()

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

bootstrap().catch(error => {
  console.error('Failed to initialize application reference data', error)
})
