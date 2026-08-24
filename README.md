<<<<<<< HEAD
# Samvad-Psy-Phi-
=======
# Project SAMVAAD – ISL Video Email Utility 🤟

A simple, secure Python command-line utility to email Indian Sign Language (ISL) micro-learning video attachments to learners and service counter staff.

Part of **Project SAMVAAD** (Human-first accessibility and micro-learning module) by **Team PSI PHI**, Global Academy of Technology.

---

## 📁 Directory Structure

```text
samvaad-learning/
├── videos/
│   ├── namaste.mp4
│   ├── what_is_your_name.mp4
│   └── thank_you.mp4
├── send_videos.py
├── .env
├── .env.example
├── requirements.txt
└── README.md
```

---

## 🔑 How to Create a Gmail App Password

To send emails programmatically via Gmail SMTP, you must use a **Gmail App Password** rather than your main Google account password.

1. **Enable 2-Step Verification**:
   - Go to your [Google Account Security Settings](https://myaccount.google.com/security).
   - Under "How you sign in to Google", select **2-Step Verification** and complete setup if not already enabled.

2. **Generate an App Password**:
   - Navigate to [Google App Passwords](https://myaccount.google.com/apppasswords).
   - Enter an App Name (e.g. `SAMVAAD Emailer`).
   - Click **Create**.
   - Copy the 16-character generated password (e.g. `abcd efgh ijkl mnop`).

3. **Configure `.env`**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and fill in your details:
     ```env
     EMAIL_USER=your_email@gmail.com
     EMAIL_APP_PASSWORD=abcdefghijklmnop
     ```

---

## 🛠️ Installation & Setup

### 1. Install Dependencies
Make sure Python 3.8+ is installed on your system. Run:
```bash
pip install -r requirements.txt
```

### 2. Verify Video Files
Ensure the three required MP4 files are placed inside the `videos/` folder:
- `videos/namaste.mp4`
- `videos/what_is_your_name.mp4`
- `videos/thank_you.mp4`

---

## 🚀 How to Run

### Test Mode (Dry-Run & Diagnostic Check)
Validate your `.env` configuration, check video attachment sizes, and test Gmail SMTP connection/authentication without sending an actual email:

```bash
python send_videos.py --test
```

### Send ISL Videos to Recipient
To email the videos as attachments to a recipient:

```bash
python send_videos.py recipient@example.com
```

---

## 📧 Email Details & Content

- **SMTP Configuration**: `smtp.gmail.com:465` (SSL connection)
- **Subject**: `PROJECT SAMVAAD – ISL Micro-Learning Videos`
- **Attachments**:
  1. `namaste.mp4` (Namaste / Hello)
  2. `what_is_your_name.mp4` (What is your name?)
  3. `thank_you.mp4` (Thank you)
- **Security**: No hardcoded credentials; all credentials read from local `.env`.
>>>>>>> 2686669 (Add ISL video content, thumbnails, clean UI, and Gmail video share feature)
