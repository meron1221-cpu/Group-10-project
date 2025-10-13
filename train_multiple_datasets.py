import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import joblib
import re
import string
from nltk.corpus import stopwords
import nltk
import matplotlib.pyplot as plt
import seaborn as sns

# Download stopwords
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

print("=== Multi-Dataset SMS Spam Detection Training ===")

def load_and_combine_datasets():
    """Load and combine multiple datasets"""
    datasets = []
    
    # Dataset 1: Use the CLEANED version
    try:
        print("Loading sms_scam_detection_CLEANED.csv...")
        df1 = pd.read_csv('sms_scam_detection_CLEANED.csv', encoding='utf-8')
        
        print(f"  ✅ Loaded {len(df1)} samples")
        print(f"  Columns: {df1.columns.tolist()}")
        
        # Standardize column names if needed
        if 'text' in df1.columns and 'label' in df1.columns:
            df1_clean = df1[['text', 'label']].copy()
        else:
            print(f"  Available columns: {df1.columns.tolist()}")
            # Use first two columns as text and label
            df1_clean = df1.iloc[:, :2].copy()
            df1_clean.columns = ['text', 'label']
        
        df1_clean['source'] = 'cleaned_dataset'
        datasets.append(df1_clean)
        print(f"  ✅ Final: {len(df1_clean)} samples")
        
    except Exception as e:
        print(f"  ❌ Error loading cleaned dataset: {e}")
    
    # Dataset 2: Original scam.csv
    try:
        print("Loading scam.csv...")
        df2 = pd.read_csv('scam.csv', encoding='latin1')
        
        # Handle different column names in scam.csv
        if 'message' in df2.columns and 'class' in df2.columns:
            df2 = df2.rename(columns={'message': 'text', 'class': 'label'})
        elif 'text' in df2.columns and 'label' in df2.columns:
            pass  # Already correct
        
        df2 = df2[['text', 'label']].copy()
        df2['source'] = 'scam_dataset'
        datasets.append(df2)
        print(f"  ✅ Loaded {len(df2)} samples from scam.csv")
        
    except Exception as e:
        print(f"  ❌ Error loading scam.csv: {e}")
    
    if not datasets:
        print("❌ No datasets could be loaded!")
        return None
    
    # Combine all datasets
    combined_df = pd.concat(datasets, ignore_index=True)
    print(f"\n📊 TOTAL COMBINED SAMPLES: {len(combined_df)}")
    
    # Show combined distribution
    print(f"\n📈 COMBINED LABEL DISTRIBUTION:")
    print(combined_df['label'].value_counts())
    
    if 'spam' in combined_df['label'].values:
        spam_count = combined_df['label'].value_counts()['spam']
        print(f"Spam percentage: {(spam_count/len(combined_df))*100:.2f}%")
    
    return combined_df

def clean_label(label):
    """Standardize label format"""
    if not isinstance(label, str):
        return str(label).lower()
    
    label = label.lower().strip()
    
    # Map variations to standard labels
    label_mapping = {
        'spam': 'spam',
        'ham': 'ham',
        '1': 'spam',
        '0': 'ham',
        'yes': 'spam',
        'no': 'ham',
        'true': 'spam',
        'false': 'ham'
    }
    
    return label_mapping.get(label, label)

def preprocess_text(text):
    """Clean and preprocess text data"""
    if not isinstance(text, str):
        return ""
    
    # Convert to lowercase
    text = text.lower()
    
    # Remove URLs
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    
    # Remove email addresses
    text = re.sub(r'\S+@\S+', '', text)
    
    # Remove phone numbers
    text = re.sub(r'[\+\(]?[1-9][0-9 .\-\(\)]{8,}[0-9]', '', text)
    
    # Remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))
    
    # Remove numbers
    text = re.sub(r'\d+', '', text)
    
    # Remove extra whitespace
    text = ' '.join(text.split())
    
    return text

