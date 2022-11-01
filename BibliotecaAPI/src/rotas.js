const express = require('express');
const rotas = express();
const { 
  registraAutor,
  buscaAutor,
  registraLivro,
  listarLivros
} = require('./controladores/autores');

rotas.use(express.json());

rotas.post('/', registraAutor);
rotas.get('/autor/:id', buscaAutor);
rotas.post('/autor/:id/livro', registraLivro);
rotas.get('/livro', listarLivros);

module.exports = rotas;