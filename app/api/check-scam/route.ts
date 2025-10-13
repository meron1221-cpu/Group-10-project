// app/api/check-scam/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Call our Python Flask API
    const flaskResponse = await fetch("http://localhost:5000/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!flaskResponse.ok) {
      throw new Error("Failed to get prediction from AI service");
    }

    const prediction = await flaskResponse.json();

    return NextResponse.json(prediction);
  } catch (error) {
    console.error("Scam detection error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
