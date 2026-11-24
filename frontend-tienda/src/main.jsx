import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.jsx'
import ChatWidget from './components/ChatWidget.jsx'
import Footer from './components/Footer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">
        <App />
      </div>
      <Footer />
    </div>
    <ChatWidget />
  </StrictMode>,
)
