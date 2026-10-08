const sendOtpMail = async (toEmail, otp) => {
    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "Nestro <onboarding@resend.dev>",
                to: [toEmail],
                subject: "Verify Your Email - OTP",
                html: `
                    <div style="font-family: Arial, sans-serif; padding:20px">
                        <h2>Email Verification</h2>
                        <p>Your OTP code is:</p>
                        <h1 style="letter-spacing:4px">${otp}</h1>
                        <p>This OTP is valid for <b>3 minutes</b>.</p>
                        <p>If you didn't request this, ignore this email.</p>
                    </div>
                `,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.log("Resend Error:", data);
            return "Email sending failed: " + (data.message || "Unknown error");
        }

        console.log("OTP Email sent:", data.id);

        return "OTP Email sent successfully";
    } catch (error) {
        console.log("Email sending failed:", error);
        return "Email sending failed: " + error.message;
    }
};

export default sendOtpMail;