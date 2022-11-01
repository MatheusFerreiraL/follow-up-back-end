const jwt = require('jsonwebtoken');
const pool = require('../conn');
const senhajwt = require('../senhaJWT');

const verificaUsuarioLogado = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).json({ mensagem: 'Usuário não autorizado' });

  const token = authorization.split(' ')[1];

  try {
    const { id } = jwt.verify(token, senhajwt);
    const query = 'SELECT * FROM usuarios WHERE id = $1;';
    
    const { rows, rowCount } = await pool.query(query, [id]);

    if (rowCount < 1) return res.status(401).json({ mensagem: 'Usuário não autorizado' });

    req.usuario = rows[0];

    next();
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ mensagem: 'Erro interno do servidor' });
  }
};

module.exports = verificaUsuarioLogado;