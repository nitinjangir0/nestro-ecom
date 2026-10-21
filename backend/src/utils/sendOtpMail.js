import nodemailer from "nodemailer";

const sendOtpMail = async (toEmail, otp) => {
    try {
        const { EMAIL_USER, EMAIL_PASS } = process.env;

        if (!EMAIL_USER || !EMAIL_PASS) {
            throw new Error("EMAIL_USER or EMAIL_PASS is not configured");
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: `"Nestro" <${EMAIL_USER}>`,
            to: toEmail,
            subject: "Verify Your Email - OTP",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #7A4E2D;">Nestro Email Verification</h2>
                    <p>Your OTP code is:</p>
                    <h1 style="letter-spacing: 4px;">${otp}</h1>
                    <p>This OTP is valid for <b>3 minutes</b>.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            `,
        });

        console.log("OTP email sent:", info.messageId);

        return "OTP Email sent successfully";
    } catch (error) {
        console.error("OTP email sending failed:", error.message);
        throw new Error("OTP email could not be sent");
    }
};

export default sendOtpMail;