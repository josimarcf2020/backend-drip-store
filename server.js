require('dotenv').config(); // Moved to the top
const express = require('express');
const sequelize = require('./config/database'); // Corrected path
const privateRoutes = require('./src/routes/privateRoutes.js');
const userRoutes = require('./src/routes/userRoutes'); 
const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Olá NodeJS rodando... Servidor Ok!");
});

app.use(privateRoutes);
app.use('/users', userRoutes);

sequelize.sync().then(() => {

  app.listen(port, host, () => { // Used defined lowercase variables
    console.log(`Example app listening at http://${host}:${port}`);
  });

}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Algo deu errado no servidor!');
  }
);
