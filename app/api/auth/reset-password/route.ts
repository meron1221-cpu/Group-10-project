import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Invalid request." },
        { status: 400 }
      );
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await db.user.findFirst({
      where: {
        resetToken: hashedToken,
      },
    });

    if (!user || !user.resetTokenExpiry) {
      return NextResponse.json(
        { message: "Invalid or expired token." },
        { status: 400 }
      );
    }

    if (new Date(user.resetTokenExpiry) < new Date()) {
      return NextResponse.json(
        { message: "Token has expired." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
      where: { email: user.email },
      data: {
        hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    console.error("RESET_PASSWORD_ERROR", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
