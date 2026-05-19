import React, { useState } from 'react';
import { Download, Upload, Eye, ArrowLeft, Layout as LayoutIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CodeBlock from './CodeBlock';
import ComplexityCard from './ComplexityCard';
import { StackHeroArt } from './ConceptArt';
import { stackSnippets } from '../codeSnippets';

export default function StackView() {
  const [items, setItems] = useState<string[]>(['Plate 1', 'Plate 2', 'Plate 3']);
  const [lastAction, setLastAction] = useState<string>('Initialization');

  const push = () => {
    if (items.length >= 6) {
      setLastAction('Stack Overflow! Maximum capacity reached.');
      return;
    }
    const newItem = `Plate ${items.length + 1}`;
    setItems(prev => [...prev, newItem]);
    setLastAction(`Pushed ${newItem}`);
  };

  const pop = () => {
    if (items.length === 0) {
      setLastAction('Stack Underflow! No items to remove.');
      return;
    }
    const removedItem = items[items.length - 1];
    setItems(prev => prev.slice(0, -1));
    setLastAction(`Popped ${removedItem}`);
  };

  const peek = () => {
    if (items.length === 0) {
      setLastAction('Stack is empty. Nothing to peek.');
      return;
    }
    setLastAction(`Peeked top: ${items[items.length - 1]}`);
  };

  return (
    <div className="flex flex-col gap-16 py-8">
      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <span className="w-fit px-3 py-1 bg-surface-container-high border border-outline-variant rounded-full text-xs font-mono text-primary-fixed">
            Linear Data Structure
          </span>
          <h2 className="text-5xl font-bold text-primary tracking-tight">Stack Data Structure</h2>
          <p className="text-lg text-on-surface-variant leading-relaxed">
            Understand Last In, First Out (LIFO) using a stack of plates. A precise, linear data structure essential for parsing, backtracking, and memory management.
          </p>
        </div>
        <div className="relative rounded-2xl overflow-hidden border border-outline-variant shadow-[0_0_30px_rgba(56,222,187,0.1)] aspect-video bg-surface-container">
          <StackHeroArt />
        </div>
      </section>

      {/* Interactive Lab */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Visualizer */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container rounded-2xl border border-outline-variant p-8 relative overflow-hidden group min-h-[500px] flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-b from-primary-fixed/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <div className="mb-8 flex items-center gap-3">
              <span className="p-2 bg-primary-fixed/10 rounded-lg">
                <LayoutIcon className="text-primary-fixed w-5 h-5" />
              </span>
              <h3 className="text-2xl font-bold text-primary">Plate Stack Visualizer</h3>
            </div>

            <div className="flex-grow flex flex-col items-center justify-end pb-12">
              <div className="w-full max-w-[240px] flex flex-col items-center justify-end gap-2 border-x-4 border-b-4 border-outline-variant p-6 rounded-b-2xl bg-surface/50 min-h-[320px] relative">
                {/* Top Indicator */}
                <div className="absolute -right-20 bottom-[calc(theme(spacing.2)*var(--items-count)+theme(spacing.12)*var(--items-count))] transition-all duration-500 flex items-center gap-2 text-primary-fixed" style={{ '--items-count': items.length } as any}>
                  <ArrowLeft className="w-8 h-8 animate-pulse" />
                  <span className="font-mono text-sm uppercase tracking-wider font-bold">Top</span>
                </div>

                <AnimatePresence initial={false}>
                  {[...items].reverse().map((item, idx) => (
                    <motion.div
                      key={item}
                      initial={{ y: -100, opacity: 0, scale: 0.8 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ x: 200, opacity: 0, scale: 0.8 }}
                      layout
                      className={`w-full h-12 flex items-center justify-center rounded-lg border font-mono text-sm transition-all duration-300 ${
                        idx === 0 
                          ? 'bg-surface-bright border-primary-fixed text-primary-fixed neon-glow' 
                          : 'bg-surface-container-highest border-outline-variant text-on-surface'
                      }`}
                    >
                      {item}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {items.length === 0 && (
                  <div className="text-on-surface-variant font-mono text-sm opacity-50 uppercase tracking-widest">
                    Stack is empty
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button 
                onClick={push}
                className="bg-primary-fixed/10 border border-primary-fixed text-primary-fixed px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-primary-fixed/20 hover:neon-glow transition-all font-mono text-sm font-bold"
              >
                <Download className="w-4 h-4" /> Push
              </button>
              <button 
                onClick={pop}
                className="bg-surface-bright border border-outline-variant text-on-surface px-6 py-3 rounded-lg flex items-center gap-2 hover:border-primary-fixed hover:text-primary-fixed transition-all font-mono text-sm font-bold"
              >
                <Upload className="w-4 h-4" /> Pop
              </button>
              <button 
                onClick={peek}
                className="bg-surface-bright border border-outline-variant text-on-surface px-6 py-3 rounded-lg flex items-center gap-2 hover:border-primary-fixed hover:text-primary-fixed transition-all font-mono text-sm font-bold"
              >
                <Eye className="w-4 h-4" /> Peek
              </button>
            </div>

            <div className="mt-8 text-center text-xs font-mono text-primary-fixed/80 bg-surface-dim py-3 rounded-xl border border-outline-variant/30">
              <span className="opacity-50 tracking-widest uppercase mr-2">Status:</span> 
              <span className="text-primary-fixed">{lastAction}</span>
            </div>
          </div>
        </div>

        {/* Core Info */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="bg-surface-container rounded-2xl border border-outline-variant p-8">
            <h3 className="text-3xl font-bold text-primary mb-4">The Core Idea</h3>
            <p className="text-on-surface-variant leading-relaxed text-lg">
              Imagine a stack of heavy plates in a cafeteria. You can only add a new plate to the top, and you can only remove the top plate. To reach the bottom plate, you must remove all the plates above it first.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-primary-fixed/10 border border-primary-fixed/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center neon-glow">
                <span className="text-5xl font-bold text-primary-fixed tracking-tighter">LIFO</span>
                <span className="text-sm font-mono text-primary mt-2 uppercase tracking-widest opacity-80">Last In, First Out</span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="bg-surface-container-highest rounded-xl border border-outline-variant p-4 flex items-center gap-4">
                  <Download className="text-primary-fixed w-5 h-5" />
                  <div>
                    <div className="text-sm font-bold text-primary">Push</div>
                    <div className="text-xs text-on-surface-variant">Add item to top</div>
                  </div>
                </div>
                <div className="bg-surface-container-highest rounded-xl border border-outline-variant p-4 flex items-center gap-4">
                  <Upload className="text-error w-5 h-5" />
                  <div>
                    <div className="text-sm font-bold text-primary">Pop</div>
                    <div className="text-xs text-on-surface-variant">Remove top item</div>
                  </div>
                </div>
                <div className="bg-surface-container-highest rounded-xl border border-outline-variant p-4 flex items-center gap-4">
                  <Eye className="text-secondary w-5 h-5" />
                  <div>
                    <div className="text-sm font-bold text-primary">Peek</div>
                    <div className="text-xs text-on-surface-variant">View top item</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <CodeBlock code={stackSnippets[0].code} filename={stackSnippets[0].filename} snippets={stackSnippets} />
            <div className="flex flex-col gap-6">
              <ComplexityCard title="Time Complexity" description="Push, Pop, and Peek operations." complexity="O(1)" />
              <ComplexityCard title="Space Complexity" description="For storing n elements." complexity="O(n)" isSpace />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
