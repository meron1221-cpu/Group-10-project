from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import re
import string
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and vectorizer
try:
    model = joblib.load('spam_model.joblib')
    vectorizer = joblib.load('tfidf_vectorizer.joblib')
    print("Model loaded successfully")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None
    vectorizer = None

class AnalysisRequest(BaseModel):
    content: str
    messageType: str = "general"

def preprocess_text(text):
    if isinstance(text, str):
        text = text.lower()
        text = text.translate(str.maketrans('', '', string.punctuation))
        text = re.sub(r'\d+', '', text)
        text = ' '.join(text.split())
        return text
    return ""

@app.post("/analyze")
async def analyze_message(request: AnalysisRequest):
    if not model or not vectorizer:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    # Preprocess text
    cleaned_text = preprocess_text(request.content)
    
    # Vectorize
    text_vector = vectorizer.transform([cleaned_text])
    
    # Predict
    prediction = model.predict(text_vector)[0]
    probability = model.predict_proba(text_vector)[0]
    
    is_scam = prediction == 'spam'
    confidence = max(probability) * 100
    
    # Determine risk level
    if confidence > 80:
        risk_level = "high"
    elif confidence > 60:
        risk_level = "medium"
    else:
        risk_level = "low"
    
    return {
        "isScam": is_scam,
        "confidence": confidence,
        "riskLevel": risk_level,
        "detectedCategory": "Spam" if is_scam else "Legitimate",
        "summary": f"This message is classified as {'spam' if is_scam else 'legitimate'} with {confidence:.1f}% confidence.",
        "recommendations": [
            "Be cautious with unsolicited messages",
            "Verify through official channels",
            "Don't share personal information"
        ] if is_scam else [
            "Message appears safe",
            "Always stay vigilant"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)