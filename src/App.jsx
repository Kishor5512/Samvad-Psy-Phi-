import React, { useState, useMemo } from 'react';
import phrasesData from './data/phrases.json';
import useProgress from './hooks/useProgress';

import CategoryFilter from './components/CategoryFilter';
import PhraseList from './components/PhraseList';
import VideoPlayer from './components/VideoPlayer';

import './styles/main.css';

/**
 * App component - SAMVAAD Learning Module main entry shell.
 */
export default function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedPhrase, setSelectedPhrase] = useState(null);

  // Custom hook for tracking progress in localStorage
  const { completedIds, markComplete } = useProgress();

  // Extract unique categories from dataset
  const categories = useMemo(() => {
    const set = new Set(phrasesData.map((item) => item.category));
    return Array.from(set);
  }, []);

  // Calculate count for each category pill
  const categoryCounts = useMemo(() => {
    const counts = { All: phrasesData.length };
    categories.forEach((cat) => {
      counts[cat] = phrasesData.filter((item) => item.category === cat).length;
    });
    return counts;
  }, [categories]);

  // Handle clicking a phrase card
  const handleSelectPhrase = (phrase) => {
    setSelectedPhrase(phrase);
  };

  // Handle closing video modal
  const handleClosePlayer = () => {
    setSelectedPhrase(null);
  };

  return (
    <div className="app-container">
      {/* Top Navigation Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="brand-section">
            <div className="brand-logo-badge">🤟</div>
            <div className="brand-text-container">
              <h1 className="brand-title">SAMVAAD</h1>
              <span className="brand-subtitle">Public Counter Staff ISL Module</span>
            </div>
          </div>

          <div className="offline-status-badge" title="App shell and media cached for offline desk usage">
            <span className="status-dot" />
            <span>PWA Ready (Offline)</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="app-main-content">
        {/* Desk Kiosk Banner */}
        <section className="hero-banner">
          <h2 className="hero-title">Indian Sign Language Quick Training</h2>
          <p className="hero-desc">
            Essential ISL phrases for public service desks. Tap any card to view the video demonstration, practice the sign, and mark as completed.
          </p>
        </section>

        {/* Category Pills Filter */}
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          categoryCounts={categoryCounts}
        />

        {/* Grid of Phrase Cards */}
        <PhraseList
          phrases={phrasesData}
          activeCategory={activeCategory}
          completedIds={completedIds}
          onSelectPhrase={handleSelectPhrase}
        />
      </main>

      {/* Video Player Modal (Active when card clicked) */}
      {selectedPhrase && (
        <VideoPlayer
          phrase={selectedPhrase}
          isCompleted={completedIds.includes(selectedPhrase.id)}
          onMarkComplete={markComplete}
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
}
