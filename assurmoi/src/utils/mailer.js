const {createTransport} = require('nodemailer');
const { getMaxListeners } = require('nodemailer/lib/xoauth2');
require('dotenv').config();

const transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true' ?? false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const mail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            text,
            html
        });

        console.log('Email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return error;
    }
}

const mailLogin = async user => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: `${user.username} <${user.email}>`,
            subject: 'Notification de connexion',
            text: `Bonjour ${user.username},\n\nUne nouvelle connexion à votre compte a été détectée. Si ce n'était pas vous, veuillez sécuriser votre compte immédiatement.`,
            html: `<h2>Bonjour ${user.username},</h2><br><p>Une nouvelle connexion à votre compte a été détectée. Si ce n'était pas vous, veuillez sécuriser votre compte immédiatement.</p>`
        });

        console.log('Login alert email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending login alert email: %s', error);
        return error;
    }
}

module.exports = {
    mail,
    mailLogin
}