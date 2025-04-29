const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const itensRoutes = require('./routes/itens');
const reservasRoutes = require('./routes/reservas');

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`📦 [${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Rotas da API
app.use('/itens', itensRoutes);
app.use('/reservas', reservasRoutes); // melhor deixar '/reservas' explícito



// Inicia o servidor
app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
