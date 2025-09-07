CREATE SCHEMA store;

CREATE TABLE IF NOT EXISTS store.restaurante(
  id SERIAL primary key,
  name VARCHAR(100) NOT NULL,
  endereco VARCHAR(200) NOT NULL,
  telefone VARCHAR(11) NOT NULL,
  email VARCHAR(100) NOT NULL,
  descricao VARCHAR(100) NOT NULL 
)
