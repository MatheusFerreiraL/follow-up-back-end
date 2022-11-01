
# Exercício 01

## Implementação de Api para sistemas de Biblioteca

A API se conecta com um banco de dados `postgreSQL` chamado `biblioteca` e todo código de criação das tabelas está no arquivo `dump.sql`

1 - Tabela chamada `autores` contendo as seguintes características:

- Um identificador único do autor como chave primaria e auto incremento;
- O nome (obrigatório)
- A idade

2 - Funcionalidade de cadastrar um autor no banco de dados seguindo as especificações;

3 - Funcionalidade de buscar um autor no banco de dados através do seu identificador único (trazendo as informações de todos os seus livros);

4 - Tabela chamada `livros` contendo as seguintes características:

- Um identificador único do livro como chave primaria e auto incremento;
- O nome (obrigatório)
- O genero
- A editora
- A data de publicação no formato `YYYY-MM-DD`
- O identificador do autor responsável pelo livro

5 - Funcionalidade de cadastrar um livro para um autor no banco de dados;

6 - Funcionalidade de listar os livros cadastrados no banco de dados, com as informações do seu autor;
###### tags: `exercícios` `lógica` `banco de dados` `sql` `postgres`
