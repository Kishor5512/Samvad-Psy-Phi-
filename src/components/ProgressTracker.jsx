import React from 'react';
import PropTypes from 'prop-types';

/**
 * ProgressTracker component displays the daily practice streak.
 *
 * @param {Object} props
 * @param {number} props.streak - Active calendar day streak.
 * @param {Function} [props.onResetProgress] - Optional callback to reset progress.
 */
export default function ProgressTracker({
  streak = 0,
  onResetProgress
}) {
  return (
    <div className="progress-tracker-bar" role="region" aria-label="Learning Streak Overview">
      <div className="tracker-content-wrapper streak-only">
        {/* Streak & Flame Badge Counter */}
        <div className="streak-badge-box">
          <div className="streak-badge" title="Daily training streak count">
            <span className="flame-icon">🔥</span>
            <div className="streak-info">
              <span className="streak-number">{streak}</span>
              <span className="streak-label">{streak === 1 ? 'Day Streak' : 'Days Streak'}</span>
            </div>
          </div>
        </div>

        {onResetProgress && (
          <button
            type="button"
            className="reset-progress-btn"
            onClick={onResetProgress}
            title="Reset training streak data"
          >
            Reset Streak
          </button>
        )}
      </div>
    </div>
  );
}

ProgressTracker.propTypes = {
  streak: PropTypes.number.isRequired,
  onResetProgress: PropTypes.func
};
