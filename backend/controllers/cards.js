/* eslint no-console: ["error", { allow: ["log"] }] */
const mongoose = require('mongoose');
const Card = require('../models/card');
const {
  BadRequestError,
  ForbidenError,
  NotFoundError,
  InternalServerError,
} = require('../utils/errors/index');
const { OK } = require('../utils/constants');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(OK).send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(OK).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные карточки'));
      }
      return next(new InternalServerError('Произошла ошибка на сервере.'));
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Не найдена карточка с указанным _id.'))
    .then((cardDoc) => {
      if (req.user._id !== cardDoc.owner.toString()) {
        return next(new ForbidenError('Нельзя удалять чужую карточку'));
      }
      return Card.findByIdAndRemove(req.params.cardId);
    })
    .then((card) => res.status(OK).send({ message: `Карточка _id:${card._id} удалена` }))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return next(err);
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Переданы некорректные данные карточки'));
      }
      return next(new InternalServerError('Произошла ошибка на сервере.'));
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Не найдена карточка с указанным _id.'))
    .then((card) => res.status(OK).send({ data: card }))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return next(err);
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Переданы некорректные данные карточки'));
      }
      return next(new InternalServerError('Произошла ошибка на сервере.'));
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Не найдена карточка с указанным _id.'))
    .then((card) => res.status(OK).send({ data: card }))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return next(err);
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Переданы некорректные данные карточки'));
      }
      return next(new InternalServerError('Произошла ошибка на сервере.'));
    });
};
