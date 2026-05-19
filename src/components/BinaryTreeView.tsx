import React, { useState } from 'react';
import { ArrowLeft, Plus, Search as SearchIcon, Info, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CodeBlock from './CodeBlock';
import ComplexityCard from './ComplexityCard';
import { treeSnippets } from '../codeSnippets';

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  id: string;
  color?: 'red' | 'black';
  balance?: number;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const cloneTree = (node: TreeNode | null): TreeNode | null => {
  if (!node) return null;
  return { ...node, left: cloneTree(node.left), right: cloneTree(node.right) };
};

const getLayout = (node: TreeNode | null, x = 400, y = 50, offset = 180) => {
  const nodes: (TreeNode & { x: number; y: number })[] = [];
  const edges: { id: string; x1: number; y1: number; x2: number; y2: number }[] = [];

  const traverse = (n: TreeNode | null, cx: number, cy: number, currentOffset: number) => {
    if (!n) return;
    nodes.push({ ...n, x: cx, y: cy });
    if (n.left) {
      const nx = cx - currentOffset;
      const ny = cy + 80;
      edges.push({ id: `${n.id}-${n.left.id}`, x1: cx, y1: cy, x2: nx, y2: ny });
      traverse(n.left, nx, ny, currentOffset / 1.8);
    }
    if (n.right) {
      const nx = cx + currentOffset;
      const ny = cy + 80;
      edges.push({ id: `${n.id}-${n.right.id}`, x1: cx, y1: cy, x2: nx, y2: ny });
      traverse(n.right, nx, ny, currentOffset / 1.8);
    }
  };

  traverse(node, x, y, offset);
  return { nodes, edges };
};

export default function BinaryTreeView({ type, onBack }: { type: string; onBack: () => void }) {
  const [root, setRoot] = useState<TreeNode | null>(() => {
    return {
      val: 50, id: 'n50', color: 'black', balance: 0,
      left: { 
        val: 25, id: 'n25', color: 'red', balance: 0,
        left: { val: 10, id: 'n10', color: 'black', balance: 0, left: null, right: null }, 
        right: { val: 35, id: 'n35', color: 'black', balance: 0, left: null, right: null } 
      },
      right: { 
        val: 75, id: 'n75', color: 'red', balance: 0,
        left: { val: 60, id: 'n60', color: 'black', balance: 0, left: null, right: null }, 
        right: { val: 90, id: 'n90', color: 'black', balance: 0, left: null, right: null } 
      }
    };
  });

  const [insertVal, setInsertVal] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [lastAction, setLastAction] = useState('Tree initialized');
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const { nodes, edges } = getLayout(root);

  const insertNode = async () => {
    const val = parseInt(insertVal);
    if (isNaN(val) || isAnimating) return;
    setIsAnimating(true);
    setInsertVal('');
    setLastAction(`Inserting ${val}...`);

    if (!root) {
      setRoot({ 
        val, id: `n${val}-${Date.now()}`, left: null, right: null, 
        color: type === 'Red-Black Tree' ? 'black' : undefined, balance: 0 
      });
      setLastAction(`Inserted ${val} as root`);
      setIsAnimating(false);
      return;
    }

    let currentTree = cloneTree(root);
    let curr = currentTree;
    const highlights: string[] = [];

    while (curr) {
      highlights.push(curr.id);
      setHighlightedNodes([...highlights]);
      await sleep(500);

      if (val < curr.val) {
        if (!curr.left) {
          curr.left = { 
            val, id: `n${val}-${Date.now()}`, left: null, right: null, 
            color: type === 'Red-Black Tree' ? 'red' : undefined, balance: 0 
          };
          highlights.push(curr.left.id);
          setHighlightedNodes([...highlights]);
          await sleep(500);
          break;
        }
        curr = curr.left;
      } else if (val > curr.val) {
        if (!curr.right) {
          curr.right = { 
            val, id: `n${val}-${Date.now()}`, left: null, right: null, 
            color: type === 'Red-Black Tree' ? 'red' : undefined, balance: 0 
          };
          highlights.push(curr.right.id);
          setHighlightedNodes([...highlights]);
          await sleep(500);
          break;
        }
        curr = curr.right;
      } else {
        setLastAction(`${val} already exists!`);
        break;
      }
    }

    setRoot(currentTree);
    setLastAction(`Inserted ${val}.`);
    setHighlightedNodes([]);
    setIsAnimating(false);
  };

  const searchNode = async () => {
    const val = parseInt(searchVal);
    if (isNaN(val) || isAnimating) return;
    setIsAnimating(true);
    setSearchVal('');
    setLastAction(`Searching for ${val}...`);

    let curr = root;
    const highlights: string[] = [];

    while (curr) {
      highlights.push(curr.id);
      setHighlightedNodes([...highlights]);
      await sleep(600);

      if (val === curr.val) {
        setLastAction(`Found ${val}!`);
        setIsAnimating(false);
        setTimeout(() => setHighlightedNodes([]), 2000);
        return;
      } else if (val < curr.val) {
        curr = curr.left;
      } else {
        curr = curr.right;
      }
    }

    setLastAction(`${val} not found.`);
    setTimeout(() => setHighlightedNodes([]), 2000);
    setIsAnimating(false);
  };

  return (
    <div className="flex flex-col gap-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-surface text-on-surface-variant hover:text-primary rounded-lg border border-outline transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-on-surface">{type} Visualizer</h2>
          <p className="text-sm text-on-surface-variant uppercase tracking-widest font-mono mt-1">Interactive Sandbox</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-surface rounded-2xl border border-outline p-6 relative overflow-hidden flex flex-col min-h-[500px] shadow-sm">
            <div className="flex justify-between items-center mb-6 z-10 relative bg-surface p-2 rounded-lg border border-outline">
              <div className="text-xs font-mono text-on-surface px-3 py-1 bg-surface-container-low rounded border border-outline">
                Status: {lastAction}
              </div>
              <button onClick={() => !isAnimating && setRoot(null)} className="text-xs text-error font-bold flex items-center gap-1 hover:opacity-80">
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
                    const isHighlighted = highlightedNodes.includes(node.id);
                    const isRedBlack = type === 'Red-Black Tree';
                    const isRed = isRedBlack && node.color === 'red';
                    
                    let bg = isHighlighted ? 'bg-primary-container' : (isRedBlack ? (isRed ? 'bg-error' : 'bg-surface-container-highest') : 'bg-surface');
                    let text = isHighlighted ? 'text-on-primary-container' : ((isRedBlack) ? 'text-white' : 'text-on-surface');
                    let border = isHighlighted ? 'border-primary' : (isRedBlack ? (isRed ? 'border-error' : 'border-surface-container-highest') : 'border-outline');

                    return (
                      <motion.div
                        key={node.id}
                        layout
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, left: node.x - 24, top: node.y - 24 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className={`absolute w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border-2 shadow-sm transition-colors duration-300 ${bg} ${text} ${border}`}
                      >
                        {node.val}
                        {type === 'AVL Tree' && (
                          <div className="absolute -top-2 -right-2 bg-surface text-on-surface-variant text-[9px] w-5 h-5 flex items-center justify-center rounded-full border border-outline font-mono">
                            {node.balance || 0}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6 z-10 relative">
              <div className="flex items-center gap-2 flex-1 p-2 bg-surface-container-low rounded-xl border border-outline">
                <input 
                  type="number" 
                  placeholder="Value" 
                  value={insertVal} 
                  onChange={(e) => setInsertVal(e.target.value)}
                  className="w-20 bg-surface border border-outline rounded px-3 py-2 text-sm focus:border-primary outline-none text-on-surface"
                />
                <button 
                  onClick={insertNode} disabled={isAnimating}
                  className="bg-primary text-white flex-1 py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" /> Insert
                </button>
              </div>
              <div className="flex items-center gap-2 flex-1 p-2 bg-surface-container-low rounded-xl border border-outline">
                <input 
                  type="number" 
                  placeholder="Target" 
                  value={searchVal} 
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-20 bg-surface border border-outline rounded px-3 py-2 text-sm focus:border-primary outline-none text-on-surface"
                />
                <button 
                  onClick={searchNode} disabled={isAnimating}
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
               <h3 className="font-bold text-lg text-on-surface">Tree Mechanics</h3>
             </div>
             <p className="text-sm text-on-surface-variant leading-relaxed">
               {type === 'Binary Search Tree' && "A node-based binary tree data structure which has the following properties: The left subtree of a node contains only nodes with keys lesser than the node's key. The right subtree contains nodes with keys greater."}
               {type === 'AVL Tree' && "A self-balancing BST where the difference between heights of left and right subtrees cannot be more than one for all nodes."}
               {type === 'Red-Black Tree' && "A self-balancing BST where each node has an extra bit representing color (Red or Black)."}
             </p>
           </div>
           
           <ComplexityCard 
             title="Average Time" 
             description="Time complexity for search/insert depending on balance." 
             complexity={type.includes('Search') ? "O(log n) expected" : "O(log n) strict"} 
           />
           <CodeBlock filename={treeSnippets[0].filename} code={treeSnippets[0].code} snippets={treeSnippets} />
        </div>
      </div>
    </div>
  );
}
