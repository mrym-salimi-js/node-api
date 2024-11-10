const nodemailer = require('nodemailer');
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

  // 2. define email option
  const mailOptions = {
    from: 'sheyporchi <sandbox.smtp.mailtrap.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. send email
  await transporter.sendMail(mailOptions);
};
