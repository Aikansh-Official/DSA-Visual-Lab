import React, { useState } from 'react';
import { LogIn, LogOut, Search, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CodeBlock from './CodeBlock';
import ComplexityCard from './ComplexityCard';
import { QueueHeroArt } from './ConceptArt';
import { queueSnippets } from '../codeSnippets';

export default function QueueView() {
  const [items, setItems] = useState<string[]>(['Person 10', 'Person 20', 'Person 30']);
  const [lastAction, setLastAction] = useState<string>('Initialization');

  const enqueue = () => {
    if (items.length >= 6) {
      setLastAction('Queue is full! Wait for someone to leave.');
      return;
    }
    const newVal = (Math.floor(Math.random() * 9) + 4) * 10;
    const newItem = `Person ${newVal}`;
    setItems(prev => [...prev, newItem]);
    setLastAction(`Enqueued ${newItem}`);
  };

  const dequeue = () => {
    if (items.length === 0) {
      setLastAction('Queue is empty! No one to serve.');
      return;
    }
    const removedItem = items[0];
    setItems(prev => prev.slice(1));
    setLastAction(`Dequeued ${removedItem}`);
  };

  const peek = () => {
    if (items.length === 0) {
      setLastAction('Queue is empty. No one at the front.');
      return;
    }
    setLastAction(`Peeked front: ${items[0]}`);
  };

  return (
    <div className="flex flex-col gap-16 py-8">
      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <span className="w-fit px-3 py-1 bg-surface-container-high border border-outline-variant rounded-full text-xs font-mono text-primary-fixed">
            Linear Data Structure
          </span>
          <h2 className="text-5xl font-bold text-primary tracking-tight">Queue Data Structure</h2>
          <p className="text-lg text-on-surface-variant leading-relaxed">
            Understand First In, First Out (FIFO) using a line of people at a ticket counter. A Queue operates exactly like a real-world line: the first person to arrive is the first one served.
          </p>
        </div>
        <div className="relative rounded-2xl overflow-hidden border border-outline-variant shadow-[0_0_30px_rgba(56,222,187,0.1)] aspect-video bg-surface-container">
          <QueueHeroArt />
        </div>
      </section>

      {/* Interactive Lab */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Visualizer */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-surface-container rounded-2xl border border-outline-variant p-8 relative overflow-hidden group min-h-[450px] flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-fixed/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <div className="mb-12 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-primary-fixed/10 rounded-lg">
                  <Search className="text-primary-fixed w-5 h-5" />
                </span>
                <h3 className="text-2xl font-bold text-primary">Queue Visualizer</h3>
              </div>
              <div className="text-xs font-mono text-on-surface-variant bg-surface-dim px-4 py-2 rounded-lg border border-outline-variant">
                Status: {lastAction}
              </div>
            </div>

            <div className="flex-grow flex items-center justify-center py-12">
              <div className="w-full flex items-center gap-4 px-8 py-10 bg-surface rounded-3xl border border-outline-variant/50 relative overflow-x-auto scrollbar-hide min-h-[140px]">
                {/* Labels */}
                {items.length > 0 && (
                  <>
                    <div className="absolute left-10 -top-8 flex flex-col items-center">
                      <span className="text-[10px] font-mono font-bold text-error uppercase tracking-widest">Front</span>
                      <ArrowDown className="w-4 h-4 text-error animate-bounce" />
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 right-[calc(theme(spacing.8)+theme(spacing.4)*(items-count-1))] transition-all duration-500" style={{ right: `calc(32px + (64px + 16px) * 0)` }}>
                      {/* Rear pointer is dynamic */}
                    </div>
                  </>
                )}

                <AnimatePresence initial={false}>
                  {items.map((item, idx) => (
                    <motion.div
                      key={item + idx}
                      initial={{ x: 100, opacity: 0, scale: 0.8 }}
                      animate={{ x: 0, opacity: 1, scale: 1 }}
                      exit={{ x: -100, opacity: 0, scale: 0.8 }}
                      layout
                      className={`min-w-[80px] h-20 flex items-center justify-center rounded-xl border font-mono text-xs transition-all duration-300 relative group/item ${
                        idx === 0 
                          ? 'bg-surface-bright border-primary-fixed text-primary-fixed neon-glow' 
                          : idx === items.length - 1
                          ? 'bg-primary-fixed/10 border-primary-fixed/50 text-primary-fixed'
                          : 'bg-surface-container-highest border-outline-variant text-on-surface'
                      }`}
                    >
                      {item.split(' ')[1]}
                      {idx === items.length - 1 && (
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                          <motion.div initial={{ y: 10 }} animate={{ y: 0 }} transition={{ repeat: Infinity, duration: 1, repeatType: 'reverse' }}>
                             <ArrowDown className="w-4 h-4 text-primary-fixed rotate-180" />
                          </motion.div>
                          <span className="text-[10px] font-mono font-bold text-primary-fixed uppercase tracking-widest">Rear</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {items.length === 0 && (
                  <div className="w-full text-center text-on-surface-variant font-mono text-sm opacity-50 uppercase tracking-widest">
                    Queue is empty
                  </div>
                )}

                {/* Direction flow indicator */}
                {items.length > 0 && (
                  <div className="ml-auto flex items-center gap-2 opacity-30">
                    <span className="text-[10px] font-mono uppercase font-bold text-on-surface-variant">Flow</span>
                    <ArrowDown className="w-4 h-4 -rotate-90 text-on-surface-variant" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
              <button 
                onClick={enqueue}
                className="bg-primary-fixed/10 border border-primary-fixed text-primary-fixed px-8 py-3 rounded-lg flex items-center gap-3 hover:bg-primary-fixed hover:text-on-primary-fixed hover:neon-glow transition-all font-mono text-sm font-bold"
              >
                <LogIn className="w-4 h-4" /> Enqueue Person
              </button>
              <button 
                onClick={dequeue}
                className="bg-surface-dim border border-outline-variant text-on-surface px-8 py-3 rounded-lg flex items-center gap-3 hover:border-error hover:text-error transition-all font-mono text-sm font-bold"
              >
                <LogOut className="w-4 h-4" /> Dequeue Person
              </button>
              <button 
                onClick={peek}
                className="bg-surface-dim border border-outline-variant text-on-surface px-8 py-3 rounded-lg flex items-center gap-3 hover:border-primary hover:text-primary transition-all font-mono text-sm font-bold"
              >
                <Search className="w-4 h-4" /> Peek Front
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container rounded-2xl border border-outline-variant p-6">
            <h3 className="text-xl font-bold text-primary mb-4">Core Idea</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
              A queue is a linear collection of elements that are maintained in a sequence and can be modified by the addition of entities at one end and the removal of entities from the other end.
            </p>
            <div className="bg-primary-fixed/10 border border-primary-fixed/50 rounded-xl p-6 flex flex-col items-center justify-center text-center neon-glow">
              <span className="text-3xl font-bold text-primary-fixed tracking-tighter">FIFO</span>
              <span className="text-[10px] font-mono text-primary mt-1 uppercase tracking-widest opacity-80">First In, First Out</span>
              <div className="mt-4 text-[10px] text-on-surface-variant leading-tight">
                The element added first is the one to be removed first.
              </div>
            </div>
          </div>

          <div className="bg-surface-container rounded-2xl border border-outline-variant p-6 flex-grow">
            <h3 className="text-xl font-bold text-primary mb-4">Operations</h3>
            <div className="flex flex-col gap-3">
               <div className="bg-surface-dim border border-outline-variant p-3 rounded-lg flex items-center gap-3">
                  <span className="p-1.5 bg-primary-fixed/10 rounded-md">
                    <LogIn className="w-4 h-4 text-primary-fixed" />
                  </span>
                  <div>
                    <div className="text-xs font-bold text-primary font-mono">Enqueue(item)</div>
                    <div className="text-[10px] text-on-surface-variant">Adds to the rear</div>
                  </div>
               </div>
               <div className="bg-surface-dim border border-outline-variant p-3 rounded-lg flex items-center gap-3">
                  <span className="p-1.5 bg-error/10 rounded-md">
                    <LogOut className="w-4 h-4 text-error" />
                  </span>
                  <div>
                    <div className="text-xs font-bold text-primary font-mono">Dequeue()</div>
                    <div className="text-[10px] text-on-surface-variant">Removes from front</div>
                  </div>
               </div>
               <div className="bg-surface-dim border border-outline-variant p-3 rounded-lg flex items-center gap-3">
                  <span className="p-1.5 bg-secondary/10 rounded-md">
                    <Search className="w-4 h-4 text-secondary" />
                  </span>
                  <div>
                    <div className="text-xs font-bold text-primary font-mono">Front / Peek()</div>
                    <div className="text-[10px] text-on-surface-variant">Views the front item</div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Code & Complexity */}
        <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch pt-8">
           <CodeBlock code={queueSnippets[0].code} filename={queueSnippets[0].filename} snippets={queueSnippets} />
           <div className="flex flex-col gap-6 justify-center">
              <ComplexityCard title="Time Complexity" description="Enqueue and Dequeue operations." complexity="O(1)" />
              <ComplexityCard title="Space Complexity" description="For storing n elements." complexity="O(n)" isSpace />
           </div>
        </div>
      </section>
    </div>
  );
}
