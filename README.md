# lab-express-mongo

## requirements

* nodejs
* docker
* docker-compose

## development

Install dependencies

```bash
npm i
```

Start mongo

```bash
docker-compose up -d
```

Run server

```bash
npm run dev
```

## configuration

You can create a `.env` file and customize any of the variables below:

```
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
AUTH_EXPIRES=8h
AUTH_SECRET=lab-express-mongo-secret
DB_URI=mongodb://localhost/lab-express-mongo
DB_PORT=27017
SENTRY_DSN=
```
