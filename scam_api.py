
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import re

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js frontend

class ScamDetector:
    def __init__(self):
        # Load model components
        self.model = joblib.load('scam_model/random_forest_model.pkl')
        self.vectorizer = joblib.load('scam_model/tfidf_vectorizer.pkl')
        self.le = joblib.load('scam_model/label_encoder.pkl')

    def clean_text(self, text):
        text = text.lower()
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        return text

    def predict(self, message):
        cleaned = self.clean_text(message)
        features = self.vectorizer.transform([cleaned])
        prediction = self.model.predict(features)[0]
        probability = self.model.predict_proba(features)[0]

        return {
            'prediction': self.le.inverse_transform([prediction])[0],
            'confidence': float(np.max(probability)),
            'is_scam': self.le.inverse_transform([prediction])[0] != 'legitimate',
            'all_probabilities': dict(zip(self.le.classes_, probability.tolist()))
        }

# Initialize detector
detector = ScamDetector()

@app.route('/api/predict', methods=['POST'])
def predict_scam():
    try:
        data = request.get_json()

        if not data or 'message' not in data:
            return jsonify({'error': 'No message provided'}), 400

        message = data['message']

        if not message.strip():
            return jsonify({'error': 'Empty message'}), 400

        result = detector.predict(message)
        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'model': 'scam_detector_v1'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
