import React, { useState, useRef, useEffect } from 'react'
import NavBarFunc from './NavBarFunc'
import { Link } from 'react-router-dom'

const HeaderFunc = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setDropdownOpen(false)
      }
    }
    window.addEventListener('mousedown', handleClickOutside)
    return () => window.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="bg-[#013638] shadow-sm relative z-50">
      <nav className="w-full mx-auto px-4 h-14 flex items-center justify-center">
        <NavBarFunc
          setDropdownOpen={setDropdownOpen}
          dropdownOpen={dropdownOpen}
          buttonRef={buttonRef} // Passando buttonRef para o NavBarFunc
        />
      </nav>

      {/* Dropdown fora do padding */}
      {dropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-60 bg-gray-800 rounded-md shadow-lg z-50 "
        >
          <ul className="text-white text-sm divide-y divide-white/20">
            <li>
              <Link
                to="/cadastroProduto"
                onClick={() => setDropdownOpen(false)}
                className="block hover:bg-gray-700 px-4 py-2 w-full"
              >
                Cadastro de Produto
              </Link>
            </li>
            <li>
              <Link
                to="/consultaProduto"
                onClick={() => setDropdownOpen(false)}
                className="block hover:bg-gray-700 px-4 py-2 w-full"
              >
                Consulta de Produto
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

export default HeaderFunc
