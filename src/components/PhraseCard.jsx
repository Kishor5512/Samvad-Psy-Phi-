import React from 'react';
import PropTypes from 'prop-types';

/**
 * PhraseCard component displays a phrase card item with thumbnail image, duration, title, and completion status.
 *
 * @param {Object} props
 * @param {Object} props.phrase - Phrase data object from phrases.json.
 * @param {boolean} props.isCompleted - Whether phrase has been completed/practiced.
 * @param {Function} props.onSelectPhrase - Callback triggered when user clicks the card to play video.
 */
export default function PhraseCard({ phrase, isCompleted = false, onSelectPhrase }) {
  const { title, category, durationSeconds, gloss, thumbnailUrl } = phrase;

  return (
    <article
      className={`phrase-card ${isCompleted ? 'completed' : ''}`}
      onClick={() => onSelectPhrase(phrase)}
      tabIndex={0}
      role="button"
      aria-label={`Practice phrase: ${title}. ${isCompleted ? 'Completed' : 'Not completed'}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectPhrase(phrase);
        }
      }}
    >
      <div className="card-media-wrapper">
        <div className="card-video-preview">
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt={`ISL sign for ${title}`}
              className="card-thumbnail-img"
              loading="lazy"
            />
          )}
          <div className="preview-overlay">
            <div className="play-icon-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <span className="duration-badge">{durationSeconds}s</span>
          {isCompleted && (
            <div className="completed-badge" title="Practiced">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          )}
        </div>
      </div>

      <div className="card-content">
        <div className="card-header">
          <span className={`category-tag ${category.toLowerCase().replace(/\s+/g, '-')}`}>
            {category}
          </span>
          {isCompleted && <span className="status-label">Practiced</span>}
        </div>
        <h3 className="card-title">{title}</h3>
        <p className="card-gloss" title={gloss}>
          <span className="gloss-prefix">ISL:</span> {gloss}
        </p>
      </div>
    </article>
  );
}

PhraseCard.propTypes = {
  phrase: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    videoUrl: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string,
    gloss: PropTypes.string.isRequired,
    durationSeconds: PropTypes.number.isRequired
  }).isRequired,
  isCompleted: PropTypes.bool,
  onSelectPhrase: PropTypes.func.isRequired
};
