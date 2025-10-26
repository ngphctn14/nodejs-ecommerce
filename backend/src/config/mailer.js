import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async (user, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"E-Shop" <${process.env.FROM_EMAIL}>`,
    to: user.email,
    subject: "Xác nhận địa chỉ email của bạn",
    html: `
      <h2>Xin chào, ${user.fullName}!</h2>
      <p>Nhấn vào link bên dưới để xác nhận email:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
    `,
  });
}