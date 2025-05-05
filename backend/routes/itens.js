const express = require('express');
const router = express.Router();
const db = require('../db');



// Rota para listar itens
router.get('/', (req, res) => {
  const { page = 1, limit = 10, count, ...filters } = req.query;
  const offset = (page - 1) * limit;

  // Primeiro fazemos a consulta do total se necessário
  if (count) {
    let countQuery = 'SELECT COUNT(*) as total FROM itens WHERE 1=1';
    const params = [];
    
    // Adicione seus filtros aqui igual na query principal
    if (filters.nome) {
      countQuery += ` AND nome LIKE ?`;
      params.push(`%${filters.nome}%`);
    }
    // ... outros filtros

    db.query(countQuery, params, (err, countResult) => {
      if (err) {
        console.error('Erro ao contar itens:', err);
        return res.status(500).json({ error: err.message });
      }

      const total = countResult[0].total;
      
      // Agora fazemos a consulta dos itens
      let query = 'SELECT * FROM itens WHERE 1=1';
      const queryParams = [];
      
      // Adicione os mesmos filtros
      if (filters.nome) {
        query += ` AND nome LIKE ?`;
        queryParams.push(`%${filters.nome}%`);
      }
      // ... outros filtros

      query += ` LIMIT ? OFFSET ?`;
      queryParams.push(Number(limit), Number(offset));

      db.query(query, queryParams, (err, results) => {
        if (err) {
          console.error('Erro na consulta:', err);
          return res.status(500).json({ error: err.message });
        }

        res.json({
          items: results,
          total: total
        });
      });
    });
  } else {
    // Consulta normal sem contar o total
    let query = 'SELECT * FROM itens WHERE 1=1';
    const params = [];
    
    // Filtros...
    query += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    db.query(query, params, (err, results) => {
      if (err) {
        console.error('Erro na consulta:', err);
        return res.status(500).json({ error: err.message });
      }

      res.json(results);
    });
  }
});

router.get('/consultaCodigo', (req, res) => {
  const { codigo } = req.query;

  if (!codigo) {
    return res.status(400).json({ error: 'O código é necessário' });
  }

  const query = 'SELECT * FROM itens WHERE codigo = ?'; // Buscando pelo código

  console.log('📝 SQL executado:', query);

  // Executando a query
  db.query(query, [codigo], (err, results) => {
    if (err) {
      console.error('❌ Erro na consulta:', err.message);
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    console.log(`✅ Item encontrado:`, results[0]);
    res.json(results[0]); // Retorna o primeiro item encontrado
  });
});

router.get('/por-codigo', (req, res) => {
  console.log('🔔 Nova requisição recebida em /por-codigo');
  console.log('🔍 Query parameters recebidos:', req.query);

  const { codigo } = req.query;

  // Validação do código
  if (!codigo) {
    console.log('❌ Erro: Código não fornecido');
    return res.status(400).json({ error: 'O código do item é obrigatório' });
  }

  console.log(`🔎 Buscando item com código: "${codigo}"`);
  console.log('📝 Tipo do código:', typeof codigo, 'Tamanho:', codigo.length);

  const query = 'SELECT * FROM itens WHERE codigo = ?';
  console.log('🛠️ SQL a ser executado:', query);
  console.log('📌 Parâmetros:', [codigo]);

  // Execução da query
  console.log('⚡ Executando consulta no banco de dados...');
  const startTime = Date.now();
  
  db.query(query, [codigo], (err, results) => {
    const queryTime = Date.now() - startTime;
    console.log(`⏱️ Tempo de consulta: ${queryTime}ms`);

    if (err) {
      console.error('❌ Erro na consulta:', err);
      console.log('🛑 Stack trace:', err.stack);
      return res.status(500).json({ 
        error: 'Erro no servidor',
        details: err.message
      });
    }

    console.log('✅ Resultados encontrados:', results.length);
    
    if (results.length === 0) {
      console.log(`⚠️ Nenhum item encontrado com código "${codigo}"`);
      return res.status(404).json({ 
        error: 'Item não encontrado',
        codigo_pesquisado: codigo
      });
    }

    const itemEncontrado = results[0];
    console.log('🎯 Item encontrado:');
    console.log('   ID:', itemEncontrado.id);
    console.log('   Código:', itemEncontrado.codigo);
    console.log('   Nome:', itemEncontrado.nome);
    console.log('   Quantidade:', itemEncontrado.quantidade);
    
    // Log adicional para verificar todos os campos
    console.log('📦 Dados completos do item:', JSON.stringify(itemEncontrado, null, 2));

    res.json(itemEncontrado);
  });
});


// Rota para adicionar item
router.post('/', (req, res) => {
  console.log('Dados recebidos no POST:', req.body);

  const itemData = {
    nome: req.body.nome || null,
    quantidade: req.body.quantidade ? parseInt(req.body.quantidade) : 0,
    categoria: req.body.categoria || null,
    fornecedor: req.body.fornecedor || null,
    estado: req.body.estado || null,
    disponivel: req.body.disponivel ? parseInt(req.body.disponivel) : 0,
    reservado: req.body.reservado ? parseInt(req.body.reservado) : 0,
    em_locacao: req.body.em_locacao ? parseInt(req.body.em_locacao) : 0,
    vlr_unit: req.body.vlr_unit ? parseFloat(req.body.vlr_unit) : 0,
    vlr_parado: req.body.vlr_parado ? parseFloat(req.body.vlr_parado) : 0,
    localizacao: req.body.localizacao || null,
    codigo: req.body.codigo || null
  };


  const query = `INSERT INTO itens SET ?`;

  db.query(query, itemData, (err, result) => {
    if (err) {
      console.error('Erro no MySQL:', err);
      return res.status(500).json({ error: 'Erro no banco de dados', details: err.message });
    }

    db.query('SELECT * FROM itens WHERE id = ?', [result.insertId], (err, results) => {
      if (err || results.length === 0) {
        console.error('Erro ao buscar item criado:', err);
        return res.status(500).json({ error: 'Erro ao recuperar item' });
      }

      const savedItem = results[0];
      console.log('Item persistido no banco:', savedItem);
      res.status(201).json(savedItem);
    });
  });
});

// Rota para atualizar item
router.put('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`🔄 Dados recebidos para atualização (ID: ${id}):`, req.body);

  const {
    nome,
    quantidade = 0,
    categoria = null,
    fornecedor = null,
    estado = null,
    disponivel = 0,
    reservado = 0,
    em_locacao = 0,
    vlr_unit = 0,
    vlr_parado = 0,
    localizacao = null
  } = req.body;

  const query = `
    UPDATE itens SET
      nome = ?, quantidade = ?, categoria = ?, fornecedor = ?,
      estado = ?, disponivel = ?, reservado = ?, em_locacao = ?,
      vlr_unit = ?, vlr_parado = ?, localizacao = ?
    WHERE id = ?
  `;

  const values = [
    nome, quantidade, categoria, fornecedor,
    estado, disponivel, reservado, em_locacao,
    vlr_unit, vlr_parado, localizacao,
    id
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ Erro ao atualizar:', err.message);
      return res.status(500).json({ error: err.message });
    }

    console.log(`✅ Item ${id} atualizado. Linhas afetadas:`, result.affectedRows);
    res.json({ id, ...req.body });
  });
});




module.exports = router;
