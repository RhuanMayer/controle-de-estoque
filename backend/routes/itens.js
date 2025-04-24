const express = require('express');
const router = express.Router();
const db = require('../db');



// Rota para listar itens
router.get('/', (req, res) => {
  const { page = 1, limit = 10, nome, quantidade_maior_que } = req.query;
  const offset = (page - 1) * limit;

  console.log('🔍 Parâmetros da consulta:', { page, limit, nome, quantidade_maior_que });

  let query = 'SELECT * FROM itens WHERE 1=1';
  if (nome) query += ` AND nome LIKE '%${nome}%'`;
  if (quantidade_maior_que) query += ` AND quantidade > ${quantidade_maior_que}`;
  query += ` LIMIT ${limit} OFFSET ${offset}`;

  console.log('📝 SQL executado:', query);

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Erro na consulta:', err.message);
      return res.status(500).json({ error: err.message });
    }

    console.log(`✅ Retornados ${results.length} itens`);
    console.log('📊 Primeiro item da lista:', results[0] || 'Nenhum item encontrado');

    res.json(results);
  });
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
