import { Joi, Segments, celebrate } from 'celebrate';
import { Types } from 'mongoose';

const urlPattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:\\/?#[\]@!$&'()*+,;=.]+$/;

export const validateCard = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Длина поля name не должна быть меньше 2-х символов',
        'string.max': 'Длина поля name не должна превышать 30 символов',
        'string.empty': 'Поле name обязательно для заполнения',
      }),
    link: Joi.string().required().pattern(urlPattern)
      .message('Поле link должно быть ссылкой')
      .messages({
        'string.empty': 'Поле link должно быть заполнено',
      }),
  }),
});

export const validateId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string()
      .required()
      .custom((value, helpers) => (Types.ObjectId.isValid(value) ? value : helpers.message({
        any: 'Передан невалидный id',
      }))),
  }),
});

export const validateCardId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string()
      .required()
      .custom((value, helpers) => (Types.ObjectId.isValid(value) ? value : helpers.message({
        any: 'Передан невалидный id',
      }))),
  }),
});
export const validateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Длина поля name не должна быть меньше 2-х символов',
      'string.max': 'Длина поля name не должна превышать 30 символов',
    }),
    about: Joi.string().min(2).max(200).messages({
      'string.min': 'Длина поля about не должна быть меньше 2-х символов',
      'string.max': 'Длина поля about не должна превышать 200 символов',
    }),
    password: Joi.string().required().messages({
      'string:empty': 'Поле password не может быть пустым',
    }),
    email: Joi.string().required().email()
      .message('Поле email должно быть валидным')
      .messages({
        'string:empty': 'Поле email не может быть пустым',
      }),
    avatar: Joi.string().pattern(urlPattern)
      .message('Поле avatar должно быть ссылкой'),
  }),
});

export const validateProfileInfo = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Длина поля name не должна быть меньше 2-х символов',
        'string.max': 'Длина поля name не должна превышать 30 символов',
        'string.empty': 'Поле name должно быть заполнено',
      }),
    about: Joi.string().required().min(2).max(200)
      .messages({
        'string.min': 'Длина поля about не должна быть меньше 2-х символов',
        'string.max': 'Длина поля about не должна превышать 200 символов',
        'string.empty': 'Поле about должно быть заполнено',
      }),
  }),
});

export const validateAvatar = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlPattern)
      .message('Поле avatar должно быть ссылкой')
      .messages({
        'string:empty': 'Поле avatar не может быть пустым',
      }),
  }),
});

export const validateCredentials = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email()
      .message('Поле email должно быть валидным')
      .messages({
        'string:empty': 'Поле email не может быть пустым',
      }),
    password: Joi.string().required().messages({
      'string:empty': 'Поле password не может быть пустым',
    }),
  }),
});
