import pandas as pd
import glob
import json
import os
import sys
import shutil
import tempfile

def process_files(input_dir=None):
    base = os.path.dirname(os.path.abspath(__file__))
    
    if not input_dir:
        input_dir = os.path.join(base, 'feedback-reports')
        
    print(f"Scanning for Excel files in: {input_dir}")
    files = glob.glob(os.path.join(input_dir, '*.xlsx'))
    all_programs = []
    errors = []

    for f in files:
        if os.path.basename(f).startswith('~$'):
            continue
            
        temp_path = None
        try:
            # CREATE A TEMP COPY to read even if open in Excel
            fd, temp_path = tempfile.mkstemp(suffix='.xlsx')
            os.close(fd)
            shutil.copy2(f, temp_path)
            
            # Read from the copy
            df = pd.read_excel(temp_path, header=None)
            
            # Robust extraction of Name and URL
            # Default to filename if we can't find a name inside
            program_name = os.path.basename(f).replace('.xlsx', '').replace('_', ' ')
            program_url = ""
            
            if len(df) > 0:
                # Try to find "Program Name:" label in the first 20 rows
                for r in range(min(20, len(df))):
                    row_vals = [str(v).lower() for v in df.iloc[r]]
                    if any("program name" in v for v in row_vals):
                        for c in range(len(df.columns)-1):
                            if "program name" in str(df.iloc[r, c]).lower():
                                val = str(df.iloc[r, c+1]).strip()
                                if val.lower() != 'nan' and val:
                                    program_name = val
                                break
                    if any("program url" in v for v in row_vals):
                        for c in range(len(df.columns)-1):
                            if "program url" in str(df.iloc[r, c]).lower():
                                val = str(df.iloc[r, c+1]).strip()
                                if val.lower() != 'nan' and val:
                                    program_url = val
                                break

            issues = []

            # Find the header row (usually contains "Section Heading") in the first 20 rows
            header_idx = 2 # Default
            for r in range(min(20, len(df))):
                row_vals = [str(v).lower() for v in df.iloc[r]]
                if any("section heading" in v for v in row_vals):
                    header_idx = r
                    break
            
            if len(df) > header_idx:
                cols = [str(c).strip() for c in df.iloc[header_idx].fillna('Unknown')]
                data_df = df.iloc[header_idx+1:].copy()
                data_df.columns = cols
                col_map = {}
                for c in cols:
                    low_c = str(c).lower()
                    if "status" in low_c: col_map['status'] = c
                    elif "remarks" in low_c or "dev remarks" in low_c: col_map['remarks'] = c
                    else: col_map[low_c] = c

                for _, row in data_df.iterrows():
                    # Skip truly empty rows
                    if pd.isna(row.get('Section Heading')) and pd.isna(row.get('Gap / Issue')) and pd.isna(row.get('Content')):
                        continue

                    issue_dict = {}
                    for col in cols:
                        # Only process columns we actually have in the row
                        if col in row:
                            val = row[col]
                            # CRITICAL: Strip 'nan' strings and handle empty cells
                            str_val = str(val).strip()
                            if str_val.lower() == 'nan' or pd.isna(val):
                                issue_dict[col] = ""
                            else:
                                issue_dict[col] = str_val
                        else:
                            issue_dict[col] = ""
                    
                    # Standardize Status and Remarks for the UI
                    status_key = col_map.get('status', 'Status')
                    remarks_key = col_map.get('remarks', 'Remarks')
                    
                    # Default status to 'Open' if empty
                    current_status = issue_dict.get(status_key, '').strip()
                    issue_dict['Status'] = current_status if current_status else 'Open'
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
            errors.append(f"{os.path.basename(f)}: {e}")
            print(f"Error processing {f}: {e}")
        finally:
            if temp_path and os.path.exists(temp_path):
                try:
                    os.remove(temp_path)
                except:
                    pass

    os.makedirs(os.path.join(base, 'src'), exist_ok=True)
    with open(os.path.join(base, 'src', 'data.json'), 'w', encoding='utf-8') as outfile:
        json.dump(all_programs, outfile, indent=2)
        
    if errors:
        print("\nWARNING: Some files had issues:")
        for err in errors:
            print(f" - {err}")
    
    print(f"\nFinal Dashboard Data Created: {len(all_programs)} programs ready.")

if __name__ == '__main__':
    target_dir = sys.argv[1] if len(sys.argv) > 1 else None
    process_files(target_dir)
