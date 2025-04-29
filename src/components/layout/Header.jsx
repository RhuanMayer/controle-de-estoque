// src/components/layout/Header.jsx
import React from 'react'
import NavBar from './Navbar'

const Header = () => {
  return (
    <header className="bg-[#00454e] border-b border-none border-opacity-10 shadow-sm">
      <nav className="w-full mx-auto px-4 h-14 flex items-center justify-between">
        {/* LOGO */}
        <div className="text-white font-bold text-xl tracking-wider">
          EstoqueNet
        </div>

        {/* NAVBAR */}
        <NavBar />
      </nav>
    </header>
  )
}

export default Header
