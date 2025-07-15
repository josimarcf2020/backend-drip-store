const { Sequelize } = require('sequelize');

// Configuração da conexão com o banco de dados
const sequelize = new Sequelize('bd-drip-store', 'root', 'Ca13iD05C0Pi0#', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});

try {
  // Testa a conexão com o banco de dados
  sequelize.authenticate();
  console.log('Conexão com o banco de dados estabelecida com sucesso.');
} catch (error) {
  console.error('Não foi possível conectar ao banco de dados:', error);
}

module.exports = sequelize;