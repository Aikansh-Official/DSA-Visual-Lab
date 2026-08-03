import React, { useState } from 'react';
import { ArrowLeft, Info, Plus, RefreshCw, Search as SearchIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import CodeBlock from './CodeBlock';
import ComplexityCard from './ComplexityCard';
import { treeSnippetSets } from '../codeSnippets';

const MIN_DEGREE = 2;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createNode = (id, keys = [], children = []) => ({ id, keys, children });
const cloneTree = (node) => node ? ({ ...node, keys: [...node.keys], children: node.children.map(cloneTree) }) : null;
const isLeaf = (node) => node.children.length === 0;

const hasValue = (node, value) => {
  if (!node) return false;
  let index = 0;
  while (index < node.keys.length && value > node.keys[index]) index += 1;
  if (node.keys[index] === value) return true;
  return isLeaf(node) ? false : hasValue(node.children[index], value);
};

const splitChild = (parent, index, makeId) => {
  const fullChild = parent.children[index];
  const median = fullChild.keys[MIN_DEGREE - 1];
  const rightChild = createNode(
    makeId(),
    fullChild.keys.slice(MIN_DEGREE),
    isLeaf(fullChild) ? [] : fullChild.children.slice(MIN_DEGREE),
  );

  fullChild.keys = fullChild.keys.slice(0, MIN_DEGREE - 1);
  if (!isLeaf(fullChild)) fullChild.children = fullChild.children.slice(0, MIN_DEGREE);
  parent.keys.splice(index, 0, median);
  parent.children.splice(index + 1, 0, rightChild);
};

const insertNonFull = (node, value, makeId) => {
  let index = node.keys.length - 1;
  if (isLeaf(node)) {
    node.keys.push(value);
    node.keys.sort((a, b) => a - b);
    return;
  }

  while (index >= 0 && value < node.keys[index]) index -= 1;
  index += 1;

  if (node.children[index].keys.length === 2 * MIN_DEGREE - 1) {
    splitChild(node, index, makeId);
    if (value > node.keys[index]) index += 1;
  }
  insertNonFull(node.children[index], value, makeId);
};

const insertValue = (root, value, makeId) => {
  if (!root) return createNode(makeId(), [value]);
  if (root.keys.length === 2 * MIN_DEGREE - 1) {
    const newRoot = createNode(makeId(), [], [root]);
    splitChild(newRoot, 0, makeId);
    insertNonFull(newRoot, value, makeId);
    return newRoot;
  }
  insertNonFull(root, value, makeId);
  return root;
};

const buildInitialTree = () => {
  let root = null;
  let sequence = 0;
  const makeId = () => `seed-b-${sequence++}`;
  [20, 40, 70, 5, 12, 30, 55, 80, 95].forEach((value) => {
    root = insertValue(root, value, makeId);
  });
  return root;
};

const traversalPath = (root, value) => {
  const path = [];
  let node = root;
  while (node) {
    path.push(node.id);
    let index = 0;
    while (index < node.keys.length && value > node.keys[index]) index += 1;
    if (node.keys[index] === value || isLeaf(node)) break;
    node = node.children[index];
  }
  return path;
};

const getLayout = (root) => {
  if (!root) return { nodes: [], edges: [] };
  const nodes = [];
  const edges = [];

  const measure = (node) => {
    node.layoutWidth = isLeaf(node) ? 1 : node.children.reduce((sum, child) => sum + measure(child), 0);
    return node.layoutWidth;
  };
  measure(root);

  const place = (node, left, width, y) => {
    const x = left + width / 2;
    nodes.push({ ...node, x, y });
    let childLeft = left;
    node.children.forEach((child) => {
      const childWidth = width * (child.layoutWidth / node.layoutWidth);
      const childX = childLeft + childWidth / 2;
      edges.push({ id: `${node.id}-${child.id}`, x1: x, y1: y + 22, x2: childX, y2: y + 72 });
      place(child, childLeft, childWidth, y + 72);
      childLeft += childWidth;
    });
  };

  place(root, 30, 740, 52);
  return { nodes, edges };
};

export default function BTreeView({ onBack }) {
  const [root, setRoot] = useState(buildInitialTree);
  const [insertVal, setInsertVal] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [lastAction, setLastAction] = useState('B-Tree initialized (minimum degree 2)');
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const { nodes, edges } = getLayout(root);

  const animatePath = async (path) => {
    for (const nodeId of path) {
      setHighlightedNodes([nodeId]);
      await sleep(380);
    }
  };

  const insertNode = async () => {
    const value = Number.parseInt(insertVal, 10);
    if (Number.isNaN(value) || isAnimating) return;
    if (hasValue(root, value)) {
      setLastAction(`${value} already exists. Try a different value.`);
      return;
    }

    setIsAnimating(true);
    setInsertVal('');
    setLastAction(`Finding the correct B-Tree node for ${value}...`);
    await animatePath(traversalPath(root, value));

    const nextRoot = cloneTree(root);
    let sequence = 0;
    const makeId = () => `b-${Date.now()}-${sequence++}`;
    const updatedRoot = insertValue(nextRoot, value, makeId);
    setRoot(updatedRoot);
    setLastAction(`Inserted ${value}. Full nodes split around their middle key.`);
    setHighlightedNodes([]);
    setIsAnimating(false);
  };

  const searchNode = async () => {
    const value = Number.parseInt(searchVal, 10);
    if (Number.isNaN(value) || isAnimating) return;
    setIsAnimating(true);
    setSearchVal('');
    setLastAction(`Searching for ${value}...`);
    await animatePath(traversalPath(root, value));
    setLastAction(hasValue(root, value) ? `Found ${value}!` : `${value} is not in the B-Tree.`);
    await sleep(650);
    setHighlightedNodes([]);
    setIsAnimating(false);
  };

  return (
    <div className="flex flex-col gap-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-surface text-on-surface-variant hover:text-primary rounded-lg border border-outline transition-colors" aria-label="Back to tree types">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-on-surface">B-Tree Visualizer</h2>
          <p className="text-sm text-on-surface-variant uppercase tracking-widest font-mono mt-1">2-3-4 Tree Sandbox</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-surface rounded-2xl border border-outline p-6 relative overflow-hidden flex flex-col min-h-[500px] shadow-sm">
            <div className="flex justify-between items-center mb-6 z-10 relative bg-surface p-2 rounded-lg border border-outline">
              <div className="text-xs font-mono text-on-surface px-3 py-1 bg-surface-container-low rounded border border-outline">Status: {lastAction}</div>
              <button onClick={() => { if (!isAnimating) { setRoot(null); setHighlightedNodes([]); setLastAction('B-Tree cleared'); } }} className="text-xs text-error font-bold flex items-center gap-1 hover:opacity-80">
                <RefreshCw className="w-3 h-3" /> Clear
              </button>
            </div>

            <div className="flex-grow w-full h-full relative overflow-x-auto overflow-y-hidden border border-outline/30 rounded-xl bg-surface-container-low/50">
              <div className="min-w-[800px] min-h-[400px] w-full h-full relative">
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {edges.map((edge) => <motion.line key={edge.id} {...edge} stroke="var(--color-outline-variant)" strokeWidth="2" />)}
                </svg>
                <AnimatePresence>
                  {nodes.map((node) => {
                    const active = highlightedNodes.includes(node.id);
                    const nodeWidth = Math.max(58, node.keys.length * 48);
                    return (
                      <motion.div key={node.id} layout initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1, left: node.x - nodeWidth / 2, top: node.y - 22 }} className={`absolute h-11 flex overflow-hidden rounded-lg border-2 shadow-sm ${active ? 'border-primary bg-primary-container' : 'border-outline bg-surface'}`}>
                        {node.keys.map((key, index) => <span key={key} className={`w-12 flex items-center justify-center text-sm font-bold text-on-surface ${index ? 'border-l border-outline' : ''}`}>{key}</span>)}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex gap-4 mt-6 z-10 relative">
              <div className="flex items-center gap-2 flex-1 p-2 bg-surface-container-low rounded-xl border border-outline">
                <input type="number" placeholder="Value" value={insertVal} onChange={(event) => setInsertVal(event.target.value)} className="w-20 bg-surface border border-outline rounded px-3 py-2 text-sm focus:border-primary outline-none text-on-surface" />
                <button onClick={insertNode} disabled={isAnimating} className="bg-primary text-white flex-1 py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-colors disabled:opacity-50"><Plus className="w-4 h-4" /> Insert</button>
              </div>
              <div className="flex items-center gap-2 flex-1 p-2 bg-surface-container-low rounded-xl border border-outline">
                <input type="number" placeholder="Target" value={searchVal} onChange={(event) => setSearchVal(event.target.value)} className="w-20 bg-surface border border-outline rounded px-3 py-2 text-sm focus:border-primary outline-none text-on-surface" />
                <button onClick={searchNode} disabled={isAnimating} className="bg-surface border border-outline text-on-surface flex-1 py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-colors disabled:opacity-50"><SearchIcon className="w-4 h-4" /> Search</button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface rounded-2xl border border-outline p-6">
            <div className="flex gap-2 items-center text-primary mb-4"><Info className="w-5 h-5" /><h3 className="font-bold text-lg text-on-surface">B-Tree Mechanics</h3></div>
            <p className="text-sm text-on-surface-variant leading-relaxed">Each node can store multiple sorted keys. When a node is full, its middle key moves up and the remaining keys split into two child nodes.</p>
          </div>
          <ComplexityCard title="Insertion and Search" description="The height stays small because each node holds several keys." complexity="O(log n)" />
          <CodeBlock filename={treeSnippetSets['B-Tree'][0].filename} code={treeSnippetSets['B-Tree'][0].code} snippets={treeSnippetSets['B-Tree']} />
        </div>
      </div>
    </div>
  );
}
