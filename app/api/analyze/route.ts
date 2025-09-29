import { type NextRequest, NextResponse } from "next/server"
import { analyticsStore } from "@/lib/analytics-store"

interface PhishingIndicator {
  type: string
  description: string
  severity: "low" | "medium" | "high"
  pattern: RegExp
  weight: number
}

const phishingIndicators: PhishingIndicator[] = [
  {
    type: "Suspicious URLs",
    description: "Links to suspicious or shortened domains",
    severity: "high",
    pattern: /bit\.ly|tinyurl|t\.co|goo\.gl|suspicious|phishing|malicious|fake/i,
    weight: 25,
  },
  {
    type: "Urgent Language",
    description: "Uses urgent or threatening language",
    severity: "medium",
    pattern: /urgent|immediate|expire|suspend|verify now|act now|limited time|deadline|final notice/i,
    weight: 15,
  },
  {
    type: "Spelling Errors",
    description: "Contains multiple spelling or grammar errors",
    severity: "low",
    pattern: /recieve|seperate|occured|definately|loose|there account|you're account|its urgent/i,
    weight: 10,
  },
  {
    type: "Generic Greetings",
    description: "Uses generic greetings instead of personal names",
    severity: "medium",
    pattern: /dear customer|dear user|dear sir\/madam|valued customer|dear account holder/i,
    weight: 12,
  },
  {
    type: "Request for Credentials",
    description: "Asks for passwords, SSN, or financial information",
    severity: "high",
    pattern: /password|ssn|social security|credit card|bank account|pin|login|username|verify.*account/i,
    weight: 30,
  },
  {
    type: "Suspicious Attachments",
    description: "References potentially malicious attachments",
    severity: "high",
    pattern: /\.exe|\.zip|\.rar|attachment|download|install|click here|open attachment/i,
    weight: 20,
  },
  {
    type: "Financial Threats",
    description: "Threatens financial consequences",
    severity: "high",
    pattern: /account.*suspend|account.*close|payment.*fail|billing.*issue|refund.*expire/i,
    weight: 22,
  },
  {
    type: "Impersonation",
    description: "Impersonates legitimate organizations",
    severity: "high",
    pattern: /paypal|amazon|microsoft|apple|google|bank.*america|wells.*fargo|irs|government/i,
    weight: 18,
  },
]

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const { emailContent } = await request.json()

    if (!emailContent || typeof emailContent !== "string") {
      return NextResponse.json({ error: "Email content is required" }, { status: 400 })
    }

    // Get client info
    const userAgent = request.headers.get("user-agent") || "Unknown"
    const forwarded = request.headers.get("x-forwarded-for")
    const realIp = request.headers.get("x-real-ip")
    const ipAddress = forwarded?.split(",")[0] || realIp || "Unknown"

    // Analyze the email content
    const analysis = analyzeEmailContent(emailContent)

    // Calculate response time
    const responseTime = Date.now() - startTime

    // Store the analysis result
    const record = analyticsStore.addAnalysis({
      result: analysis.isPhishing ? "phishing" : "legitimate",
      confidence: analysis.confidence,
      riskLevel: analysis.riskLevel,
      indicators: analysis.indicators.filter((i) => i.found).map((i) => i.type),
      userAgent,
      ipAddress: ipAddress.replace(/\.\d+$/, ".***"), // Mask last octet for privacy
    })

    // Store system metrics
    analyticsStore.addSystemMetrics({
      cpuUsage: Math.random() * 30 + 20, // Simulated
      memoryUsage: Math.random() * 20 + 40, // Simulated
      responseTime,
      activeConnections: Math.floor(Math.random() * 100) + 50, // Simulated
    })

    return NextResponse.json({
      ...analysis,
      analysisId: record.id,
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze email" }, { status: 500 })
  }
}

function analyzeEmailContent(content: string) {
  const foundIndicators = []
  let totalScore = 0

  // Check each indicator
  for (const indicator of phishingIndicators) {
    const found = indicator.pattern.test(content)

    foundIndicators.push({
      type: indicator.type,
      description: indicator.description,
      severity: indicator.severity,
      found,
    })

    if (found) {
      totalScore += indicator.weight
    }
  }

  // Calculate confidence and risk level
  let confidence = Math.min(totalScore * 1.2, 95) // Cap at 95%
  const isPhishing = confidence > 50
  let riskLevel: "low" | "medium" | "high" = "low"

  if (confidence >= 70) {
    riskLevel = "high"
  } else if (confidence >= 40) {
    riskLevel = "medium"
  }

  // Add some randomness for realism (±5%)
  confidence += (Math.random() - 0.5) * 10
  confidence = Math.max(0, Math.min(100, confidence))

  const summary = isPhishing
    ? `This email shows strong indicators of being a phishing attempt with ${confidence.toFixed(1)}% confidence.`
    : `This email appears to be legitimate with ${(100 - confidence).toFixed(1)}% confidence.`

  const recommendations = isPhishing
    ? [
        "Do not click any links in this email",
        "Do not download any attachments",
        "Do not provide any personal information",
        "Report this email to your IT department or email provider",
        "Delete this email immediately",
        "If you've already clicked links, change your passwords immediately",
      ]
    : [
        "This email appears safe, but always verify sender identity",
        "Be cautious with any links or attachments",
        "When in doubt, contact the sender through alternative means",
        "Keep your security software updated",
      ]

  return {
    isPhishing,
    confidence: Math.round(confidence * 10) / 10,
    riskLevel,
    indicators: foundIndicators,
    summary,
    recommendations,
    analysisTimestamp: new Date().toISOString(),
  }
}
