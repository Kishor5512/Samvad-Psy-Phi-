import os
import sys
import re
import ssl
import socket
import smtplib
import argparse
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from dotenv import load_dotenv

# Ensure stdout supports UTF-8 encoding on Windows terminals
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Load environment variables from .env file
load_dotenv()

# Constants
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465  # SSL port for Gmail

# Video files required by Project SAMVAAD
REQUIRED_VIDEOS = [
    "namaste.mp4",
    "what_is_your_name.mp4",
    "thank_you.mp4"
]

EMAIL_SUBJECT = "PROJECT SAMVAAD – ISL Micro-Learning Videos"

EMAIL_BODY = """Hello,

Please find attached the first Project SAMVAAD ISL micro-learning videos:

1. Namaste / Hello
2. What is your name?
3. Thank you

These videos are part of the SAMVAAD human-first accessibility and micro-learning module.

Regards,
Project SAMVAAD
Team PSI PHI
Global Academy of Technology"""


def is_valid_email(email_str: str) -> bool:
    """
    Validates email format using basic regex.
    """
    pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return bool(re.match(pattern, email_str.strip()))


def format_size(bytes_size: int) -> str:
    """
    Formats byte size to human readable KB or MB.
    """
    if bytes_size < 1024 * 1024:
        return f"{bytes_size / 1024:.2f} KB ({bytes_size:,} bytes)"
    else:
        return f"{bytes_size / (1024 * 1024):.2f} MB ({bytes_size:,} bytes)"


def check_environment():
    """
    Checks if EMAIL_USER and EMAIL_APP_PASSWORD are defined in .env.
    """
    email_user = os.getenv("EMAIL_USER", "").strip()
    email_pass = os.getenv("EMAIL_APP_PASSWORD", "").strip()

    if not email_user or email_user == "your_email@gmail.com":
        print("[!] Error: Missing or invalid EMAIL_USER in .env file.")
        print("    Please set EMAIL_USER=your_email@gmail.com in your .env file.")
        return None, None

    if not email_pass or email_pass == "your_gmail_app_password":
        print("[!] Error: Missing or invalid EMAIL_APP_PASSWORD in .env file.")
        print("    Please set EMAIL_APP_PASSWORD=your_16_char_app_password in your .env file.")
        return None, None

    return email_user, email_pass


def check_video_files(videos_dir: str):
    """
    Verifies existence of video files and calculates sizes.
    """
    print(f"\n[+] Checking video files in '{videos_dir}' directory...")
    
    if not os.path.exists(videos_dir):
        print(f"[!] Error: Videos directory '{videos_dir}' does not exist.")
        return False, [], 0

    attached_files = []
    total_size = 0
    all_found = True

    for filename in REQUIRED_VIDEOS:
        file_path = os.path.join(videos_dir, filename)
        if not os.path.exists(file_path):
            print(f"  [x] Missing file: {filename} (Path: {file_path})")
            all_found = False
        else:
            file_size = os.path.getsize(file_path)
            total_size += file_size
            attached_files.append((filename, file_path, file_size))
            print(f"  [OK] Found: {filename:<25} Size: {format_size(file_size)}")

    if not all_found:
        print("\n[!] Error: One or more required video files are missing.")
        return False, [], 0

    print(f"\n[*] Total Attachment Size: {format_size(total_size)}")

    # Gmail maximum total attachment limit is 25 MB
    MAX_GMAIL_BYTES = 25 * 1024 * 1024
    if total_size > MAX_GMAIL_BYTES:
        print(f"[!] Warning: Total size ({format_size(total_size)}) exceeds Gmail's 25 MB attachment limit!")

    return True, attached_files, total_size


def test_smtp_connection(email_user: str, email_pass: str):
    """
    Tests SSL SMTP connection and authentication to Gmail without sending email.
    """
    print(f"\n[*] Testing SMTP connection to {SMTP_SERVER}:{SMTP_PORT}...")
    try:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context, timeout=15) as server:
            print("  [OK] Connected to Gmail SSL SMTP server.")
            print("  [*] Authenticating with credentials...")
            server.login(email_user, email_pass)
            print("  [OK] Authentication successful!")
            return True
    except smtplib.SMTPAuthenticationError:
        print("\n[!] Error: SMTP Authentication failed!")
        print("    Troubleshooting:")
        print("    1. Verify EMAIL_USER is your full Gmail address.")
        print("    2. Verify EMAIL_APP_PASSWORD is a valid 16-character App Password.")
        print("    3. Ensure 2-Step Verification is enabled on your Google Account.")
        return False
    except (smtplib.SMTPConnectError, socket.error, TimeoutError, ssl.SSLError) as e:
        print(f"\n[!] Error: Failed to connect to SMTP server ({e})")
        print("    Check your internet connection or network firewall settings.")
        return False
    except Exception as e:
        print(f"\n[!] Error: Unexpected error during SMTP test: {e}")
        return False


