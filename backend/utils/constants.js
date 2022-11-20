const OK = 200;
const URL_PATTERN = /^https?:\/\/(?:w{3}\.)?(?:[a-z0-9]+[a-z0-9-]*\.)+[a-z]{2,}(?::[0-9]+)?(?:\/\S*)?#?$/i;
const allowedCors = [
  'http://localhost:3001',
<<<<<<< HEAD
  'http://amo.edu.nomoredomains.icu',
=======
  'http://amo.edu.nomoredomains.club',
>>>>>>> 797ea83b6d0e9f91c41560fc2c0c58242746aab3
];
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
module.exports = {
  OK,
  URL_PATTERN,
  allowedCors,
  DEFAULT_ALLOWED_METHODS,
};
