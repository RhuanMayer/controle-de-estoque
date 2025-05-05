// src/router/index.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import PageLayout from '../components/layout/pageLayout'
import Login from '../pages/Login'
import Inicio from '../pages/HomePage'
import Reserva from '../pages/Reserva'
import NotFound from '../pages/NotFound'
import CadastroProduto from '../pages/CadastroProduto'
import ConsultaProduto from '../pages/ConsultaProdutos'
import CadastroCategoria from '../pages/CadastroCategoria'

const Router = () => {
  return (
    <Routes>
      {/* Redirecionamento da raiz para login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Páginas públicas */}
      <Route path="/login" element={<Login />} />

      {/* Páginas com layout do jogo */}
      <Route element={<PageLayout />}>
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/reserva" element={<Reserva />} />
        <Route path="/cadastro-produto" element={<CadastroProduto />} />
        <Route path="/consulta-produto" element={<ConsultaProduto />} />
        <Route path="/cadastro-categoria" element={<CadastroCategoria />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default Router
