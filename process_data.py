import pandas as pd
import glob
import json
import os

def process_files():
    base = os.path.dirname(os.path.abspath(__file__))
    files = glob.glob(os.path.join(base, 'feedback-reports', '*.xlsx'))
    all_programs = []
    errors = []

    for f in files:
        try:
            df = pd.read_excel(f, header=None)

            # Structure:
            # Row 0: Program Name:, <Name>, Issues Identified:, <Count>...
            # Row 1: Program URL:, <URL>, ...
            # Row 2: Headers (Sr No, Section Heading, Sub-Section Heading, Content, Gap / Issue, Fix Suggested, Remarks)
            # Row 3+: Data

            program_name = str(df.iloc[0, 1]) if len(df) > 0 and len(df.columns) > 1 else "Unknown"
            program_url = str(df.iloc[1, 1]) if len(df) > 1 and len(df.columns) > 1 else ""

            issues = []

            if len(df) > 3:
                data_df = df.iloc[3:].copy()
                # Clean columns and look for Status/Remarks
                cols = [str(c).strip() for c in df.iloc[2].fillna('Unknown')]
                data_df.columns = cols
                
                # Standardize column mapping (Case Insensitive)
                col_map = {c.lower(): c for c in cols}

                for _, row in data_df.iterrows():
                    # Check if row is empty
                    if pd.isna(row.get('Section Heading')) and pd.isna(row.get('Gap / Issue')):
                        continue

                    issue_dict = {}
                    for col in cols:
                        val = row[col]
                        issue_dict[col] = str(val).strip() if pd.notna(val) else ""
                    
                    # Ensure 'Status' and 'Remarks' keys always exist for the UI
                    # (Even if the column is missing in one specific Excel file)
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

    if errors:
        print(f"\nWARNING: {len(errors)} file(s) failed to process: {errors}")
        print("Output data.json may be incomplete.")

    os.makedirs(os.path.join(base, 'src'), exist_ok=True)

    with open(os.path.join(base, 'src', 'data.json'), 'w', encoding='utf-8') as outfile:
        json.dump(all_programs, outfile, indent=2)
        print("Data written to src/data.json")

if __name__ == '__main__':
    process_files()
