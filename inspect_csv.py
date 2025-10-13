import pandas as pd
import chardet

def detect_encoding(file_path):
    """Detect file encoding"""
    with open(file_path, 'rb') as f:
        raw_data = f.read()
        result = chardet.detect(raw_data)
        return result['encoding']

# Detect encoding
encoding = detect_encoding('sms_scam_detection_dataset_merged_with_lang.csv')
print(f"Detected encoding: {encoding}")

# Try different loading methods
methods = [
    # Method 1: Basic with low_memory
    {'low_memory': False},
    
    # Method 2: Specify dtype for problematic columns
    {'low_memory': False, 'dtype': {'URL': str, 'EMAIL': str, 'PHONE': str, 'lang': str}},
    
    # Method 3: Load as all strings
    {'dtype': str},
    
    # Method 4: Skip bad lines
    {'error_bad_lines': False, 'warn_bad_lines': True},
    
    # Method 5: Use different encoding
    {'encoding': 'utf-8'},
    {'encoding': 'latin1'},
    {'encoding': 'ISO-8859-1'},
    {'encoding': 'cp1252'},
]

for i, kwargs in enumerate(methods):
    try:
        print(f"\n--- Trying Method {i+1}: {kwargs} ---")
        df = pd.read_csv('sms_scam_detection_dataset_merged_with_lang.csv', **kwargs)
        print(f"✅ SUCCESS! Shape: {df.shape}")
        print(f"Columns: {df.columns.tolist()}")
        print(f"First few rows:")
        print(df.head(2))
        print(f"Data types:")
        print(df.dtypes)
        break
    except Exception as e:
        print(f"❌ FAILED: {e}")