const pool = require('../conn');
const { dadosObrigatorios } = require('../utils/verificaDados');

const cadastrarPokemon = async (req, res) => {
  const { nome, habilidades, imagem, apelido } = req.body;
  const usuarioLogado = req.usuario;

  const dadosInformados = dadosObrigatorios(res, {nome, habilidades});

  if (!dadosInformados) return;

  try {
    const query = `
    INSERT INTO pokemons (usuario_id, nome, habilidades, imagem, apelido)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;

    const { rows } = await pool.query(query, [usuarioLogado.id, nome, habilidades, imagem, apelido]);

    return res.status(201).json(rows[0]);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno de servidor" });
  }
};

const atualizarApelido = async (req, res) => {
  const { apelido } = req.body;
  const { id } = req.params;

  const dadosInformados = dadosObrigatorios(res, {apelido});

  if (!dadosInformados) return;

  try {
    const query = 'UPDATE pokemons SET apelido = $1 WHERE id = $2;';

    const { rowCount } = await pool.query(query,[apelido, id]);

    if (rowCount < 1) return res.status(400).json({ mensagem: 'Nenhum usuário cadastrado' });

    return res.status(204);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno de servidor" });
  }
};

const listarPokemons = async (req, res) => {
  const query = `
    SELECT p.id AS pokeId, u.nome AS userNome, p.apelido, p.habilidades, p.imagem FROM pokemons p LEFT JOIN usuarios u 
    ON p.usuario_id = u.id;
  `;

  const { rows, rowCount } = await pool.query(query);

  if (rowCount < 1) return res.status(400).json({ mensagem: 'Nenhum pokemon cadastrado' });

  const pokemons = rows.map(poke => {
    const habilidadeFormatada = poke.habilidades.split(',');
    return {
      id: poke.pokeid,
      usuario: poke.usernome,
      apelido: poke.apelido,
      habilidades: habilidadeFormatada,
      imagem: poke.imagem
    }
  });

  return res.json(pokemons);
}; 

const exibirUmPokemon = async (req, res) => {
  const { id } = req.params;

  const dadosInformados = dadosObrigatorios(res, {id});
  if (!dadosInformados) return;

  const query = `
    SELECT p.id AS pokeId, u.nome AS userNome, p.apelido, p.habilidades, p.imagem FROM pokemons p LEFT JOIN usuarios u 
    ON p.usuario_id = u.id 
    WHERE p.id = $1;
  `;

  try {
    const { rows, rowCount } = await pool.query(query, [id]);

    if (rowCount < 1) return res.status(400).json({ mensagem: 'Nenhum pokemon encontrado com o ID informado' });

    const pokemon = rows.map(poke => {
      const habilidadeFormatada = poke.habilidades.split(',');
      return {
        id: poke.pokeid,
        usuario: poke.usernome,
        apelido: poke.apelido,
        habilidades: habilidadeFormatada,
        imagem: poke.imagem
      }
    });
    return res.json(...pokemon);

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno de servidor" });
  }
};

const excluirPokemon = async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM pokemons WHERE id = $1;';
    
    const { rowCount } = await pool.query(query, [id]);

    if (rowCount < 1) return res.status(400).json({ mensagem: 'Não foi possível concluir a sua operação!' });

    return res.json({mensagem: 'Pokemon excluído com sucesso'});
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno de servidor" });
  }
};

module.exports = {
  cadastrarPokemon,
  atualizarApelido,
  listarPokemons,
  exibirUmPokemon,
  excluirPokemon
};