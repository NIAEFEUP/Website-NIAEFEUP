# Site-NIAEFEUP

### Objetivo do projeto

O objetivo deste projeto é que o [site](https://ni.fe.up.pt) do Núcleo seja dinâmico. Desta forma, os membros têm a sua conta de acesso ao website e podem personalizar o seu perfil ao seu gosto. Adicionalmente, o recrutamento do NI passa a ser feito através do website, assim como a realização de entrevistas e a aceitação dos candidatos por parte do presidente. Com este projeto, os membros podem aprender sobre tecnologias emergentes no paradigma da web, nomeadamente, nodejs.

### Tecnologias usadas

* [Node.js](https://nodejs.org/en/])
* [Keystone.js](http://keystonejs.com/)
* [MongoDB](https://www.mongodb.com/)
* [Bootstrap](https://getbootstrap.com/)
* [SASS](http://sass-lang.com/)

### Como instalar/executar

#### 1. Clonar o repositório e entrar dentro do novo directório

  ```bash
  git clone https://github.com/NIAEFEUP/Website-NIAEFEUP.git
  cd Website-NIAEFEUP
  ```

#### 2. Instalar as dependências do package.json:

  ```bash
  npm install
  ```

#### 3. Adicionar as variáveis de ambiente:

* Criar um ficheiro .env no directório principal e adicionar:
```
 MONGO_URI=mongodb://<user>:<password>@<dominio>:<porta>/<nome_db>
 COOKIE_SECRET=u|_*J5<+Ed4eM#$g)B|G)z$8fy$Pt$E36MC=lnok;o6-]:cWnPuJdR>X*Z,bWDO
```
O COOKIE_SECRET é uma string grande e random, pode ser qualquer coisa.
Não se esqueçam do URI do mongo, alternativamente podem correr uma base de dados local e fazer a ligação ao localhost.

Mais informações sobre este ficheiro estão disponíveis abaixo.

#### 4. Iniciar o servidor:

  ```bash
  node keystone
  ```

  Para ter __hot reload__ é possivel correr a app com `nodemon`, para tal é necessário instalá-la como uma dependencia global, acessível em todo o sistema.

 ```bash
  npm install -g nodemon
  ```
Para iniciar:
 ```bash
  nodemon src/keystone.js
  ```

  Desta forma, cada vez que houver alterações no código, a aplicação é recompilada e reiniciada para aplicar as alterações efetuadas.

  - Para reiniciar manualmente, escrever `rs` no terminal
  - Para terminar, enviar sinal SIGTERM `^C`

  Também é possivel correr o projeto com Docker, através no `docker-compose.yml` disponivel. Usa `docker-compose up [--build]` para iniciar tanto o servidor como uma base de dados mongodb. No .env deves especificar o seguinte `MONGO_URI`: `mongodb://mongo/<nome-da-db-que-quiseres>` 

### Estrutura do projeto

```
+---img: Pasta com as imagens do site.
|   \---members: Pasta com as imagens dos membros.
+---models: Modelos da base dados. Cada ficheiro representa uma Entidade.
+---public: Javascript, Styling, etc. relacionado com o front end.
|   +---styles: Estilo do website
|   |   \---site: Ficheiro scss por página.
+---routes: Controladores do website.
|   +---api: Endpoints da API do website
|   \---views: Lógica que devolve as vistas. C do modelo MVC
|   index.js: Declaração das rotas do website.
|   middleware.js: Usado para efetuar controlo de acessos e afins.
+---templates: Pasta com as vistas em pug.
|   +---layouts: Pasta com os layouts comuns a várias vistas (header, footer,..)
|   +---mixins: UI's auxiliares como as flash messages.
|   +---mockups: Mockups feitos para o design do website.
|   \---views: Ficheiros correspondentes ao design nas páginas em si.
+---updates: Pasta com os scripts usados para fazer atualizações.
Keystone.js: Entry point do website.
```

### Estrutura do envfile (.env)
* `MONGO_URI` - URI da base de dados (```mongodb://<user>:<password>@<dominio>:<porta>/<nome_db>```)
* `COOKIE_SECRET` - String aleatória, de preferência não muito curta (20+ chars)
* `GMAIL_ADDRESS` - E-mail sender das respostas às candidaturas
* `GMAIL_PASS` - Password respetiva do e-mail acima
* `SLACK_INVITE` - Link do invite para Slack
* `GOOGLE_GROUPS_INVITE` - Link do invite para Google Groups
* `GOOGLE_DRIVE_INVITE` - Link do invite para Google Drive
