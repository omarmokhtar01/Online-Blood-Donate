const nodemailer = require("nodemailer");

const sendEmail=async(options)=>{

    let transporter = nodemailer.createTransport({
      host: process.env.HOST,
      // port: process.env.PORT,
      service:'gmail',
      secure: false,
        auth: {
              user: process.env.EMAIL,
              pass: process.env.PASS
          }
      });
      let mailOptions ={
        from:options.email , // sender address
        to:process.env.EMAIL , // list of receivers
        subject:options.subject , // Subject line
        text: options.message
      }
      await transporter.sendMail(mailOptions);
    }

  module.exports = sendEmail;