def analyze_dataset(df):
    """Analyze the combined dataset"""
    print("\n=== Dataset Analysis ===")
    print(f"Total samples: {len(df)}")
    
    # Label distribution
    print(f"\nLabel distribution:")
    label_counts = df['label'].value_counts()
    for label, count in label_counts.items():
        percentage = (count / len(df)) * 100
        print(f"  {label}: {count} ({percentage:.2f}%)")
    
    # Source distribution
    if 'source' in df.columns:
        print(f"\nSource distribution:")
        source_counts = df['source'].value_counts()
        for source, count in source_counts.items():
            print(f"  {source}: {count}")
    
    # Text length analysis
    df['text_length'] = df['text'].apply(lambda x: len(str(x)))
    print(f"\nText length statistics:")
    print(f"  Min: {df['text_length'].min()} chars")
    print(f"  Max: {df['text_length'].max()} chars")
    print(f"  Mean: {df['text_length'].mean():.1f} chars")
    print(f"  Median: {df['text_length'].median()} chars")
    
    return df

def train_model(df):
    """Train the spam detection model"""
    print("\n=== Model Training ===")
    
    # Clean and standardize labels
    df['label_clean'] = df['label'].apply(clean_label)
    
    # Check if we have both classes
    unique_labels = df['label_clean'].unique()
    print(f"Unique labels after cleaning: {unique_labels}")
    
    if len(unique_labels) < 2:
        print("Error: Need at least 2 classes for classification!")
        return None, None, None
    
    # Filter to only include spam and ham
    df = df[df['label_clean'].isin(['spam', 'ham'])]
    print(f"Samples after label filtering: {len(df)}")
    
    # Preprocess text
    print("Preprocessing text...")
    df['cleaned_text'] = df['text'].apply(preprocess_text)
    
    # Remove empty texts
    df = df[df['cleaned_text'].str.len() > 0]
    print(f"Samples after text cleaning: {len(df)}")
    
    # Prepare features and target
    X = df['cleaned_text']
    y = df['label_clean']
    
    print(f"\nFinal class distribution:")
    print(y.value_counts())
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, 
        test_size=0.2, 
        random_state=42, 
        stratify=y
    )
    
    print(f"Training set: {len(X_train)} samples")
    print(f"Test set: {len(X_test)} samples")
    
    # TF-IDF Vectorization with improved parameters
    print("\nVectorizing text...")
    tfidf = TfidfVectorizer(
        max_features=8000,
        stop_words='english',
        ngram_range=(1, 3),
        min_df=2,
        max_df=0.8,
        sublinear_tf=True
    )
    
    X_train_tfidf = tfidf.fit_transform(X_train)
    X_test_tfidf = tfidf.transform(X_test)
    
    print(f"Vocabulary size: {len(tfidf.get_feature_names_out())}")
    print(f"Training features shape: {X_train_tfidf.shape}")
    print(f"Test features shape: {X_test_tfidf.shape}")
    
    # Train model with improved parameters
    print("\nTraining Logistic Regression model...")
    model = LogisticRegression(
        random_state=42,
        max_iter=2000,
        C=0.5,
        solver='liblinear',
        class_weight='balanced'
    )
    
    model.fit(X_train_tfidf, y_train)
    
    return model, tfidf, (X_test_tfidf, y_test, X_train, y_train, df)

