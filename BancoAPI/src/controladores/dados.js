const bancodedados = require('../bancodedados');
const { contas, depositos, saques, transferencias } = bancodedados;
const { format } = require('date-fns');
let idConta = 1;

const listar_contas = (req, res) => {
  return res.status(200).json(bancodedados.contas);
};

const criar_conta = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  const novaConta = {
    numero: idConta++,
    saldo: 0,
    usuario: {
      nome,
      cpf,
      data_nascimento: format(new Date(data_nascimento), 'dd-MM-yyyy'),
      telefone,
      email,
      senha
    }
  };
  contas.push(novaConta);
  return res.status(201).send();
};

const atualizar_usuario = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  const { numeroConta } = req.params;

  const contaParaAtualizar = contas.find(conta => {
    return conta.numero === Number(numeroConta);
  });

  contaParaAtualizar.usuario.nome = nome;
  contaParaAtualizar.usuario.cpf = cpf;
  contaParaAtualizar.usuario.data_nascimento = format(new Date(data_nascimento), 'dd-MM-yyyy')
  contaParaAtualizar.usuario.telefone = telefone;
  contaParaAtualizar.usuario.email = email;
  contaParaAtualizar.usuario.senha = senha;

  res.status(201).send();
};

const acharConta = (contaBuscada) => {
  const conta = contas.find(conta => {
    return conta.numero === Number(contaBuscada);
  });

  return conta;
};

const excluir_conta = (req, res) => {
  const { numeroConta } = req.params;
  let index;
  const contaParaExcluir = acharConta(numeroConta);

  if (!contaParaExcluir) {
    return res.status(400).json({ mensagem: 'Conta não foi encontrada!' });
  }
  if (Number(contaParaExcluir.saldo) !== 0) {
    return res.status(400).json({ mensagem: 'A conta só pode ser excluída com saldo zerado!'});
  }

  contas.splice(index, 1);
  return res.status(204).send();
};

const fazer_deposito = (req, res) => {
  const { numero_conta, valor } = req.body; 

  const contaParaDeposito = acharConta(numero_conta);

  if (!contaParaDeposito) {
    return res.status(404).json({ mensagem: 'Conta não encontrada!' });
  }

  contaParaDeposito.saldo += Number(valor);
  depositos.push({
    data: format(new Date(), 'dd-MM-yyyy H:mm:ss'),
    numero_conta,
    valor
  });
  
  return res.status(200).send();
};

const fazer_saque = (req, res) => {
  const { numero_conta, valor, senha } = req.body;
  const contaParaSaque = acharConta(numero_conta);

  if (!contaParaSaque) {
    return res.status(404).json({ mensagem: 'Conta não encontrada!' });
  }
  if (contaParaSaque.usuario.senha !== senha) {
    return res.status(401).json({ mensagem: 'Senha incorreta!' });
  }
  if (contaParaSaque.saldo < valor) {
    return res.status(400).json({ mensagem: 'Saldo insuficiente!' });
  }

  contaParaSaque.saldo -= valor;
  saques.push({
    data: format(new Date(), 'dd-MM-yyyy H:mm:ss'),
    numero_conta,
    valor
  });

  return res.status(200).send();
};

const fazer_transferencia = (req, res) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
  const contaOrigem = acharConta(numero_conta_origem);
  const contadestino = acharConta(numero_conta_destino);

  if (contaOrigem.usuario.senha !== senha) {
    return res.status(400).json({ mensagem: 'A senha informada é inválida!' });
  }
  if (contaOrigem.saldo < valor) {
    return res.status(400).json({ mensagem: 'O saldo da conta de origem é insuficiente!' });
  }

  contaOrigem.saldo -= valor;
  contadestino.saldo += valor;
  transferencias.push({
    data: format(new Date(), 'dd-MM-yyyy H:mm:ss'),
    numero_conta_origem,
    numero_conta_destino,
    valor
  });

  return res.status(200).send();
};

const exibir_saldo = (req, res) => {
  const { numero_conta, senha } = req.query;
  const saldoConta = acharConta(numero_conta);

  if (saldoConta.usuario.senha !== senha) {
    return res.status(400).json({ mensagem: 'A senha informada é inválida!' });
  }

  res.status(200).json(`O saldo da conta ${numero_conta} é de R$ ${saldoConta.saldo}`);
};

const exibir_extrato = (req, res) => {
  const { numero_conta, senha } = req.query;
  const extratoConta = acharConta(numero_conta);
  const extrato = {
    depositos: [],
    saques: [],
    transferenciasEnviadas: [],
    transferenciasRecebidas: []
  };

  if (extratoConta.usuario.senha !== senha) {
    return res.status(400).json({ mensagem: 'A senha informada é inválida!' });
  }

  depositos.forEach(deposito => {
    if (deposito.numero_conta === numero_conta){
      extrato.depositos.push(deposito);
    }
  });
  saques.forEach(saque => {
    if(saque.numero_conta === numero_conta){
      extrato.saques.push(saque);
    }
  });
  transferencias.forEach(transf => {
    if (transf.numero_conta_origem === numero_conta) {
      extrato.transferenciasEnviadas.push(transf);
    }else if (transf.numero_conta_destino === numero_conta) {
      extrato.transferenciasRecebidas.push(transf);
    }
  });

  return res.status(200).send(extrato);
};

module.exports = { 
  listar_contas, criar_conta, 
  atualizar_usuario, excluir_conta, 
  fazer_deposito, fazer_saque,
  fazer_transferencia, exibir_saldo,
  exibir_extrato
};