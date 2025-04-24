import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFilter, FaExclamationCircle } from 'react-icons/fa';

function Home() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ nome: '', quantidade_maior_que: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditingCurrency, setIsEditingCurrency] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reservingItem, setReservingItem] = useState(null);
  const [reserveQuantity, setReserveQuantity] = useState('');

  useEffect(() => {
    fetchItems();
  }, [page, JSON.stringify(filters)]);
  

  const handleOpenReserveModal = (item) => {
    setReservingItem(item);
    setReserveQuantity('');
  };

  const handleReserve = async () => {
    if (!reservingItem || !reserveQuantity) {
      alert("Por favor, preencha a quantidade a ser reservada.");
      return;
    }
  
    const dataToSend = {
      itemId: reservingItem.id,
      quantity: reserveQuantity,
    };
  
    try {
      await axios.post('/api/reserve', dataToSend);
      alert('Reserva realizada com sucesso!');
      setReservingItem(null);  // Close the modal after reservation
    } catch (error) {
      console.error('Erro ao reservar item:', error);
      alert('Erro ao realizar reserva.');
    }
  };


  
  

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/itens', {
        params: { page, ...filters }
      });
      setItems(response.data);
    } catch (error) {
      console.error('❌ Erro ao buscar itens:', error);
    } finally {
      setLoading(false);
    }
  };

  function formatCurrency(value) {
    const number = parseFloat(value);
    if (isNaN(number)) return '';
    return number.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  

  const openEditModal = (item) => {
    setEditingItem(item ? { 
      ...item,
      quantidade: item.quantidade || '',
      disponivel: item.disponivel || '',
      reservado: item.reservado || '',
      em_locacao: item.em_locacao || '',
      vlr_unit: item.vlr_unit || '',
      vlr_parado: item.vlr_parado || '',
      estado: item.estado || '',
      localizacao: item.localizacao || '',
      fornecedor: item.fornecedor || ''
    } : {
      nome: '',
      quantidade: '',
      categoria: '',
      fornecedor: '',
      estado: '',
      disponivel: '',
      reservado: '',
      em_locacao: '',
      localizacao: '',
      vlr_unit: '',
      vlr_parado: ''
    });
    setIsEditModalOpen(true);
  };

  async function gerarCodigoSKUUnico() {
    while (true) {
      // Gerando letras aleatórias
      const letras = [...Array(3)].map(() =>
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
      ).join('');
      // Gerando números aleatórios
      const numeros = String(Math.floor(Math.random() * 90 + 10));
      const codigo = letras + numeros;
  
      console.log('🔄 Tentando gerar código SKU... Gerado:', codigo);
  
      try {
        // Fazendo a requisição GET para a rota /consultaCodigo passando o código como parâmetro
        console.log('🔍 Consultando código no servidor:', codigo);
        const response = await axios.get('http://localhost:5000/consultaCodigo', {
          params: { codigo }
        });
  
        // Se a resposta for vazia (ou não houver item encontrado), significa que o código é único
        if (response.data.length === 0) {
          console.log('✅ Código único gerado:', codigo);
          return codigo;
        } else {
          console.log('⚠️ Código já existente encontrado:', codigo);
        }
  
      } catch (error) {
        // Se o código não for encontrado (erro 404), então é um código único
        if (error.response && error.response.status === 404) {
          console.log('✅ Código único gerado (erro 404, não encontrado no banco):', codigo);
          return codigo;
        }
  
        // Em caso de erro inesperado, loga o erro
        console.error('❌ Erro ao consultar código:', error.message);
      }
  
      console.log('🔄 Tentando novamente...');
    }
  }

  //const codigo = gerarCodigoSKUUnico();

  const handleSaveEdit = async () => {

    const codigo = await gerarCodigoSKUUnico();

    try {
      const itemToSave = {
        nome: editingItem.nome,
        quantidade: editingItem.quantidade ? parseInt(editingItem.quantidade) : 0,
        categoria: editingItem.categoria || null,
        fornecedor: editingItem.fornecedor || null,
        estado: editingItem.estado || null,
        disponivel: editingItem.disponivel ? parseInt(editingItem.disponivel) : 0,
        reservado: editingItem.reservado ? parseInt(editingItem.reservado) : 0,
        em_locacao: editingItem.em_locacao !== '' ? parseInt(editingItem.em_locacao) : 0,  // Aqui a mudança
        vlr_unit: editingItem.vlr_unit ? parseFloat(editingItem.vlr_unit) : 0,
        vlr_parado: editingItem.vlr_parado ? parseFloat(editingItem.vlr_parado) : 0,
        localizacao: editingItem.localizacao || null,
        codigo: codigo
      };
  
      console.log('📤 Dados enviados para salvamento:', itemToSave);
  
      let response;
      if (editingItem.id) {
        console.log(`🔄 Atualizando item ID: ${editingItem.id}`);
        response = await axios.put(`http://localhost:5000/itens/${editingItem.id}`, itemToSave);
        console.log('✅ Resposta da atualização:', response.data);
      } else {
        console.log('➕ Criando novo item');
        response = await axios.post('http://localhost:5000/itens', itemToSave);
        console.log('✅ Resposta da criação:', response.data);
      }
  
      setIsEditModalOpen(false);
  
      // Busca os dados atualizados
      console.log('🔍 Buscando dados atualizados...');
      const updatedResponse = await axios.get('http://localhost:5000/itens');
      console.log('📊 Todos os itens do banco:', updatedResponse.data);
  
      // Encontra o item específico que foi modificado
      const savedItem = updatedResponse.data.find(item => 
        item.id === (editingItem.id || response.data.id)
      );
      console.log('🆕 Item específico persistido:', savedItem);
  
      setItems(updatedResponse.data);
  
    } catch (error) {
      console.error('❌ Erro completo:', {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
      alert(`Erro: ${error.response?.data?.error || error.message}`);
    }
  };


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setFilters({ nome: '', quantidade_maior_que: '' });
  };

  return (
    <div className="mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📦 Controle de Estoque</h1>

      <button
        onClick={() => openEditModal(null)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
      >
        + Incluir Item
      </button>

      {/* Botão Filtros */}
      <button
        onClick={handleToggleFilters}
        className="mt-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded flex items-center space-x-2"
      >
        <FaFilter />
        {(filters.nome || filters.quantidade_maior_que) && (
          <FaExclamationCircle className="text-red-500 text-xl" />
        )}
        <span>Filtros</span>
      </button>

      {/* Filtros */}
      {showFilters && (
        <div className="mt-6 flex space-x-4 bg-gray-100 p-4 rounded shadow-md">
          <input
            type="text"
            name="nome"
            value={filters.nome}
            onChange={handleFilterChange}
            placeholder="Filtrar por nome"
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            name="quantidade_maior_que"
            value={filters.quantidade_maior_que}
            onChange={handleFilterChange}
            placeholder="Quantidade mínima"
            className="p-2 border border-gray-300 rounded"
          />
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Limpar
          </button>
        </div>
      )}

      {/* Tabela de Itens */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full bg-white border border-gray-300 shadow-sm rounded overflow-hidden">
          <thead className="bg-gray-200">
            <tr className="text-left text-sm text-gray-700">
              <th className="px-4 py-2">Código</th>
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">Categoria</th>
              <th className="px-4 py-2">Fornecedor</th>
              <th className="px-4 py-2">Quantidade</th>
              <th className="px-4 py-2">Disponível</th>
              <th className="px-4 py-2">Reservado</th>
              <th className="px-4 py-2">Em Locação</th>
              <th className="px-4 py-2">Valor Unit.</th>
              <th className="px-4 py-2">Valor Parado</th>
              <th className="px-4 py-2">Localização</th>
              <th className="px-4 py-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50 text-sm">
                <td className="px-4 py-2">{item.codigo}</td>
                <td className="px-4 py-2">{item.nome || '-'}</td>
                <td className="px-4 py-2">{item.categoria || '-'}</td>
                <td className="px-4 py-2">{item.fornecedor || '-'}</td>
                <td className="px-4 py-2">{item.quantidade ?? '-'}</td>
                <td className="px-4 py-2">{item.disponivel ?? '-'}</td>
                <td className="px-4 py-2">{item.reservado ?? '-'}</td>
                <td className="px-4 py-2">{item.em_locacao ?? '-'}</td>
                <td className="px-4 py-2">
  {item.vlr_unit != null && !isNaN(Number(item.vlr_unit))
    ? `R$ ${Number(item.vlr_unit).toFixed(2)}`
    : '-'}
</td>
<td className="px-4 py-2">
  {item.vlr_parado != null && !isNaN(Number(item.vlr_parado))
    ? `R$ ${Number(item.vlr_parado).toFixed(2)}`
    : '-'}
</td>
                <td className="px-4 py-2">{item.localizacao || '-'}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                  
                  <button
                    onClick={() => openEditModal(item)}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  
                
                <button
  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
  onClick={() => handleOpenReserveModal(item)}
>
  Reservar
</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
          className="px-4 py-2 bg-gray-400 text-white rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={items.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Próxima
        </button>
      </div>

      {/* Modal de Edição */}
      {isEditModalOpen && (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {editingItem?.id ? 'Editar Item' : 'Novo Item'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Coluna 1 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome*</label>
            <input
              type="text"
              placeholder="Ex: Tripé Fotográfico"
              value={editingItem.nome || ''}
              onChange={(e) => setEditingItem({...editingItem, nome: e.target.value})}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Categoria</label>
            <input
              type="text"
              placeholder="Ex: Iluminação"
              value={editingItem.categoria || ''}
              onChange={(e) => setEditingItem({...editingItem, categoria: e.target.value})}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Fornecedor</label>
            <input
              type="text"
              placeholder="Ex: TecnoPro"
              value={editingItem.fornecedor || ''}
              onChange={(e) => setEditingItem({...editingItem, fornecedor: e.target.value})}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <input
              type="text"
              placeholder="Ex: Novo, Usado"
              value={editingItem.estado || ''}
              onChange={(e) => setEditingItem({...editingItem, estado: e.target.value})}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Localização</label>
            <input
              type="text"
              placeholder="Ex: Prateleira A2"
              value={editingItem.localizacao || ''}
              onChange={(e) => setEditingItem({...editingItem, localizacao: e.target.value})}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        {/* Coluna 2 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Quantidade Total*</label>
            <input
              type="number"
              placeholder="Ex: 10"
              value={editingItem.quantidade || ''}
              onChange={(e) => setEditingItem({...editingItem, quantidade: e.target.value})}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Disponível</label>
            <input
              type="number"
              placeholder="Ex: 8"
              value={editingItem.disponivel || ''}
              onChange={(e) => setEditingItem({...editingItem, disponivel: e.target.value})}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Reservado</label>
            <input
              type="number"
              placeholder="Ex: 1"
              value={editingItem.reservado || ''}
              onChange={(e) => setEditingItem({...editingItem, reservado: e.target.value})}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Em Locação</label>
            <input
              type="number"
              placeholder="Ex: 1"
              value={editingItem.em_locacao || ''}
              onChange={(e) => setEditingItem({...editingItem, em_locacao: e.target.value})}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Valor Unitário (R$)</label>
            <input
  type="text"
  placeholder="Ex: 150.00"
  value={
    isEditingCurrency === 'vlr_unit'
      ? editingItem.vlr_unit || ''
      : formatCurrency(editingItem.vlr_unit)
  }
  onFocus={() => setIsEditingCurrency('vlr_unit')}
  onBlur={() => setIsEditingCurrency(null)}
  onChange={(e) =>
    setEditingItem({
      ...editingItem,
      vlr_unit: e.target.value.replace(',', '.').replace(/[^\d.]/g, '')
    })
  }
  className="border p-2 rounded w-full"
/>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Valor Parado (R$)</label>
            <input
  type="text"
  placeholder="Ex: 100.00"
  value={
    isEditingCurrency === 'vlr_parado'
      ? editingItem.vlr_parado || ''
      : formatCurrency(editingItem.vlr_parado)
  }
  onFocus={() => setIsEditingCurrency('vlr_parado')}
  onBlur={() => setIsEditingCurrency(null)}
  onChange={(e) =>
    setEditingItem({
      ...editingItem,
      vlr_parado: e.target.value.replace(',', '.').replace(/[^\d.]/g, '')
    })
  }
  className="border p-2 rounded w-full"
/>
          </div>
        </div>
      </div>
        
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() => setIsEditModalOpen(false)}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
      )}
      {reservingItem && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Reservar Item</h2>
      <p><strong>Item:</strong> {reservingItem.nome}</p>
      <p><strong>Código:</strong> {reservingItem.codigo}</p>
      <div className="mb-4">
        <p><strong>Estoque disponível:</strong> {reservingItem.quantidade}</p>
      </div>
      <div className="mb-4 mt-2">
        <label className="block text-sm font-medium text-gray-700">Quantidade a reservar</label>
        <input
          type="number"
          value={reserveQuantity}
          onChange={(e) => setReserveQuantity(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={() => setReservingItem(null)}
        >
          Cancelar
        </button>
        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          onClick={handleReserve}
        >
          Confirmar Reserva
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Home;