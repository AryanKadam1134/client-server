export const resetPasswordOTPTemplate = (user, otp) => {
  return `<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px;">
        
        <h2 style="color: #1f2937;">Password Reset OTP</h2>

        <p style="color: #4b5563; font-size: 15px;">
          Hi ${user?.firstName || "User"} ${user?.lastName || ""},
        </p>

        <p style="color: #4b5563; font-size: 15px;">
          We received a request to reset your password. Use the OTP below to proceed:
        </p>

        <div style="margin: 25px 0; text-align: center;">
          <span style="
            display: inline-block;
            padding: 12px 20px;
            font-size: 24px;
            letter-spacing: 4px;
            font-weight: bold;
            color: #111827;
            background-color: #f3f4f6;
            border-radius: 8px;
          ">
            ${otp}
          </span>
        </div>

        <p style="color: #4b5563; font-size: 14px;">
          This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.
        </p>

        <div style="margin: 20px 0; padding: 15px; background-color: #fef2f2; border-radius: 6px;">
          <p style="margin: 0; font-size: 14px; color: #b91c1c;">
            If you did not request this, please ignore this email.
          </p>
        </div>

        <hr style="margin: 30px 0;" />

        <p style="font-size: 12px; color: #9ca3af;">
          © ${new Date().getFullYear()} Portfolio SaaS. All rights reserved.
        </p>

      </div>
    </div>`;
};
