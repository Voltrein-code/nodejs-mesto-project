import mongoose, { Schema } from 'mongoose';
import isURL from 'validator/lib/isURL';

enum DefaultValues {
  UserName = 'Жак-Ив Кусто',
  UserAbout = 'Исследователь',
  UserAvatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'
}

interface IUser {
  name: 'string' | DefaultValues.UserName;
  about: 'string' | DefaultValues.UserAbout;
  avatar: 'string' | DefaultValues.UserAvatar;
  email: 'string';
  password: 'string';
}

interface IUserTools {
  deletePassword(): string
}

const userSchema = new Schema<IUser, IUserTools>(
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
  },
  { versionKey: false },
);

export default mongoose.model<IUser>('user', userSchema);