def evaluate_model(model, tfidf, test_data):
    """Evaluate the trained model"""
    print("\n=== Model Evaluation ===")
    
    X_test_tfidf, y_test, X_train, y_train, df = test_data
    
    # Predictions
    y_pred = model.predict(X_test_tfidf)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"Model Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Confusion Matrix
    cm = confusion_matrix(y_test, y_pred)
    print("\nConfusion Matrix:")
    print(cm)
    
    # Plot confusion matrix
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=model.classes_, 
                yticklabels=model.classes_)
    plt.title('Confusion Matrix - Combined Spam Detection Model')
    plt.ylabel('Actual')
    plt.xlabel('Predicted')
    plt.tight_layout()
    plt.savefig('confusion_matrix_combined.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    print("Confusion matrix saved as 'confusion_matrix_combined.png'")
    
    return accuracy

def analyze_features(model, tfidf, top_n=30):
    """Analyze most important features for spam detection"""
    print(f"\n=== Feature Analysis (Top {top_n}) ===")
    
    feature_names = tfidf.get_feature_names_out()
    
    # Check the shape of model coefficients
    print(f"Model coefficients shape: {model.coef_.shape}")
    print(f"Model classes: {model.classes_}")
    
    # For binary classification with liblinear solver
    if model.coef_.shape[0] == 1:
        # Binary classification - coefficients are for the positive class (spam)
        coef = model.coef_[0]
        
        # Top spam indicators (positive coefficients)
        top_spam_indices = coef.argsort()[-top_n:][::-1]
        print("Top Spam Indicators:")
        for i, idx in enumerate(top_spam_indices, 1):
            print(f"  {i:2d}. {feature_names[idx]:<20} {coef[idx]:.4f}")
        
        # Top ham indicators (negative coefficients)
        top_ham_indices = coef.argsort()[:top_n]
        print("\nTop Ham Indicators:")
        for i, idx in enumerate(top_ham_indices, 1):
            print(f"  {i:2d}. {feature_names[idx]:<20} {coef[idx]:.4f}")
    else:
        # Multi-class classification
        for i, class_label in enumerate(model.classes_):
            coef = model.coef_[i]
            top_indices = coef.argsort()[-top_n:][::-1]
            print(f"\nTop {class_label.upper()} Indicators:")
            for j, idx in enumerate(top_indices, 1):
                print(f"  {j:2d}. {feature_names[idx]:<20} {coef[idx]:.4f}")
    
    return feature_names

def test_model_on_examples(model, tfidf):
    """Test the model on example messages"""
    print("\n=== Testing on Example Messages ===")
    
    test_messages = [
        "Congratulations! You've won a $1000 Walmart gift card! Click here to claim now!",
        "Hey, are we meeting for lunch tomorrow?",
        "URGENT: Your bank account has been locked. Verify your details immediately!",
        "Can you pick up some milk on your way home?",
        "FREE iPhone! Text YES to claim your prize! Limited time offer!",
        "Hi mom, I'll be home around 7 PM for dinner",
        "You have won a £2000 prize! Call now to claim! 09066362231",
        "Meeting postponed to 3 PM. See you then!",
        "Your package delivery failed. Update your address: http://fake-update.com",
        "Dinner at 8? Let me know if that works for you"
    ]
    
    for msg in test_messages:
        cleaned = preprocess_text(msg)
        vectorized = tfidf.transform([cleaned])
        prediction = model.predict(vectorized)[0]
        probability = model.predict_proba(vectorized)[0]
        
        spam_prob = 0
        ham_prob = 0
        if 'spam' in model.classes_:
            spam_idx = list(model.classes_).index('spam')
            spam_prob = probability[spam_idx] * 100
        if 'ham' in model.classes_:
            ham_idx = list(model.classes_).index('ham')
            ham_prob = probability[ham_idx] * 100
        
        print(f"\nMessage: {msg}")
        print(f"Prediction: {prediction.upper()}")
        print(f"Probabilities - Spam: {spam_prob:.1f}%, Ham: {ham_prob:.1f}%")
        print("-" * 60)

def main():
    """Main training pipeline"""
    # Load and combine datasets
    df = load_and_combine_datasets()
    if df is None:
        return
    
    # Analyze dataset
    df = analyze_dataset(df)
    
    # Train model
    model, tfidf, test_data = train_model(df)
    if model is None:
        print("Model training failed!")
        return
    
    # Evaluate model
    accuracy = evaluate_model(model, tfidf, test_data)
    
    # Analyze features
    feature_names = analyze_features(model, tfidf)
    
    # Test on examples
    test_model_on_examples(model, tfidf)
    
    # Save model
    print("\n=== Saving Model ===")
    joblib.dump(model, 'spam_model_combined.joblib')
    joblib.dump(tfidf, 'tfidf_vectorizer_combined.joblib')
    
    # Save model info
    model_info = {
        'accuracy': accuracy,
        'training_samples': len(test_data[3]),  # y_train
        'test_samples': len(test_data[1]),      # y_test
        'vocabulary_size': len(feature_names),
        'classes': model.classes_.tolist(),
        'total_samples': len(df)
    }
    
    joblib.dump(model_info, 'model_info.joblib')
    
    print("Model saved as 'spam_model_combined.joblib'")
    print("Vectorizer saved as 'tfidf_vectorizer_combined.joblib'")
    print("Model info saved as 'model_info.joblib'")
    
    print(f"\n=== Training Complete ===")
    print(f"Final Model Accuracy: {accuracy*100:.2f}%")
    print(f"Total Training Samples: {model_info['training_samples']}")
    print(f"Total Dataset Size: {model_info['total_samples']}")
    print(f"Vocabulary Size: {model_info['vocabulary_size']}")

if __name__ == "__main__":
    main()