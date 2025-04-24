const express = require('express');
const router = express.Router();
const db = require('../db'); // seu arquivo de conexão MySQL

// Criar reserva
router.post('/reservas', (req, res) => {
  const { id_item, quantidade_reservada, data_finalizacao } = req.body;

  const query = `
    INSERT INTO reservas (id_item, quantidade_reservada, data_finalizacao)
    VALUES (?, ?, ?)
  `;

  db.query(query, [id_item, quantidade_reservada, data_finalizacao], (err, result) => {
    if (err) {
      console.error('Erro ao inserir reserva:', err);
      return res.status(500).json({ erro: 'Erro ao criar reserva' });
    }
    res.status(201).json({ mensagem: 'Reserva criada com sucesso', id_reserva: result.insertId });
  });
});

module.exports = router;
