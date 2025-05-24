const express = require('express');
const privateRoutes = require('./src/routes/privateRoutes.js');
const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Olá NodeJS rodando... Servidor Ok!");
});

app.use(privateRoutes);

app.listen(port, host, () => {
  console.log(`Example app listening at http://${host}:${port}`)
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Algo deu errado no servidor!');
  }
);
