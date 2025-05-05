import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaSearch, FaEdit, FaSave, FaTimes, FaFile, FaChevronDown, FaExpand } from 'react-icons/fa';
import Chatbot from '/src/components/layout/chatBot';


const ConsultaProduto = () => {
  // Estados para consulta
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    nome: '',
    categoria: '',
    status: '',
    cor: '',
    quantidadeMin: '',
    quantidadeMax: '',
    valorMin: '',
    valorMax: ''
  });
  const [loading, setLoading] = useState(false);

  // Função para obter os filtros ativos formatados
  const getActiveFilters = () => {
    const activeFilters = [];

    if (filters.cor) {
      activeFilters.push({ label: 'Cor', value: filters.cor });
    }
    if (filters.quantidadeMin) {
      activeFilters.push({ label: 'Qtd mín', value: filters.quantidadeMin });
    }
    if (filters.quantidadeMax) {
      activeFilters.push({ label: 'Qtd máx', value: filters.quantidadeMax });
    }
    if (filters.valorMin) {
      activeFilters.push({ label: 'Valor mín', value: formatCurrency(filters.valorMin) });
    }
    if (filters.valorMax) {
      activeFilters.push({ label: 'Valor máx', value: formatCurrency(filters.valorMax) });
    }

    return activeFilters;
  };

  // Obter filtros ativos
  const activeFilters = getActiveFilters();

  // Estados para edição
  const [editingItem, setEditingItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const fileInputRef = useRef(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const advancedFiltersRef = useRef(null);
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const statusRef = useRef(null);
  const [showUnidadeMedidaOptions, setShowUnidadeMedidaOptions] = useState(false);
  const unidadeMedidaRef = useRef(null);
  const editFileInputRef = useRef(null);
  const [editFileInputKey, setEditFileInputKey] = useState(Date.now());
  const [isEditImageExpanded, setIsEditImageExpanded] = useState(false);

  const unidadesMedida = [
    { value: 'un', label: 'Unidade (un)' },
    { value: 'kg', label: 'Quilograma (kg)' },
    { value: 'g', label: 'Grama (g)' },
    { value: 'l', label: 'Litro (l)' },
  ];

  const handleEditFileChange = (e) => {
    if (e.target.files[0]) {
      setEditingItem(prev => ({
        ...prev,
        foto: e.target.files[0],
        foto_url: null // Limpa a URL da imagem existente se um novo arquivo for selecionado
      }));
    }
  };

  const handleUnidadeMedidaSelect = (selectedValue) => {
    setEditingItem({ ...editingItem, unidadeMedida: selectedValue });
    setShowUnidadeMedidaOptions(false);
  };

  const handleClearUnidadeMedida = () => {
    setEditingItem({ ...editingItem, unidadeMedida: '' });
  };


  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setShowStatusOptions(false);
      }
      if (unidadeMedidaRef.current && !unidadeMedidaRef.current.contains(event.target)) {
        setShowUnidadeMedidaOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutsideAdvancedFilters = (event) => {
      // Verifica se o clique foi fora do dropdown E fora do botão de filtros avançados
      if (
        advancedFiltersRef.current && 
        !advancedFiltersRef.current.contains(event.target) &&
        !event.target.closest('[data-advanced-filters-button]') // Adicione este atributo ao botão
      ) {
        setShowAdvancedFilters(false);
      }
    };
  
    if (showAdvancedFilters) {
      document.addEventListener('mousedown', handleClickOutsideAdvancedFilters);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideAdvancedFilters);
    };
  }, [showAdvancedFilters]);

  // Buscar produtos
  useEffect(() => {
    fetchItems();
  }, [page, filters, itemsPerPage]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      // Prepara os parâmetros garantindo que valores numéricos sejam números
      const params = {
        page,
        limit: itemsPerPage,
        count: true,
        ...filters,
        valorMin: filters.valorMin ? Number(filters.valorMin) : '',
        valorMax: filters.valorMax ? Number(filters.valorMax) : ''
      };

      const response = await axios.get('http://localhost:5000/itens', { params });

      setItems(response.data.items || response.data);
      setTotalItems(response.data.total || 0);
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
      alert('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal de edição com dados completos do produto
  const openEditModal = async (item) => {
    try {
      const response = await axios.get('http://localhost:5000/itens/por-codigo', {
        params: { codigo: item.codigo }
      });

      const produtoCompleto = response.data;

      setEditingItem({
        id: produtoCompleto.id,
        codigo: produtoCompleto.codigo || '',
        nome: produtoCompleto.nome || '',
        localizacao: produtoCompleto.localizacao || '',
        quantidade: produtoCompleto.quantidade || '',
        descricao: produtoCompleto.descricao || '',
        unidadeMedida: produtoCompleto.unidadeMedida || '',
        categoria: produtoCompleto.categoria || '',
        cor: produtoCompleto.cor || '',
        valorCusto: produtoCompleto.valorCusto || '',
        valorVenda: produtoCompleto.valorVenda || '',
        valorVendaPromocional: produtoCompleto.valorVendaPromocional || '',
        peso: produtoCompleto.peso || '',
        profundidade: produtoCompleto.profundidade || '',
        tamanho: produtoCompleto.tamanho || '',
        volume: produtoCompleto.volume || '',
        altura: produtoCompleto.altura || '',
        largura: produtoCompleto.largura || '',
        comprimento: produtoCompleto.comprimento || '',
        foto: null,
        foto_url: produtoCompleto.foto_url || null,
        status: produtoCompleto.status || 1
      });

      setIsEditModalOpen(true);
      setFileInputKey(Date.now());
    } catch (error) {
      console.error('Erro ao buscar detalhes do produto:', error);
      alert('Erro ao carregar dados do produto');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setEditingItem(prev => ({
        ...prev,
        foto: e.target.files[0]
      }));
    }
  };

  // Salvar edição
  const handleSaveEdit = async () => {
    try {
      const formData = new FormData();

      // Adiciona todos os campos
      Object.keys(editingItem).forEach(key => {
        if (editingItem[key] !== null && editingItem[key] !== undefined) {
          if (key === 'foto') {
            if (editingItem.foto instanceof File) {
              formData.append('foto', editingItem.foto);
            }
          } else {
            formData.append(key, editingItem[key]);
          }
        }
      });

      await axios.put(`http://localhost:5000/itens/${editingItem.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setIsEditModalOpen(false);
      fetchItems();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      alert('Erro ao atualizar produto');
    }
  };

  const formatCurrencyInput = (value) => {
    if (!value) return '';
    return parseFloat(value).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingItem(prev => ({ ...prev, [name]: value }));
  };

  function formatCurrency(value) {
    return parseFloat(value || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  // Adicione esta função utilitária
  const parseCurrencyInput = (value) => {
    if (!value) return '';
    // Remove todos os caracteres não numéricos exceto ponto e vírgula
    const cleanValue = value.replace(/[^\d,]/g, '');
    // Substitui vírgula por ponto para formato decimal
    const numericValue = cleanValue.replace(',', '.');
    return numericValue;
  };

  const handleCurrencyChange = (e, field) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = (value / 100).toFixed(2);
    setEditingItem(prev => ({ ...prev, [field]: formattedValue }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    // Converter campos numéricos para número ou string vazia
    const numericFields = ['quantidadeMin', 'quantidadeMax', 'valorMin', 'valorMax'];
    const processedValue = numericFields.includes(name)
      ? (value === '' ? '' : Number(value))
      : value;

    setFilters(prev => ({ ...prev, [name]: processedValue }));
  };

  const clearFilters = () => {
    setFilters({ nome: '', categoria: '', status: '' });
    setPage(1);
  };

  return (
    <div className="p-6 min-h-screen w-full bg-gray-50">
      <div className="w-full mx-auto">
        <div className="text-sm text-gray-600 mb-2">
          <a href="/inicio" className="text-blue-600 hover:underline">Início</a>
          <span> &gt; </span>
          <a className="text-gray-600">Consulta de Produtos</a>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">Consulta de Produto</h1>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Filtro por Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do produto</label>
              <input
                type="text"
                name="nome"
                value={filters.nome}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Buscar por nome"
              />
            </div>

            {/* Filtro por Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                name="categoria"
                value={filters.categoria}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Todas</option>
                <option value="Louça">Louça</option>
                <option value="Papelaria">Papelaria</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            {/* Filtro por Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Todos</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>

            {/* Botão de Busca - AGORA NA MESMA LINHA */}
            <div className="flex items-end">
              <button
                onClick={fetchItems}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 border rounded flex items-center justify-center"
              >
                <FaSearch className="mr-2" />
                Buscar
              </button>
            </div>
          </div>

          {/* Filtros Avançados */}
          <div className="relative mt-4">
    <button
      data-advanced-filters-button
      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
      className="p-2 border border-gray-300 rounded flex items-center hover:bg-gray-50"
    >
      <span className="text-sm font-medium">Filtros Avançados</span>
      <FaChevronDown className={`ml-2 text-gray-500 transition-transform ${showAdvancedFilters ? 'transform rotate-180' : ''}`} />
    </button>

            {/* Pills de filtros ativos */}
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.cor && (
                <span className="inline-flex items-center bg-blue-50 text-blue-800 text-xs px-3 py-1 rounded-full">
                  Cor: {filters.cor}
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, cor: '' }))}
                    className="ml-1.5 text-blue-600 hover:text-blue-800"
                  >
                    <FaTimes className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}

              {filters.quantidadeMin && (
                <span className="inline-flex items-center bg-blue-50 text-blue-800 text-xs px-3 py-1 rounded-full">
                  Qtd mín: {filters.quantidadeMin}
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, quantidadeMin: '' }))}
                    className="ml-1.5 text-blue-600 hover:text-blue-800"
                  >
                    <FaTimes className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}

              {filters.quantidadeMax && (
                <span className="inline-flex items-center bg-blue-50 text-blue-800 text-xs px-3 py-1 rounded-full">
                  Qtd máx: {filters.quantidadeMax}
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, quantidadeMax: '' }))}
                    className="ml-1.5 text-blue-600 hover:text-blue-800"
                  >
                    <FaTimes className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}

              {filters.valorMin && (
                <span className="inline-flex items-center bg-blue-50 text-blue-800 text-xs px-3 py-1 rounded-full">
                  Valor mín: {formatCurrency(filters.valorMin)}
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, valorMin: '' }))}
                    className="ml-1.5 text-blue-600 hover:text-blue-800"
                  >
                    <FaTimes className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}

              {filters.valorMax && (
                <span className="inline-flex items-center bg-blue-50 text-blue-800 text-xs px-3 py-1 rounded-full">
                  Valor máx: {formatCurrency(filters.valorMax)}
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, valorMax: '' }))}
                    className="ml-1.5 text-blue-600 hover:text-blue-800"
                  >
                    <FaTimes className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}
            </div>

            {/* Dropdown de filtros avançados */}
            {showAdvancedFilters && (
              
              <div className="absolute z-10 mt-2 w-full bg-white border-gray-300 border-1 rounded-lg shadow-xl p-4" ref={advancedFiltersRef}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
                    <input
                      type="text"
                      name="cor"
                      value={filters.cor}
                      onChange={handleFilterChange}
                      className="w-full p-2 border bg-white border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Digite a cor"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade mínima</label>
                      <input
                        type="number"
                        name="quantidadeMin"
                        value={filters.quantidadeMin}
                        onChange={handleFilterChange}
                        className="w-full p-2 border bg-white border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: 10"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade máxima</label>
                      <input
                        type="number"
                        name="quantidadeMax"
                        value={filters.quantidadeMax}
                        onChange={handleFilterChange}
                        className="w-full p-2 border bg-white border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: 100"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Valor mínimo</label>
                      <input
                        type="text"
                        name="valorMin"
                        value={filters.valorMin}
                        onChange={(e) => {
                          const rawValue = parseCurrencyInput(e.target.value);
                          setFilters(prev => ({ ...prev, valorMin: rawValue }));
                        }}
                        className="w-full p-2 border bg-white border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: 50,00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Valor máximo</label>
                      <input
                        type="text"
                        name="valorMax"
                        value={filters.valorMax}
                        onChange={(e) => {
                          const rawValue = parseCurrencyInput(e.target.value);
                          setFilters(prev => ({ ...prev, valorMax: rawValue }));
                        }}
                        className="w-full p-2 border bg-white border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: 500,00"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
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
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center">
                      Carregando...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center">
                      Nenhum produto encontrado
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 h-14"> {/* h-14 = 3.5rem */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.codigo || '-'}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.nome || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.categoria || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.cor || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantidade || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.valorVenda ? formatCurrency(item.valorVenda) : 'R$ 0,00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${item.status === 1 ? 'bg-green-100 text-green-800' :
                            item.status === 0 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'}`}>
                          {item.status === 1 ? 'Ativo' : item.status === 0 ? 'Inativo' : ''}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <FaEdit className="mr-1" />
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Controles de paginação - Rodapé fixo */}
        <div className="sticky  bg-white border-t border-gray-200 p-2 flex items-center justify-between">
          {/* Espaço vazio à esquerda para balancear o layout */}
          <div className="flex-1"></div>

          {/* Botões de navegação centralizados */}
          <div className="flex items-center gap-4 flex-1 justify-center">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="px-4 py-2 bg-gray-400 text-white rounded disabled:opacity-50"
            >
              Anterior
            </button>
            {/* ↓↓↓ ESTE É O LOCAL CORRETO ↓↓↓ */}
            <span className="text-sm">Página {page} de {Math.ceil(totalItems / itemsPerPage)}</span>
            {/* ↑↑↑ ESTE É O LOCAL CORRETO ↑↑↑ */}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page * itemsPerPage >= totalItems}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              Próxima
            </button>
          </div>

          {/* Seletor de itens por página à direita */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className="text-sm text-gray-600">Itens por página:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="p-1 border border-gray-300 rounded text-sm"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="500">500</option>
            </select>
          </div>
        </div>

        {/* Modal de Edição */}
        {isEditModalOpen && editingItem && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Editar Produto</h2>

              {/* Seção Dados Gerais */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Dados Gerais</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                    <input
                      type="text"
                      name="codigo"
                      value={editingItem.codigo}
                      onChange={(e) => setEditingItem({ ...editingItem, codigo: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto*</label>
                    <input
                      type="text"
                      name="nome"
                      value={editingItem.nome}
                      onChange={(e) => setEditingItem({ ...editingItem, nome: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                    <input
                      type="text"
                      name="localizacao"
                      value={editingItem.localizacao}
                      onChange={(e) => setEditingItem({ ...editingItem, localizacao: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade*</label>
                    <input
                      type="number"
                      name="quantidade"
                      value={editingItem.quantidade}
                      onChange={(e) => setEditingItem({ ...editingItem, quantidade: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <textarea
                      name="descricao"
                      value={editingItem.descricao}
                      onChange={(e) => setEditingItem({ ...editingItem, descricao: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                      rows="3"
                    />
                  </div>

                  <div className="relative" ref={unidadeMedidaRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unidade de Medida</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="unidadeMedida"
                        value={editingItem.unidadeMedida}
                        onChange={(e) => setEditingItem({ ...editingItem, unidadeMedida: e.target.value })}
                        onFocus={() => setShowUnidadeMedidaOptions(true)}
                        className="w-full p-2 pl-3 pr-8 border border-gray-300 rounded focus:outline-none 
                focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                        placeholder="Selecione ou digite"
                      />

                      {editingItem.unidadeMedida && (
                        <button
                          type="button"
                          onClick={handleClearUnidadeMedida}
                          className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <FaTimes className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setShowUnidadeMedidaOptions(!showUnidadeMedidaOptions)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <FaChevronDown className={`h-4 w-4 transition-transform ${showUnidadeMedidaOptions ? 'transform rotate-180' : ''}`} />
                      </button>
                    </div>

                    {showUnidadeMedidaOptions && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300 max-h-60 overflow-auto custom-scrollbar">
                        {unidadesMedida.filter(option =>
                          option.label.toLowerCase().includes(editingItem.unidadeMedida.toLowerCase())
                        ).length > 0 ? (
                          unidadesMedida
                            .filter(option =>
                              option.label.toLowerCase().includes(editingItem.unidadeMedida.toLowerCase())
                            )
                            .map((option) => (
                              <div
                                key={option.value}
                                onClick={() => handleUnidadeMedidaSelect(option.label)}
                                className={`px-4 py-2 hover:bg-blue-50 cursor-pointer 
                        ${editingItem.unidadeMedida === option.label ? 'bg-blue-100' : ''}`}
                              >
                                {option.label}
                              </div>
                            ))
                        ) : (
                          <div className="px-4 py-2 text-gray-500">Nenhuma opção encontrada</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <input
                      type="text"
                      name="categoria"
                      value={editingItem.categoria}
                      onChange={(e) => setEditingItem({ ...editingItem, categoria: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
                    <input
                      type="text"
                      name="cor"
                      value={editingItem.cor}
                      onChange={(e) => setEditingItem({ ...editingItem, cor: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>

                  {/* Campo Status - Adicione esta parte */}
                  <div className="relative" ref={statusRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={editingItem.status === 1 ? 'Ativo' : 'Inativo'}
                        onClick={() => setShowStatusOptions(!showStatusOptions)}
                        className="w-full p-2 pl-3 pr-8 border border-gray-300 rounded focus:outline-none 
                focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700 
                cursor-pointer"
                        placeholder="Selecione"
                      />
                      <button
                        type="button"
                        onClick={() => setShowStatusOptions(!showStatusOptions)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <FaChevronDown className={`h-4 w-4 transition-transform ${showStatusOptions ? 'transform rotate-180' : ''}`} />
                      </button>
                    </div>

                    {showStatusOptions && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300">
                        <div
                          onClick={() => {
                            setEditingItem({ ...editingItem, status: 1 });
                            setShowStatusOptions(false);
                          }}
                          className={`px-4 py-2 hover:bg-blue-50 cursor-pointer ${editingItem.status === 1 ? 'bg-blue-100 font-medium' : ''}`}
                        >
                          Ativo
                        </div>
                        <div
                          onClick={() => {
                            setEditingItem({ ...editingItem, status: 0 });
                            setShowStatusOptions(false);
                          }}
                          className={`px-4 py-2 hover:bg-blue-50 cursor-pointer ${editingItem.status === 0 ? 'bg-blue-100 font-medium' : ''}`}
                        >
                          Inativo
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Seção Valores */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Valores</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custo (Un.)</label>
                    <input
                      type="text"
                      value={formatCurrency(editingItem.valorCusto)}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        const formattedValue = (value / 100).toFixed(2);
                        setEditingItem({ ...editingItem, valorCusto: formattedValue });
                      }}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Venda (Un.)</label>
                    <input
                      type="text"
                      value={formatCurrency(editingItem.valorVenda)}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        const formattedValue = (value / 100).toFixed(2);
                        setEditingItem({ ...editingItem, valorVenda: formattedValue });
                      }}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Venda Promocional (Un.)</label>
                    <input
                      type="text"
                      value={formatCurrency(editingItem.valorVendaPromocional)}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        const formattedValue = (value / 100).toFixed(2);
                        setEditingItem({ ...editingItem, valorVendaPromocional: formattedValue });
                      }}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Seção Dimensões */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Dimensões</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                    <input
                      type="number"
                      name="peso"
                      value={editingItem.peso}
                      onChange={(e) => setEditingItem({ ...editingItem, peso: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profundidade (cm)</label>
                    <input
                      type="number"
                      name="profundidade"
                      value={editingItem.profundidade}
                      onChange={(e) => setEditingItem({ ...editingItem, profundidade: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho</label>
                    <input
                      type="text"
                      name="tamanho"
                      value={editingItem.tamanho}
                      onChange={(e) => setEditingItem({ ...editingItem, tamanho: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Volume (m³)</label>
                    <input
                      type="number"
                      name="volume"
                      value={editingItem.volume}
                      onChange={(e) => setEditingItem({ ...editingItem, volume: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
                    <input
                      type="number"
                      name="altura"
                      value={editingItem.altura}
                      onChange={(e) => setEditingItem({ ...editingItem, altura: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Largura (cm)</label>
                    <input
                      type="number"
                      name="largura"
                      value={editingItem.largura}
                      onChange={(e) => setEditingItem({ ...editingItem, largura: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comprimento (cm)</label>
                    <input
                      type="number"
                      name="comprimento"
                      value={editingItem.comprimento}
                      onChange={(e) => setEditingItem({ ...editingItem, comprimento: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                      step="0.01"
                    />
                  </div>
                </div>


              </div>

              {/* Seção Foto - Modal de Edição */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Foto</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Foto do Produto (JPG/PNG)</label>
                  <div className="flex items-center">
                    <div className="relative flex-grow mr-2">
                      <input
                        type="text"
                        readOnly
                        value={editingItem.foto ? editingItem.foto.name : (editingItem.foto_url ? 'Imagem atual' : 'Nenhum arquivo selecionado')}
                        placeholder="Nenhum arquivo selecionado"
                        className="w-full p-2 border border-gray-300 rounded-l focus:outline-none"
                      />
                      {(editingItem.foto || editingItem.foto_url) && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItem({ ...editingItem, foto: null, foto_url: null });
                            setEditFileInputKey(Date.now());
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
                        >
                          <FaTimes className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    <label className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r cursor-pointer">
                      <FaFile className="h-4 w-4" />
                      <span className="mr-2">{editingItem.foto_url ? 'Alterar' : 'Procurar'}</span>
                      <input
                        type="file"
                        key={editFileInputKey}
                        onChange={handleEditFileChange}
                        accept="image/jpeg, image/png"
                        className="hidden"
                        ref={editFileInputRef}
                      />
                    </label>
                  </div>

                  {/* Pré-visualização da imagem com botão de expandir */}
                  {(editingItem.foto || editingItem.foto_url) && (
                    <div className="mt-4 relative group">
                      <p className="text-sm text-gray-500 mb-2">
                        {editingItem.foto ? 'Nova imagem:' : 'Imagem atual:'}
                      </p>
                      <div className="relative inline-block">
                        <img
                          src={editingItem.foto ? URL.createObjectURL(editingItem.foto) : editingItem.foto_url}
                          alt="Pré-visualização"
                          className="h-30 w-auto max-w-full object-contain border rounded-lg cursor-zoom-in shadow-sm"
                          onClick={() => setIsEditImageExpanded(true)}
                        />
                        <button
                          onClick={() => setIsEditImageExpanded(true)}
                          className="absolute bottom-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                          aria-label="Expandir imagem"
                        >
                          <FaExpand className="h-5 w-5 text-gray-700" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal para visualização expandida - Edição */}
              {isEditImageExpanded && (editingItem.foto || editingItem.foto_url) && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm transition-opacity duration-300"
                  onClick={() => setIsEditImageExpanded(false)}
                >
                  <div className="relative max-w-6xl max-h-[90vh]">
                    <img
                      src={editingItem.foto ? URL.createObjectURL(editingItem.foto) : editingItem.foto_url}
                      alt="Visualização expandida"
                      className="max-w-full max-h-[90vh] object-contain"
                      onClick={(e) => e.stopPropagation()}
                    />

                    <button
                      onClick={() => setIsEditImageExpanded(false)}
                      className="absolute -top-8 right-0 text-white hover:text-gray-300 transition-colors"
                      aria-label="Fechar"
                    >
                      <FaTimes className="h-8 w-8" />
                    </button>
                  </div>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 flex items-center"
                >
                  <FaTimes className="mr-2" />
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                >
                  <FaSave className="mr-2" />
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Chatbot />
    </div>
  );
};

export default ConsultaProduto;