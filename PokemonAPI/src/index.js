const express = require('express');
const rotas = require('./routes');
const app = express();
const PORTA = 8000;

app.use(express.json());

app.use(rotas);

app.listen(PORTA, () => console.log(`Servidor conectado na porta ${PORTA}`));