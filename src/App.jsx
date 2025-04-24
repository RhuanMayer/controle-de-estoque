// src/App.jsx
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Router from './router' // importa o arquivo com suas rotas


const App = () => {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  )
}

export default App
