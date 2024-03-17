# Sistema de Forúm

Projeto de um sistema de fórum que conta também com um sistema de notificações. O projeto foi desenvolvido no curso de formação em Node.js da Rocketseat e aplica os conceitos da Clean Architecture e Domain Driven Design (DDD). O sistama conta com testes de unidade e testes end-to-end e também utiliza de tecnologias como PostgreSQL para a persistência de dados, Redis para cache de consultas e NestJS para implementar uma API RESTFUL.

# Teste a aplicação em sua máquina

Certifique-se de ter o Docker e o Node.js instalados em sua máquina antes de prosseguir.

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/)

1. Faça o clone do projeto

```bash
git clone https://github.com/marcosparreiras/ignite-node-stage04-forum.git
```

2. Navegue até diretório do projeto e instale as dependências com o comando:

```bash
npm install
```

3. Renomeie o arquivo `.sample.env` para `.env` e complete as variáveis de ambiente com informações válidas

4. Suba os bancos de dados utilizando Docker Compose:

```bash
docker compose up -d
```

5. Inicie a aplicação em modo de desenvolvimento:

```bash
npm run start:dev
```

ou, rode os testes de unidade com o comando:

```bash
npm run test
```

ou, rode os testes end-to-end com o comando:

```bash
npm run test:e2e
```

# Endpoints

### Usuários

| Método | Rota      | Necessário autorização | Descrição                                                       |
| ------ | --------- | ---------------------- | --------------------------------------------------------------- |
| POST   | /accounts | ❌                     | Cria um novo usuário na aplicação                               |
| POST   | /sessions | ❌                     | Inicia a sessão de um usuário e retorna um token de autorização |

---

#### POST /accounts

##### Body

```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "123456789"
}
```

---

#### POST /sessions

##### Body

```json
{
  "email": "johndoe@example.com",
  "password": "123456789"
}
```

---

### Perguntas

| Método | Rota                                   | Necessário autorização | Descrição                                                                 |
| ------ | -------------------------------------- | ---------------------- | ------------------------------------------------------------------------- |
| GET    | /questions/:slug                       | ❌                     | Retorna uma pergunta específica pelo slug                                 |
| GET    | /questions                             | ❌                     | Lista as perguntas por ordem decrescente de criação                       |
| GET    | /questions/:questionId/answers         | ❌                     | Lista as respostas de uma pergunta                                        |
| GET    | /questions/:questionId/comments        | ❌                     | Lista os comentários de uma pergunta                                      |
| POST   | /questions                             | ✅                     | Cria uma nova pergunta                                                    |
| POST   | /questions/:questionId/answers         | ✅                     | Cria uma resposta para um pergunta                                        |
| POST   | /questions/:questionId/comments        | ✅                     | Cria um comentário em uma pergunta                                        |
| PUT    | /questions/:id                         | ✅                     | Atualiza uma pergunta. (Restrito ao criador da pergunta)                  |
| DELETE | /questions/:id                         | ✅                     | Deleta uma pergunta. (Restrito ao criador da pergunta)                    |
| DELETE | /questions/comments/:questionCommentId | ✅                     | Deleta um comentário de uma resposta. (Restrito ao criador do comentário) |

---

#### GET /questions/:slug

---

#### GET /questions

##### Search params

```bash
page=1
```

---

#### GET /questions/:questionId/answers

##### Search params

```bash
page=1
```

---

#### GET /questions/:questionId/comments

##### Search params

```bash
page=1
```

---

#### POST /questions

##### Headers

```bash
Authorization: Bearer token
```

##### Body

```json
{
  "title": "Software Development",
  "content": "How do you approach requirements management in software development projects to ensure the delivery of a product that meets the needs of end users?",
  "attachmentsIds": ["e9c27b15-06d7-42d2-8df0-f961f16f3d9d"]
}
```

---

#### POST /questions/:questionId/answers

##### Headers

```bash
Authorization: Bearer token
```

##### Body

