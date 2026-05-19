import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, SlidersHorizontal, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CodeBlock from './CodeBlock';
import ComplexityCard from './ComplexityCard';
import { ArrayHeroArt } from './ConceptArt';
import { arraySnippets } from '../codeSnippets';

export default function ArrayView() {
  const [elements, setElements] = useState<number[]>([10, 25, 42, 67, 88]);
  const [lastAction, setLastAction] = useState<string>('Initialization');
  const [highlightIdx, setHighlightIdx] = useState<number | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [insertIdx, setInsertIdx] = useState<string>('0');
  const [insertVal, setInsertVal] = useState<string>('');

  const insertAt = () => {
    const idx = parseInt(insertIdx);
    const val = parseInt(insertVal) || Math.floor(Math.random() * 100);
    
    if (isNaN(idx) || idx < 0 || idx > elements.length) {
      setLastAction('Invalid index for insertion');
      return;
    }
    if (elements.length >= 8) {
      setLastAction('Array at maximum capacity for demo');
      return;
    }

    const newArr = [...elements];
    newArr.splice(idx, 0, val);
    setElements(newArr);
    setLastAction(`Inserted ${val} at index ${idx}`);
    setInsertVal('');
  };

  const deleteAt = (idx: number) => {
    const removed = elements[idx];
    const newArr = [...elements];
    newArr.splice(idx, 1);
    setElements(newArr);
    setLastAction(`Deleted ${removed} from index ${idx}`);
  };

  const linearSearch = async () => {
    const val = parseInt(searchValue);
    if (isNaN(val)) return;
    
    setSearching(true);
    setLastAction(`Searching for ${val}...`);
    
    for (let i = 0; i < elements.length; i++) {
      setHighlightIdx(i);
      await new Promise(r => setTimeout(r, 600));
      if (elements[i] === val) {
        setLastAction(`Found ${val} at index ${i}!`);
        setSearching(false);
        return;
      }
    }
    
    setHighlightIdx(null);
    setLastAction(`${val} not found in array.`);
    setSearching(false);
  };

  return (
    <div className="flex flex-col gap-16 py-8">
      {/* Hero */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <span className="w-fit px-3 py-1 bg-primary-container border border-primary/20 rounded-full text-xs font-mono text-primary-fixed font-bold uppercase tracking-wider">
            Static/Dynamic Structure
          </span>
          <h2 className="text-5xl font-bold text-on-surface tracking-tight">Array Data Structure</h2>
          <p className="text-lg text-on-surface-variant leading-relaxed">
            The most fundamental data structure. A collection of elements identified by index or key, stored in contiguous memory locations for fast access.
          </p>
        </div>
        <div className="relative rounded-2xl overflow-hidden border border-outline shadow-lg aspect-video bg-surface-container-low">
           <ArrayHeroArt />
        </div>
      </section>

      {/* Lab */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-surface rounded-2xl border border-outline p-8 relative overflow-hidden group min-h-[400px] flex flex-col shadow-sm">
            <div className="mb-12 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <SlidersHorizontal className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-on-surface">Array Memory Visualizer</h3>
                  <p className="text-xs text-on-surface-variant font-mono uppercase tracking-widest mt-1">Contiguous Blocks [0...N]</p>
                </div>
              </div>
              <div className="text-xs font-mono text-on-surface-variant bg-surface-dim px-4 py-2 rounded-lg border border-outline">
                Status: {lastAction}
              </div>
            </div>

            <div className="flex-grow flex items-center justify-center py-12 relative">
              <div className="flex gap-1 p-2 bg-surface-container-low rounded-xl border border-outline shadow-inner">
                <AnimatePresence mode="popLayout" initial={false}>
                  {elements.map((val, idx) => (
                    <motion.div
                      key={`${val}-${idx}`}
                      layout
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1,
                        backgroundColor: highlightIdx === idx ? 'var(--color-primary-container)' : 'var(--color-surface)',
                        borderColor: highlightIdx === idx ? 'var(--color-primary)' : 'var(--color-outline)'
                      }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className={`relative w-20 h-24 border-2 flex flex-col rounded-lg transition-colors duration-300 shadow-sm`}
                    >
                      <div className="flex-1 flex items-center justify-center text-xl font-bold text-on-surface">
                        {val}
                      </div>
                      <div className="h-8 border-t border-outline/50 flex items-center justify-center bg-surface-dim rounded-b-lg">
                        <span className="text-[10px] font-mono font-bold text-on-surface-variant">IDX {idx}</span>
                      </div>
                      
                      <button 
                        onClick={() => deleteAt(idx)}
                        disabled={searching}
                        className="absolute -top-2 -right-2 p-1 bg-error text-on-primary rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity hover:scale-110 shadow-md"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {elements.length < 8 && !searching && (
                   <button 
                    onClick={() => { setInsertIdx(elements.length.toString()); insertAt(); }}
                    className="w-20 h-24 border-2 border-dashed border-outline/30 rounded-lg flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all text-on-surface-variant/30 hover:text-primary transition-all group"
                   >
                     <Plus className="w-6 h-6 group-hover:scale-125 transition-transform" />
                   </button>
                )}
              </div>
              
              {/* Search Pointer */}
              {searching && highlightIdx !== null && (
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0, x: (highlightIdx * 84) - ((elements.length - 1) * 42) }}
                  className="absolute bottom-4 flex flex-col items-center gap-2"
                >
                  <motion.div 
                    animate={{ y: [0, -10, 0] }} 
                    transition={{ repeat: Infinity, duration: 0.6 }}
                  >
                    <ArrowDown className="text-primary w-6 h-6 rotate-180" />
                  </motion.div>
                  <span className="text-[10px] font-mono font-bold text-primary uppercase bg-primary/10 px-2 py-1 rounded">Scanning</span>
                </motion.div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="flex items-center gap-3 p-4 bg-surface-dim rounded-xl border border-outline">
                <div className="flex-1 flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Val"
                    value={insertVal}
                    onChange={(e) => setInsertVal(e.target.value)}
                    className="w-16 bg-surface border border-outline rounded px-2 py-1 text-sm focus:border-primary outline-none"
                  />
                  <input 
                    type="number" 
                    placeholder="Idx"
                    value={insertIdx}
                    onChange={(e) => setInsertIdx(e.target.value)}
                    className="w-16 bg-surface border border-outline rounded px-2 py-1 text-sm focus:border-primary outline-none"
                  />
                </div>
                <button 
                  onClick={insertAt}
                  disabled={searching}
                  className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" /> Insert
                </button>
              </div>

              <div className="flex items-center gap-2 p-4 bg-surface-dim rounded-xl border border-outline font-mono">
                <input 
                  type="number" 
                  placeholder="Target Value"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="flex-1 bg-surface border border-outline rounded px-3 py-2 text-sm focus:border-primary outline-none"
                />
                <button 
                  onClick={linearSearch}
                  disabled={searching}
                  className="bg-surface-container-highest border border-outline text-on-surface px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:border-primary transition-colors"
                >
                  <Search className="w-4 h-4" /> Search
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface rounded-2xl border border-outline p-6 flex flex-col gap-4">
             <div className="flex items-center gap-3 text-primary">
               <Info className="w-5 h-5" />
               <h3 className="font-bold">Key Characteristics</h3>
             </div>
             <ul className="space-y-3">
               {[
                 { label: 'Contiguous Memory', desc: 'Elements are stored next to each other.' },
                 { label: 'Zero-Indexed', desc: 'Access starts at index [0].' },
                 { label: 'Fixed/Dynamic Size', desc: 'Can be resized in some high-level languages.' }
               ].map((item, i) => (
                 <li key={i} className="flex flex-col gap-1 p-3 bg-surface-container-low rounded-lg border border-outline/50 hover:border-primary/30 transition-colors">
                   <span className="text-xs font-bold text-on-surface">{item.label}</span>
                   <span className="text-[11px] text-on-surface-variant font-medium">{item.desc}</span>
                 </li>
               ))}
             </ul>
          </div>
          
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-mono text-primary font-bold uppercase tracking-widest mb-2">Primary Advantage</span>
            <span className="text-2xl font-bold text-on-surface tracking-tight">O(1) Random Access</span>
            <p className="text-[11px] text-on-surface-variant mt-3 max-w-[200px]">Knowing the index allows for instantaneous data retrieval.</p>
          </div>
        </div>

        <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch pt-8">
           <CodeBlock code={arraySnippets[0].code} filename={arraySnippets[0].filename} snippets={arraySnippets} />
           <div className="flex flex-col gap-6 justify-center">
              <ComplexityCard title="Access Time" description="Retrieving element by index." complexity="O(1)" />
              <ComplexityCard title="Insertion/Deletion" description="Average case requires shifting elements." complexity="O(n)" isSpace />
           </div>
        </div>
      </section>
    </div>
  );
}

const ArrowDown = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 5v14M19 12l-7 7-7-7"/>
  </svg>
);
