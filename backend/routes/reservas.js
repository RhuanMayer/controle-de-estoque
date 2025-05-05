const express = require('express');
const router = express.Router();
const db = require('../db');

// Rota para criar reserva (agora apenas '/')
router.post('/', (req, res) => {
  console.log('Rota POST /reservas alcançada');
  console.log('Dados recebidos:', req.body);

  const { id_item, quantidade_reservada, data_finalizacao } = req.body;

  if (!id_item || !quantidade_reservada || !data_finalizacao) {
    console.error('Erro: Dados faltando para a reserva');
    return res.status(400).json({ 
      error: 'Faltando dados necessários: id_item, quantidade_reservada, data_finalizacao' 
    });
  }

  const query = `
    INSERT INTO reservas (id_item, quantidade_reservada, data_finalizacao)
    VALUES (?, ?, ?)
  `;

  db.query(query, [id_item, quantidade_reservada, data_finalizacao], (err, result) => {
    if (err) {
      console.error('Erro ao inserir reserva:', err.message);
      return res.status(500).json({ 
        error: 'Erro ao criar reserva', 
        details: err.message 
      });
    }

    console.log('Reserva criada com sucesso, ID:', result.insertId);
    res.status(201).json({
      mensagem: 'Reserva criada com sucesso',
      id_reserva: result.insertId
    });
  });
});

module.exports = router;