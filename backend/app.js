const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const itensRoutes = require('./routes/itens');
const reservasRoutes = require('./routes/reservas'); // Importa a rota de reservas

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/itens', itensRoutes);  // Rota de itens
app.use('/reservas', reservasRoutes);  // Adiciona a rota de reservas

app.use((req, res, next) => {
  console.log(`📦 [${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});



app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
