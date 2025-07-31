import { model, Schema } from "mongoose";
import { hash } from "../../utils/hashing/hash.js";


export const defaultProfilePec = "defProf.png";

export const defaultSecureURL = process.env.defaultSecureURL;

export const defaultPublicID = "defProf_ljpuqb"


export const roles = {
    admin: "admin",
    user: "user",
};


export const providers = {
    system: "system",
    google: "google",
};

const userSchema = new Schema (
    {
        email: {
            type: String,
            required: true, 
            unique: true, 
            lowercase: true, 
            match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        },
        password: {
            type: String,
            required: function() {
                return this.provider === providers.system;
            },
        },
        username: {
            type: String,
            minlength: 5,
            maxlength: 15,
            required: true,
            unique: true,
        },
        isAcctivated: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: Object.values(roles),
            default: roles.user,
            required: true,
        },
        isLoggedIn: {
            type: Boolean,
            default: false,
        },
        freezed: {
            type: Boolean,
            default: false,
        },
        provider: {
            type: String,
            enum: Object.values(providers),
            default: providers.system,
        },
        passwordUpdatedAt: {
            type: Date,
            default: Date.now,
        },
        tempEmail: {
            type: String,
            lowercase: true,
            match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            default: null,
        },
        // profilePicture: {
        //     type: String,
        //     default: defaultProfilePec
        // },
        profilePicture: {
            secure_url: {
                type: String,
                default: defaultSecureURL
            },
            public_id: {
                type: String,
                default: defaultPublicID
            },
        },
        coverPicture: [String],

    }, 
    {timestamps: true}
)


userSchema.pre("save", function(next) {
    if (this.isModified("password")) {
        this.password = hash({plaintText: this.password});
        this.passwordUpdatedAt = Date.now();
    }
    return next();
});


const User = model("User", userSchema);


export default User;