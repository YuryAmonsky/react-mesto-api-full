/* eslint no-console: ["error", { allow: ["log"] }] */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SECRETKEY } = require('../middlewares/auth');
const {
  BadRequestError,
  NotFoundError,
  ConflictError,
  InternalServerError,
} = require('../utils/errors/index');
const {
  OK,
} = require('../utils/constants');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRETKEY, { expiresIn: '7d' });
      res.status(OK).send({ token });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(OK).send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  /* контроллер используется для получения данных
  текущего пользователя и пользователя с запрашиваемым id.
  добавляю проверку на наличие в запросе params.userID */
  let userId;
  if (req.params.userId) userId = req.params.userId;
  else userId = req.user._id;
  User.findById(userId).orFail(new NotFoundError(`Пользователь с id:${userId} не найден`))
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return next(err);
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Переданы некорректные данные пользователя'));
      }
      return next(new InternalServerError('Произошла ошибка на сервере.'));
    });
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      ...req.body, password: hash,
    }))
    .then(({
      name, about, avatar, email, _id, createdAt,
    }) => {
      res.status(OK).send(
        {
          data: {
            name, about, avatar, email, _id, createdAt,
          },
        },
      );
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с указанным email уже зарегистрирован'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные пользователя'));
      }
      return next(new InternalServerError('Произошла ошибка на сервере.'));
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .orFail(new NotFoundError(`Пользователь с id:${req.user._id} не найден`))
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return next(err);
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные пользователя'));
      }
      return next(new InternalServerError('Произошла ошибка на сервере.'));
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail(new NotFoundError(`Пользователь с id:${req.user._id} не найден`))
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return next(err);
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные пользователя'));
      }
      return next(new InternalServerError('Произошла ошибка на сервере.'));
    });
};
