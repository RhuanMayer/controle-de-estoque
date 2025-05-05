import React, { useState, useRef, useEffect } from 'react'
import NavBarFunc from './NavBarFunc'
import { Link } from 'react-router-dom'

const HeaderFunc = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false) // Para o dropdown de Produtos
  const [dropdownOpenPedido, setDropdownOpenPedido] = useState(false) // Para o dropdown de Pedido
  const [dropdownOpenClients, setDropdownOpenClients] = useState(false) // Para o dropdown de Clientes
  
  // Refs para os dropdowns
  const dropdownRef = useRef(null)
  const dropdownRefPedido = useRef(null)
  const dropdownRefClients = useRef(null)
  
  // Refs para os botões
  const buttonRef = useRef(null)
  const buttonRefPedido = useRef(null)
  const buttonRefClients = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        buttonRefPedido.current &&
        !buttonRefPedido.current.contains(event.target) &&
        buttonRefClients.current &&
        !buttonRefClients.current.contains(event.target)
      ) {
        setDropdownOpen(false)
        setDropdownOpenPedido(false)
        setDropdownOpenClients(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDropdownProduto = () => {
    setDropdownOpen(!dropdownOpen)
    setDropdownOpenPedido(false)
    setDropdownOpenClients(false)
  }

  const toggleDropdownPedido = () => {
    setDropdownOpenPedido(!dropdownOpenPedido)
    setDropdownOpen(false)
    setDropdownOpenClients(false)
  }

  const toggleDropdownClients = () => {
    setDropdownOpenClients(!dropdownOpenClients)
    setDropdownOpen(false)
    setDropdownOpenPedido(false)
  }

  return (
    <header className="bg-[#013638] shadow-sm relative z-50">
      <nav className="w-full mx-auto px-8 h-14 flex items-center justify-start relative">
        <NavBarFunc
          setDropdownOpen={setDropdownOpen}
          dropdownOpen={dropdownOpen}
          buttonRef={buttonRef}
          setDropdownOpenPedido={setDropdownOpenPedido}
          buttonRefPedido={buttonRefPedido}
          toggleDropdownProduto={toggleDropdownProduto}
          toggleDropdownPedido={toggleDropdownPedido}
          toggleDropdownClients={toggleDropdownClients}
          buttonRefClients={buttonRefClients}
          setDropdownOpenClients={setDropdownOpenClients}
        />
      </nav>

      {/* Dropdown de Produtos - posicionado abaixo do botão Produtos */}
      {dropdownOpen && (
        <div
          ref={dropdownRef}
          className="mt-1 absolute top-full left-0 w-100  bg-gray-800 rounded-md shadow-lg z-50"
          style={{
            left: buttonRef.current?.getBoundingClientRect().left,
            width: buttonRef.current?.getBoundingClientRect().width
          }}
        >
          <ul className="text-white text-sm divide-y divide-white/20">
            <li>
              <Link
                to="/cadastroProduto"
                onClick={() => setDropdownOpen(false)}
                className="block hover:bg-gray-700 rounded-md px-4 py-2 w-full"
              >
                Cadastro de Produto
              </Link>
            </li>
            <li>
              <Link
                to="/consultaProduto"
                onClick={() => setDropdownOpen(false)}
                className="block hover:bg-gray-700 rounded-md px-4 py-2 w-full"
              >
                Consulta de Produto
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* Dropdown de Pedido - posicionado abaixo do botão Pedido */}
      {dropdownOpenPedido && (
        <div
          ref={dropdownRefPedido}
          className="absolute top-full left-0 mt-1 w-60 bg-gray-800 rounded-md shadow-lg z-50"
          style={{
            left: buttonRefPedido.current?.getBoundingClientRect().left,
            width: buttonRefPedido.current?.getBoundingClientRect().width
          }}
        >
          <ul className="text-white text-sm divide-y divide-white/20">
            <li>
              <Link
                to="/cadastrarPedido"
                onClick={() => setDropdownOpenPedido(false)}
                className="block hover:bg-gray-700 rounded-md px-4 py-2 w-full"
              >
                Cadastrar Pedido
              </Link>
            </li>
            <li>
              <Link
                to="/consultarPedido"
                onClick={() => setDropdownOpenPedido(false)}
                className="block hover:bg-gray-700 rounded-md px-4 py-2 w-full"
              >
                Consultar Pedido
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* Dropdown de Clientes - posicionado abaixo do botão Clientes */}
      {dropdownOpenClients && (
        <div
          ref={dropdownRefClients}
          className="absolute top-full left-0 mt-1 w-60 bg-gray-800 rounded-md shadow-lg z-50"
          style={{
            left: buttonRefClients.current?.getBoundingClientRect().left,
            width: buttonRefClients.current?.getBoundingClientRect().width
          }}
        >
          <ul className="text-white text-sm divide-y divide-white/20">
            <li>
              <Link
                to="/cadastrarCliente"
                onClick={() => setDropdownOpenClients(false)}
                className="block hover:bg-gray-700 rounded-md px-4 py-2 w-full"
              >
                Cadastrar Cliente
              </Link>
            </li>
            <li>
              <Link
                to="/consultarCliente"
                onClick={() => setDropdownOpenClients(false)}
                className="block hover:bg-gray-700 rounded-md px-4 py-2 w-full"
              >
                Consultar Cliente
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

export default HeaderFunc