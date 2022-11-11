const { BadRequestError } = require('./errors/index');
const { URL_PATTERN } = require('./constants');

module.exports = (url) => {
  if (!URL_PATTERN.test(url)) {
    throw new BadRequestError('Неверный формат URL');
  }
  return true;
};
