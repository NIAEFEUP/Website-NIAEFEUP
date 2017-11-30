# Site-NIAEFEUP

### Objetivo do projeto

### Tecnologias usadas

### Como instalar/executar

1. Clone this repo to your computer, and cd into the project directory:

  ```bash
  git clone https://github.com/NIAEFEUP/Website-NIAEFEUP.git
  cd Website-NIAEFEUP
  ```

2. Install the dependencies from package.json:

  ```bash
  npm install
  ```

3. Add environment variables:

* Create a .env file in the root folder and add:
```
 MONGO_URI=mongodb://<user>:<password>:@ds157853.mlab.com:57835/yournewdb
 COOKIE_SECRET=u|_*J5<+Ed4eM#$g)B|G)z$8fy$Pt$E36MC=lnok;o6-]:cWnPuJdR>X*Z,bWDO
```
The cookie secret is a random long string. This is just an working example.
Don't forget to user your MONGO_URI.

3. Start the server:

  ```bash
  node keystone
  ```

### Estrutura do projeto
