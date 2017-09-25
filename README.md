# Site-NIAEFEUP

### Get Started!

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

## TODO List

* [x] Login/Logout
* [x] Atualizar informação do membro
* [x] Atualizar Foto de perfil
* [ ] Atualizar front-end
* [ ] Manipulação de file system com [fs](https://nodejs.org/api/fs.html)
* [ ] Quando o user dá upload de uma imagem, fazer set no seu image_path com o novo caminho
* [ ] Aperfeiçoar o modelo atual (formulário de edição de perfil | api para upload de ficheiros) -> Deixei uns TODO's em alguns ficheiros
* [ ] Criar um Back-End para gerir o processo de recrutamento.
* [x] Página publica com o formulário de candidatura.
* [ ] Permitir ao admin marcar as entrevistas como realizadas.
* [ ] Aceitar/Rejeitar novos membros (Enviar convite para as contas de :Slack, GoogleGroup, Site).
* [ ] Enviar emails de feedback aos candidatos.
* [ ] Fazer integração com Google Calendar para marcação de reuniões.
* [ ] Back-end ser um headless CMS de forma a cada direção escolher o seu front-end.