def send_email(email_user: str, email_pass: str, recipient_email: str, attached_files: list):
    """
    Constructs and sends email with attached videos over SSL SMTP.
    """
    print(f"\n[*] Preparing email message...")
    print(f"    From: {email_user}")
    print(f"    To:   {recipient_email}")
    print(f"    Subject: {EMAIL_SUBJECT}")

    # Build MIME message
    msg = MIMEMultipart()
    msg['From'] = email_user
    msg['To'] = recipient_email
    msg['Subject'] = EMAIL_SUBJECT

    # Attach plain text body
    msg.attach(MIMEText(EMAIL_BODY, 'plain', 'utf-8'))

    # Attach MP4 videos
    print(f"\n[*] Attaching {len(attached_files)} video files...")
    for filename, file_path, file_size in attached_files:
        try:
            with open(file_path, "rb") as f:
                part = MIMEBase("video", "mp4")
                part.set_payload(f.read())
            
            encoders.encode_base64(part)
            part.add_header(
                "Content-Disposition",
                f'attachment; filename="{filename}"'
            )
            msg.attach(part)
            print(f"  [OK] Attached: {filename}")
        except Exception as e:
            print(f"[!] Error attaching file '{filename}': {e}")
            return False

    # Connect and send via SMTP_SSL
    print(f"\n[*] Connecting to {SMTP_SERVER}:{SMTP_PORT} and sending email...")
    try:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context, timeout=30) as server:
            server.login(email_user, email_pass)
            server.send_message(msg)

        print("\n[SUCCESS] Email with ISL micro-learning videos sent successfully!")
        print(f"          Sent to: {recipient_email}")
        return True

    except smtplib.SMTPAuthenticationError:
        print("\n[!] Error: SMTP Authentication failed.")
        print("    Check EMAIL_USER and EMAIL_APP_PASSWORD in your .env file.")
        print("    Make sure you are using a Gmail App Password, not your account login password.")
        return False
    except (smtplib.SMTPException, socket.error, TimeoutError, ssl.SSLError) as e:
        print(f"\n[!] Error: Failed to send email via SMTP ({e})")
        return False
    except Exception as e:
        print(f"\n[!] Error: Unexpected error while sending email: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description="Project SAMVAAD - ISL Micro-Learning Video Email Utility"
    )
    parser.add_argument(
        "recipient",
        nargs="?",
        default="",
        help="Recipient email address (e.g. user@example.com)"
    )
    parser.add_argument(
        "--test",
        action="store_true",
        help="Run in test mode to validate configuration and video files without sending an email"
    )

    args = parser.parse_args()

    print("==================================================")
    print("  PROJECT SAMVAAD - ISL VIDEO EMAIL UTILITY")
    print("==================================================")

    # 1. Environment variables check
    email_user, email_pass = check_environment()

    # 2. Videos directory check
    script_dir = os.path.dirname(os.path.abspath(__file__))
    videos_dir = os.path.join(script_dir, "videos")
    files_ok, attached_files, total_size = check_video_files(videos_dir)

    # Handle Test Mode
    if args.test:
        print("\n--------------------------------------------------")
        print("RUNNING IN TEST MODE (No email will be sent)")
        print("--------------------------------------------------")

        # Validate recipient if provided
        if args.recipient:
            if is_valid_email(args.recipient):
                print(f"[OK] Recipient email format valid: {args.recipient}")
            else:
                print(f"[!] Warning: Recipient email format invalid: '{args.recipient}'")

        if not email_user or not email_pass:
            print("\n[!] TEST RESULT: Missing or default environment variables in .env")
            print("    Update EMAIL_USER and EMAIL_APP_PASSWORD in .env to test SMTP connection.")
            sys.exit(1)

        if not files_ok:
            print("\n[!] TEST RESULT: Missing required video files in 'videos/'")
            sys.exit(1)

        smtp_ok = test_smtp_connection(email_user, email_pass)
        if smtp_ok:
            print("\n[SUCCESS] ALL TESTS PASSED SUCCESSFULLY! Ready to send emails.")
            sys.exit(0)
        else:
            print("\n[!] TEST RESULT: Could not authenticate with Gmail SMTP server.")
            sys.exit(1)

    # Normal Mode Requirements
    if not args.recipient:
        print("\n[!] Error: Recipient email address is required.")
        print("Usage: python send_videos.py recipient@example.com")
        print("       python send_videos.py --test")
        sys.exit(1)

    recipient_email = args.recipient.strip()
    if not is_valid_email(recipient_email):
        print(f"\n[!] Error: Invalid recipient email address: '{recipient_email}'")
        sys.exit(1)

    if not email_user or not email_pass:
        print("\n[!] Error: Environment configuration failed. Check .env file.")
        sys.exit(1)

    if not files_ok:
        print("\n[!] Error: Video files check failed.")
        sys.exit(1)

    # Send Email
    success = send_email(email_user, email_pass, recipient_email, attached_files)
    if not success:
        sys.exit(1)


if __name__ == "__main__":
    main()
