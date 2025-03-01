## Descrição

Este é o backend do NomeDoProjeto, construído com Node.js utilizando o framework NestJS e TypeScript. Ele utiliza Docker para facilitar o ambiente de desenvolvimento, Jest para testes unitários, Winston para logging, Postgres como banco de dados e TypeORM como ORM.

## Tecnologias utilizadas

```bash
Node.js e NestJS – Framework e runtime para construir APIs escaláveis.
TypeScript – Linguagem de programação com tipagem estática.
Docker – Containerização do ambiente de desenvolvimento e produção.
Jest – Testes unitários e de integração.
Winston – Logging estruturado.
PostgreSQL – Banco de dados relacional.
TypeORM – ORM para facilitar a comunicação com o banco de dados.

```
## Pré-requisitos
```bash
Docker instalado e configurado.
Yarn ou npm para gerenciamento de pacotes (opcional, se for utilizar comandos fora do Docker).
```
## como rodar
```bash
docker compose up --build
```

## testes

```bash
$ yarn run test
```

## Documentação

```bash
http://localhost:3000/api
```
