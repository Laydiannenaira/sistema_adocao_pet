# Sistema de Adoção de Pets 

## Backend

Este repositório contém o backend do sistema de adoção de pets, desenvolvido para modernizar o processo de um abrigo de animais. A aplicação permite o gerenciamento de pets e adotantes, além de automatizar o processo de adoção, tornando-o mais eficiente e acessível.

O backend é responsável pela lógica do sistema e pela gestão dos dados. Ele foi construído utilizando **Node.js** com o framework **Express**, e utiliza o **Prisma ORM** para interagir com o banco de dados.

---

### Funcionalidades Implementadas

O backend oferece uma API RESTful para as seguintes funcionalidades:

* **Pets**: Permite o **CRUD** (Create, Read, Update, Delete) de informações dos pets.
    * `GET /pets`: Lista todos os pets disponíveis no sistema.
    * `POST /pets`: Cadastra um novo pet com nome, espécie, data de nascimento, descrição e status.
    * `PUT /pets/:id`: Atualiza os dados de um pet existente.
    * `DELETE /pets/:id`: Remove um pet do sistema.
* **Adotantes**: Gerencia o cadastro de adotantes.
    * `POST /adopters`: Registra um novo adotante com nome, e-mail, telefone e endereço.
* **Adoções**: Formaliza o processo de adoção.
    * `POST /adoptions`: Registra uma nova adoção, associando um pet a um adotante. Automaticamente, o status do pet é atualizado para "adotado".

---

### Estrutura do Banco de Dados

O projeto utiliza um banco de dados relacional como PostgreSQL ou MySQL para armazenar as informações. As tabelas principais são:

* `pets`: Armazena informações dos pets, incluindo `id`, `nome`, `espécie`, `data de nascimento`, `descrição` e `status`.
* `adopters`: Contém os dados dos adotantes, como `id`, `nome`, `e-mail`, `telefone` e `endereço`.
* `adoptions`: Registra as adoções realizadas, com referência ao pet e adotante.

---

### Como Rodar o Projeto

Para executar o backend localmente, siga os passos abaixo:

1.  **Pré-requisitos:** Certifique-se de ter o Node.js e o PostgreSQL ou MySQL instalados na sua máquina.

2.  **Configuração:**
    * Clone este repositório.
    * Navegue até o diretório do projeto no terminal.
    * Crie um arquivo `.env` na raiz do projeto e configure a variável `DATABASE_URL` com a string de conexão do seu banco de dados. Exemplo:
        `DATABASE_URL="postgresql://user:password@localhost:5432/nomedobanco?schema=public"`

3.  **Instalação de Dependências:**
    * Instale as dependências do projeto com o seguinte comando:
        `npm install`

4.  **Configuração do Banco de Dados (Migrations):**
    * Para criar as tabelas no seu banco de dados com base no `schema.prisma`, execute a migração:
        `npx prisma migrate dev --name init`

5.  **Inicialização do Servidor:**
    * Inicie o servidor de desenvolvimento com o comando:
        `npm start` ou `node index.js`

    O servidor estará rodando em `http://localhost:8080`.

---

### Contribuição

Este projeto foi desenvolvido por **Squad** 8 para o curso de **Desenvolvimento Full Stack Avanti**, projeto **DFS-2025.3**.
