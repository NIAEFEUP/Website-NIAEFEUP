# Site-NIAEFEUP

### Objetivo do projeto

### Tecnologias usadas

* [Node.js](https://nodejs.org/en/])
* [Keystone.js](http://keystonejs.com/)
* [MongoDB](https://www.mongodb.com/)
* [Bootstrap](https://getbootstrap.com/)
* [SASS](http://sass-lang.com/)

### Como instalar/executar

1. Clonar o repositório e entrar dentro do novo directório

  ```bash
  git clone https://github.com/NIAEFEUP/Website-NIAEFEUP.git
  cd Website-NIAEFEUP
  ```

2. Instalar as dependências do package.json:

  ```bash
  npm install
  ```

3. Adicionar as variáveis de ambiente:

* Criar um ficheiro .env no directório principal e adicionar:
```
 MONGO_URI=mongodb://<user>:<password>:@ds157853.mlab.com:57835/yournewdb
 COOKIE_SECRET=u|_*J5<+Ed4eM#$g)B|G)z$8fy$Pt$E36MC=lnok;o6-]:cWnPuJdR>X*Z,bWDO
```
O COOKIE_SECRET é uma string grande e random, pode ser qualquer coisa.
Não se esqueçam do URI do mongo, alternativamente podem correr uma base de dados local e fazer a ligação ao localhost.

4. Iniciar o servidor:

  ```bash
  node keystone
  ```

### Estrutura do projeto
