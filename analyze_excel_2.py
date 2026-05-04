import pandas as pd
import glob

files = glob.glob('*.xlsx')
for f in files:
    print(f"File: {f}")
    try:
        df = pd.read_excel(f, header=None)
        print(df.head(10).to_string())
    except Exception as e:
        print("Error reading", f, e)
    print("-" * 50)
