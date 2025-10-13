import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { writeFileSync, unlinkSync } from "fs";
import { join } from "path";

export interface ScamAnalysisResult {
  isScam: boolean;
  confidence: number;
  riskLevel: "low" | "medium" | "high";
  detectedCategory: string;
  indicators: {
    type: string;
    description: string;
    severity: "low" | "medium" | "high";
    found: boolean;
  }[];
  summary: string;
  recommendations: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { content, messageType = "general" } = await request.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Valid content is required" },
        { status: 400 }
      );
    }

    // Create a temporary file with the content
    const tempFilePath = join(process.cwd(), "temp_analysis.txt");
    writeFileSync(tempFilePath, content);

    // Run Python script to analyze the content
    const result = await runPythonAnalysis(content);

    // Clean up temp file
    try {
      unlinkSync(tempFilePath);
    } catch (e) {
      console.warn("Could not delete temp file:", e);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Internal server error during analysis" },
      { status: 500 }
    );
  }
}

function runPythonAnalysis(content: string): Promise<ScamAnalysisResult> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python", ["analyze_message.py"], {
      cwd: process.cwd(),
    });

    let output = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error("Python process error:", errorOutput);
        reject(new Error(`Python process exited with code ${code}`));
        return;
      }

      try {
        const result = JSON.parse(output);
        resolve(result);
      } catch (parseError) {
        console.error("Failed to parse Python output:", output);
        reject(new Error("Invalid response from analysis service"));
      }
    });

    // Send content to Python process
    pythonProcess.stdin.write(JSON.stringify({ content }));
    pythonProcess.stdin.end();
  });
}
