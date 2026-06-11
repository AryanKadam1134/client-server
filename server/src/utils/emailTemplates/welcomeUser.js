export const welcomeUser = (user) => {
  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "there";

  return `<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 24px;">
      <div style="max-width: 640px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background-color: #111827; padding: 28px 30px;">
          <p style="margin: 0 0 8px; color: #93c5fd; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">
            Portfolio SaaS
          </p>
          <h1 style="margin: 0; color: #ffffff; font-size: 28px; line-height: 1.25;">
            Welcome aboard, ${fullName}!
          </h1>
        </div>

        <div style="padding: 30px;">
          <p style="margin: 0 0 18px; color: #374151; font-size: 16px; line-height: 1.6;">
            Your account has been created successfully. You can now start building your portfolio, adding your skills, projects, education, experience, certificates, and achievements from your dashboard.
          </p>

          <div style="margin: 24px 0; padding: 18px; background-color: #eff6ff; border-radius: 10px; border: 1px solid #bfdbfe;">
            <p style="margin: 0; color: #1e3a8a; font-size: 15px; line-height: 1.6;">
              Tip: Begin with your profile details and resume, then add projects and social links so your portfolio feels complete right away.
            </p>
          </div>

          <div style="margin: 26px 0;">
            <p style="margin: 0 0 10px; color: #111827; font-size: 15px; font-weight: 700;">
              Good first steps
            </p>
            <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 15px; line-height: 1.7;">
              <li>Complete your personal details.</li>
              <li>Upload your profile image and resume.</li>
              <li>Add your strongest skills, projects, and achievements.</li>
            </ul>
          </div>

          <p style="margin: 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
            Thanks for joining us. We are excited to see what you create.
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />

          <p style="margin: 0; font-size: 12px; color: #9ca3af;">
            &copy; ${new Date().getFullYear()} Portfolio SaaS. All rights reserved.
          </p>
        </div>
      </div>
    </div>`;
};
