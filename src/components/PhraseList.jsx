import React from 'react';
import PropTypes from 'prop-types';
import PhraseCard from './PhraseCard';

/**
 * PhraseList component renders a grid of PhraseCards filtered by category.
 *
 * @param {Object} props
 * @param {Array<Object>} props.phrases - Array of phrase objects.
 * @param {string} props.activeCategory - Currently selected category filter.
 * @param {string[]} props.completedIds - List of completed phrase IDs.
 * @param {Function} props.onSelectPhrase - Callback triggered when user clicks a card.
 */
export default function PhraseList({
  phrases = [],
  activeCategory = 'All',
  completedIds = [],
  onSelectPhrase
}) {
  const filteredPhrases = activeCategory === 'All'
    ? phrases
    : phrases.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

  if (filteredPhrases.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <h3>No phrases found</h3>
        <p>No ISL training phrases available for category "{activeCategory}".</p>
      </div>
    );
  }

  return (
    <section className="phrase-list-grid" aria-label="ISL Phrases Grid">
      {filteredPhrases.map((phrase) => {
        const isDone = completedIds.includes(phrase.id);
        return (
          <PhraseCard
            key={phrase.id}
            phrase={phrase}
            isCompleted={isDone}
            onSelectPhrase={onSelectPhrase}
          />
        );
      })}
    </section>
  );
}

PhraseList.propTypes = {
  phrases: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      videoUrl: PropTypes.string.isRequired,
      gloss: PropTypes.string.isRequired,
      durationSeconds: PropTypes.number.isRequired
    })
  ).isRequired,
  activeCategory: PropTypes.string.isRequired,
  completedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectPhrase: PropTypes.func.isRequired
};
