import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API route to send a single video email
app.post('/api/send-email', async (req, res) => {
  try {
    const { email, phraseTitle, videoUrl, gloss } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, error: 'Recipient email address is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, error: 'Invalid recipient email address.' });
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_APP_PASSWORD;

    if (!emailUser || !emailPass || emailUser === 'your_email@gmail.com' || emailPass === 'your_gmail_app_password') {
      return res.status(400).json({
        success: false,
        error: 'Email credentials not configured in server .env file. Please set EMAIL_USER and EMAIL_APP_PASSWORD in .env'
      });
    }

    // Resolve video file path from public directory
    let relativeVideoPath = videoUrl.startsWith('/') ? videoUrl.slice(1) : videoUrl;
    let filePath = path.join(__dirname, 'public', relativeVideoPath);

    if (!fs.existsSync(filePath)) {
      // Fallback check in videos/ folder
      const filename = path.basename(relativeVideoPath);
      filePath = path.join(__dirname, 'videos', filename);
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: `Video file not found on server for ${phraseTitle || 'selected phrase'}.`
      });
    }

    // Create Gmail SMTP SSL Transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    const mailOptions = {
      from: `"Project SAMVAAD" <${emailUser}>`,
      to: email.trim(),
      subject: `PROJECT SAMVAAD – ISL Video: ${phraseTitle || 'Micro-Learning'}`,
      text: `Hello,\n\nPlease find attached your requested Project SAMVAAD Indian Sign Language (ISL) training video.\n\nPhrase: ${phraseTitle}\nISL Structure & Gloss: ${gloss || 'N/A'}\n\nThese videos are part of the SAMVAAD human-first accessibility and micro-learning module.\n\nRegards,\nProject SAMVAAD\nTeam PSI PHI\nGlobal Academy of Technology`,
      attachments: [
        {
          filename: path.basename(filePath),
          path: filePath
        }
      ]
    };

    console.log(`Sending email to ${email.trim()} with attachment ${filePath}...`);
    await transporter.sendMail(mailOptions);
    console.log(`Successfully sent email to ${email.trim()}!`);

    return res.json({
      success: true,
      message: `Video for "${phraseTitle}" sent successfully to ${email.trim()}!`
    });

  } catch (error) {
    console.error('Error sending email:', error);
    let errorMessage = error.message || 'Failed to send email via SMTP.';
    if (error.code === 'EAUTH') {
      errorMessage = 'SMTP Authentication failed. Check EMAIL_USER and EMAIL_APP_PASSWORD in .env file.';
    }
    return res.status(500).json({ success: false, error: errorMessage });
  }
});

app.listen(PORT, () => {
  console.log(`SAMVAAD Email API Server running on http://localhost:${PORT}`);
});
