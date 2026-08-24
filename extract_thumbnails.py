import os
import cv2

os.makedirs("public/thumbnails", exist_ok=True)

videos = [
    ("Namaste.mp4", "namaste.jpg"),
    ("Thank you.mp4", "thank-you.jpg"),
    ("What is your name.mp4", "what-is-your-name.jpg")
]

for video_name, thumb_name in videos:
    video_path = os.path.join("public/videos", video_name)
    thumb_path = os.path.join("public/thumbnails", thumb_name)
    
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error opening video: {video_path}")
        continue
        
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    # Pick a frame around 20-30% into the video
    target_frame = max(1, int(total_frames * 0.25))
    cap.set(cv2.CAP_PROP_POS_FRAMES, target_frame)
    
    ret, frame = cap.read()
    if ret and frame is not None:
        cv2.imwrite(thumb_path, frame)
        print(f"Extracted thumbnail: {thumb_path} (from frame {target_frame}/{total_frames})")
    else:
        print(f"Failed to read frame from {video_name}")
        
    cap.release()

print("Thumbnail extraction finished.")
