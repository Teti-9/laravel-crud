## Gestão de Alunos e Matrículas.

Um CRUD desenvolvido em PHP utilizando o framework Laravel em conjunto com o banco de dados SQLite e um front-end que engloba HTML, CSS e JS.

## Funcionalidades da API  

- 📌 **Alunos:** CRUD (Criar, Ler, Atualizar, Deletar) de alunos.  

- 📌 **Matrículas:** CRUD (Criar, Ler, Atualizar, Deletar) de matrículas.  

- 📌 **Relacionamentos e Validações**: Aluno-Matrícula, FormRequests e JsonResources.

## 🛠️ Instalação, Configuração e Execução

### 🔹 Instalação Local (SQLite)
```
git clone https://github.com/Teti-9/laravel-crud.git
cd laravel-crud

O arquivo .env e database.sqlite estão expostos, logo não é necessário criar/editar ambos.

Rode os comandos na pasta do projeto:
composer install
php artisan migrate:fresh
php artisan serve
```
```
Após seguir os passos acima e com o php artisan serve rodando:

http://localhost:8000/ - Para acessar o front-end.
http://localhost:8000/api/{rotas-api-descritas-abaixo} - Para acessar as rotas com Postman, Insomnia, Thunder Client etc.
    - e.g. http://localhost:8000/api/alunos
```
## 🗂️ Estrutura do Back-end e Front-end
```
- Cada funcionalidade está organizada em um arquivo separado.  

app/
├── Enums/
│   └── Planos.php
├── Http/
│   ├── Controllers/
│   │   ├── AlunoController.php
│   │   └── MatriculaController.php
│   ├── Requests/
│   │   ├── StoreAlunoRequest.php
│   │   └── StoreMatriculaRequest.php
│   └── Resources/
│       ├── AlunoResource.php
│       └── MatriculaResource.php
├── Models/
│   ├── Aluno.php
│   └── Matricula.php
database/
├── migrations/
public
│   ├── index.html
│   ├── index.css
│   └── index.js
routes/
├── api.php
└── web.php
```
## 📚 Rotas da API
```
GET api/alunos- Lista todos alunos
GET api/alunos/{id} - Lista aluno específico
POST api/alunos - Cria novo aluno
PUT api/alunos/{id} - Atualiza aluno
DELETE api/alunos/{id} - Remove aluno

GET api/matriculas - Lista todas matrículas
GET api/matriculas/{id} - Lista matrícula específica
POST api/matriculas - Cria nova matricula
PUT api/matriculas/{id} - Atualiza matricula
DELETE api/matriculas/{id} - Remove matricula
```