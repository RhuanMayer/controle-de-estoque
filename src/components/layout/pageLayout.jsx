import React from 'react'
import Header from './Header';
import HeaderFunc from './HeaderFunc';
import { Outlet } from 'react-router-dom'

const GameLayout = () => {
  return (
    <div>
      <div>
      <Header />
      <HeaderFunc />
    </div>
      <main>
        <Outlet /> {/* ← Isso é o que mostra a página atual, tipo "Cidade" */}
      </main>
    </div>
  )
}

export default GameLayout
