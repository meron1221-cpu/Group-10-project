"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Shield,
  Upload,
  Type,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Info,
  Mail,
  MessageSquare,
  FileText,
  X,
  Loader2,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, useInView, animate } from "framer-motion";
import { Orbitron } from "next/font/google";

// --- FONT SETUP ---
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

// --- INTERFACES ---
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

type InputSource = "email" | "sms" | "file";

// A reusable component for scroll-triggered animations
function AnimatedSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// A reusable component for the animated number counter
function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView && ref.current) {
      animate(0, to, {
        duration: 2,
        onUpdate(value) {
          if (ref.current) {
            ref.current.textContent = Math.round(value).toLocaleString();
          }
        },
      });
    }
  }, [isInView, to]);

  return <span ref={ref}>0</span>;
}

// --- MAIN COMPONENT ---
export default function AnalyzePage() {
  // State for the multi-step form
  const [inputSource, setInputSource] = useState<InputSource | null>(null);

  // State for different input types
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [smsContent, setSmsContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState("");

  // General state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ScamAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);

  // --- HANDLERS ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onload = (e) => setFileContent(e.target?.result as string);
      reader.readAsText(uploadedFile);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setEmailSubject("");
    setEmailBody("");
    setSmsContent("");
    setFile(null);
    setFileContent("");
    setInputSource(null); // Go back to the selection screen
    setError(null);
    setFeedbackSent(false);
  };

  const analyzeContent = async () => {
    let payload: {
      sourceType: InputSource;
      subject?: string;
      body: string;
      fileName?: string;
    };
    let contentToAnalyze: string;

    // Construct payload based on the selected input source
    switch (inputSource) {
      case "email":
        payload = {
          sourceType: "email",
          subject: emailSubject,
          body: emailBody,
        };
        contentToAnalyze = `${emailSubject}\n${emailBody}`;
        break;
      case "sms":
        payload = { sourceType: "sms", body: smsContent };
        contentToAnalyze = smsContent;
        break;
      case "file":
        payload = {
          sourceType: "file",
          fileName: file?.name,
          body: fileContent,
        };
        contentToAnalyze = fileContent;
        break;
      default:
        setError("Invalid input source selected.");
        return;
    }

    if (!contentToAnalyze.trim()) {
      setError("Please provide content to analyze.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // In a real app, you'd send the structured `payload` to your API
      const analysis = performScamAnalysis(payload);
      setResult(analysis);
    } catch (err) {
      console.error("Analysis error:", err);
      setError("An unexpected error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFeedback = (isCorrect: boolean) => {
    setFeedbackSent(true);
    // Here you would send the original payload and user feedback to your backend
    console.log("Feedback submitted:", { isCorrect });
  };

  // --- STYLING & HELPERS ---
  const getRiskColorClasses = (level: "low" | "medium" | "high") => {
    switch (level) {
      case "high":
        return {
          text: "text-red-600", // Using a standard Tailwind color for simplicity
          bg: "bg-red-50",
          border: "border-red-200",
          progress: "bg-red-600",
        };
      case "medium":
        return {
          text: "text-yellow-600", // Using a standard Tailwind color
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          progress: "bg-yellow-600",
        };
      case "low":
      default:
        return {
          text: "text-green-600", // Using a standard Tailwind color
          bg: "bg-green-50",
          border: "border-green-200",
          progress: "bg-green-600",
        };
    }
  };

  // --- RENDER FUNCTIONS FOR DIFFERENT INPUTS ---
  const renderSourceSelector = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card
        className="text-center hover:shadow-xl hover:border-blue-500 transition-all cursor-pointer"
        onClick={() => setInputSource("email")}
      >
        <CardHeader className="items-center">
          <Mail className="h-12 w-12 text-blue-600 mb-2" />
          <CardTitle>Analyze an Email</CardTitle>
          <CardDescription>Paste subject and body</CardDescription>
        </CardHeader>
      </Card>
      <Card
        className="text-center hover:shadow-xl hover:border-blue-500 transition-all cursor-pointer"
        onClick={() => setInputSource("sms")}
      >
        <CardHeader className="items-center">
          <MessageSquare className="h-12 w-12 text-blue-600 mb-2" />
          <CardTitle>Analyze a Text/SMS</CardTitle>
          <CardDescription>Paste message content</CardDescription>
        </CardHeader>
      </Card>
      <Card
        className="text-center hover:shadow-xl hover:border-blue-500 transition-all cursor-pointer"
        onClick={() => setInputSource("file")}
      >
        <CardHeader className="items-center">
          <Upload className="h-12 w-12 text-blue-600 mb-2" />
          <CardTitle>Upload a File</CardTitle>
          <CardDescription>Supports .eml and .txt</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );

  const renderEmailForm = () => (
    <div className="space-y-4">
      <Input
        placeholder="Email Subject"
        value={emailSubject}
        onChange={(e) => setEmailSubject(e.target.value)}
        className="text-sm"
      />
      <Textarea
        placeholder="Paste the complete email body here..."
        value={emailBody}
        onChange={(e) => setEmailBody(e.target.value)}
        className="min-h-[250px] font-mono text-sm"
      />
    </div>
  );

  const renderSmsForm = () => (
    <Textarea
      placeholder="Paste the SMS or text message content here..."
      value={smsContent}
      onChange={(e) => setSmsContent(e.target.value)}
      className="min-h-[250px] font-mono text-sm"
    />
  );

  const renderFileForm = () => (
    <div className="space-y-4">
      <Input
        type="file"
        accept=".eml,.txt,.msg"
        onChange={handleFileChange}
        className="cursor-pointer file:text-blue-700 file:font-semibold hover:file:bg-blue-50"
      />
      {file && (
        <div className="mt-4 flex items-center justify-between rounded-lg border bg-gray-50 p-3">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-gray-500" />
            <div className="text-sm">
              <p className="font-medium text-gray-800">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setFile(null);
              setFileContent("");
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );

  const renderInputForm = () => (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            {inputSource === "email" && <Mail className="h-6 w-6" />}
            {inputSource === "sms" && <MessageSquare className="h-6 w-6" />}
            {inputSource === "file" && <Upload className="h-6 w-6" />}
            <span>
              {inputSource === "email" && "Analyze Email"}
              {inputSource === "sms" && "Analyze Text/SMS"}
              {inputSource === "file" && "Upload File"}
            </span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setInputSource(null)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {inputSource === "email" && renderEmailForm()}
        {inputSource === "sms" && renderSmsForm()}
        {inputSource === "file" && renderFileForm()}

        <Button
          onClick={analyzeContent}
          disabled={isAnalyzing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...
            </>
          ) : (
            <>
              <Shield className="mr-2 h-5 w-5" /> Analyze Now
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );

  const renderResults = () => {
    if (!result) return null;
    const riskColors = getRiskColorClasses(result.riskLevel);
    return (
      <div className="space-y-6 animate-in fade-in-50 duration-500">
        <Card className={`shadow-lg border-2 ${riskColors.border}`}>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="flex items-center space-x-2">
                {result.isScam ? (
                  <AlertTriangle className={`h-7 w-7 ${riskColors.text}`} />
                ) : (
                  <CheckCircle className={`h-7 w-7 ${riskColors.text}`} />
                )}
                <span>Analysis Complete</span>
              </CardTitle>
              <Badge
                className={`${riskColors.bg} ${riskColors.text} ${riskColors.border} py-1 px-3 text-sm`}
              >
                {result.riskLevel.toUpperCase()} RISK
              </Badge>
            </div>
            {result.isScam && (
              <CardDescription className="pt-2 !mt-2 font-semibold text-gray-700">
                Detected Category: {result.detectedCategory}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg font-medium text-gray-800">
              {result.summary}
            </p>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-gray-600">Confidence Score</span>
                <span className={`font-bold ${riskColors.text}`}>
                  {result.confidence.toFixed(1)}%
                </span>
              </div>
              <Progress
                value={result.confidence}
                indicatorClassName={riskColors.progress}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Explainable AI: Indicators</CardTitle>
            <CardDescription>
              Breakdown of suspicious elements found in the message.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.indicators.map((indicator, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between rounded-lg border p-3 ${indicator.found
                    ? `${getRiskColorClasses(indicator.severity).bg} ${getRiskColorClasses(indicator.severity).border
                    }`
                    : "bg-gray-50"
                    }`}
                >
                  <div>
                    <p className="font-medium">{indicator.type}</p>
                    <p className="text-sm text-gray-600">
                      {indicator.description}
                    </p>
                  </div>
                  <Badge
                    variant={indicator.found ? "destructive" : "secondary"}
                  >
                    {indicator.found ? "DETECTED" : "NOT FOUND"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recommendations & Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <ChevronRight
                    className={`h-5 w-5 flex-shrink-0 mt-0.5 ${riskColors.text}`}
                  />
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
            <div className="border-t mt-6 pt-6">
              <p className="text-center text-sm font-semibold text-gray-700 mb-3">
                Was this analysis helpful? (This helps improve our AI)
              </p>
              {feedbackSent ? (
                <p className="text-center text-green-600 font-bold">
                  Thank you for your feedback!
                </p>
              ) : (
                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleFeedback(true)}
                  >
                    <ThumbsUp className="mr-2 h-4 w-4 text-green-600" /> Correct
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleFeedback(false)}
                  >
                    <ThumbsDown className="mr-2 h-4 w-4 text-red-600" />{" "}
                    Incorrect
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={resetAnalysis}
            variant="outline"
            className="flex-1 text-base py-5"
          >
            Analyze Another Message
          </Button>
          <Button
            onClick={() => window.print()}
            className="flex-1 text-base py-5"
          >
            Save Report as PDF
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${orbitron.className}`}>
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">GuardSphere</span>
          </div>
          <div className="w-20 text-right text-sm text-gray-500 hidden sm:block">
            Analysis
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-4xl">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!result && (
            <div className="mb-10 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                AI-Powered Scam Detection
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Select the type of message you want to analyze.
              </p>
            </div>
          )}
          {result
            ? renderResults()
            : inputSource
              ? renderInputForm()
              : renderSourceSelector()}
        </div>
      </main>
    </div>
  );
}

// --- MOCK ANALYSIS LOGIC ---
const performScamAnalysis = (payload: {
  sourceType: string;
  subject?: string;
  body: string;
  fileName?: string;
}): ScamAnalysisResult => {
  const { subject = "", body } = payload;
  const content = `${subject} ${body}`.toLowerCase();

  let detectedCategory = "Legitimate";
  let isScam = false;
  let confidence = 10 + Math.random() * 15;
  let riskLevel: "low" | "medium" | "high" = "low";
  let summary = "This message appears to be safe.";
  let recommendations = [
    "Always be cautious, even if a message seems safe.",
    "Verify sender identities through a separate, trusted channel if unsure.",
  ];
  let indicators: ScamAnalysisResult["indicators"] = [];

  if (
    /won.*lottery|prize|claim.*your.*winnings|advance.*fee|processing.*charge|tax.*payment/.test(
      content
    )
  ) {
    isScam = true;
    detectedCategory = "Advance-Fee / Lottery Scam";
    riskLevel = "high";
    confidence = 90 + Math.random() * 9;
    summary =
      "This is a classic Advance-Fee or Lottery scam. You are being asked to pay money to receive a fake prize.";
    indicators.push(
      {
        type: "Fake Prize Claim",
        description: "Claims you have won a large sum of money or a prize",
        severity: "high",
        found: /won|lottery|prize|winnings/.test(content),
      },
      {
        type: "Upfront Fee Request",
        description: "Asks for a fee, tax, or charge to release the funds",
        severity: "high",
        found: /fee|charge|tax/.test(content),
      }
    );
    recommendations = [
      "Legitimate lotteries do not require you to pay a fee to claim your prize.",
      "Do NOT send any money or personal information.",
      "Block the sender and delete the message.",
    ];
  } else if (
    /sim.*swap|upgrade.*sim|4g|5g|deactivate.*sim|block.*your.*number/.test(
      content
    )
  ) {
    isScam = true;
    detectedCategory = "SIM Swap (Simjacking)";
    riskLevel = "high";
    confidence = 88 + Math.random() * 10;
    summary =
      "This message is a potential SIM Swap (Simjacking) attempt to take control of your phone number.";
    indicators.push(
      {
        type: "Fraudulent SIM Upgrade",
        description: "Urges you to upgrade your SIM to 4G/5G",
        severity: "high",
        found: /upgrade.*sim|4g|5g/.test(content),
      },
      {
        type: "Threat of Deactivation",
        description: "Threatens to block or deactivate your number",
        severity: "high",
        found: /deactivate|block/.test(content),
      }
    );
    recommendations = [
      "Do NOT call any numbers or reply to this message.",
      "If you have concerns about your SIM, visit your mobile operator's official store in person.",
      "Contact your provider immediately if you lose service unexpectedly.",
    ];
  } else if (/telebirr|cbe birr|amole|otp|pin sent|ብር/.test(content)) {
    isScam = true;
    detectedCategory = "Mobile Money (Telebirr) Fraud";
    riskLevel = "high";
    confidence = 85 + Math.random() * 10;
    summary =
      "This message shows strong indicators of being a Telebirr or mobile money scam.";
    indicators.push(
      {
        type: "Request for OTP/PIN",
        description: "Asks for a One-Time Password or PIN",
        severity: "high",
        found: /otp|pin/.test(content),
      },
      {
        type: "Fake Transaction",
        description: "Mentions a fake money transfer or prize",
        severity: "high",
        found: /ብር|won|prize/.test(content),
      },
      {
        type: "Urgent Threat",
        description: "Threatens account suspension or loss of funds",
        severity: "medium",
        found: /locked|suspend/.test(content),
      }
    );
    recommendations = [
      "NEVER share your PIN or OTP with anyone.",
      "Contact your bank or Telebirr support directly using their official number to verify.",
      "Delete this message immediately.",
    ];
  } else if (
    /missed.*call from|call.*me.*back|urgent.*call/.test(content) &&
    /\+\d{3,}/.test(content)
  ) {
    isScam = true;
    detectedCategory = "Wangiri Fraud";
    riskLevel = "medium";
    confidence = 70 + Math.random() * 15;
    summary =
      "This message may be related to a Wangiri (missed call) scam, designed to make you call a premium-rate number.";
    indicators.push(
      {
        type: "Request to Call Back",
        description:
          "Asks you to return a call, often to an international number",
        severity: "medium",
        found: /call.*back/.test(content),
      },
      {
        type: "International Number",
        description:
          "The number provided is likely an expensive premium-rate line",
        severity: "high",
        found: /\+\d{3,}/.test(content),
      }
    );
    recommendations = [
      "Do NOT call back international numbers you do not recognize.",
      "You will be charged high fees for the call. Block the number.",
    ];
  } else if (
    /ethio telecom|cbe|bank of abyssinia|dashen bank|your pin|account number/.test(
      content
    )
  ) {
    isScam = true;
    detectedCategory = "Social Engineering";
    riskLevel = "high";
    confidence = 82 + Math.random() * 15;
    summary =
      "This message impersonates a known company to trick you into revealing sensitive information.";
    indicators.push(
      {
        type: "Impersonation",
        description: "Uses the name of a well-known Ethiopian company",
        severity: "high",
        found: /ethio telecom|cbe|bank of/.test(content),
      },
      {
        type: "Sensitive Data Request",
        description: "Asks for a PIN or account details",
        severity: "high",
        found: /pin|account number/.test(content),
      }
    );
    recommendations = [
      "Your bank or Ethio Telecom will NEVER ask for your PIN via SMS.",
      "Do not reply. Contact the company using their official contact information to verify.",
    ];
  } else if (
    /lonely|love.*you|darling|my.*love|need.*help.*urgently|emergency|money.*for.*ticket|send me money/.test(
      content
    )
  ) {
    isScam = true;
    detectedCategory = "Romance Scam";
    riskLevel = "medium";
    confidence = 65 + Math.random() * 20;
    summary =
      "This message contains emotional language and potential requests for money, which are common in romance scams.";
    indicators.push(
      {
        type: "Emotional Manipulation",
        description: "Uses overly affectionate or emotional language quickly",
        severity: "medium",
        found: /love|darling/.test(content),
      },
      {
        type: "Hint of Financial Need",
        description:
          "Mentions a financial problem, emergency, or need for money",
        severity: "high",
        found: /help|emergency|money/.test(content),
      }
    );
    recommendations = [
      "Be extremely cautious with online relationships, especially if they ask for money.",
      "Never send money to someone you have not met in person.",
      "Perform a reverse image search on their profile pictures.",
    ];
  } else if (
    payload.sourceType === "email" &&
    /urgent|action required|verify.*account|password|login|account.*suspended/.test(
      subject
    )
  ) {
    isScam = true;
    detectedCategory = "Phishing";
    riskLevel = "high";
    confidence = 80 + Math.random() * 15;
    summary =
      "The email's urgent subject line is a major red flag for phishing.";
    indicators.push(
      {
        type: "Urgent Subject Line",
        description: "Subject creates a false sense of urgency",
        severity: "high",
        found: true,
      },
      {
        type: "Credential Request",
        description: "The content likely asks for login details",
        severity: "high",
        found: /password|login|credentials/.test(content),
      }
    );
    recommendations = [
      "Do not click any links or open attachments.",
      "Verify any requests by contacting the company through their official website or phone number.",
      "Mark the email as spam.",
    ];
  }

  indicators.push({
    type: "Contains a Link",
    description: "Includes a URL that could be malicious",
    severity: "low",
    found: /http:|https:/.test(content),
  });

  const finalIndicators = indicators.map((ind) => ({
    ...ind,
    found: ind.found || false,
  }));

  if (
    !isScam &&
    /http:|https:/.test(content) &&
    /verify|account|login/.test(content)
  ) {
    isScam = true;
    detectedCategory = "Phishing";
    riskLevel = "low";
    confidence = 40 + Math.random() * 20;
    summary =
      "This message has some characteristics of a phishing attempt, but with low confidence. Proceed with caution.";
    recommendations = [
      "Avoid clicking links unless you are certain of the sender's identity.",
      "When in doubt, navigate to the website directly instead of using the link.",
    ];
    const linkIndicator = finalIndicators.find(
      (ind) => ind.type === "Contains a Link"
    );
    if (linkIndicator) linkIndicator.severity = "medium";
  }

  return {
    isScam,
    confidence,
    riskLevel,
    detectedCategory,
    indicators: finalIndicators,
    summary,
    recommendations,
  };
};
// End of AnalyzePage component – handles multi-input scam analysis with AI feedback
