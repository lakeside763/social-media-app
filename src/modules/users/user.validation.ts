import { Joi, validate } from "express-validation";

export const CreateUserValidation = validate({
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
  })
})