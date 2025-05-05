import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'

const NavBarFunc = ({ setDropdownOpen, buttonRef, dropdownOpen, setDropdownOpenPedido, buttonRefPedido, toggleDropdownProduto, toggleDropdownPedido, buttonRefClients,toggleDropdownClients }) => {
  return (
    <ul className="flex gap-6 text-white text-sm font-medium items-center">
      {/* Dropdown de Produtos */}
      <li>
        <button
          ref={buttonRef}
          onClick={toggleDropdownProduto} // Usando a função para controlar o dropdown de Produtos
          className="bg-gray-800 rounded-full px-6 py-3 hover:bg-gray-600 focus:bg-gray-500 text-white flex items-center justify-center min-w-[120px] cursor-pointer"
        >
          <span className="leading-none mr-1">Produtos</span>
          <ChevronDown size={14} className="relative top-[1px]" />
        </button>
      </li>

      {/* Dropdown de Pedido */}
      <li>
        <button
          ref={buttonRefPedido}
          onClick={toggleDropdownPedido} // Usando a função para controlar o dropdown de Pedido
          className="bg-gray-800 rounded-full px-6 py-3 hover:bg-gray-600 focus:bg-gray-500 text-white flex items-center justify-center min-w-[120px] cursor-pointer"
        >
          <span className="leading-none mr-1">Pedidos</span>
          <ChevronDown size={14} className="relative top-[1px]" />
        </button>
      </li>
      <li>
        <button
          ref={buttonRefClients}
          onClick={toggleDropdownClients} // Usando a função para controlar o dropdown de Pedido
          className="bg-gray-800 rounded-full px-6 py-3 hover:bg-gray-600 focus:bg-gray-500 text-white flex items-center justify-center min-w-[120px] cursor-pointer"
        >
          <span className="leading-none mr-1">Clientes</span>
          <ChevronDown size={14} className="relative top-[1px]" />
        </button>
      </li>
    </ul>
  )
}

export default NavBarFunc
