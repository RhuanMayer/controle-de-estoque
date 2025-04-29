import React from 'react'
import { Link } from 'react-router-dom'
import { User } from 'lucide-react';


const NavBar = () => {
  return (
    <ul className="flex gap-6 text-white text-sm font-medium items-center">
      <li><Link to="/inicio" className="bg-gray-800 rounded-full px-3 py-1 text-sm hover:bg-gray-700">Início</Link></li>
      <li>
        <Link 
          to="/perfil" 
          className="flex items-center justify-center w-10 h-10  rounded-full hover:bg-gray-700"
          title="Perfil"
        >
          <User size={25} />
        </Link>
      </li>
    </ul>
  )
}

export default NavBar
