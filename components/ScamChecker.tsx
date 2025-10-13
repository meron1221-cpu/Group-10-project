"use client";

import { useState } from "react";

export default function ScamChecker() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<{
    prediction: string;
    confidence: number;
    is_scam: boolean;
    all_probabilities?: Record<string, number>;
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const checkScam = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/check-scam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      setResult({ error: "Failed to check message" } as any);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Scam Detection</h2>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Paste message to check for scams..."
        className="w-full p-3 border border-gray-300 rounded-md mb-4"
        rows={4}
      />

      <button
        onClick={checkScam}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Checking..." : "Check for Scams"}
      </button>

      {result && !result.error && (
        <div
          className={`mt-4 p-4 rounded-md ${
            result.is_scam
              ? "bg-red-100 border border-red-300"
              : "bg-green-100 border border-green-300"
          }`}
        >
          <h3
            className={`font-bold ${
              result.is_scam ? "text-red-800" : "text-green-800"
            }`}
          >
            {result.is_scam
              ? "ALERT: Potential Scam Detected"
              : "SAFE: Likely Legitimate"}
          </h3>
          <p>Type: {result.prediction}</p>
          <p>Confidence: {(result.confidence * 100).toFixed(1)}%</p>
        </div>
      )}
      {result && result.error && (
        <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded-md">
          <p className="text-yellow-800">{result.error}</p>
        </div>
      )}
    </div>
  );
}
