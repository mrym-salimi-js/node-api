const nodemailer = require('nodemailer');

const fs = require('fs');
exports.sendEmail = async (options) => {
  // 1. create a transpoter
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '79a5ad8ce2a3ef',
      pass: '072dc880f5c7cd',
    },
  });

  const htmlEmail = fs.readFileSync(
    `C:/Users/A/Desktop/node-api/views/email/forgetPassEmailMsg.html`,
    'utf8',
  );

  const finalHtmlEmail = htmlEmail.replace('{{resetPassLink}}', options.url);
  // console.log(x);
  const mailOptions = {
    from: 'sheyporchi <sandbox.smtp.mailtrap.io>',
    to: options.email,
    subject: options.subject,
    // text: options.message,
    html: finalHtmlEmail,
  };

  // 3. send email
  await transporter.sendMail(mailOptions);
};
