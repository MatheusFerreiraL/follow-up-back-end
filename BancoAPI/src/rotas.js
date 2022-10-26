const express = require('express');
const rotas = express();
const { 
  listar_contas, criar_conta, 
  atualizar_usuario, excluir_conta, 
  fazer_deposito, fazer_saque,
  fazer_transferencia, exibir_saldo,
  exibir_extrato
} = require('./controladores/dados');
const { 
  verificaSenha, verificaDados, 
  atualizarConta, verificaNumeroDeContaEvalor,
  verificaSenhaTransacoes, verificaTransferencia,
  verificaExibicaoContaEsenha
}  = require('./middlewares');


rotas.get('/contas', verificaSenha, listar_contas);
rotas.post('/contas',verificaDados, criar_conta);
rotas.put('/contas/:numeroConta/usuario', atualizarConta, verificaDados, atualizar_usuario);
rotas.delete('/contas/:numeroConta', excluir_conta);
rotas.post('/transacoes/depositar', verificaNumeroDeContaEvalor, fazer_deposito);
rotas.post('/transacoes/sacar', verificaNumeroDeContaEvalor, verificaSenhaTransacoes, fazer_saque);
rotas.post('/transacoes/transferir', verificaTransferencia, fazer_transferencia);
rotas.get('/contas/saldo',verificaExibicaoContaEsenha, exibir_saldo);
rotas.get('/contas/extrato', verificaExibicaoContaEsenha, exibir_extrato);

module.exports = rotas;