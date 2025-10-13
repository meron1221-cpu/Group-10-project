import sys
import json
import joblib
import re
import string
from nltk.corpus import stopwords
import nltk

# Ensure stopwords are available
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

# Load the trained model and vectorizer
try:
    model = joblib.load('spam_model.joblib')
    vectorizer = joblib.load('tfidf_vectorizer.joblib')
except Exception as e:
    print(json.dumps({"error": f"Model loading failed: {str(e)}"}))
    sys.exit(1)

def preprocess_text(text):
    """Preprocess text in the same way as during training"""
    if isinstance(text, str):
        text = text.lower()
        text = text.translate(str.maketrans('', '', string.punctuation))
        text = re.sub(r'\d+', '', text)
        text = ' '.join(text.split())
        return text
    return ""

def analyze_message(content):
    """Analyze message and return detailed results"""
    # Preprocess
    cleaned_text = preprocess_text(content)
    
    # Vectorize
    text_vector = vectorizer.transform([cleaned_text])
    
    # Predict
    prediction = model.predict(text_vector)[0]
    probability = model.predict_proba(text_vector)[0]
    
    is_scam = prediction == 'spam'
    confidence = max(probability) * 100
    scam_probability = probability[list(model.classes_).index('spam')] * 100 if 'spam' in model.classes_ else 0
    
    # Determine risk level based on scam probability
    if scam_probability > 80:
        risk_level = "high"
    elif scam_probability > 60:
        risk_level = "medium"
    else:
        risk_level = "low"
    
    # Detect specific scam patterns for indicators
    content_lower = content.lower()
    
    indicators = [
        {
            "type": "AI Model Detection",
            "description": "Machine learning model classification",
            "severity": "high" if is_scam else "low",
            "found": is_scam
        },
        {
            "type": "Suspicious Keywords",
            "description": "Contains common scam terminology",
            "severity": "medium",
            "found": any(word in content_lower for word in ['win', 'won', 'prize', 'free', 'cash', 'reward', 'lottery'])
        },
        {
            "type": "Urgent Language",
            "description": "Uses pressure tactics or urgent requests",
            "severity": "medium",
            "found": any(word in content_lower for word in ['urgent', 'immediately', 'now', 'quick', 'hurry', 'limited'])
        },
        {
            "type": "Financial Requests",
            "description": "Asks for money or financial information",
            "severity": "high",
            "found": any(word in content_lower for word in ['money', 'payment', 'fee', 'account', 'bank', 'card', 'transfer'])
        },
        {
            "type": "Prize Claims",
            "description": "Claims you've won something",
            "severity": "high",
            "found": any(word in content_lower for word in ['winner', 'won', 'prize', 'award', 'reward'])
        },
        {
            "type": "Links or Contact Info",
            "description": "Contains URLs or phone numbers",
            "severity": "low",
            "found": bool(re.search(r'http[s]?://|www\.|\+\d{10,}', content_lower))
        }
    ]
    
    # Determine category
    if is_scam:
        if any(word in content_lower for word in ['win', 'won', 'prize', 'lottery']):
            detected_category = "Lottery/Prize Scam"
        elif any(word in content_lower for word in ['bank', 'account', 'card', 'security']):
            detected_category = "Financial Phishing"
        elif any(word in content_lower for word in ['free', 'gift', 'offer']):
            detected_category = "Free Offer Scam"
        else:
            detected_category = "Suspicious Spam"
    else:
        detected_category = "Legitimate Message"
    
    # Create summary and recommendations
    if is_scam:
        summary = f"This message has been classified as {detected_category.lower()} with {scam_probability:.1f}% confidence. It shows characteristics commonly associated with scams."
        recommendations = [
            "Do not respond to this message",
            "Do not click any links or download attachments",
            "Do not share personal or financial information",
            "Block the sender if possible",
            "Report as spam to your service provider"
        ]
    else:
        summary = f"This message appears to be legitimate with {confidence:.1f}% confidence. However, always exercise caution with unsolicited messages."
        recommendations = [
            "Message appears safe, but remain vigilant",
            "Verify the sender's identity if unsure",
            "Avoid sharing sensitive information",
            "Contact the organization directly if claiming to be from a company"
        ]
    
    return {
        "isScam": is_scam,
        "confidence": scam_probability if is_scam else (100 - scam_probability),
        "riskLevel": risk_level,
        "detectedCategory": detected_category,
        "indicators": indicators,
        "summary": summary,
        "recommendations": recommendations
    }

if __name__ == "__main__":
    try:
        # Read input from stdin
        input_data = sys.stdin.read()
        request = json.loads(input_data)
        content = request.get('content', '')
        
        if not content:
            result = {"error": "No content provided"}
        else:
            result = analyze_message(content)
        
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {"error": f"Analysis failed: {str(e)}"}
        print(json.dumps(error_result))
        sys.exit(1)