"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ScamChecker from "@/components/ScamChecker";

export default function AnalysisPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="relative text-center mb-12">
          <Link
            href="/dashboard"
            className="absolute top-0 left-0 flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            AI-Powered Scam Detection
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Analyze emails, SMS, and messages for potential scams using our
            advanced AI detection system
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left: Scam Checker */}
          <div>
            <ScamChecker />
          </div>

          {/* Right: Information */}
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                How It Works
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Paste any suspicious message in the text area</li>
                <li>• Our AI analyzes patterns and scam indicators</li>
                <li>• Get instant scam detection results</li>
                <li>• View confidence levels and scam type classification</li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Common Scam Types Detected
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Phishing attempts</li>
                <li>• Fake job offers</li>
                <li>• Bank impersonation</li>
                <li>• Investment fraud</li>
                <li>• Lottery scams</li>
                <li>• Tech support scams</li>
              </ul>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Tips for Safety
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Never share personal information</li>
                <li>• Verify unexpected requests through official channels</li>
                <li>• Check URLs before clicking</li>
                <li>• Be cautious of urgent or threatening language</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
