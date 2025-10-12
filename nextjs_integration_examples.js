
// Next.js API Route: pages/api/check-scam.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Call our Python Flask API
    const flaskResponse = await fetch('http://localhost:5000/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!flaskResponse.ok) {
      throw new Error('Failed to get prediction from AI service');
    }

    const prediction = await flaskResponse.json();

    res.status(200).json(prediction);
  } catch (error) {
    console.error('Scam detection error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// React Component Example: components/ScamChecker.js
import { useState } from 'react';

export default function ScamChecker() {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkScam = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/check-scam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: 'Failed to check message' });
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
        rows="4"
      />

      <button
        onClick={checkScam}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Checking...' : 'Check for Scams'}
      </button>

      {result && (
        <div className={`mt-4 p-4 rounded-md ${
          result.is_scam ? 'bg-red-100 border border-red-300' : 'bg-green-100 border border-green-300'
        }`}>
          <h3 className={`font-bold ${result.is_scam ? 'text-red-800' : 'text-green-800'}`}>
            {result.is_scam ? '🚨 Potential Scam Detected' : '✅ Likely Legitimate'}
          </h3>
          <p>Type: {result.prediction}</p>
          <p>Confidence: {(result.confidence * 100).toFixed(1)}%</p>
        </div>
      )}
    </div>
  );
}
