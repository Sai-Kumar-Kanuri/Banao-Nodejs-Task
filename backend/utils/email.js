import nodemailer from "nodemailer";


const sendEmail = async (option) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    
    const emailOptions = {
        from: "UserDB support<support@userdb.com>",
        to: option.email,
        subject: option.subject,
        text: option.message
    }

    await transport.sendMail(emailOptions)
}

export default sendEmail;