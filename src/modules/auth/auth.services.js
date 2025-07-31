import User from "../../DB/models/user.model.js";
import sendEmails, { subjects } from "../../utils/emails/sendEmails.js";
import Randomstring from "randomstring";



import { signUpActivateByOtp } from "../../utils/emails/generateHTML.js";
import { compareHash, hash } from "../../utils/hashing/hash.js";
import { generateToken, verifyToken } from "../../utils/token/token.js";
import { encrypt } from "../../utils/encryption/encryption.js";
import { emailEvent } from "../../utils/emails/email.event.js";
import OTP from "../../DB/models/otp.model.js";
import { OAuth2Client } from "google-auth-library";




export const register = async (req, res, next) => {
    const { username, email, password, otp } = req.body;

    const otpExists = await OTP.findOne({email});

    if(!otpExists){
        return next(new Error("Invalid OTP!", {cause: 400}));
    }

    if(otpExists.banUntil > Date.now()){
        return next(new Error("You are banned for 1 minute!", {cause: 400}));
    }


    if (otpRecord.banUntil && otpRecord.banUntil <= new Date()) {
        otpRecord.failedAttempts = 0;
        otpRecord.banUntil = null;
        await otpRecord.save();
    }

    if (otpExists.otp !== otp) {
        otpExists.failedAttempts += 1;
        if (otpExists.failedAttempts >= 4) {
            otpExists.banUntil = new Date(Date.now() + 60000);
        }
        await otpExists.save();
        return next(new Error("Invalid OTP!", { cause: 400 }));
    }

    otpExists.isUsed = true;
    await otpExists.save();

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        return next(new Error("Username or email already exists.", { cause: 400 }));
    }

    const newUser = new User({
        username,
        email,
        password: hash({plaintText: password}),
        isAcctivated: true,
    });
    await newUser.save();

    emailEvent.emit("sendEmail", {email});

    return res.status(201).json({ success: true, message: "User added successfully." });

}



export const acctivateAccount = async (req, res, next) => {
    const {token} = req.params;
    // const {email} = jwt.verify(token, process.env.JWT_SECRET);

    const email = verifyToken({token});

    const user = await User.findOne({email});

    if(!user){
        return next(new Error("Document not found!", {cause: 400}));
    }

    user.isAcctivated = true;

    await user.save();

    return res.status(200).json({success: true, message: "Acctivation successfully!"});
}



export const login = async (req, res, next) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if(!user){
        return next(new Error("Document not found!", {cause: 400}));
    }

    const isMatch = compareHash({plaintText: password, hash: user.password});
    if(!isMatch){
        return next(new Error("Invalid credentials!", {cause: 400}));
    }

    if(!user.isAcctivated){
        return next(new Error("Please acctivate your account!", {cause: 400}));
    }

    // const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET);
    const access_token = generateToken({payLoad:{ userId: user._id}, options: {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}});
    const refresh_token = generateToken({payLoad:{ userId: user._id}, options: {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}});

    return res.status(200).json({success: true, message: "Login Successfully", access_token, refresh_token});
}



export const sendOTP = async (req, res, next) => {
    const {email} = req.body;

    const user = await User.findOne({email});

    if(user){
        return next(new Error("User already exist!", {cause: 400}));
    }

    const otp = Randomstring.generate({length: 6, charset: "alphanumeric"});

    const savedOTP = await OTP.create({email, otp});



    emailEvent.emit("sendEmail", email, otp, subjects.register);


    return res.status(200).json({success: true, message: "OTP sent successfully!"});
}





export const forgotPassword = async (req, res, next) => {
    const {email} = req.body;

    const user = await User.findOne({email, isAcctivated: true});

    if(!user){
        return next(new Error("User not found!", {cause: 400}));
    }

    const otp = Randomstring.generate({length: 6, charset: "alphanumeric"});

    await OTP.create({email, otp});

    emailEvent.emit("sendEmail", email, otp, subjects.resetPassword);

    return res.status(200).json({success: true, message: "OTP sent successfully!"});
}



export const resetPassword = async (req, res, next) => {
    const {email, otp, password} = req.body;


    const user = await User.findOne({email});

    if(!user){
        return next(new Error("User not found!", {cause: 400}));
    }

    const otpExists = await OTP.findOne({email});

    if(!otpExists){
        return next(new Error("Invalid OTP!", {cause: 400}));
    }

    if(otpExists.banUntil > Date.now()){
        return next(new Error("You are banned for 1 minute!", {cause: 400}));
    }

    if (otpRecord.banUntil && otpRecord.banUntil <= new Date()) {
        otpRecord.failedAttempts = 0;
        otpRecord.banUntil = null;
        await otpRecord.save();
    }

    if (otpExists.otp !== otp) {
        otpExists.failedAttempts += 1;
        if (otpExists.failedAttempts >= 4) {
            otpExists.banUntil = new Date(Date.now() + 60000);
        }
        await otpExists.save();
        return next(new Error("Invalid OTP!", { cause: 400 }));
    }

    otpExists.isUsed = true;
    await otpExists.save();

    user.password = password;
    await user.save();



    return res.status(200).json({success: true, message: "Try to login with new password!"});
}






export const newAccess = async (req, res, next) => {
    const {refresh_token} = req.body;


    const {userId, iat} = verifyToken({token: refresh_token});

    const user = await User.findById(userId);

    if (!user) {
        return next(new Error("User not found!", { cause: 404 }));
    }

    // if (user.passwordUpdatedAt > iat*1000) {
    //     return next(new Error("Password changed, please login again!", { cause: 400 }));
    // }

    const access_token = generateToken({payLoad: { userId: user._id }, options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } });

    return res.status(200).json({ success: true, message: "New access token generated successfully!", access_token });
}



export const loginGmail = async (req, res, next) => {
    const { idToken } = req.body;
    const client = new OAuth2Client();

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payLoad = ticket.getPayload();
        return payLoad;
    }

    const userData = await verify();

    const {email_verified, email, name, picture} = userData;


    if(!email_verified){
        return next(new Error("Email not verified!", {cause: 400}));
    }


    const user = await User.findOne({email, username: name, isAcctivated: true, provider: "google"});


    const access_token = generateToken({payLoad: {userId: user._id}, options: {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}});

    const refresh_token = generateToken({payLoad: {userId: user._id}, options: {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}});

    return res.status(200).json({success: true, message: "Login Successfully", access_token, refresh_token});
}