```json
{
  "content": "Software development is the process of designing, creating, testing, and maintaining software applications and systems. It involves using programming languages, frameworks, libraries, and tools to develop software solutions that meet user needs.",
  "attachmentsIds": ["e9c27b15-06d7-42d2-8df0-f961f16f3d9d"]
}
```

---

#### POST /questions/:questionId/comments

##### Headers

```bash
Authorization: Bearer token
```

##### Body

```json
{
  "content": "What an amazing question!!"
}
```

---

#### PUT /questions/:id

##### Headers

```bash
Authorization: Bearer token
```

##### Body

```json
{
  "title": "Software Development",
  "content": "How do you approach requirements management in software development projects to ensure the delivery of a product that meets the needs of end users?",
  "attachmentsIds": ["e9c27b15-06d7-42d2-8df0-f961f16f3d9d"]
}
```

---

#### DELETE /questions/:id

##### Headers

```bash
Authorization: Bearer token
```

---

#### DELETE /questions/comments/:questionCommentId

##### Headers

```bash
Authorization: Bearer token
```

---

### Respostas

| Método | Rota                               | Necessário autorização | Descrição                                                                               |
| ------ | ---------------------------------- | ---------------------- | --------------------------------------------------------------------------------------- |
| GET    | /answers/:answerId/comments        | ❌                     | Lista os comentários de uma resposta                                                    |
| PATCH  | /answer/:answerId/choose-as-best   | ✅                     | Marca uma resposta como a melhor de uma pergunta. (Restrita ao criador de uma pergunta) |
| POST   | /answers/:answerId/comments        | ✅                     | Cria um comentário em uma resposta                                                      |
| PUT    | /answers/:id                       | ✅                     | Atualiza uma resposta. (Restrito ao criador da resposta)                                |
| DELETE | /answers/:id                       | ✅                     | Deleta uma resposta. (Restrito ao criador da resposta)                                  |
| DELETE | /answers/comments/:asnwerCommentId | ✅                     | Deleta um comentário de uma resposta. (Restrito ao criador do comentário)               |

---

#### GET /answers/:answerId/comments

##### Search params

```bash
page=1
```

---

#### PATCH /answer/:answerId/choose-as-best

##### Headers

```bash
Authorization: Bearer token
```

---

#### POST /answers/:answerId/comments

##### Headers

```bash
Authorization: Bearer token
```

##### Body

```json
{
  "content": "Great answer!"
}
```

---

#### PUT /answers/:id

##### Headers

```bash
Authorization: Bearer token
```

```json
{
  "content": "Software development is the process of designing, creating, testing, and maintaining software applications and systems. It involves using programming languages, frameworks, libraries, and tools to develop software solutions that meet user needs.",
  "attachmentsIds": ["e9c27b15-06d7-42d2-8df0-f961f16f3d9d"]
}
```

---

#### DELETE /answers/:id

##### Headers

```bash
Authorization: Bearer token
```

---

#### DELETE /answers/comments/:asnwerCommentId

##### Headers

```bash
Authorization: Bearer token
```

---

### Anexos

| Método | Rota         | Necessário autorização | Descrição                |
| ------ | ------------ | ---------------------- | ------------------------ |
| POST   | /attachments | ✅                     | Faz o upload de um anexo |

---

#### POST /attachments

##### Headers

```bash
Authorization: Bearer token
Content-Type: multipart/form-data
```

##### form-data

```bash
key="file"
value="./some-dir/file-name.png"
```

---

### Notificações

As notificações são criadas automaticamente e disparadas para os usuários interessados quando:

- Uma resposta é criada
- Uma resposta é comentada
- Uma resposta é marcada como a melhor de uma pegunta
- Uma pergunta é comentada

| Método | Rota                   | Necessário autorização | Descrição                              |
| ------ | ---------------------- | ---------------------- | -------------------------------------- |
| PATCH  | /notification/:id/read | ✅                     | Marca uma notificação como visualizada |

---

#### PATCH /notification/:id/read
