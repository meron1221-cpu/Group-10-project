import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { username, email, password, confirmPassword } = await request.json();

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match." },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        username,
        email,
        hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "User created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("SIGNUP_ERROR", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
