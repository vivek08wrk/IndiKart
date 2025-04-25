import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from "react"; 
import { Provider } from 'react-redux' 
import { Store } from './Redux/Store.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={Store}>
      <App />
  </Provider>

)
