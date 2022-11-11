/* eslint no-console: ["error", { allow: ["log"] }] */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes');
const handleError = require('./middlewares/handleError');

const app = express();
const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(handleError);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
