import joi from "joi";
import User, { roles } from "../../DB/models/user.model.js";


export const sendOTP = joi.object({
    email: joi.string().email().required(),
}).required()


export const register = joi
    .object({
        email: joi
            .string()
            .email()
            .required()
            .external(async (value, helpers) => {
                const userExists = await User.findOne({ email: value });
                if (userExists) {
                    throw new Error("Email already exists.", {cause: 400});
                }
                return value;
            }),
        otp: joi.string().length(6).required(),
        password: joi
            .string()
            .required()
            .pattern(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\\W]).{8,50}$")),
        confirmPassword: joi.string().valid(joi.ref("password")),
        username: joi.string().min(5).max(15).required(),
        role: joi.string().valid(...Object.values(roles)).default("user")
    })
    .required()



export const login = joi
    .object({
        email: joi.string().email().required(),
        password: joi
            .string()
            .required()
    })
    .required()

export const forgotPassword = joi
    .object({
        email: joi.string().email().required()
    })
    .required()

export const resetPassword = joi
    .object({
        email: joi.string().email().required(),
        otp: joi.string().length(6).required(),
        password: joi
            .string()
            .required()
            .pattern(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\\W]).{8,50}$")),
        confirmPassword: joi.string().valid(joi.ref("password")),
    })
    .required()


export const newAccess = joi
    .object({
        refresh_token: joi.string().required(),
    })
    .required()


export const loginGmail = joi
    .object({
        idToken: joi.string().required(),
    })
    .required()



