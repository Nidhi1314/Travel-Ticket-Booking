import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USERNAME, // Your email address
            pass: process.env.EMAIL_PASSWORD, // Your app password
        },
    });

    const mailOptions = {
        from: 'Your App <your_email@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html, // Optional: for sending HTML content
    };

    await transporter.sendMail(mailOptions);
};
