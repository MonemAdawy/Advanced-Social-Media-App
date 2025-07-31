import joi from "joi"
import { isValidObjectId } from "../../middleware/validation.middleware.js"




export const createPost = joi.object({
    text: joi.string().min(2),
    file: joi.array().items(joi.object({  
        fieldname: joi.string().valid("images").required(),  
        originalname: joi.string().required(), 
        encoding: joi.string().required(),
        mimetype: joi.string().required(),
        size: joi.number().required(),
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required()
    }))
}).or("text", "file")
    

export const updatePost = joi.object({
    id: joi.custom(isValidObjectId).required(),
    text: joi.string().min(2),
    file: joi.array().items(joi.object({  
        fieldname: joi.string().valid("images").required(),  
        originalname: joi.string().required(), 
        encoding: joi.string().required(),
        mimetype: joi.string().required(),
        size: joi.number().required(),
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required()
    }))
}).or("text", "file")


export const freezePost = joi.object({
    id: joi.custom(isValidObjectId).required(),
}).required()


export const unfreezePost = joi.object({
    id: joi.custom(isValidObjectId).required()
}).required()


export const getPost = joi.object({
    id: joi.custom(isValidObjectId).required()
}).required()



export const likePost = joi.object({
    id: joi.custom(isValidObjectId).required()
}).required()