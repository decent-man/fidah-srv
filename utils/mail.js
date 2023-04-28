const nodemailer = require("nodemailer");


exports.generateOTP = () => {
    let otp = '';
    for(let i=0; i<=3; i++){
        const randomVal = Math.round(Math.random() * 9)
        otp = otp + randomVal
    }
    return otp;
};

exports.mailTransport = () =>{
    var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    }
  });
  return transport
}
