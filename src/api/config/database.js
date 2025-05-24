const { Sequelize } = require('sequelize');

// Configuração da conexão com o banco de dados
const sequelize = new Sequelize('bd-drip-store', 'root', 'Ca13iD05C0Pi0#', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});

module.exports = sequelize;