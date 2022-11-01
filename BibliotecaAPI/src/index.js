const express = require('express');
const app = express();
const PORTA = 8000;
const rotas = require('./rotas');

app.use(express.json());
app.use(rotas);

app.listen(PORTA, () => console.log(`Servidor iniciado na porta ${PORTA}`));