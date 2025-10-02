import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { findUserByEmail, createUser } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, confirmPassword } = body;

    if (!email || !password || !confirmPassword) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    if (password !== confirmPassword) {
      return new NextResponse("Passwords do not match", { status: 400 });
    }

    // Check if the user already exists in our mock DB
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return new NextResponse("User with this email already exists", {
        status: 409,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user in our mock DB
    const user = createUser({
      email,
      hashedPassword,
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("SIGNUP_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
