import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SHOOTER_EMAIL,
    pass: process.env.SHOOTER_PASS, // App password
  },
});

const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: `"Portfolio App" <${process.env.SHOOTER_EMAIL}>`,
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("Email sent:", info.messageId);
};

export default sendEmail;
