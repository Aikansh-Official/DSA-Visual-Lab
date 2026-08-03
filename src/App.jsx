import React, { useEffect, useState } from 'react';
import { Crown, Moon, Sparkles, Sun, Terminal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DSATopic } from './types';
import StackView from './components/StackView';
import QueueView from './components/QueueView';
import ArrayView from './components/ArrayView';
import TreeView from './components/TreeView';

const Header = ({ currentTopic, isDarkMode, onThemeToggle, onTopicChange, onStartLearning }) => (
  <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-surface/80 backdrop-blur-md shadow-[0_0_15px_rgba(56,222,187,0.1)]">
    <div className="flex items-center gap-2">
      <Terminal className="text-primary-fixed w-6 h-6" />
      <h1 className="text-xl font-bold text-primary tracking-tight">DSA Visual Lab</h1>
    </div>
    <nav className="hidden md:flex items-center gap-8">
      <button 
        onClick={() => onTopicChange(DSATopic.STACK)}
        className={`text-sm font-medium transition-all duration-200 ${currentTopic === DSATopic.STACK ? 'text-primary-fixed border-b-2 border-primary-fixed' : 'text-on-surface-variant hover:text-primary-fixed'}`}
      >
        Stacks
      </button>
      <button 
        onClick={() => onTopicChange(DSATopic.QUEUE)}
        className={`text-sm font-medium transition-all duration-200 ${currentTopic === DSATopic.QUEUE ? 'text-primary-fixed border-b-2 border-primary-fixed' : 'text-on-surface-variant hover:text-primary-fixed'}`}
      >
        Queues
      </button>
      <button 
        onClick={() => onTopicChange(DSATopic.ARRAY)}
        className={`text-sm font-medium transition-all duration-200 ${currentTopic === DSATopic.ARRAY ? 'text-primary-fixed border-b-2 border-primary-fixed' : 'text-on-surface-variant hover:text-primary-fixed'}`}
      >
        Arrays
      </button>
      <button 
        onClick={() => onTopicChange(DSATopic.TREE)}
        className={`text-sm font-medium transition-all duration-200 ${currentTopic === DSATopic.TREE ? 'text-primary-fixed border-b-2 border-primary-fixed' : 'text-on-surface-variant hover:text-primary-fixed'}`}
      >
        Trees
      </button>
    </nav>
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onThemeToggle}
        className="flex h-10 w-10 items-center justify-center rounded border border-outline-variant bg-surface-container text-on-surface-variant transition-colors hover:border-primary-fixed hover:text-primary-fixed"
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
      <button
        onClick={onStartLearning}
        className="relative overflow-hidden bg-primary-fixed text-on-primary-fixed px-6 py-2 rounded font-medium text-sm hover:neon-glow transition-all duration-300"
      >
        Start Learning
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 hover:translate-x-full" />
      </button>
    </div>
  </header>
);

const PremiumToast = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -18, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -18, scale: 0.96 }}
    className="fixed right-6 top-24 z-[60] w-[min(420px,calc(100vw-48px))] overflow-hidden rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50 via-white to-yellow-100 shadow-[0_18px_50px_rgba(245,158,11,0.35)]"
  >
    <div className="absolute inset-0 premium-gold-shine opacity-70" />
    <div className="relative flex items-start gap-4 p-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 text-amber-950 shadow-[0_0_24px_rgba(245,158,11,0.55)]">
        <Crown className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-600" />
          <h2 className="text-lg font-bold text-amber-950">Buy Premium</h2>
        </div>
        <p className="mt-1 text-sm font-medium text-amber-900">
          Unlock more visual lessons, practice challenges, and advanced DSA labs at just 99rs.
        </p>
      </div>
      <button onClick={onClose} className="rounded-full p-1 text-amber-800 transition-colors hover:bg-amber-200/70" aria-label="Close premium message">
        <X className="h-4 w-4" />
      </button>
    </div>
  </motion.div>
);

const Footer = () => (
  <footer className="w-full py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-outline-variant bg-surface-container-lowest mt-16 mt-auto">
    <div className="text-lg font-bold text-primary-fixed">DSA Visual Lab</div>
    <div className="flex gap-8">
      <a href="#" className="text-sm font-medium text-on-surface-variant hover:text-primary-fixed transition-colors">GitHub</a>
      <a href="#" className="text-sm font-medium text-on-surface-variant hover:text-primary-fixed transition-colors">Topics</a>
      <a href="#" className="text-sm font-medium text-on-surface-variant hover:text-primary-fixed transition-colors">Contact</a>
      <a href="#" className="text-sm font-medium text-on-surface-variant hover:text-primary-fixed transition-colors">Practice</a>
    </div>
    <div className="text-sm font-medium text-on-surface-variant">
      © 2026 DSA Visual Lab. Engineered for precision.
    </div>
  </footer>
);

export default function App() {
  const [currentTopic, setCurrentTopic] = useState(DSATopic.STACK);
  const [showPremium, setShowPremium] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('dsa-visual-lab-theme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light';
    localStorage.setItem('dsa-visual-lab-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <div className="min-h-screen flex flex-col pt-24">
      <Header
        currentTopic={currentTopic}
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode((currentMode) => !currentMode)}
        onTopicChange={setCurrentTopic}
        onStartLearning={() => setShowPremium(true)}
      />
      <AnimatePresence>
        {showPremium && <PremiumToast onClose={() => setShowPremium(false)} />}
      </AnimatePresence>
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTopic}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentTopic === DSATopic.STACK && <StackView />}
            {currentTopic === DSATopic.QUEUE && <QueueView />}
            {currentTopic === DSATopic.ARRAY && <ArrayView />}
            {currentTopic === DSATopic.TREE && <TreeView />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
