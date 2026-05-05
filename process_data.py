import pandas as pd
import glob
import json
import os
import sys

def process_files(input_dir=None):
    base = os.path.dirname(os.path.abspath(__file__))
    
    # If no input_dir provided, default to 'feedback-reports'
    if not input_dir:
        input_dir = os.path.join(base, 'feedback-reports')
        
    print(f"Scanning for Excel files in: {input_dir}")
    files = glob.glob(os.path.join(input_dir, '*.xlsx'))
    all_programs = []
    errors = []

    for f in files:
        # Ignore temp excel files
        if os.path.basename(f).startswith('~$'):
            continue
            
        try:
            df = pd.read_excel(f, header=None)

            program_name = str(df.iloc[0, 1]) if len(df) > 0 and len(df.columns) > 1 else "Unknown"
            program_url = str(df.iloc[1, 1]) if len(df) > 1 and len(df.columns) > 1 else ""

            issues = []

            if len(df) > 3:
                data_df = df.iloc[3:].copy()
                cols = [str(c).strip() for c in df.iloc[2].fillna('Unknown')]
                data_df.columns = cols
                col_map = {c.lower(): c for c in cols}

                for _, row in data_df.iterrows():
                    if pd.isna(row.get('Section Heading')) and pd.isna(row.get('Gap / Issue')):
                        continue

                    issue_dict = {}
                    for col in cols:
                        val = row[col]
                        issue_dict[col] = str(val).strip() if pd.notna(val) else ""
                    
                    status_key = col_map.get('status', 'Status')
                    remarks_key = col_map.get('remarks', 'Remarks')
                    
                    issue_dict['Status'] = issue_dict.get(status_key, 'Open')
                    issue_dict['Remarks'] = issue_dict.get(remarks_key, '')

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
            errors.append(f)
            print(f"Error processing {f}: {e}")

    os.makedirs(os.path.join(base, 'src'), exist_ok=True)
    with open(os.path.join(base, 'src', 'data.json'), 'w', encoding='utf-8') as outfile:
        json.dump(all_programs, outfile, indent=2)
        print(f"Success! Data written to src/data.json ({len(all_programs)} programs)")

if __name__ == '__main__':
    # Allow passing input directory as argument
    target_dir = sys.argv[1] if len(sys.argv) > 1 else None
    process_files(target_dir)
