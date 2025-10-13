import pandas as pd
import re

def fix_merge_conflict_csv(input_file, output_file):
    """Remove Git merge conflict markers from CSV file"""
    
    print("Removing Git merge conflict markers...")
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove Git merge conflict markers
    content_clean = re.sub(r'^<<<<<<< HEAD\s*', '', content, flags=re.MULTILINE)
    content_clean = re.sub(r'^=======\s*', '', content_clean, flags=re.MULTILINE)
    content_clean = re.sub(r'^>>>>>>> .+\s*', '', content_clean, flags=re.MULTILINE)
    
    # Remove any empty lines at the beginning
    content_clean = content_clean.lstrip()
    
    # Write cleaned content
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content_clean)
    
    print(f"✅ Cleaned file saved as: {output_file}")
    
    # Test load the cleaned file
    try:
        df = pd.read_csv(output_file, encoding='utf-8')
        print(f"✅ Successfully loaded cleaned file!")
        print(f"Shape: {df.shape}")
        print(f"Columns: {df.columns.tolist()}")
        
        if 'label' in df.columns:
            print(f"\nLabel distribution:")
            print(df['label'].value_counts())
            
        return df
    except Exception as e:
        print(f"❌ Error loading cleaned file: {e}")
        return None

# Fix the file
fixed_df = fix_merge_conflict_csv(
    'sms_scam_detection_dataset_merged_with_lang.csv',
    'sms_scam_detection_CLEANED.csv'
)