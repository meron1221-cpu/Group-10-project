"use client";

import { useState } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ScamAnalysisResult {
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

export default function AnalyzePage() {
  const [content, setContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ScamAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeContent = async () => {
    if (!content.trim()) {
      setError("Please enter some content to analyze.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          messageType: "general",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analysis failed");
      }

      const analysis: ScamAnalysisResult = await response.json();
      setResult(analysis);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during analysis."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setContent("");
    setError(null);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getRiskColorProgress = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-600";
      case "medium":
        return "bg-yellow-600";
      case "low":
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <div className="flex items-center gap-3 flex-1 justify-center">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              AI Scam Detection
            </h1>
          </div>
          <div className="w-20"></div> {/* Spacer for balance */}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Input Section */}
        {!result ? (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Shield className="h-6 w-6 text-blue-600" />
                Analyze Message for Scams
              </CardTitle>
              <CardDescription className="text-lg">
                Paste any suspicious email, SMS, or message content below for AI
                analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea
                placeholder="Paste your message here... (e.g., 'You won a prize! Click here to claim...')"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px] resize-none text-base p-4"
              />

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Tip:</strong> The AI model has been trained on 28,000+
                  messages with 97.6% accuracy. It can detect various scam
                  patterns including lottery scams, phishing attempts, and
                  financial fraud.
                </p>
              </div>

              <Button
                onClick={analyzeContent}
                disabled={isAnalyzing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    AI Analysis in Progress...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-5 w-5" />
                    Analyze with AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Results Section */
          <div className="space-y-6 animate-in fade-in-50 duration-500">
            {/* Main Result Card */}
            <Card
              className={`shadow-lg border-2 ${
                result.isScam
                  ? "border-red-200 bg-red-50/50"
                  : "border-green-200 bg-green-50/50"
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    {result.isScam ? (
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                    ) : (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    )}
                    {result.isScam
                      ? "Potential Scam Detected"
                      : "Message Appears Safe"}
                  </CardTitle>
                  <Badge
                    className={`text-lg py-2 px-4 font-bold ${getRiskColor(
                      result.riskLevel
                    )}`}
                  >
                    {result.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>
                <CardDescription className="text-lg">
                  <strong>Category:</strong> {result.detectedCategory} •{" "}
                  <strong>Confidence:</strong> {result.confidence.toFixed(1)}%
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xl mb-6 leading-relaxed">{result.summary}</p>

                <div className="space-y-3">
                  <div className="flex justify-between text-lg font-medium">
                    <span>AI Confidence Score</span>
                    <span
                      className={
                        result.isScam ? "text-red-600" : "text-green-600"
                      }
                    >
                      {result.confidence.toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={result.confidence}
                    className="h-3"
                    indicatorClassName={getRiskColorProgress(result.riskLevel)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Detection Indicators */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Detection Indicators</CardTitle>
                <CardDescription>
                  Breakdown of suspicious elements analyzed by AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.indicators.map((indicator, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                        indicator.found
                          ? getRiskColor(indicator.severity)
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-lg">
                          {indicator.type}
                        </p>
                        <p className="text-gray-600 mt-1">
                          {indicator.description}
                        </p>
                      </div>
                      <Badge
                        variant={indicator.found ? "destructive" : "secondary"}
                        className="text-base py-1 px-3 font-medium"
                      >
                        {indicator.found ? "DETECTED" : "NOT FOUND"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  Safety Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.recommendations.map((rec, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                    >
                      <div
                        className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                          result.isScam ? "bg-red-500" : "bg-green-500"
                        }`}
                      />
                      <span className="text-lg leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={resetAnalysis}
                variant="outline"
                className="flex-1 py-6 text-lg font-semibold"
                size="lg"
              >
                Analyze Another Message
              </Button>
              <Button
                onClick={() => window.print()}
                className="flex-1 py-6 text-lg font-semibold bg-green-600 hover:bg-green-700"
                size="lg"
              >
                Save Report
              </Button>
            </div>
          </div>
        )}

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                How AI Detection Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Machine learning model trained on 28,000+ messages</li>
                <li>• 97.6% accuracy in scam detection</li>
                <li>• Analyzes patterns, keywords, and message structure</li>
                <li>• Real-time classification with confidence scores</li>
                <li>• Continuously learning from new scam patterns</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Common Scam Types Detected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Lottery & Prize Scams</li>
                <li>• Phishing & Impersonation</li>
                <li>• Financial Fraud</li>
                <li>• Investment Scams</li>
                <li>• Urgent Action Requests</li>
                <li>• Fake Job Offers</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
