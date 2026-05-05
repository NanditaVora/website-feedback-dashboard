import os
import time
import subprocess
from datetime import datetime

# Configuration
# WE WATCH THE EXTERNAL FOLDER
WATCH_DIR = r'C:\Users\nandita.vora\OneDrive - NIIT Limited\NIIT-AI Powered FSE - General\Design Docs\FSE-v6\Website-Feedback'
CHECK_INTERVAL = 5 

def get_last_modified():
    """Get the latest modification time of any xlsx file in the external directory."""
    if not os.path.exists(WATCH_DIR):
        return 0
    files = [os.path.join(WATCH_DIR, f) for f in os.listdir(WATCH_DIR) if f.endswith('.xlsx') and not f.startswith('~$')]
    if not files:
        return 0
    return max(os.path.getmtime(f) for f in files)

def sync_to_github():
    """Process data locally and push ONLY the tiny data.json file."""
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Detected changes! Processing data...")
    
    try:
        # Step 1: Run process_data.py locally using the external folder
        # This creates/updates src/data.json
        subprocess.run(['python', 'process_data.py', WATCH_DIR], check=True)
        
        # Step 2: Push ONLY the data.json to GitHub
        # We don't push the heavy Excel files anymore!
        subprocess.run(['git', 'add', 'src/data.json'], check=True, capture_output=True)
        
        commit_msg = f"auto: update dashboard data {datetime.now().strftime('%Y-%m-%d %H:%M')}"
        result = subprocess.run(['git', 'commit', '-m', commit_msg], capture_output=True, text=True)
        
        if "nothing to commit" in result.stdout:
            print("Dashboard is already up to date.")
            return
            
        print("Uploading tiny data file to GitHub...")
        subprocess.run(['git', 'push', 'origin', 'main'], check=True, capture_output=True)
        print("Success! Dashboard updated with zero duplicate memory usage.")
        
    except Exception as e:
        print(f"Error during sync: {e}")
        print("Tip: If you have an Excel file open, please close it so the script can read the data.")

def main():
    print("-----------------------------------------")
    print("  FSE Dashboard LEAN Auto-Sync (v2)")
    print("-----------------------------------------")
    print(f"WATCHING EXCEL: {WATCH_DIR}")
    print("SYNCING: Tiny data.json only")
    print("STATUS: No duplicate Excel files used.")
    print("-----------------------------------------")
    
    last_mod = get_last_modified()
    
    try:
        while True:
            current_mod = get_last_modified()
            if current_mod > last_mod:
                time.sleep(2) # Short wait for Excel save
                sync_to_github()
                last_mod = current_mod
            
            time.sleep(CHECK_INTERVAL)
    except KeyboardInterrupt:
        print("\nAuto-Sync stopped.")

if __name__ == "__main__":
    main()
