
import dotenv from "dotenv";

dotenv.config(); // MUST be before anything else




import Mailgen from "mailgen";
import nodemailer from "nodemailer";






const sendEmail = async(options) =>{
    const mailgenerator = new Mailgen({
        theme:"default",
        product:{
            name:"Task Manager",
            link: "https://arceus.com"
        }
    })
    const emailTextual = mailgenerator.generatePlaintext(options.mailgenContent);
    const emailhtml = mailgenerator.generate(options.mailgenContent);

    const transporter = nodemailer.createTransport({
        host:process.env.MAILTRAP_HOST,
        port:process.env.MAILTRAP_PORT,
        auth:{
            user:process.env.MAILTRAP_USER,
            pass:process.env.MAILTRAP_PASS,
        }
    })

    const mail ={
        from: "Task Manager <no-reply@taskmanager.com>",
        to:options.email,
        subject:options.subject,
        text:emailTextual,
        html:emailhtml,
    }
   try {
  const info = await transporter.sendMail(mail);
  console.log("EMAIL SENT:", info); // 👈 ADD THIS
} catch (error) {
  console.log("EMAIL ERROR:", error); // 👈 ADD THIS
}
}





const EmailVerificationContent = (username,
    VerficationURL) => {
        return {
            body:{
                name:username,
                intro:"Welcome to our App! We are excited to you on onboard"
                ,
                action:{
                      instructions: 'To get started with Mailgen, please click here:',

                button: {
                color: '#22BC66', // Optional action button color
                text: 'Confirm your account',
                link:VerficationURL,
            }
            },
          outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'

        },


};
    };

const EmailPasswordResetContent = (username,
  PasswordResetURL) => {
        return {
            body:{
                name:username,
                intro:"WE GOT A REQUEST TO RESET YOUR PASSWORD OF YOUR ACCOUNT"
                ,
                action:{
                      instructions: "TO RESET PLEASE CLICK ON THE BUTTON BELOW...",


                button: {
                color: '#22BC66', // Optional action button color
                text: 'Reset Password',
                link:PasswordResetURL,
            }
            },
          outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'

        },


};
};


console.log("MAIL CONFIG:", {
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  user: process.env.MAILTRAP_USER,
  pass: process.env.MAILTRAP_PASS ? "YES" : "NO"
});

export {EmailPasswordResetContent,
    EmailVerificationContent,sendEmail};