"use client";

// This is a placeholder page for showing a detailed analysis of a community-reported scam.
// In a real app, you would fetch the report details based on the `id` from the URL.

import { useParams } from "next/navigation";
import { Orbitron } from "next/font/google";
import {
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  ArrowLeft,
  Shield,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// --- FONT SETUP ---
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Mock data for a single report
const mockReportDetail = {
  id: "12345",
  detectedCategory: "Bank Impersonation",
  riskLevel: "high",
  summary:
    "This SMS impersonates a major bank, creating a false sense of urgency to trick users into clicking a malicious link.",
  indicators: [
    {
      type: "Urgent or Threatening Language",
      explanation:
        "The message uses phrases like 'account suspended' to rush you into action.",
      found: true,
    },
    {
      type: "Suspicious Links or Domains",
      explanation:
        "The link does not go to the official bank website. It's a lookalike designed to steal your login.",
      found: true,
    },
    {
      type: "Request for Sensitive Information",
      explanation: "The fake site asks for your username, password, and PIN.",
      found: true,
    },
  ],
  recommendations: [
    "NEVER click links in unexpected text messages from your bank.",
    "Always log in by typing the bank's official website address directly into your browser.",
    "If you are concerned, call the number on the back of your bank card.",
  ],
};

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  // In a real app, you would fetch the report details from your backend using params.id
  const report = mockReportDetail; // Using mock data for demonstration

  if (!report) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 ${orbitron.className}`}
      >
        <p className="text-gray-700 dark:text-gray-300">
          Report details not found.
        </p>
      </div>
    );
  }

  const riskColors =
    report.riskLevel === "high"
      ? "text-red-600 border-red-200"
      : report.riskLevel === "medium"
      ? "text-yellow-600 border-yellow-200"
      : "text-green-600 border-green-200";

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${orbitron.className}`}
    >
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">GuardSphere</span>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-4xl space-y-6">
          <Card className={`shadow-lg border-2 ${riskColors}`}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className={`h-7 w-7 ${riskColors}`} />
                <span>Analysis of Report #{params.id}</span>
              </CardTitle>
              <p className="pt-2 !mt-2 font-semibold text-gray-700 dark:text-gray-300">
                Detected Category: {report.detectedCategory}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                {report.summary}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg dark:bg-gray-800/50">
            <CardHeader>
              <CardTitle>AI-Detected Indicators</CardTitle>
              <CardDescription>
                Breakdown of suspicious elements found in this report.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {report.indicators.map((indicator, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 rounded-lg border dark:border-gray-700 bg-red-50 dark:bg-red-900/20"
                >
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-1 text-red-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {indicator.type}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {indicator.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-lg dark:bg-gray-800/50">
            <CardHeader>
              <CardTitle>Protective Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {report.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <ChevronRight
                      className={`h-5 w-5 flex-shrink-0 mt-0.5 ${riskColors}`}
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      {rec}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
