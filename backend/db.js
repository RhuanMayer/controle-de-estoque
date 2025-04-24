const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',           // seu usuário
  password: '',           // sua senha
  database: 'projeto4_controleestoquedb' // nome do seu banco
});

db.connect((err) => {
  if (err) {
    console.error('❌ Erro na conexão com o MySQL:', err.message);
    return;
  }
  console.log('✅ MySQL conectado!');
});

module.exports = db;
