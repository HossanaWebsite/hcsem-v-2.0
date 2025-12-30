"""
HCSEM Website Demo Screen Recorder
Records the website demo and saves as MP4 file
"""

import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import cv2
import numpy as np
from PIL import ImageGrab
import pyautogui

def setup_browser():
    """Setup Chrome browser in fullscreen"""
    chrome_options = Options()
    chrome_options.add_argument('--start-maximized')
    chrome_options.add_argument('--disable-infobars')
    chrome_options.add_argument('--disable-extensions')
    
    driver = webdriver.Chrome(options=chrome_options)
    return driver

def record_screen(duration_seconds, output_file='hcsem_demo.mp4', fps=30):
    """Record screen for specified duration"""
    print(f"Starting recording for {duration_seconds} seconds...")
    
    # Get screen size
    screen_size = pyautogui.size()
    
    # Define codec and create VideoWriter
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_file, fourcc, fps, screen_size)
    
    start_time = time.time()
    frame_count = 0
    
    try:
        while (time.time() - start_time) < duration_seconds:
            # Capture screen
            img = ImageGrab.grab()
            
            # Convert to numpy array
            frame = np.array(img)
            
            # Convert RGB to BGR (OpenCV uses BGR)
            frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
            
            # Write frame
            out.write(frame)
            
            frame_count += 1
            
            # Print progress every 30 frames (1 second at 30fps)
            if frame_count % 30 == 0:
                elapsed = int(time.time() - start_time)
                print(f"Recording... {elapsed}/{duration_seconds} seconds")
            
            # Sleep to maintain fps
            time.sleep(1/fps)
    
    finally:
        out.release()
        print(f"\nRecording complete! Saved to: {output_file}")
        print(f"Total frames: {frame_count}")

def main():
    """Main function to record website demo"""
    
    # Setup
    driver = setup_browser()
    
    try:
        # Navigate to demo page
        print("Opening demo page...")
        driver.get('http://localhost:3000/demo-player.html')
        
        # Wait for page to load
        time.sleep(3)
        
        # Maximize window
        driver.maximize_window()
        time.sleep(1)
        
        # Start recording (4 minutes = 240 seconds)
        print("\nStarting 4-minute recording...")
        print("Make sure the browser window is visible!")
        time.sleep(2)  # Give user time to see the message
        
        record_screen(
            duration_seconds=240,  # 4 minutes
            output_file='public/hcsem_complete_demo.mp4',
            fps=30
        )
        
    except Exception as e:
        print(f"Error: {e}")
    
    finally:
        # Close browser
        driver.quit()
        print("\nDone! Check public/hcsem_complete_demo.mp4")

if __name__ == "__main__":
    print("=" * 60)
    print("HCSEM Website Demo Recorder")
    print("=" * 60)
    print("\nThis script will:")
    print("1. Open the demo page in Chrome")
    print("2. Record the screen for 4 minutes")
    print("3. Save as MP4 file")
    print("\nMake sure:")
    print("- Chrome browser is installed")
    print("- npm run dev is running (localhost:3000)")
    print("- No other windows are covering the browser")
    print("\nPress Ctrl+C to cancel, or wait 5 seconds to start...")
    
    try:
        time.sleep(5)
        main()
    except KeyboardInterrupt:
        print("\n\nRecording cancelled by user.")
