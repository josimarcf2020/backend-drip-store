const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

//Definindo modelo category
const Options = sequelize.define("options", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    use_in_menu: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    }
}, {
    timestamps: true    
}); 
// A sincronização do modelo com o banco de dados (sequelize.sync())
// deve ser centralizada em um único ponto da aplicação (ex: server.js ou sync.js)
// após todos os modelos e associações serem carregados.

module.exports = Options;