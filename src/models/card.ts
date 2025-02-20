import mongoose, { Schema } from 'mongoose';
import { isURL } from 'validator';

interface ICard {
  name: 'string';
  link: 'string';
  owner: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
  createdAt: Date;
}

const cardSchema = new Schema<ICard>(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => isURL(v),
        message: 'Поле link должно быть ссылкой',
      },
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: 'user' }],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

export default mongoose.model<ICard>('card', cardSchema);
