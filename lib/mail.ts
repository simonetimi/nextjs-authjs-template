import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST as string,
  port: Number(process.env.MAIL_port),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.DOMAIN}/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: 'Simone',
    to: email,
    subject: 'Confirm your email',
    html: `<p>Click <a href=${confirmLink}>here</a> to confirm your email.</p>`,
  };
  return await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.DOMAIN}/auth/password-reset?token=${token}`;
  const mailOptions = {
    from: 'Simone',
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href=${confirmLink}>here</a> to reset and create a new password.</p>`,
  };
  return await transporter.sendMail(mailOptions);
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  const mailOptions = {
    from: 'Simone',
    to: email,
    subject: '2FA Code',
    html: `<p>Your 2FA code: ${token}</p>`,
  };
  return await transporter.sendMail(mailOptions);
};
