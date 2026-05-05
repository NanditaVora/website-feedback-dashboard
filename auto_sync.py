import os
import time
import subprocess
from datetime import datetime

# Configuration
WATCH_DIR = 'feedback-reports'
CHECK_INTERVAL = 5 # Check every 5 seconds
GIT_COMMANDS = [
    ['git', 'add', '.'],
    ['git', 'commit', '-m', 'auto: sync feedback reports'],
    ['git', 'push', 'origin', 'main']
]

def get_last_modified():
    """Get the latest modification time of any xlsx file in the directory."""
    files = [os.path.join(WATCH_DIR, f) for f in os.listdir(WATCH_DIR) if f.endswith('.xlsx')]
    if not files:
        return 0
    return max(os.path.getmtime(f) for f in files)

def sync_to_github():
    """Run git commands to push changes."""
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Detected changes! Syncing to Dashboard...")
    try:
        # Step 1: Add
        subprocess.run(['git', 'add', '.'], check=True, capture_output=True)
        # Step 2: Commit
        result = subprocess.run(['git', 'commit', '-m', f"auto: sync reports {datetime.now().strftime('%Y-%m-%d %H:%M')}"], capture_output=True, text=True)
        if "nothing to commit" in result.stdout:
            print("Already in sync.")
            return
        # Step 3: Push
        print("Pushing to GitHub...")
        subprocess.run(['git', 'push', 'origin', 'main'], check=True, capture_output=True)
        print("Done! Your dashboard will update in ~2 minutes.")
    except Exception as e:
        print(f"Error during sync: {e}")
        print("Tip: Make sure you have closed your Excel file.")

def main():
    print("-----------------------------------------")
    print("  FSE Dashboard Auto-Sync Started!")
    print("-----------------------------------------")
    print(f"Watching folder: {WATCH_DIR}")
    print("I will automatically update your dashboard whenever you save an Excel file.")
    print("Press Ctrl+C to stop the sync.")
    print("-----------------------------------------")
    
    last_mod = get_last_modified()
    
    try:
        while True:
            current_mod = get_last_modified()
            if current_mod > last_mod:
                # Wait a few seconds for Excel to release the file lock
                time.sleep(3)
                sync_to_github()
                last_mod = current_mod
            
            time.sleep(CHECK_INTERVAL)
    except KeyboardInterrupt:
        print("\nAuto-Sync stopped.")

if __name__ == "__main__":
    main()
