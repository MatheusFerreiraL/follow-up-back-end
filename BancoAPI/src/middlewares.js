const bancodedados = require('./bancodedados');
const { contas } = bancodedados;
const senhaListarContas = 'Cubos123Bank';

function dadosObrigatorios(res, objeto) {
  for (let chave in objeto) {
    if(!objeto[chave]) {
      res.status(400).json({ mensagem: `O campo ${chave} é obrigatório!` });
      return false;
    }
  }
  return true;
}

function verificaCpf(res, cpf) {
  if (typeof cpf !== 'string') {
    res.status(400).json({ mensagem: 'O CPF deve ser do tipo string!' });
    return false;
  }
  for(let item of cpf) {
    if(!Number(item)) {
      res.status(400).json({ mensagem: 'O CPF deve conter apenas números!' });
      return false;
    }
  }
  if (cpf.length !== 11) {
    res.status(400).json({ mensagem: 'O CPF deve conter 11 dígitos!' });
    return false;
  }
  contas.forEach(conta => {
    if (conta.usuario.cpf === cpf) {
      res.status(400).json({ mensagem: 'Já existe uma conta com esse CPF!' });
      return false;
    }
  });
  return true;
}

const verificaSenha = (req, res, next) => {
  const { senha_banco } = req.query;

  if (senha_banco !== senhaListarContas) {
    return res.status(401).json({ mensagem: 'A senha do banco informada é inválida!' });
  }
  next();
};

const verificaDados = (req, res, next) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  if (!dadosObrigatorios(res, { nome, data_nascimento, telefone, email, senha })) {
    return;
  }

  if (!verificaCpf(res, cpf)) {
    return;
  }

  let emailExiste = false;
  contas.forEach(conta => {
    if (conta.usuario.email === email) {
      emailExiste = true;
    }
  });

  if (emailExiste) {
    return res.status(400).json({ mensagem: 'Já existe uma conta com esse email!' });
  }
  next();  
};

const verificaSeContaExiste = (contaBuscada) => {
  let contaExiste = false;
  contas.forEach(conta => {
    if (conta.numero === Number(contaBuscada)) {
      return contaExiste = true;
    }
  });
  return contaExiste;
};

const atualizarConta = (req, res, next) => {
  const { numeroConta } = req.params;
  let numeroDeContaExiste = verificaSeContaExiste(numeroConta);

  if(!numeroDeContaExiste) {
    return res.status(400).json({ mensagem: 'O número de conta informado não foi encontrado!' });
  }

  next();
};

const verificaNumeroDeContaEvalor = (req, res, next) => {
  const { numero_conta, valor } = req.body;
  let contaExiste = verificaSeContaExiste(numero_conta);

  if (!Number(numero_conta) || !Number(valor)) {
    return res.status(400).json({ mensagem: 'O número da conta e o valor devem ser informados!' });
  }

  if (!contaExiste) {
    return res.status(400).json({ mensagem: 'O número de conta informado não foi encontrado!' });
  }

  if (valor <= 0) {
    return res.status(400).json({ mensagem: 'O valor do depósito deve ser maior que zero!' });
  }

  next();
};

const verificaSenhaTransacoes = (req, res, next) => {
  const { senha } = req.body;

  if (!senha) {
    return res.status(400).json({ mensagem: 'A senha deve ser informada!' });
  }

  next();
};

const verificaTransferencia = (req, res, next) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
  const contaOrigemExiste = verificaSeContaExiste(numero_conta_origem);
  const contaDestinoExiste = verificaSeContaExiste(numero_conta_destino);

  if (!Number(numero_conta_origem) || !Number(numero_conta_destino) || !Number(valor) || !senha) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios para finalizar a transferência!' });
  }
  if (!contaOrigemExiste || !contaDestinoExiste) {
    return res.status(400).json({ mensagem: 'O número da conta de origem/destino informado não foi encontrado!' });
  }

  next();
};

const verificaExibicaoContaEsenha = (req, res, next) => {
  const { numero_conta, senha } = req.query;
  const contaExiste = verificaSeContaExiste(numero_conta);

  if (!numero_conta || !senha) {
    return res.status(400).json({ mensagem: 'O número da conta e a senha devem ser informados!' });
  }
  if (!contaExiste) {
    return res.status(400).json({ mensagem: 'O número da conta informado não foi encontrado!' });
  }

  next();
};

module.exports = { 
  verificaSenha, verificaDados, 
  atualizarConta, verificaNumeroDeContaEvalor,
  verificaSenhaTransacoes, verificaTransferencia,
  verificaExibicaoContaEsenha
};