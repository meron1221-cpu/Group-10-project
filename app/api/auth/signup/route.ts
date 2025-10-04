import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { findUserByEmail, createUser } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, confirmPassword } = body;

    if (!email || !password || !confirmPassword) {
      // FIX: Return a JSON object for the error
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      // FIX: Return a JSON object for the error
      return NextResponse.json(
        { message: "Passwords do not match." },
        { status: 400 }
      );
    }

    // Check if the user already exists in our mock DB
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      // FIX: Return a JSON object for the error
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 409 } // 409 Conflict is more appropriate here
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user in our mock DB
    const user = createUser({
      email,
      hashedPassword,
    });

    // Return the created user object as JSON on success
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("SIGNUP_ERROR", error);
    // FIX: Return a JSON object for server errors
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
