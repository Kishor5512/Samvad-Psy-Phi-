import cv2
import requests
import time
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

# Download model bundle if not present locally
# Run once in terminal: 
# wget -q https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task

ANALYSIS_API_URL = "http://localhost:8000/api/analyze-sign"

def extract_landmarks(hand_landmarks):
    """Flattens 21 hand landmarks (x, y, z) into a 1D list."""
    landmarks = []
    for lm in hand_landmarks:
        landmarks.extend([lm.x, lm.y, lm.z])
    return landmarks

def send_for_analysis(landmark_buffer):
    """Sends recorded sequence of landmark frames to backend."""
    payload = {
        "timestamp": time.time(),
        "frames_count": len(landmark_buffer),
        "landmarks_data": landmark_buffer
    }
    try:
        response = requests.post(ANALYSIS_API_URL, json=payload, timeout=2.0)
        print(f"[+] Sent {len(landmark_buffer)} frames | Status: {response.status_code}")
        if response.status_code == 200:
            print(f"[✓] Prediction: {response.json().get('prediction', 'Unknown')}")
    except requests.exceptions.RequestException as e:
        print(f"[!] API send skipped or failed: {e}")

def main():
    # Setup HandLandmarker detector option
    base_options = python.BaseOptions(model_asset_path='hand_landmarker.task')
    options = vision.HandLandmarkerOptions(base_options=base_options, num_hands=2)
    detector = vision.HandLandmarker.create_from_options(options)

    cap = cv2.VideoCapture(0)
    recording = False
    landmark_buffer = []
    
    print("\n--- SAMVAAD OpenCV Sign Capture ---")
    print("Press 'r' to START / STOP recording sign sequence.")
    print("Press 'q' to QUIT.\n")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print("[!] Could not access webcam.")
            break

        frame = cv2.flip(frame, 1)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
        
        detection_result = detector.detect(mp_image)
        
        frame_landmarks = []
        if detection_result.hand_landmarks:
            for hand_landmarks in detection_result.hand_landmarks:
                frame_landmarks.append(extract_landmarks(hand_landmarks))
                # Simple visual overlay for detected points
                for lm in hand_landmarks:
                    h, w, _ = frame.shape
                    cx, cy = int(lm.x * w), int(lm.y * h)
                    cv2.circle(frame, (cx, cy), 3, (0, 255, 0), -1)

        if recording and frame_landmarks:
            landmark_buffer.append(frame_landmarks)

        status_color = (0, 0, 255) if recording else (0, 255, 0)
        status_text = f"RECORDING ({len(landmark_buffer)} frames)" if recording else "IDLE (Press 'r' to capture)"
        cv2.putText(frame, status_text, (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.7, status_color, 2)

        cv2.imshow("SAMVAAD - Sign Capture & Analysis", frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('r'):
            recording = not recording
            if not recording:
                if landmark_buffer:
                    print(f"[*] Recording stopped. Sending {len(landmark_buffer)} frames for analysis...")
                    send_for_analysis(landmark_buffer)
                    landmark_buffer = []
                else:
                    print("[!] No landmarks detected during session.")
            else:
                print("[*] Recording started...")
                
        elif key == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()