import { Types } from "mongoose";


const validation = (schema) => {
    return async (req, res, next) => {
        try {
            const data = { ...req.body, ...req.params, ...req.query };

            if (req.file || req.files?.length) {
                data.file = req.file || req.files;
            }
            await schema.validateAsync(data, { abortEarly: false });
            return next();
        } catch (error) {
            const messageList = error.details ? error.details.map((obj) => obj.message) : [error.message];
            return next(new Error(messageList, { cause: 400 }));
        }
    };
};

export const isValidObjectId = (value, helper) => {
    if (Types.ObjectId.isValid(value)) {
        return value;
    }
    return helper.message('Invalid receiver id');
};

export default validation;




