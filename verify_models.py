import joblib
import pandas as pd

def verify_model(model_name):
    print(f"\n🔍 Verifying {model_name}...")
    try:
        model = joblib.load(f'{model_name}.joblib')
        vectorizer = joblib.load(f'tfidf_vectorizer_{"combined" if "combined" in model_name else ""}.joblib')
        
        print(f"✅ {model_name} loaded successfully!")
        print(f"   Classes: {model.classes_}")
        print(f"   Vocabulary size: {len(vectorizer.get_feature_names_out())}")
        
        # Test prediction
        test_msg = "Congratulations! You won a prize!"
        vectorized = vectorizer.transform([test_msg])
        prediction = model.predict(vectorized)[0]
        probability = model.predict_proba(vectorized)[0]
        
        print(f"   Test prediction: {prediction}")
        print(f"   Probabilities: {dict(zip(model.classes_, probability))}")
        
        return True
    except Exception as e:
        print(f"❌ {model_name} failed: {e}")
        return False

print("=== MODEL VERIFICATION ===")

# Verify both models
models_to_check = ['spam_model', 'spam_model_combined']

for model_name in models_to_check:
    verify_model(model_name)

print(f"\n🎯 Ready for integration!")