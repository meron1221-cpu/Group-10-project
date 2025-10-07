import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({
        message:
          "If an account with this email exists, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    await db.user.update({
      where: { email },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry,
      },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@gashasphere.com",
      to: email,
      subject: "Password Reset Request for GashaSphere",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You requested a password reset for your GashaSphere account.</p>
          <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
          <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          <p>If you didn't request this reset, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      message:
        "If an account with this email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("FORGOT_PASSWORD_ERROR", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
