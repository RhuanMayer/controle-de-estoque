import React from 'react'
import { Link } from 'react-router-dom'


const NavBar = () => {
  return (
    <ul className="flex gap-6 text-white text-sm font-medium items-center">
      <li><Link to="/inicio" className="bg-gray-800 rounded-full px-3 py-1 text-sm hover:bg-gray-700">Início</Link></li>
      <li><Link to="/reservas" className="bg-gray-800 rounded-full px-3 py-1 text-sm hover:bg-gray-700">Reservas</Link></li>
    </ul>
  )
}

export default NavBar
