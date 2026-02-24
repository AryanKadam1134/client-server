const passwordChangedTemplate = (user) => {
  return `<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px;">
        <h2 style="color: #1f2937;">Password Updated Successfully</h2>

        <p style="color: #4b5563; font-size: 15px;">Hi ${user.fullName},</p>

        <p style="color: #4b5563; font-size: 15px;">
          This is a confirmation that your account password was successfully
          changed.
        </p>

        <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-radius: 6px;">
          <p style="margin: 0; font-size: 14px; color: #374151;">
            If you made this change, no further action is required.
          </p>
        </div>

        <p style="color: #4b5563; font-size: 15px;">
          If you did <strong>not</strong> change your password, please reset it
          immediately and contact our support team.
        </p>

        <hr style="margin: 30px 0;" />

        <p style="font-size: 12px; color: #9ca3af;">
          © ${new Date().getFullYear()} Portfolio SaaS. All rights reserved.
        </p>
      </div>
    </div>`;
};

export default passwordChangedTemplate;
