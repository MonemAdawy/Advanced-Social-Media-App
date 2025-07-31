import { model, Schema } from "mongoose";

const otpSchema = new Schema ({
    email: {
        type: String,
        required: true,
        lowercase: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    otp: {
        type: String,
        required: true,
    },
    isUsed: {
        type: Boolean,
        default: false,
    },
    failedAttempts: {
        type: Number,
        default: 0,
    },
    banUntil: {
        type: Date,
        default: null,
    },
}, {timestamps: true});

otpSchema.index({createdAt: 1}, {expireAfterSeconds: 480});


const OTP = model("OTP", otpSchema);


export default OTP;