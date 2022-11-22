const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { URL_PATTERN } = require('../utils/constants');
const {
  getUsers,
  getUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/me', getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUserInfo);
router.get('/', getUsers);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(URL_PATTERN).required(),
  }),
}), updateUserAvatar);

module.exports = router;
