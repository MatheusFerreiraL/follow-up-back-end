CREATE DATABASE biblioteca;

CREATE TABLE autores (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  idade INTEGER
);

CREATE TABLE livros (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  genero TEXT,
  editora TEXT,
  data_publicacao DATE,
  autor_id INTEGER REFERENCES autores(id)
);