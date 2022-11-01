const pool = require('../conn');

module.exports = async function verificaIdAutor (res, authorId) {

  try {
    const { rows, rowCount } = await pool.query(`SELECT * FROM autores WHERE id = $1`, [authorId]);
  
    if (rowCount < 1) {
      res.status(400).json({ mensagem: 'ID informado não existe, tente novamente!' });
      return false;
    } 

    return rows;
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: 'Erro interno do servidor!' });
  }
};