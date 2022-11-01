
# Exercício 01

## Criação de API com autenticação

1 - Existe um banco de dados chamado `catalogo_pokemons` com as tabelas descritas abaixo e todo código de criação das tabelas está no arquivo `dump.sql`

a) Tabela `usuarios` com os campos:

- id - identificador único do usuário como chave primaria e auto incremento;
- nome - (obrigatório)
- email - (obrigatório e único)
- senha - (obrigatório)

b) Tabela `pokemons` com os campos

- id - identificador único do pokemon como chave primaria e auto incremento;
- usuario_id - (obrigatório)
- nome - (obrigatório)
- habilidades - (obrigatótio)
- imagem
- apelido

2 - Para a entidade `usuarios` foi implementado as seguintes funcionalidades.

a) Cadastro de usuário

- A senha do usuário criptografada usando a biblioteca `bcrypt` antes de salvar o cadastro.

b) Login de usuário

- Credenciais do usuário validada usando a biblioteca `bcrypt`.
- Token de autenticação gerado com a biblioteca `jsonwebtoken`.

3 - Para a entidade `pokemons` foi implementado as seguintes funcionalidades:

a) Cadastro do pokemons

b) Atualização apenas do apelido do pokemon

c) Listagem completa dos pokemons

d) Listagem de apenas um pokemon filtrado pelo seu id

e) Exclusão do pokemon

Mais informações da entidade `pokemons`:

- Recebe o token do header da requisição (_authorization_) no formato `Bearer Token` e valida o usuário logado em todos os endpoints.
- O campo `usuario_id` é obtido do token recebido no header.
- Na listagem de pokemons o campo `habilidades` retorna um array de habilidades.

###### tags: `exercícios` `lógica` `banco de dados` `sql` `postgres`
