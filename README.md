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

3. Export the Stormpath API Key ID / Secret and Application HREF Environment Variables (Alternatively you can create an [API Key Pair](https://docs.stormpath.com/rest/product-guide/latest/quickstart.html#create-an-api-key-pair)) :

  ```bash
  export STORMPATH_CLIENT_APIKEY_ID=xxx
  export STORMPATH_CLIENT_APIKEY_SECRET=xxx
  export STORMPATH_APPLICATION_HREF=xxx
  ```
  
4. Start the server:

  ```bash
  node server.js
  ```
