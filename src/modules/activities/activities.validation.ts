import { Joi, validate } from "express-validation";
import mongoose from "mongoose";


export const CreatePostValidation = validate({
  body: Joi.object({
    content: Joi.string().required(),
  })
})

export const CreateCommentValidation = validate({
  params: Joi.object({
    id: Joi.string().required()
  }),
  body: Joi.object({
    content: Joi.string().required()
  })
})

export const IdValidation = validate({
  params: Joi.object({
    id: Joi.string().required()
  })
})

export const objectId = () => Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message({ message: 'Invalid object id'});
  }
  return value;
});

export const GetsByPageValidation = validate({
  query: Joi.object({
    limit: Joi.number().optional(),
    cursor: Joi.string().optional(),
  })
})