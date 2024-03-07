import nodemailer from "nodemailer";


const sendEmail = async (option) => {
    // const transporter = nodemailer.createTransport({
    //     host: process.env.EMAIL_HOST,
    //     port: process.env.EMAIL_PORT,
    //     auth: {
    //         user: process.env.EMAIL_USER,
    //         pass: process.env.EMAIL_PASSWORD
    //     }
    // })

    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "940c3c9422e721",
            pass: "f9bd92a749dc92"
        }
    });

    const emailOptions = {
        from: "UserDB support<support@userdb.com>",
        to: option.email,
        subject: option.subject,
        text: option.message
    }

    await transport.sendMail(emailOptions)
}

export default sendEmail;