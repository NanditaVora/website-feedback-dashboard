import pandas as pd
import glob
import json

files = glob.glob('*.xlsx')
for f in files:
    print(f"File: {f}")
    try:
        df = pd.read_excel(f)
        print("Columns:", df.columns.tolist())
        print("Shape:", df.shape)
        # print first row to understand the data
        print("Sample data:")
        print(df.head(1).to_dict('records'))
    except Exception as e:
        print("Error reading", f, e)
    print("-" * 50)
