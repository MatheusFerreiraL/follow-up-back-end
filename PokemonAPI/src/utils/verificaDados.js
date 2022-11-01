const pool = require('../conn');

const dadosObrigatorios = (res, objeto) => {
  for (let chave in objeto) {
    if (!objeto[chave]) {
      res.status(400).json({ mensagem: `O campo ${chave} é obrigatório!` });
      return false;
    }
  }
  return true;
};

const verificaEmail = async (res, email) => {

  const query = `SELECT * FROM usuarios WHERE email = $1;`;

  try {
    const {rowCount} = await pool.query(query, [email]);
    if (rowCount > 0) {
      res.status(400).json({ mensagem: 'O email informado já existe!' });
      return false;
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ mensagem: 'Erro interno do servidor' });
    return false;
  }
  return true;
};

module.exports = {
  dadosObrigatorios,
  verificaEmail
}