import { EventEmitter } from "events";
import jwt from "jsonwebtoken";
import sendEmails, { subjects } from "./sendEmails.js";
import { signUpActivateByOtp, signUpActivateByLink } from "./generateHTML.js";
export const emailEvent = new EventEmitter();



emailEvent.on("sendEmail", async (email, otp, subject) => {
    console.log(`Event sendEmail: ${email}`);
    const isSent = await sendEmails({to: email, subject, html: signUpActivateByOtp(otp)});
    
});



emailEvent.on("sendEmailToVerifyByLink", async (email, link, subject) => {
    console.log(`Event sendEmailToVerifyByLink: ${email}`);
    const isSent = await sendEmails({to: email, subject, html: signUpActivateByLink(link)});
    
});