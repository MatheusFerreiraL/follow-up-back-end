const pool = require('../conn');
const verificaIdAutor = require('../utils/idAutor');

const  registraAutor = async (req, res) => {
  const { nome, idade } = req.body;
  if (!nome) return res.status(400).json({ mensagem: 'O nome deve obrigatoriamente ser informado' });
  
  const query = `
    INSERT INTO autores (nome, idade)
    VALUES ($1, $2) RETURNING *;    
  `;
  const params = [nome, idade];

  try {
    const { rows } = await pool.query(query, params);
    return res.json(rows[0]);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: 'Erro interno do servidor!' });
  }
};

const buscaAutor = async (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT autores.id, autores.nome, autores.idade, livros.id AS livro_id, livros.nome AS livro_nome, livros.genero AS livro_genero, livros.editora AS livro_editora, livros.data_publicacao AS data_publicacao FROM autores 
    LEFT JOIN livros ON autores.id = livros.autor_id 
    WHERE autores.id = $1;
  `;

  const resultadoBusca = await verificaIdAutor(res, id);
  if (!resultadoBusca) return;

  const { rows } = await pool.query(query, [id]);

  const livros = rows.map(livro => {
    return {
      id: livro.livro_id,
      nome: livro.livro_nome,
      genero: livro.livro_genero,
      editora: livro.livro_editora,
      data_publicacao: livro.data_publicacao,
    }
  });

  const pesquisaCompleta = {
    id: rows[0].id,
    nome: rows[0].nome,
    idade: rows[0].idade,
    livros: livros
  }

  return res.json(pesquisaCompleta);
};

const registraLivro = async (req, res) => {
  const { nome, genero, editora, data_publicacao } = req.body;
  const { id } = req.params;
  
  if (!nome) return res.status(400).json({ mensagem: 'O nome deve obrigatoriamente ser informado' });

  const idExiste = await verificaIdAutor(res, id);

  if (!idExiste) return;
  
  try {
    const query = `
      INSERT INTO livros (nome, genero, editora, data_publicacao, autor_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const { rows } = await pool.query(query,[nome, genero, editora, data_publicacao, id]);

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: 'Erro interno do servidor!' });
  }
};

const listarLivros = async (req, res) => {

  const query = `
    SELECT l.id AS id_livro, l.nome AS nome_livro, l.genero, l.editora, l.data_publicacao, a.id AS autor_id, a.nome AS autor_nome, a.idade AS autor_idade
    FROM livros l LEFT JOIN autores a ON l.autor_id = a.id;
  `;
  try {
    const { rows, rowCount } = await pool.query(query);

    if (rowCount < 1) return res.status(400).json({ mensagem: 'Não existe nenhum livro cadastrado!' });

    const livros = rows.map(livro => {
      const { autor_id, autor_nome, autor_idade, ...restoLivro } = livro;
      return {
        ...restoLivro,
        autor: {
          id: autor_id,
          nome: autor_nome,
          idade: autor_idade
        }
      }
    });

    return res.json(livros);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: 'Erro interno do servidor! '});
  }
};

module.exports = { 
  registraAutor,
  buscaAutor,
  registraLivro,
  listarLivros
};