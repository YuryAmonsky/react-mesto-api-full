const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { UnathorizedError } = require('../utils/errors/index');
const urlValidator = require('../utils/urlValidator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: urlValidator,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        const err = new UnathorizedError('Неправильные почта или пароль');
        return Promise.reject(err);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            const err = new UnathorizedError('Неправильные почта или пароль');
            return Promise.reject(err);
          }
          return Promise.resolve(user);
        });
    });
};

module.exports = mongoose.model('user', userSchema);
