import React from 'react';
import PropTypes from 'prop-types';

/**
 * CategoryFilter component renders pill buttons to filter ISL phrases by category.
 *
 * @param {Object} props
 * @param {string[]} props.categories - List of unique category names.
 * @param {string} props.activeCategory - Currently selected category filter ("All" or specific name).
 * @param {Function} props.onSelectCategory - Callback triggered when user clicks a category pill.
 * @param {Object.<string, number>} [props.categoryCounts] - Optional map of phrase counts per category.
 */
export default function CategoryFilter({
  categories = [],
  activeCategory = 'All',
  onSelectCategory,
  categoryCounts = {}
}) {
  const allCategories = ['All', ...categories];

  return (
    <nav className="category-filter-container" aria-label="Phrase Categories">
      <div className="category-pills">
        {allCategories.map((cat) => {
          const isActive = activeCategory === cat;
          const count = categoryCounts[cat] !== undefined ? categoryCounts[cat] : null;

          return (
            <button
              key={cat}
              type="button"
              className={`category-pill ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat)}
              aria-pressed={isActive}
            >
              <span className="pill-label">{cat}</span>
              {count !== null && <span className="pill-badge">{count}</span>}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

CategoryFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeCategory: PropTypes.string.isRequired,
  onSelectCategory: PropTypes.func.isRequired,
  categoryCounts: PropTypes.objectOf(PropTypes.number)
};
