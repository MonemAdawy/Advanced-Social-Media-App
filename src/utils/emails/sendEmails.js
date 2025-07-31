import nodemailer from "nodemailer";

const sendEmails = async ({ to, subject, html }) => {
    console.log(`Sending email to: ${to}`);
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_SENDER,
            pass: process.env.PASS,
        },
    });

    const info = await transporter.sendMail({
        from: `"Social Media App" <${process.env.EMAIL_SENDER}>`,
        to,
        subject,
        html,
    });

    if (info.rejected.length == 0) return true;
    else return false;
};

export const subjects = {
    register: "Registration Confirmation",
    resetPassword: "Password Reset Request",
    changeEmail: "Email Change Request",
};

export default sendEmails;