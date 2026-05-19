import React, { useState } from 'react';
import { ArrowLeft, Plus, Search as SearchIcon, Info, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CodeBlock from './CodeBlock';
import ComplexityCard from './ComplexityCard';
import { trieSnippets } from '../codeSnippets';

interface TrieNodeData {
  char: string;
  id: string;
  isWord: boolean;
  children: Record<string, TrieNodeData>;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function computeLayout(root: TrieNodeData) {
  function calcW(n: TrieNodeData & { w?: number }): number {
    const keys = Object.keys(n.children);
    if (keys.length === 0) { n.w = 1; return 1; }
    let w = 0;
    for (let k of keys) w += calcW(n.children[k]);
    n.w = w;
    return w;
  }
  calcW(root as TrieNodeData & { w?: number });

  const nodes: any[] = [];
  const edges: any[] = [];
  
  function pos(n: any, x: number, wArea: number, y: number) {
    nodes.push({ ...n, x: x + wArea / 2, y });
    let currX = x;
    for (let k of Object.keys(n.children)) {
      const c = n.children[k];
      const cArea = (c.w / n.w) * wArea;
      edges.push({ id: `${n.id}-${c.id}`, x1: x + wArea / 2, y1: y, x2: currX + cArea / 2, y2: y + 80 });
      pos(c, currX, cArea, y + 80);
      currX += cArea;
    }
  }
  
  pos(root, 0, 800, 50);
  return { nodes, edges };
}

export default function TrieView({ onBack }: { onBack: () => void }) {
  const [root, setRoot] = useState<TrieNodeData>({
    char: '*', id: 'root', isWord: false,
    children: {
      'c': { char: 'c', id: 'c', isWord: false, children: {
        'a': { char: 'a', id: 'ca', isWord: false, children: {
          't': { char: 't', id: 'cat', isWord: true, children: {} }
        }}
      }},
      'd': { char: 'd', id: 'd', isWord: false, children: {
        'o': { char: 'o', id: 'do', isWord: false, children: {
          'g': { char: 'g', id: 'dog', isWord: true, children: {} }
        }}
      }}
    }
  });

  const [inputVal, setInputVal] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [lastAction, setLastAction] = useState('Trie initialized with "cat" and "dog"');
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const { nodes, edges } = computeLayout(root);

  const insertWord = async () => {
    const word = inputVal.toLowerCase().trim();
    if (!word || isAnimating) return;
    setIsAnimating(true);
    setInputVal('');
    setLastAction(`Inserting "${word}"...`);

    let newRoot = JSON.parse(JSON.stringify(root));
    let curr = newRoot;
    const highlights: string[] = ['root'];

    setHighlightedNodes([...highlights]);
    await sleep(400);

    let currentId = 'root';
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!curr.children[char]) {
        curr.children[char] = { char, id: `${currentId}-${char}`, isWord: false, children: {} };
      }
      curr = curr.children[char];
      currentId = curr.id;
      
      highlights.push(currentId);
      setRoot(newRoot); 
      setHighlightedNodes([...highlights]);
      await sleep(400);
    }
    
    curr.isWord = true;
    setRoot(newRoot);
    setLastAction(`Inserted "${word}".`);
    setTimeout(() => setHighlightedNodes([]), 1000);
    setIsAnimating(false);
  };

  const searchWord = async () => {
    const word = searchVal.toLowerCase().trim();
    if (!word || isAnimating) return;
    setIsAnimating(true);
    setSearchVal('');
    setLastAction(`Searching for "${word}"...`);

    let curr = root;
    const highlights: string[] = ['root'];
    setHighlightedNodes([...highlights]);
    await sleep(400);

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!curr.children[char]) {
        setLastAction(`"${word}" not found.`);
        setIsAnimating(false);
        setTimeout(() => setHighlightedNodes([]), 1500);
        return;
      }
      curr = curr.children[char];
      highlights.push(curr.id);
      setHighlightedNodes([...highlights]);
      await sleep(400);
    }

    if (curr.isWord) {
      setLastAction(`Found exact word "${word}"!`);
    } else {
      setLastAction(`Found prefix "${word}", but not a complete word.`);
    }
    
    setIsAnimating(false);
    setTimeout(() => setHighlightedNodes([]), 2000);
  };

  return (
    <div className="flex flex-col gap-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-surface text-on-surface-variant hover:text-primary rounded-lg border border-outline transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-on-surface">Trie Visualizer</h2>
          <p className="text-sm text-on-surface-variant uppercase tracking-widest font-mono mt-1">Prefix Tree Structure</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-surface rounded-2xl border border-outline p-6 relative overflow-hidden flex flex-col min-h-[500px] shadow-sm">
            <div className="flex justify-between items-center mb-6 z-10 relative bg-surface p-2 rounded-lg border border-outline">
              <div className="text-xs font-mono text-on-surface px-3 py-1 bg-surface-container-low rounded border border-outline">
                Status: {lastAction}
              </div>
              <button 
                onClick={() => !isAnimating && setRoot({ char: '*', id: 'root', isWord: false, children: {} })} 
                className="text-xs text-error font-bold flex items-center gap-1 hover:opacity-80"
              >
                <RefreshCw className="w-3 h-3" /> Clear
              </button>
            </div>

            <div className="flex-grow w-full h-full relative overflow-x-auto overflow-y-hidden border border-outline/30 rounded-xl bg-surface-container-low/50">
              <div className="min-w-[800px] min-h-[400px] w-full h-full relative">
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {edges.map(edge => (
                    <motion.line
                      key={edge.id}
                      x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2}
                      stroke="var(--color-outline-variant)"
                      strokeWidth="2"
                    />
                  ))}
                </svg>

                <AnimatePresence>
                  {nodes.map(node => {
                    const isHigh = highlightedNodes.includes(node.id);
                    return (
                      <motion.div
                        key={node.id}
                        layout
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, left: node.x - 20, top: node.y - 20 }}
                        className={`absolute w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 shadow-sm transition-colors duration-300 ${
                          isHigh 
                            ? 'bg-primary-container text-on-primary-container border-primary' 
                            : (node.isWord ? 'bg-surface-container text-primary border-primary border-dashed' : 'bg-surface text-on-surface border-outline')
                        }`}
                      >
                        {node.char}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6 z-10 relative">
              <div className="flex items-center gap-2 flex-1 p-2 bg-surface-container-low rounded-xl border border-outline">
                <input 
                  type="text" 
                  placeholder="Word" 
                  value={inputVal} 
                  onChange={(e) => setInputVal(e.target.value)}
                  className="w-24 bg-surface border border-outline rounded px-3 py-2 text-sm focus:border-primary outline-none text-on-surface"
                />
                <button 
                  onClick={insertWord} disabled={isAnimating}
                  className="bg-primary text-white flex-1 py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" /> Insert
                </button>
              </div>
              <div className="flex items-center gap-2 flex-1 p-2 bg-surface-container-low rounded-xl border border-outline">
                <input 
                  type="text" 
                  placeholder="Word" 
                  value={searchVal} 
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-24 bg-surface border border-outline rounded px-3 py-2 text-sm focus:border-primary outline-none text-on-surface"
                />
                <button 
                  onClick={searchWord} disabled={isAnimating}
                  className="bg-surface border border-outline text-on-surface flex-1 py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <SearchIcon className="w-4 h-4" /> Search
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="bg-surface rounded-2xl border border-outline p-6">
             <div className="flex gap-2 items-center text-primary mb-4">
               <Info className="w-5 h-5" />
               <h3 className="font-bold text-lg text-on-surface">Trie Mechanics</h3>
             </div>
             <p className="text-sm text-on-surface-variant leading-relaxed">
               A Trie (Prefix Tree) is an ordered tree data structure used to store a dynamic set or associative array where the keys are usually strings. Unlike a binary search tree, no node in the tree stores the key associated with that node; instead, its position in the tree defines the key with which it is associated.
             </p>
           </div>
           
           <ComplexityCard 
             title="Time Complexity" 
             description="O(m) where m is length of the string." 
             complexity="O(m)" 
           />
           <CodeBlock filename={trieSnippets[0].filename} code={trieSnippets[0].code} snippets={trieSnippets} />
        </div>
      </div>
    </div>
  );
}
