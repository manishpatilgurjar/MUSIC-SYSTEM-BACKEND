import nodemailer from 'nodemailer';
import fs from 'fs';
import dotenv from "dotenv";
const emailTemplatePath = 'src/configs/otpEmailTemplate.html';
const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');

dotenv.config();
export function formatEmailTemplate(otp: string): string {
    return emailTemplate.replace('%OTP%', otp);
}
export const transporter = nodemailer.createTransport({
    host: process.env.HOST, // Replace with your SMTP host
    port: 465, // Replace with your SMTP port
    secure:true, // false for TLS, true for SSL
    auth: {
        user: process.env.USER, // Replace with your email account
        pass: process.env.PASSWORD, // Replace with your email password or app-specific password
    },
});


