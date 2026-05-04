import pandas as pd
import glob
import json
import os

def process_files():
    files = glob.glob('*.xlsx')
    all_programs = []

    for f in files:
        try:
            df = pd.read_excel(f, header=None)
            
            # The structure is assumed to be:
            # Row 0: Program Name:, <Name>, Issues Identified:, <Count>...
            # Row 1: Program URL:, <URL>, ...
            # Row 2: Headers (Sr No, Section Heading, Sub-Section Heading, Content, Gap / Issue, Fix Suggested, Remarks)
            # Row 3+: Data
            
            program_name = str(df.iloc[0, 1]) if len(df.columns) > 1 else "Unknown"
            program_url = str(df.iloc[1, 1]) if len(df.columns) > 1 and len(df) > 1 else ""
            
            issues = []
            
            if len(df) > 3:
                # Get the issues starting from row 3
                data_df = df.iloc[3:].copy()
                # Set columns based on row 2
                cols = df.iloc[2].fillna('Unknown').astype(str).tolist()
                
                # Make column names unique if needed, but normally they are standard
                data_df.columns = cols
                
                for _, row in data_df.iterrows():
                    # Only include rows that actually have some content or issue
                    content = str(row.get('Content', '')).strip()
                    gap = str(row.get('Gap / Issue', '')).strip()
                    fix = str(row.get('Fix Suggested', '')).strip()
                    
                    if content == 'nan' and gap == 'nan' and fix == 'nan':
                        continue
                        
                    issue_dict = {}
                    for col in cols:
                        val = row[col]
                        issue_dict[col] = str(val).strip() if pd.notna(val) else ""
                    
                    issues.append(issue_dict)
                    
            all_programs.append({
                "id": os.path.basename(f).replace('.xlsx', ''),
                "filename": os.path.basename(f),
                "name": program_name,
                "url": program_url,
                "issues": issues
            })
            
            print(f"Processed {f}: {len(issues)} issues found.")
            
        except Exception as e:
            print(f"Error processing {f}: {e}")
            
    # Ensure src dir exists
    os.makedirs('src', exist_ok=True)
    
    with open('src/data.json', 'w', encoding='utf-8') as outfile:
        json.dump(all_programs, outfile, indent=2)
        print("Data written to src/data.json")

if __name__ == '__main__':
    process_files()
