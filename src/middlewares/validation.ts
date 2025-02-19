import { Joi, Segments, celebrate } from 'celebrate';

const urlPattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:\/?#[\]@!$&'()*+,;=.]+$/;

const validateCard = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Длина поля name не должна быть меньше 2-х символов',
        'string.max': 'Длина поля name не должга превышать 30 символов',
        'string.empty': 'Поле name обязательно для заполнения',
      }),
    link: Joi.string().required().pattern(urlPattern)
      .message('Поле link должно быть ссылкой')
      .messages({
        'string.empty': 'Поле link должно быть заполнено',
      }),
  }),
});
