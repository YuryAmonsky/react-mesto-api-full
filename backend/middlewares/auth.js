const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const UnathorizedError = require('../utils/errors/unathorized-error');

module.exports.SECRETKEY = 'aj3h4bng9f9g8bspa0fk';

module.exports.validateToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const err = new UnathorizedError('Необходима авторизация');
    return next(err);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : this.SECRETKEY);
  } catch (e) {
    const err = new UnathorizedError('Необходима авторизация');
    return next(err);
  }

  req.user = payload;

  return next();
};
