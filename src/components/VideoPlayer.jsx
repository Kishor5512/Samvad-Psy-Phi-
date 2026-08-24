import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * VideoPlayer component renders a modal media player for practicing an ISL phrase,
 * complete with playback controls, gloss explanation, completion tracking, and
 * a direct Gmail redirection option to compose an email with pre-filled recipient,
 * subject, body, and explicit binary Blob MP4 video file download.
 */
export default function VideoPlayer({ phrase, isCompleted, onMarkComplete, onClose }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(true);
  const [videoError, setVideoError] = useState(false);

  // Email state
  const [emailInput, setEmailInput] = useState('');
  const [emailStatus, setEmailStatus] = useState(null);

  // Auto-focus container for keyboard shortcuts
  const modalRef = useRef(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept Esc or Space if user is typing in email input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        onMarkComplete(phrase.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onMarkComplete, phrase.id]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleRateChange = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
    if (videoRef.current) {
      videoRef.current.loop = !isLooping;
    }
  };

  // Trigger explicit Blob MP4 video download and redirect to Gmail Compose
  const handleSendEmail = async (e) => {
    e.preventDefault();

    const targetEmail = emailInput.trim();
    if (!targetEmail) {
      setEmailStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(targetEmail)) {
      setEmailStatus({ type: 'error', message: 'Invalid recipient email format.' });
      return;
    }

    const cleanFileName = `${phrase.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.mp4`;

    // 1. Download valid binary MP4 file as Blob
    try {
      const response = await fetch(phrase.videoUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const blobData = await response.blob();
      const mp4Blob = new Blob([blobData], { type: 'video/mp4' });
      const objectUrl = URL.createObjectURL(mp4Blob);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = objectUrl;
      downloadLink.download = cleanFileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setTimeout(() => URL.revokeObjectURL(objectUrl), 15000);
    } catch (err) {
      console.warn('Blob download fallback:', err);
      // Fallback standard link click
      const a = document.createElement('a');
      a.href = phrase.videoUrl;
      a.download = cleanFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    // 2. Prepare email parameters & open Gmail Web Compose
    const subjectText = `PROJECT SAMVAAD – ISL Video: ${phrase.title}`;
    const bodyText = `Hello,\n\nPlease find attached the Project SAMVAAD Indian Sign Language (ISL) training video for "${phrase.title}".\n\nPhrase: ${phrase.title}\nISL Structure & Gloss: ${phrase.gloss}\n\nRegards,\nProject SAMVAAD\nTeam PSI PHI\nGlobal Academy of Technology`;

    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;

    window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');

    setEmailStatus({
      type: 'success',
      message: `✓ Opened Gmail Compose! Valid MP4 video file '${cleanFileName}' has been downloaded to attach.`
    });
  };

  return (
    <div className="player-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="player-title">
      <div className="player-modal-container" ref={modalRef} tabIndex={-1}>
        {/* Top Header */}
        <div className="player-header">
          <div className="player-meta">
            <span className={`category-tag ${phrase.category.toLowerCase().replace(/\s+/g, '-')}`}>
              {phrase.category}
            </span>
            <span className="duration-tag">{phrase.durationSeconds} Seconds Loop</span>
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            aria-label="Close video player"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Video Canvas Container */}
        <div className="video-viewport">
          {!videoError ? (
            <video
              ref={videoRef}
              src={phrase.videoUrl}
              autoPlay
              loop={isLooping}
              playsInline
              className="video-element"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={() => setVideoError(true)}
            />
          ) : (
            <div className="video-fallback">
              <div className="fallback-symbol">🤟</div>
              <p>Video loading offline fallback</p>
              <span className="fallback-gloss">{phrase.gloss}</span>
            </div>
          )}

          {/* Custom Controls Bar */}
          <div className="video-controls-overlay">
            <button
              type="button"
              className="control-icon-btn"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>

            <button
              type="button"
              className={`control-pill-btn ${isLooping ? 'active' : ''}`}
              onClick={toggleLoop}
              title="Toggle automatic loop"
            >
              🔁 Loop
            </button>

            <div className="speed-selector">
              <span className="speed-label">Speed:</span>
              {[0.75, 1, 1.25].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  className={`speed-btn ${playbackRate === rate ? 'active' : ''}`}
                  onClick={() => handleRateChange(rate)}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Phrase Details & Actions */}
        <div className="player-details">
          <div className="phrase-info-box">
            <h2 id="player-title" className="player-title">
              "{phrase.title}"
            </h2>
            <div className="gloss-card">
              <span className="gloss-label">ISL Structure & Gloss:</span>
              <p className="gloss-text">{phrase.gloss}</p>
            </div>
          </div>

          <div className="player-actions">
            <button
              type="button"
              className={`mark-practiced-btn ${isCompleted ? 'completed' : ''}`}
              onClick={() => onMarkComplete(phrase.id)}
            >
              {isCompleted ? (
                <>
                  <span className="check-icon">✓</span> Practiced! Mark Again
                </>
              ) : (
                <>
                  <span className="check-icon">✓</span> Mark as Practiced
                </>
              )}
            </button>

            <button type="button" className="return-btn" onClick={onClose}>
              Back to Phrases List
            </button>
          </div>

          {/* Email Redirect Compose Section */}
          <div className="email-share-card">
            <div className="email-share-header">
              <span className="email-share-icon">📧</span>
              <div>
                <h3 className="email-share-title">Send MP4 Video via Gmail</h3>
                <p className="email-share-desc">
                  Opens Gmail Compose and downloads <strong>{phrase.title}</strong> as a valid MP4 file.
                </p>
              </div>
            </div>

            <form onSubmit={handleSendEmail} className="email-share-form">
              <input
                type="email"
                className="email-input-field"
                placeholder="Enter recipient email address..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
              />
              <button type="submit" className="email-send-btn">
                Send via Gmail ↗
              </button>
            </form>

            {emailStatus && (
              <div className={`email-status-banner ${emailStatus.type}`}>
                {emailStatus.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

VideoPlayer.propTypes = {
  phrase: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    videoUrl: PropTypes.string.isRequired,
    gloss: PropTypes.string.isRequired,
    durationSeconds: PropTypes.number.isRequired
  }).isRequired,
  isCompleted: PropTypes.bool.isRequired,
  onMarkComplete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};
