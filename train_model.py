import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
import joblib
import re
import string
from nltk.corpus import stopwords
import nltk
import chardet

# Download stopwords
nltk.download('stopwords')

def detect_encoding(file_path):
    """Detect the encoding of the file"""
    with open(file_path, 'rb') as f:
        raw_data = f.read()
        result = chardet.detect(raw_data)
        return result['encoding']

# Try to detect encoding
try:
    encoding = detect_encoding('scam.csv')
    print(f"Detected encoding: {encoding}")
except Exception as e:
    print(f"Error detecting encoding: {e}")
    encoding = 'latin1'  # fallback encoding

# Try different encodings to load the CSV
encodings_to_try = ['utf-8', 'latin1', 'ISO-8859-1', 'cp1252', 'windows-1252']

df = None
for encoding in encodings_to_try:
    try:
        print(f"Trying encoding: {encoding}")
        df = pd.read_csv('scam.csv', encoding=encoding)
        print(f"Successfully loaded with {encoding} encoding")
        break
    except UnicodeDecodeError as e:
        print(f"Failed with {encoding}: {e}")
        continue
    except Exception as e:
        print(f"Error with {encoding}: {e}")
        continue

if df is None:
    # If all encodings fail, try with error handling
    try:
        print("Trying with error handling...")
        df = pd.read_csv('scam.csv', encoding='utf-8', errors='ignore')
        print("Loaded with error handling")
    except Exception as e:
        print(f"Final error: {e}")
        exit(1)

# Display basic info
print("Dataset Info:")
print(f"Shape: {df.shape}")
print(f"Columns: {df.columns.tolist()}")
print("\nFirst few rows:")
print(df.head())

# Check if required columns exist
if 'message' not in df.columns or 'class' not in df.columns:
    print("Error: Required columns 'message' or 'class' not found in dataset")
    print(f"Available columns: {df.columns.tolist()}")
    exit(1)

# Check class distribution
print("\nClass Distribution:")
print(df['class'].value_counts())
if 'spam' in df['class'].values:
    spam_count = df['class'].value_counts()['spam']
    print(f"\nSpam percentage: {(spam_count/len(df))*100:.2f}%")

# Check for missing values
print(f"\nMissing values: {df.isnull().sum()}")

# Handle missing values
df = df.dropna(subset=['message', 'class'])

# Data preprocessing function
def preprocess_text(text):
    if isinstance(text, str):
        # Convert to lowercase
        text = text.lower()
        # Remove punctuation
        text = text.translate(str.maketrans('', '', string.punctuation))
        # Remove numbers
        text = re.sub(r'\d+', '', text)
        # Remove extra whitespace
        text = ' '.join(text.split())
        return text
    return ""

# Apply preprocessing
df['cleaned_message'] = df['message'].apply(preprocess_text)

# Prepare features and target
X = df['cleaned_message']
y = df['class']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# TF-IDF Vectorization
tfidf = TfidfVectorizer(max_features=5000, stop_words='english')
X_train_tfidf = tfidf.fit_transform(X_train)
X_test_tfidf = tfidf.transform(X_test)

print(f"\nTraining set shape: {X_train_tfidf.shape}")
print(f"Test set shape: {X_test_tfidf.shape}")

# Train model
model = LogisticRegression(random_state=42, max_iter=1000)
model.fit(X_train_tfidf, y_train)

# Evaluate
y_pred = model.predict(X_test_tfidf)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy:.4f}")
print(classification_report(y_test, y_pred))

# Save model and vectorizer
joblib.dump(model, 'spam_model.joblib')
joblib.dump(tfidf, 'tfidf_vectorizer.joblib')

print("Model and vectorizer saved successfully!")

# Test the model with some examples
test_messages = [
    "Congratulations! You've won a $1000 gift card! Click here to claim!",
    "Hey, are we meeting for lunch tomorrow?",
    "URGENT: Your account has been compromised. Verify now!",
    "Can you pick up some groceries?",
    "FREE iPhone! Text YES to claim your prize!"
]

print("\nTesting model with sample messages:")
for msg in test_messages:
    cleaned = preprocess_text(msg)
    vectorized = tfidf.transform([cleaned])
    prediction = model.predict(vectorized)[0]
    probability = model.predict_proba(vectorized)[0]
    print(f"Message: {msg}")
    print(f"Prediction: {prediction}")
    print(f"Probabilities: {dict(zip(model.classes_, probability))}")
    print("-" * 50)