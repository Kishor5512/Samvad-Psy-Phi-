import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# Ensure directories exist
os.makedirs("public/icons", exist_ok=True)
os.makedirs("public/videos", exist_ok=True)

# 1. Generate PNG Icons using PIL
def create_icon(size, filename):
    img = Image.new("RGBA", (size, size), (15, 23, 42, 255)) # #0f172a background
    draw = ImageDraw.Draw(img)
    
    # Outer ring
    margin = size // 10
    draw.ellipse([margin, margin, size - margin, size - margin], outline=(59, 130, 246), width=size // 24)
    
    # Inner glowing hands symbol / badge representation
    center = size // 2
    r = size // 4
    draw.ellipse([center - r, center - r, center + r, center + r], fill=(37, 99, 235))
    
    # Text "S" inside
    try:
        font = ImageFont.truetype("arial.ttf", int(size * 0.4))
    except:
        font = ImageFont.load_default()
    
    # Draw icon initials / symbol
    text = "S"
    draw.text((center, center), text, fill=(255, 255, 255), anchor="mm", font=font)
    
    img.save(filename, "PNG")

create_icon(192, "public/icons/icon-192x192.png")
create_icon(512, "public/icons/icon-512x512.png")

# Favicon SVG
svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#0f172a"/>
  <circle cx="50" cy="50" r="35" fill="#2563eb"/>
  <path d="M40 30 L65 50 L40 70 Z" fill="#ffffff"/>
</svg>"""
with open("public/icons/favicon.svg", "w") as f:
    f.write(svg_content)

print("Icons generated successfully.")

# 2. Generate 8 high-contrast MP4 video files with custom text and animated sign language graphics
phrases_info = [
    ("hc-01-where-does-it-hurt", "Healthcare", "Where does it hurt?", "ISL Gloss: PAIN WHERE QUESTION"),
    ("hc-02-take-medicine", "Healthcare", "Take medicine twice a day", "ISL Gloss: MEDICINE EAT DAY TWO TIMES"),
    ("hc-03-id-card", "Healthcare", "Do you have your ID card?", "ISL Gloss: IDENTITY CARD YOU HAVE QUESTION"),
    ("hc-04-wait-room", "Healthcare", "Please wait in Room 3", "ISL Gloss: ROOM THREE PLEASE WAIT"),
    ("bk-01-deposit-slip", "Banking", "Fill out this deposit slip", "ISL Gloss: DEPOSIT FORM WRITE PLEASE"),
    ("bk-02-aadhaar-card", "Banking", "Show your Aadhaar card", "ISL Gloss: AADHAAR CARD SHOW PLEASE"),
    ("bk-03-enter-pin", "Banking", "Enter your PIN on keypad", "ISL Gloss: PIN NUMBER BUTTON PRESS"),
    ("bk-04-collect-cash", "Banking", "Withdrawal done, take cash", "ISL Gloss: MONEY WITHDRAW SUCCESS CASH TAKE")
]

fps = 24
duration = 4 # seconds per video
width, height = 640, 360
fourcc = cv2.VideoWriter_fourcc(*'mp4v')

for fname, category, title, gloss in phrases_info:
    filepath = f"public/videos/{fname}.mp4"
    out = cv2.VideoWriter(filepath, fourcc, fps, (width, height))
    
    cat_color = (220, 100, 30) if category == "Healthcare" else (40, 160, 220) # BGR
    
    total_frames = fps * duration
    for frame_idx in range(total_frames):
        # Create dark slate background #0f172a -> BGR (42, 23, 15)
        frame = np.full((height, width, 3), (42, 23, 15), dtype=np.uint8)
        
        # Header bar
        cv2.rectangle(frame, (0, 0), (width, 50), cat_color, -1)
        cv2.putText(frame, f"SAMVAAD ISL - {category.upper()} MODULE", (20, 33), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2, cv2.LINE_AA)
        
        # Animated Sign Demonstration Box
        t = frame_idx / fps
        center_x = width // 2
        center_y = height // 2 - 10
        
        # Animated moving hands circles simulating sign movements
        hand1_x = int(center_x - 60 + 30 * np.sin(t * 3))
        hand1_y = int(center_y + 20 * np.cos(t * 4))
        hand2_x = int(center_x + 60 - 30 * np.sin(t * 3))
        hand2_y = int(center_y - 20 * np.cos(t * 4))
        
        # Draw avatar / hands simulation
        cv2.circle(frame, (center_x, center_y - 40), 25, (255, 255, 255), -1) # Head
        cv2.ellipse(frame, (center_x, center_y + 35), (45, 30), 0, 0, 360, (200, 200, 200), -1) # Body
        
        # Animated hands
        cv2.circle(frame, (hand1_x, hand1_y), 16, (0, 215, 255), -1) # Left hand
        cv2.circle(frame, (hand2_x, hand2_y), 16, (255, 180, 0), -1) # Right hand
        cv2.line(frame, (center_x - 30, center_y + 10), (hand1_x, hand1_y), (0, 215, 255), 3)
        cv2.line(frame, (center_x + 30, center_y + 10), (hand2_x, hand2_y), (255, 180, 0), 3)
        
        # Bottom Title & Gloss overlay card
        cv2.rectangle(frame, (20, height - 90), (width - 20, height - 15), (30, 41, 59), -1)
        cv2.rectangle(frame, (20, height - 90), (width - 20, height - 15), (100, 116, 139), 1)
        
        cv2.putText(frame, f"\"{title}\"", (35, height - 60), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2, cv2.LINE_AA)
        cv2.putText(frame, gloss, (35, height - 30), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (56, 189, 248), 1, cv2.LINE_AA)
        
        # Progress Bar at top of footer
        progress_width = int((width - 40) * (frame_idx / total_frames))
        cv2.rectangle(frame, (20, height - 12), (20 + progress_width, height - 10), (59, 130, 246), -1)
        
        out.write(frame)
        
    out.release()
    print(f"Generated video: {filepath}")

print("All 8 MP4 videos generated successfully!")
