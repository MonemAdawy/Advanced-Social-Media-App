import { compareHash, hash } from "../../utils/hashing/hash.js";
import { decrypt } from "../../utils/encryption/encryption.js";
import { generateToken, verifyToken } from "../../utils/token/token.js";
import { emailEvent } from "../../utils/emails/email.event.js";
import { subjects } from "../../utils/emails/sendEmails.js";
import { signUpActivateByLink } from "../../utils/emails/generateHTML.js";
import User, { defaultProfilePec, defaultPublicID, defaultSecureURL } from "../../DB/models/user.model.js";
import fs from "fs";
import path from "path";
import cloudinary from "../../utils/file uploading/cloudinary.config.js";

export const profile = async (req, res, next) => {
    const {user} = req;

    return res.status(200).json({
        success: true, 
        data: {username: user.username, email: user.email}
    });
}



export const updateUsername = async (req, res, next) => {
    const {user} = req;
    const {newUsername, password} = req.body;


    const isMatch = compareHash({plaintText: password, hash: user.password});
    console.log(isMatch);
    if(!isMatch){
        return next(new Error("Invalid credentials!", {cause: 400}));
    }

    user.username = newUsername;
    await user.save();

    return res.status(200).json({success: true, message: "Username updated successfully!"});
}




export const updateEmail = async (req, res, next) => {
    const {user} = req;
    const {newEmail, password} = req.body;


    const isMatch = compareHash({plaintText: password, hash: user.password});
    if(!isMatch){
        return next(new Error("Invalid credentials!", {cause: 400}));
    }

    user.tempEmail = newEmail;
    await user.save();

    const token = generateToken({payLoad: { userId: user._id}});

    const url = `http://localhost:3000/user/confirm-email/${token}`;

    emailEvent.emit("sendEmailToVerifyByLink", user.email, signUpActivateByLink(url) ,subjects.changeEmail );

    return res.status(200).json({success: true, message: "Email updated successfully!", url});
}



export const confirmEmail = async (req, res, next) => {
    const {token} = req.params;
    const { userId } = verifyToken({token});

    const user = await User.findById(userId);

    if(!user){
        return next(new Error("User not found!", {cause: 400}));
    }

    user.email = user.tempEmail;
    user.tempEmail = null;
    await user.save();

    return res.status(200).json({success: true, message: "Email verified successfully!"});
}



export const updatePassword = async (req, res, next) => {
    const {user} = req;
    const {oldPassword, newPassword} = req.body;

    const isMatch = compareHash({plaintText: oldPassword, hash: user.password});
    if(!isMatch){
        return next(new Error("Invalid credentials!", {cause: 400}));
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({success: true, message: "Password updated successfully!"});
}



export const deactivateAccount = async (req, res, next) => {
    const {user} = req;
    await user.remove();

    return res.status(200).json({success: true, message: "Account deactivated successfully!"});
}



// export const profilePicture = async (req, res, next) => {
//     if (!req.file) {
//         return next(new Error("No file uploaded!", {cause: 400}))
//     }

//     const user = await User.findByIdAndUpdate(req.user._id, {profilePicture: req.file.path}, {new: true});

//     return res.status(200).json({success: true, message: "Profile picture updated successfully!", data: user});
// }


export const profilePicture = async (req, res, next) => {
    if (!req.file) {
        return next(new Error("No file uploaded!", {cause: 400}))
    }

    const user = await User.findById(req.user._id);

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {folder: `users/${user._id}/profilePic`});


    user.profilePicture = {secure_url, public_id};
    await user.save();

    return res.status(200).json({success: true, message: "Profile picture updated successfully!", data: user});
}



// export const deleteProfilePicture = async (req, res, next) => {
//     const user = await User.findById(req.user._id);

//     const imgPath = path.resolve(".", user.profilePicture)

//     fs.unlinkSync(imgPath);


//     user.profilePicture = defaultProfilePec;
//     await user.save()
    

//     return res.status(200).json({success: true, message: "Deleting profile successfully!"});
// }


export const deleteProfilePicture = async (req, res, next) => {
    const user = await User.findById(req.user._id);


    const results = await cloudinary.uploader.destroy(user.profilePicture.public_id);


    user.profilePicture = {
        public_id: defaultPublicID,
        secure_url: defaultSecureURL
    };
    await user.save()
    

    return res.status(200).json({success: true, message: "Deleting profile successfully!"});
}


export const coverPictures = async (req, res, next) => {

    const user = await User.findById(req.user._id);

    user.coverPicture.map((file) => file.path)
    user.save();

    return res.json({success: true, results: {user}})
}