import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.DOMAIN}/auth/verify-email/?token=${token}`;

  await resend.emails.send({
    from: 'Simone <onboarding@resend.dev>',
    to: email,
    subject: 'Confirm your email',
    html: `<p>Click <a href=${confirmLink}>here</a> to confirm your email.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.DOMAIN}/auth/password-reset/?token=${token}`;

  await resend.emails.send({
    from: 'Simone <onboarding@resend.dev>',
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href=${confirmLink}>here</a> to reset and create a new password.</p>`,
  });
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: 'Simone <onboarding@resend.dev>',
    to: email,
    subject: '2FA Code',
    html: `<p>Your 2FA code: ${token}</p>`,
  });
};
