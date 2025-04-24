import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'

const NavBarFunc = ({setDropdownOpen, buttonRef }) => {
  return (
    <ul className="flex gap-6 text-white text-sm font-medium items-center">
      <li>
        <button
          ref={buttonRef}
          onClick={() => setDropdownOpen((prev) => !prev)} // Alterna entre abrir e fechar
          className="flex items-center gap-1 bg-gray-800 rounded-full px-3 py-1 hover:bg-gray-700"
        >
          <span className="leading-none">Produtos</span>
          <ChevronDown size={15} className="relative top-[1px]" />
        </button>
      </li>
      <li>
        <Link
          to="/reservas"
          className="bg-gray-800 rounded-full px-3 py-1 hover:bg-gray-700"
        >
          Reservas
        </Link>
      </li>
    </ul>
  )
}

export default NavBarFunc
