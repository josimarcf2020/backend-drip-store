const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

//Definindo modelo category
const Image = sequelize.define("image", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "products", // Corrected to plural table name
            key: "id"
        }
    }
}, {
    timestamps: true 
}); 
// A sincronização do modelo com o banco de dados (sequelize.sync())
// deve ser centralizada em um único ponto da aplicação (ex: server.js ou sync.js)
// após todos os modelos e associações serem carregados.

// Exportando o modelo
module.exports = Image;
