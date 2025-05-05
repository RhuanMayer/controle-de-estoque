import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaSave, FaTimes, FaChevronDown, FaFile, FaExpand } from 'react-icons/fa';
import Chatbot from '/src/components/layout/chatBot';
import './CadastroProduto.css';

function CadastroProduto() {
  const [produto, setProduto] = useState({
    // Dados Gerais
    codigo: '',
    nome: '',
    localizacao: '',
    quantidade: '',
    descricao: '',
    unidadeMedida: '',
    categoria: '',
    cor: '',
    status: 1,
    
    // Valores
    valorCusto: '',
    valorVenda: '',
    valorVendaPromocional: '',
    
    // Dimensões
    peso: '',
    profundidade: '',
    tamanho: '',
    volume: '',
    altura: '',
    largura: '',
    comprimento: '',
    
    // Foto
    foto: null
  });

  const fileInputRef = useRef(null);
  const picklistRef = useRef(null);
  const statusRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPicklist, setShowPicklist] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [showStatusOptions, setShowStatusOptions] = useState(false);

  const unidadesMedida = [
    { value: 'un', label: 'Unidade (un)' },
    { value: 'kg', label: 'Quilograma (kg)' },
    { value: 'g', label: 'Grama (g)' },
    { value: 'l', label: 'Litro (l)' },
    { value: 'ml', label: 'Mililitro (ml)' },
    { value: 'm', label: 'Metro (m)' },
    { value: 'cm', label: 'Centímetro (cm)' },
    { value: 'mm', label: 'Milímetro (mm)' },
    { value: 'cx', label: 'Caixa (cx)' },
    { value: 'pc', label: 'Peça (pc)' },
    { value: 'par', label: 'Par' },
    { value: 'dz', label: 'Dúzia (dz)' },
    { value: 'm²', label: 'Metro quadrado (m²)' },
    { value: 'm³', label: 'Metro cúbico (m³)' }
  ];

  useEffect(() => {
    setFilteredOptions(
      unidadesMedida.filter(option =>
        option.label.toLowerCase().includes(produto.unidadeMedida.toLowerCase())
      )
    );
  }, [produto.unidadeMedida]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (picklistRef.current && !picklistRef.current.contains(event.target)) {
        setShowPicklist(false);
        
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setShowStatusOptions(false);
        
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isImageExpanded) {
        setIsImageExpanded(false);
      }
    };

    if (isImageExpanded) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isImageExpanded]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'foto') {
      setProduto({ ...produto, [name]: files[0] });
    } else {
      setProduto({ ...produto, [name]: value });
    }
  };

  const handlePicklistSelect = (selectedValue) => {
    setProduto({ ...produto, unidadeMedida: selectedValue });
    setShowPicklist(false);
  };

  const handleClearPicklist = () => {
    setProduto({ ...produto, unidadeMedida: '' });
  };

  const handleCurrencyChange = (e, field) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = (value / 100).toFixed(2);
    setProduto({ ...produto, [field]: formattedValue });
  };

  const formatCurrency = (value) => {
    return parseFloat(value || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      Object.keys(produto).forEach(key => {
        if (produto[key] !== null && produto[key] !== '') {
          formData.append(key, produto[key]);
        }
      });

      await axios.post('http://localhost:5000/itens', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      

      setSuccessMessage('Produto cadastrado com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Limpar formulário
      setProduto({
        codigo: '',
        nome: '',
        localizacao: '',
        quantidade: '',
        descricao: '',
        unidadeMedida: '',
        categoria: '',
        cor: '',
        valorCusto: '',
        valorVenda: '',
        valorVendaPromocional: '',
        peso: '',
        profundidade: '',
        tamanho: '',
        volume: '',
        altura: '',
        largura: '',
        comprimento: '',
        foto: null
      });

    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      alert('Erro ao cadastrar produto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb de navegação */}
        <div className="text-sm text-gray-600 mb-2">
          <a href="/inicio" className="text-blue-600 hover:underline">Início</a>
          <span> &gt; </span>
          <a className="text-gray-600">Cadastro de Produtos</a>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Cadastro de Produto</h1>
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border-1 border-gray-200 rounded-lg p-6">
          {/* Seção Dados Gerais */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Dados Gerais</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                <input
                  type="text"
                  name="codigo"
                  value={produto.codigo}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Código do produto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto*</label>
                <input
                  type="text"
                  name="nome"
                  value={produto.nome}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Nome completo do produto"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                <input
                  type="text"
                  name="localizacao"
                  value={produto.localizacao}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Ex: Prateleira A2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade*</label>
                <input
                  type="number"
                  name="quantidade"
                  value={produto.quantidade}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Quantidade em estoque"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  name="descricao"
                  value={produto.descricao}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Descrição detalhada do produto"
                  rows="3"
                />
              </div>

              {/* Salesforce-style Picklist for Unidade de Medida */}
              <div className="relative" ref={picklistRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unidade de Medida</label>
                <div className="relative">
                  <input
                    type="text"
                    name="unidadeMedida"
                    value={produto.unidadeMedida}
                    onChange={handleChange}
                    onFocus={() => setShowPicklist(true)}
                    className="w-full p-2 pl-3 pr-8 border border-gray-300 rounded focus:outline-none 
                              focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                    placeholder="Selecione ou digite"
                  />
                  
                  {produto.unidadeMedida && (
                    <button
                      type="button"
                      onClick={handleClearPicklist}
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes className="h-4 w-4" />
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => setShowPicklist(!showPicklist)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FaChevronDown className={`h-4 w-4 transition-transform ${showPicklist ? 'transform rotate-180' : ''}`} />
                  </button>
                </div>
                
                {showPicklist && (
  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md 
  border border-gray-300 max-h-60 overflow-auto custom-scrollbar">
    {filteredOptions.length > 0 ? (
      filteredOptions.map((option) => (
        <div
          key={option.value}
          onClick={() => handlePicklistSelect(option.label)}
          className={`px-4 py-2 hover:bg-blue-50 cursor-pointer 
                    ${produto.unidadeMedida === option.label ? 'bg-blue-100' : ''}`}
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
                  value={produto.categoria}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Categoria do produto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
                <input
                  type="text"
                  name="cor"
                  value={produto.cor}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Cor principal do produto"
                />
              </div>
              <div className="relative"  ref={statusRef}>
  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
  <div className="relative">
    {/* Input de exibição (somente leitura) */}
    <input
      type="text"
      readOnly
      value={produto.status === 1 ? 'Ativo' : 'Inativo'}
      onClick={() => setShowStatusOptions(!showStatusOptions)}
      className="w-full p-2 pl-3 pr-8 border border-gray-300 rounded focus:outline-none 
                focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700 
                cursor-pointer" // cursor-pointer para indicar que é clicável
      placeholder="Selecione"
    />
    
    {/* Ícone de dropdown */}
    <button
      type="button"
      onClick={() => setShowStatusOptions(!showStatusOptions)}
      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
    >
      <FaChevronDown className={`h-4 w-4 transition-transform ${showStatusOptions ? 'transform rotate-180' : ''}`} />
    </button>
  </div>
  
  {/* Dropdown de opções (mesmo estilo do Picklist) */}
  {showStatusOptions && (
    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300">
      <div
        onClick={() => {
          setProduto({ ...produto, status: 1 });
          setShowStatusOptions(false);
        }}
        className={`px-4 py-2 hover:bg-blue-50 cursor-pointer ${produto.status === 1 ? 'bg-blue-100' : ''}`}
      >
        Ativo
      </div>
      <div
        onClick={() => {
          setProduto({ ...produto, status: 0 });
          setShowStatusOptions(false);
        }}
        className={`px-4 py-2 hover:bg-blue-50 cursor-pointer ${produto.status === 0 ? 'bg-blue-100' : ''}`}
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
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Valores</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Custo (Un.)</label>
                <input
                  type="text"
                  value={formatCurrency(produto.valorCusto)}
                  onChange={(e) => handleCurrencyChange(e, 'valorCusto')}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="R$ 0,00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venda (Un.)</label>
                <input
                  type="text"
                  value={formatCurrency(produto.valorVenda)}
                  onChange={(e) => handleCurrencyChange(e, 'valorVenda')}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="R$ 0,00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venda Promocional (Un.)</label>
                <input
                  type="text"
                  value={formatCurrency(produto.valorVendaPromocional)}
                  onChange={(e) => handleCurrencyChange(e, 'valorVendaPromocional')}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="R$ 0,00"
                />
              </div>
            </div>
          </div>

          {/* Seção Dimensões */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Dimensões</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                <input
                  type="number"
                  name="peso"
                  value={produto.peso}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profundidade (cm)</label>
                <input
                  type="number"
                  name="profundidade"
                  value={produto.profundidade}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho</label>
                <input
                  type="text"
                  name="tamanho"
                  value={produto.tamanho}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Ex: P, M, G"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Volume (m³)</label>
                <input
                  type="number"
                  name="volume"
                  value={produto.volume}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
                <input
                  type="number"
                  name="altura"
                  value={produto.altura}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Largura (cm)</label>
                <input
                  type="number"
                  name="largura"
                  value={produto.largura}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comprimento (cm)</label>
                <input
                  type="number"
                  name="comprimento"
                  value={produto.comprimento}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Seção Foto */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Foto</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Foto do Produto (JPG/PNG)</label>
              <div className="flex items-center">
                <div className="relative flex-grow mr-2">
                  <input
                    type="text"
                    readOnly
                    value={produto.foto ? produto.foto.name : ''}
                    placeholder="Nenhum arquivo selecionado"
                    className="w-full p-2 border border-gray-300 rounded-l focus:outline-none"
                  />
                  {produto.foto && (
                    <button
                      type="button"
                      onClick={() => {
                        setProduto({...produto, foto: null});
                        fileInputRef.current.value = '';
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
                    >
                      <FaTimes className="h-5 w-5" />
                    </button>
                  )}
                </div>
                
                <label className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r cursor-pointer">
                  <FaFile className="h-4 w-4" />
                  <span className="mr-2">Procurar</span>
                  <input
                    type="file"
                    name="foto"
                    onChange={handleChange}
                    accept="image/jpeg, image/png"
                    className="hidden"
                    ref={fileInputRef}
                  />
                </label>
              </div>

              {/* Pré-visualização da imagem com botão de expandir */}
              {produto.foto && (
                <div className="mt-4 relative group">
                  <p className="text-sm text-gray-500 mb-2">Pré-visualização:</p>
                  <div className="relative inline-block">
                    <img 
                      src={URL.createObjectURL(produto.foto)} 
                      alt="Pré-visualização"
                      className="h-30 w-auto max-w-full object-contain border rounded-lg cursor-zoom-in shadow-sm"
                      onClick={() => setIsImageExpanded(true)}
                    />
                    <button
                      onClick={() => setIsImageExpanded(true)}
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

          {/* Botões de Ação */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 flex items-center"
            >
              <FaTimes className="mr-2" />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center disabled:opacity-50"
            >
              <FaSave className="mr-2" />
              {isLoading ? 'Salvando...' : 'Salvar Produto'}
            </button>
          </div>
        </form>
      </div>

      {/* Modal para visualização expandida */}
      {isImageExpanded && produto.foto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsImageExpanded(false)}
        >
          <div className="relative max-w-6xl max-h-[90vh]">
            <img
              src={URL.createObjectURL(produto.foto)}
              alt="Visualização expandida"
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            
            <button
              onClick={() => setIsImageExpanded(false)}
              className="absolute -top-8 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Fechar"
            >
              <FaTimes className="h-8 w-8" />
            </button>
          </div>
        </div>
      )}

      <Chatbot />
    </div>
  );
}

export default CadastroProduto;