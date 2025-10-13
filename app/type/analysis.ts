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

export interface AnalysisRequest {
  content: string;
  messageType: "email" | "sms" | "general";
}
