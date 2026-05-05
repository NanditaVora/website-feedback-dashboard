import os
import time
import subprocess
import shutil
from datetime import datetime

# Configuration
# WE WATCH THE EXTERNAL FOLDER
WATCH_DIR = r'C:\Users\nandita.vora\OneDrive - NIIT Limited\NIIT-AI Powered FSE - General\Design Docs\FSE-v6\Website-Feedback'
# WE COPY TO THE INTERNAL PROJECT FOLDER FOR GITHUB
INTERNAL_REPO_DIR = 'feedback-reports'
CHECK_INTERVAL = 5 

def get_last_modified():
    """Get the latest modification time of any xlsx file in the external directory."""
    if not os.path.exists(WATCH_DIR):
        return 0
    files = [os.path.join(WATCH_DIR, f) for f in os.listdir(WATCH_DIR) if f.endswith('.xlsx')]
    if not files:
        return 0
    return max(os.path.getmtime(f) for f in files)

def sync_to_github():
    """Copy files from external folder to repo and push."""
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Detected changes in Website-Feedback! Syncing...")
    
    try:
        # Step 1: Ensure internal folder exists
        if not os.path.exists(INTERNAL_REPO_DIR):
            os.makedirs(INTERNAL_REPO_DIR)
            
        # Step 2: Copy all xlsx files from external to internal
        files = [f for f in os.listdir(WATCH_DIR) if f.endswith('.xlsx')]
        for f in files:
            src = os.path.join(WATCH_DIR, f)
            dst = os.path.join(INTERNAL_REPO_DIR, f)
            shutil.copy2(src, dst)
        
        # Step 3: Git Sync
        subprocess.run(['git', 'add', '.'], check=True, capture_output=True)
        result = subprocess.run(['git', 'commit', '-m', f"auto: sync reports from external folder {datetime.now().strftime('%Y-%m-%d %H:%M')}"], capture_output=True, text=True)
        
        if "nothing to commit" in result.stdout:
            print("No new changes to upload.")
            return
            
        print("Pushing to GitHub Dashboard...")
        subprocess.run(['git', 'push', 'origin', 'main'], check=True, capture_output=True)
        print("Success! Your dashboard will update in ~2 minutes.")
        
    except Exception as e:
        print(f"Error during sync: {e}")
        print("Tip: Make sure you have closed your Excel file and that the path is correct.")

def main():
    print("-----------------------------------------")
    print("  FSE Dashboard External Auto-Sync!")
    print("-----------------------------------------")
    print(f"WATCHING: {WATCH_DIR}")
    print(f"SYNCING TO: {INTERNAL_REPO_DIR}")
    print("-----------------------------------------")
    
    last_mod = get_last_modified()
    
    try:
        while True:
            current_mod = get_last_modified()
            if current_mod > last_mod:
                time.sleep(3) # Wait for Excel lock
                sync_to_github()
                last_mod = current_mod
            
            time.sleep(CHECK_INTERVAL)
    except KeyboardInterrupt:
        print("\nAuto-Sync stopped.")

if __name__ == "__main__":
    main()
