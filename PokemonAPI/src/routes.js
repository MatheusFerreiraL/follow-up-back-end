const express = require('express');
const rotas = express();
const verificaUsuarioLogado = require('./middlewares/autenticacao');
const { 
  cadastrarUsuario,
  login,
  listarUsuarios
} = require('./controllers/usuarios');
const {
  cadastrarPokemon, 
  atualizarApelido,
  listarPokemons,
  exibirUmPokemon,
  excluirPokemon
} = require('./controllers/pokemons');


rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', login); 

rotas.use(verificaUsuarioLogado);
rotas.get('/usuarios/listar', listarUsuarios);
rotas.post('/pokemon', cadastrarPokemon);
rotas.patch('/pokemon/:id/apelido', atualizarApelido);
rotas.get('/pokemon/listar', listarPokemons);
rotas.get('/pokemon/:id/listar', exibirUmPokemon);
rotas.delete('/pokemon/:id', excluirPokemon);


module.exports = rotas;