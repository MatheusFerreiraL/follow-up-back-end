const pool = require('../conn');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const senhajwt = require('../senhaJWT');
const { dadosObrigatorios, verificaEmail } = require('../utils/verificaDados');

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  const dadosInformados = dadosObrigatorios(res, {nome, email, senha});

  if (!dadosInformados) return;

  const emailUnico = await verificaEmail(res, email);

  if (!emailUnico) return;

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const query = `
      INSERT INTO usuarios (nome, email, senha)
      VALUES ($1, $2, $3) RETURNING *;
    `;
    const { rows } = await pool.query(query, [nome, email, senhaCriptografada]);

    return res.status(201).json(rows[0]);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno de servidor" });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  const dadosInformados = dadosObrigatorios(res, {email, senha});

  if (!dadosInformados) return;

  try {
    const query = 'SELECT * FROM usuarios WHERE email = $1;';
    const { rows, rowCount } = await pool.query(query, [email]);

    if (rowCount < 1) return res.status(400).json({ mensagem: 'Email ou senha inválido '});

    const senhaValida = await bcrypt.compare(senha, rows[0].senha);

    if (!senhaValida) return res.status(400).json({ mensagem: 'Email ou senha inválido '});

    const token = jwt.sign({id: rows[0].id}, senhajwt, {expiresIn: '1h'});

    const { senha: _, ...usuarioLogado } = rows[0];

    return res.json({ usuario: usuarioLogado, token });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno de servidor" });
  }
};

const listarUsuarios = async (req, res) => {

  const query = 'SELECT id, nome, email FROM usuarios;'

  const { rows, rowCount } = await pool.query(query);

  if (rowCount < 1) return res.status(400).json({ mensagem: 'Nenhum usuário cadastrado' });

  return res.json(rows);
};

module.exports = {
  cadastrarUsuario,
  login,
  listarUsuarios
}