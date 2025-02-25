import mongoose, { Schema } from 'mongoose';
import isURL from 'validator/lib/isURL';
import { isEmail } from 'validator';
import bcrypt from 'bcryptjs';
import UnauthorizedError from '../errors/unauthorizedError';
import {
  IUser, IUserTools, DefaultValues, IUserModel,
} from './types';

const userSchema = new Schema<IUser, IUserModel, IUserTools>(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: DefaultValues.UserName,
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 200,
      default: DefaultValues.UserAbout,
    },
    avatar: {
      type: String,
      default: DefaultValues.UserAvatar,
      validate: {
        validator: (v: string) => isURL(v),
        message: 'Поле аватар должно быть ссылкой',
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: (v: string) => isEmail(v),
        message: 'Поле email должно быть валидным',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

userSchema
  .statics
  .findUserByCredentials = async function findUserByCredentials(email: string, password: string) {
    const user = await this.findOne({ email }).select('+password');

    if (!user || await bcrypt.compare(password, user.password)) {
      return Promise.reject(new UnauthorizedError('Передан не верный логин или пароль'));
    }
    return user;
  };

userSchema.methods.deletePassword = function deletePassword() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model<IUser, IUserModel>('user', userSchema);
