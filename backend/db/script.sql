CREATE DATABASE sistema_agendamento;

CREATE TABLE sys_user (
  iduser SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE sys_service (
  idservice SERIAL PRIMARY KEY,
  description VARCHAR(100) NOT NULL,
  duration VARCHAR(10) NOT NULL,
  ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE sys_user_service (
  iduser_service SERIAL PRIMARY KEY,
  iduser INTEGER NOT NULL,
  idservice INTEGER NOT NULL,
  idavailable_times INTEGER NOT NULL,
  date DATE NOT NULL,
  ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE sys_available_times (
  idavailable_times SERIAL PRIMARY KEY,
  idservice INTEGER NOT NULL,
  horario TIME NOT NULL,
  ativo BOOLEAN DEFAULT TRUE
);