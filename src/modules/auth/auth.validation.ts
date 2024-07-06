import { Joi, validate } from "express-validation";

export const LoginCredsValidation = validate({
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  })
})