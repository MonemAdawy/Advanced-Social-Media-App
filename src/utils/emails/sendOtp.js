// export const sendResetPasswordEmail = async ({ to, link }) => {
//     const transporter = nodemailer.createTransport({
//         service: 'smtp.gmail.com', // Use your email service provider
//         auth: {
//             user: process.env.EMAIL, // Your email address
//             pass: process.env.EMAIL_PASSWORD, // Your email password
//         },
//     });

//     const mailOptions = {
//         from: process.env.EMAIL,
//         to,
//         subject: 'Password Reset Request',
//         text: `You requested a password reset. Click the link to reset your password: ${link}`,
//     };

//     await transporter.sendMail(mailOptions);
// };