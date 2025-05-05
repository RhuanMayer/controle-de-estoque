import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, ChevronRight, Menu, ShoppingCart, Book, Users, Boxes } from 'lucide-react';
import './sideBar.css';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [expandedMenus, setExpandedMenus] = useState({
    produtos: false,
    pedidosOrcamentos: false,
    Clientes: false,
    Estoque: false,
  });

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    // Fecha todos os submenus ao recolher
    if (isSidebarOpen) {
      setExpandedMenus({
        produtos: false,
        pedidosOrcamentos: false,
        Clientes: false,
        Estoque: false,
      });
    }
  };

  return (
    <div className={`sidebar-container h-full bg-[#013638] text-white flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
      {/* Cabeçalho */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {isSidebarOpen && <div className="text-sm opacity-70 pl-6">Menu</div>}
        <button onClick={toggleSidebar} className="ml-3 hover:bg-gray-700 rounded">
          <Menu size={24} />
        </button>
      </div>

      {/* Conteúdo com scroll */}
      <nav className="flex-1 overflow-y-auto p-2 navbar-scroll">
        {/* Menu Clientes */}
        <div className="mb-2">
          <button
            onClick={() => toggleMenu('Clientes')}
            className="w-full flex items-center p-2 hover:bg-gray-700 rounded transition-colors duration-200"
          >
            <Users size={20} className="mr-2" />
            <span className="flex-1 pl-2">{isSidebarOpen && 'Clientes'}</span>
            {expandedMenus.Clientes ? (
              <ChevronDown size={18} className="transition-transform duration-200" />
            ) : (
              <ChevronRight size={18} className="transition-transform duration-200" />
            )}
          </button>

          {expandedMenus.Clientes && isSidebarOpen && (
            <div className="ml-4 mt-1 space-y-1 animate-fadeIn">
              {/* Submenu Clientes */}
              <div className="mb-1">
                <div className="p-2 text-gray-300 text-xs font-medium">Clientes</div>
                <NavLink
                  to="/cadastro-Clientes"
                  className={({ isActive }) =>
                    `block py-1.5 pl-6 pr-2 text-sm rounded hover:bg-gray-700 transition-colors duration-150 ${
                      isActive ? 'bg-gray-600 font-medium' : 'text-gray-200'
                    }`
                  }
                >
                  Cadastro de Clientes
                </NavLink>
                <div className="h-px bg-gray-600 mx-2 my-1 opacity-50"></div>
                <NavLink
                  to="/consulta-Clientes"
                  className={({ isActive }) =>
                    `block py-1.5 pl-6 pr-2 text-sm rounded hover:bg-gray-700 transition-colors duration-150 ${
                      isActive ? 'bg-gray-600 font-medium' : 'text-gray-200'
                    }`
                  }
                >
                  Consulta de Clientes
                </NavLink>
              </div>

              {/* Submenu Lead */}
              <div className="mb-1">
                <div className="p-2 text-gray-300 text-xs font-medium">Lead</div>
                <NavLink
                  to="/cadastro-lead"
                  className={({ isActive }) =>
                    `block py-1.5 pl-6 pr-2 text-sm rounded hover:bg-gray-700 transition-colors duration-150 ${
                      isActive ? 'bg-gray-600 font-medium' : 'text-gray-200'
                    }`
                  }
                >
                  Cadastro de lead
                </NavLink>
                <div className="h-px bg-gray-600 mx-2 my-1 opacity-50"></div>
                <NavLink
                  to="/consulta-orcamento"
                  className={({ isActive }) =>
                    `block py-1.5 pl-6 pr-2 text-sm rounded hover:bg-gray-700 transition-colors duration-150 ${
                      isActive ? 'bg-gray-600 font-medium' : 'text-gray-200'
                    }`
                  }
                >
                  Consulta de Lead
                </NavLink>
              </div>
            </div>
          )}
        </div>

        {/* Menu Pedidos/Orçamentos */}
        <div className="mb-2">
          <button
            onClick={() => toggleMenu('pedidosOrcamentos')}
            className="w-full flex items-center p-2 hover:bg-gray-700 rounded transition-colors duration-200"
          >
            <ShoppingCart size={20} className="mr-2" />
            <span className="flex-1 pl-2">{isSidebarOpen && 'Pedidos/Orçamento'}</span>
            {expandedMenus.pedidosOrcamentos ? (
              <ChevronDown size={18} className="transition-transform duration-200" />
            ) : (
              <ChevronRight size={18} className="transition-transform duration-200" />
            )}
          </button>

          {expandedMenus.pedidosOrcamentos && isSidebarOpen && (
            <div className="ml-4 mt-1 space-y-1 animate-fadeIn">
              {/* Submenu Pedidos */}
              <div className="mb-1">
                <div className="p-2 text-gray-300 text-xs font-medium">Pedidos</div>
                <NavLink
                  to="/cadastro-pedido"
                  className={({ isActive }) =>
                    `block py-1.5 pl-6 pr-2 text-sm rounded hover:bg-gray-700 transition-colors duration-150 ${
                      isActive ? 'bg-gray-600 font-medium' : 'text-gray-200'
                    }`
                  }
                >
                  Cadastro de Pedidos
                </NavLink>
                <div className="h-px bg-gray-600 mx-2 my-1 opacity-50"></div>
                <NavLink
                  to="/consulta-pedido"
                  className={({ isActive }) =>
                    `block py-1.5 pl-6 pr-2 text-sm rounded hover:bg-gray-700 transition-colors duration-150 ${
                      isActive ? 'bg-gray-600 font-medium' : 'text-gray-200'
                    }`
                  }
                >
                  Consulta de Pedidos
                </NavLink>
              </div>

              {/* Submenu Orçamentos */}
              <div className="mb-1">
                <div className="p-2 text-gray-300 text-xs font-medium">Orçamentos</div>
                <NavLink
                  to="/cadastro-orcamento"
                  className={({ isActive }) =>
                    `block py-1.5 pl-6 pr-2 text-sm rounded hover:bg-gray-700 transition-colors duration-150 ${
                      isActive ? 'bg-gray-600 font-medium' : 'text-gray-200'
                    }`
                  }
                >
                  Cadastro de Orçamentos
                </NavLink>
                <div className="h-px bg-gray-600 mx-2 my-1 opacity-50"></div>
                <NavLink
                  to="/consulta-orcamento"
                  className={({ isActive }) =>
                    `block py-1.5 pl-6 pr-2 text-sm rounded hover:bg-gray-700 transition-colors duration-150 ${
                      isActive ? 'bg-gray-600 font-medium' : 'text-gray-200'
                    }`
                  }
                >
                  Consulta de Orçamentos
                </NavLink>
              </div>
            </div>
          )}
        </div>

          {/* Menu Produtos */}
        <div className="mb-2 ">
          <button
            onClick={() => toggleMenu('produtos')}
            className="w-full flex items-center p-2 hover:bg-gray-700 rounded transition-colors duration-200 "
          >
            <Book size={20} className="mr-2" />
            <span className="flex-1 pl-2 ">{isSidebarOpen && 'Produtos'}</span>
            {expandedMenus.produtos ? (
              <ChevronDown size={18} className="transition-transform duration-200" />
            ) : (
              <ChevronRight size={18} className="transition-transform duration-200" />
            )}
          </button>

          {expandedMenus.produtos && isSidebarOpen && (
            <div className="ml-4 mt-1 space-y-1 animate-fadeIn">
              {/* Submenu Produto */}
              <div className="mb-1 ">
                <div className="p-2 text-gray-300 text-xs font-medium ">Produto</div>
                <NavLink
                  to="/cadastro-produto"
                  className={({ isActive }) =>
                    `block py-1.5 pl-6 pr-2 text-sm rounded hover:bg-gray-700 transition-colors duration-150 ${
                      isActive ? 'bg-gray-600 font-medium' : 'text-gray-200'
                    }`
                  }
                >
                  Cadastro de Produtos
                </NavLink>
                <div className="h-px bg-gray-600 mx-2 my-1 opacity-50"></div>
                <NavLink
                  to="/consulta-produto"
                  className={({ isActive }) =>
                    `block py-1.5 pl-6 pr-2 text-sm rounded hover:bg-gray-700 transition-colors duration-150 ${
                      isActive ? 'bg-gray-600 font-medium' : 'text-gray-200'
                    }`
                  }
                >
                  Consulta de Produtos
                </NavLink>
              </div>

              {/* Submenu Categorias */}
              <div className="mb-1">
                <div className="p-2 text-gray-300 text-xs font-medium">Categorias</div>
                <NavLink
                  to="/cadastro-categoria"
                  className={({ isActive }) =>
                    `block py-1.5 pl-6 pr-2 text-sm rounded hover:bg-gray-700 transition-colors duration-150 ${
                      isActive ? 'bg-gray-600 font-medium' : 'text-gray-200'
                    }`
                  }
                >
                  Cadastro de Categorias
                </NavLink>
                <div className="h-px bg-gray-600 mx-2 my-1 opacity-50"></div>
                <NavLink
                  to="/consulta-categoria"
                  className={({ isActive }) =>
                    `block py-1.5 pl-6 pr-2 text-sm rounded hover:bg-gray-700 transition-colors duration-150 ${
                      isActive ? 'bg-gray-600 font-medium' : 'text-gray-200'
                    }`
                  }
                >
                  Consulta de Categorias
                </NavLink>
              </div>
            </div>
          )}
        </div>
          


          {/* Menu Estoque */}
        <div className="mb-2 ">
          <button
            onClick={() => toggleMenu('Estoque')}
            className="w-full flex items-center p-2 hover:bg-gray-700 rounded transition-colors duration-200 "
          >
            <Boxes size={20} className="mr-2" />
            <span className="flex-1 pl-2 ">{isSidebarOpen && 'Estoque'}</span>
            {expandedMenus.Estoque ? (
              <ChevronDown size={18} className="transition-transform duration-200" />
            ) : (
              <ChevronRight size={18} className="transition-transform duration-200" />
            )}
          </button>

          {expandedMenus.Estoque && isSidebarOpen && (
            <div className="ml-4 mt-1 space-y-1 animate-fadeIn">
              {/* Submenu Entradas */}
              <div className="mb-1 ">
                <div className="p-2 text-gray-300 text-xs font-medium ">Entradas</div>
                <NavLink
                  to="/cadastro-entrada"
                  className={({ isActive }) =>
                    `block py-1.5 pl-6 pr-2 text-sm rounded hover:bg-gray-700 transition-colors duration-150 ${
                      isActive ? 'bg-gray-600 font-medium' : 'text-gray-200'
                    }`
                  }
                >
                  Cadastro de Entradas
                </NavLink>
                <div className="h-px bg-gray-600 mx-2 my-1 opacity-50"></div>
                <NavLink
                  to="/consulta-entrada"
                  className={({ isActive }) =>
                    `block py-1.5 pl-6 pr-2 text-sm rounded hover:bg-gray-700 transition-colors duration-150 ${
                      isActive ? 'bg-gray-600 font-medium' : 'text-gray-200'
                    }`
                  }
                >
                  Consulta de Entradas
                </NavLink>
              </div>

              {/* Submenu saidas */}
              <div className="mb-1">
                <div className="p-2 text-gray-300 text-xs font-medium">Saidas</div>
                <NavLink
                  to="/cadastro-saidas"
                  className={({ isActive }) =>
                    `block py-1.5 pl-6 pr-2 text-sm rounded hover:bg-gray-700 transition-colors duration-150 ${
                      isActive ? 'bg-gray-600 font-medium' : 'text-gray-200'
                    }`
                  }
                >
                  Cadastro de Saidas
                </NavLink>
                <div className="h-px bg-gray-600 mx-2 my-1 opacity-50"></div>
                <NavLink
                  to="/consulta-categoria"
                  className={({ isActive }) =>
                    `block py-1.5 pl-6 pr-2 text-sm rounded hover:bg-gray-700 transition-colors duration-150 ${
                      isActive ? 'bg-gray-600 font-medium' : 'text-gray-200'
                    }`
                  }
                >
                  Consulta de Saidas
                </NavLink>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;