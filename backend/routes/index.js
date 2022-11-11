const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const users = require('./users');
const cards = require('./cards');
const { validateToken } = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const { URL_PATTERN } = require('../utils/constants');
const { NotFoundError } = require('../utils/errors/index');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().default('Жак-Ив Кусто').min(2).max(30),
    about: Joi.string().default('Исследователь').min(2).max(30),
    avatar: Joi.string().regex(URL_PATTERN)
      .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  }),
}), createUser);
router.use('/users', validateToken, users);
router.use('/cards', validateToken, cards);
router.use('*', (req, res, next) => {
  const err = new NotFoundError('По указанному пути ничего не найдено');
  next(err);
});
router.use(errors());

module.exports = router;
