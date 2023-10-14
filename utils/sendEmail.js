const nodeMailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.MAIL_SERVICE,
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });
    const mailOptions = {
        from: process.env.MAIL_USER,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;