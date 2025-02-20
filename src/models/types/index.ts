import { HydratedDocument, Model } from 'mongoose';

export enum DefaultValues {
  UserName = 'Жак-Ив Кусто',
  UserAbout = 'Исследователь',
  UserAvatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'
}

export interface IUser {
  name: 'string' | DefaultValues.UserName;
  about: 'string' | DefaultValues.UserAbout;
  avatar: 'string' | DefaultValues.UserAvatar;
  email: 'string';
  password: 'string';
}

export interface IUserTools {
  deletePassword(): string
}

export type FindUserByCredentials =
  (email: string, password: string) => Promise<HydratedDocument<IUser, IUserTools>>;

export interface IUserModel extends Model<IUser, {}, IUserTools> {
  findUserByCredentials: FindUserByCredentials;
}
