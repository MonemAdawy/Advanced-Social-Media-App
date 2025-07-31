import joi from "joi";
import User, { roles } from "../../DB/models/user.model.js";


export const updatePassword = joi
    .object({
        oldPassword: joi.string().required(),
        newPassword: joi
            .string()
            .required()
            .pattern(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\\W]).{8,50}$")),
        confirmPassword: joi.string().valid(joi.ref("newPassword")),
    })
    .required()



export const updateEmail = joi
    .object({
        email: joi
            .string()
            .email()
            .required()
            .external(async (value, helpers) => {
                const userExists = await
                User.findOne({ email: value });
                if (userExists) {
                    throw new Error("Email already exists.", {cause: 400});
                }
                return value;
            }),
        password: joi.string().required(),
    })
    .required()


export const updateUsername = joi
    .object({
        username: joi.string().min(5).max(15).required(),
        password: joi.string().required(),
    })
    .required()



export const deactivateAccount = joi
    .object({
        password: joi.string().required(),
    })
    .required()
