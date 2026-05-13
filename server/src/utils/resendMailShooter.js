import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const shootEmail = async ({ to, subject, html }) => {
  return resend.emails.send({
    from: "onboarding@resend.dev",
    to: to,
    subject: subject,
    html: html,
  });
};

// resend.emails.send({
//   from: "onboarding@resend.dev",
//   to: "aryankadam3114@gmail.com",
//   subject: "Hello World",
//   html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
// });
