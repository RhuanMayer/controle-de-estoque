//import React, { useState, useRef, useEffect } from 'react';
//import axios from 'axios';
import { FaSave, FaTimes, FaChevronDown, FaFile, FaExpand } from 'react-icons/fa';
import Chatbot from '/src/components/layout/chatBot';

const Login = () => {
  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb de navegação */}
        <div className="text-sm text-gray-600 mb-2">
          <a href="/inicio" className="text-blue-600 hover:underline">Início</a>
          <span> &gt; </span>
          <a className="text-gray-600">Cadastro de Categoria</a>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Cadastro de Categoria</h1>

        <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Categoria</label>
                <input
                  type="text"
                  name="categoria"
                  className="w-70 p-2 border border-gray-300 rounded"
                  placeholder="Nome da Categoria"
                />
              </div>

              
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center disabled:opacity-50"
                          >
                            <FaSave className="mr-2" />
                            Cadastrar
                          </button>
                        
    </div>
    {/* Tabela de Produtos */}
            <div className="bg-white rounded-lg shadow overflow-hidden w-full">
              <div className="overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-64">NOME</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">CATEGORIA</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">COR</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">QTD</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">VALOR</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">STATUS</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200"></tbody>
                </table>
              </div>
            </div>
    
    <Chatbot />
    </div>
  );
}

export default Login;
