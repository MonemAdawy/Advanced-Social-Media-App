import jwt from 'jsonwebtoken';

export const generateToken = ({payLoad, signature = process.env.JWT_SECRET, options = {}}) => {
    return jwt.sign(payLoad, signature, options);
}


export const verifyToken = ({token, signature = process.env.JWT_SECRET, options = {}}) => {
    return jwt.verify(token, signature, options);
}