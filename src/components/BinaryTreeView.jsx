import React, { useState } from 'react';
import { ArrowLeft, Info, Plus, RefreshCw, Search as SearchIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import CodeBlock from './CodeBlock';
import ComplexityCard from './ComplexityCard';
import { treeSnippetSets } from '../codeSnippets';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createNode = (val, id, color = 'black') => ({
  val,
  id,
  color,
  left: null,
  right: null,
  height: 1,
  balance: 0,
});

const cloneTree = (node) => {
  if (!node) return null;
  return { ...node, left: cloneTree(node.left), right: cloneTree(node.right) };
};

const height = (node) => node?.height || 0;

const refreshAvlMetadata = (node) => {
  if (!node) return node;
  node.height = Math.max(height(node.left), height(node.right)) + 1;
  node.balance = height(node.left) - height(node.right);
  return node;
};

const rotateLeft = (node) => {
  const pivot = node.right;
  node.right = pivot.left;
  pivot.left = node;
  refreshAvlMetadata(node);
  return refreshAvlMetadata(pivot);
};

const rotateRight = (node) => {
  const pivot = node.left;
  node.left = pivot.right;
  pivot.right = node;
  refreshAvlMetadata(node);
  return refreshAvlMetadata(pivot);
};

const isRed = (node) => Boolean(node && node.color === 'red');

const rotateLeftRedBlack = (node) => {
  const pivot = node.right;
  node.right = pivot.left;
  pivot.left = node;
  pivot.color = node.color;
  node.color = 'red';
  refreshAvlMetadata(node);
  return refreshAvlMetadata(pivot);
};

const rotateRightRedBlack = (node) => {
  const pivot = node.left;
  node.left = pivot.right;
  pivot.right = node;
  pivot.color = node.color;
  node.color = 'red';
  refreshAvlMetadata(node);
  return refreshAvlMetadata(pivot);
};

const flipColors = (node) => {
  node.color = node.color === 'red' ? 'black' : 'red';
  if (node.left) node.left.color = node.left.color === 'red' ? 'black' : 'red';
  if (node.right) node.right.color = node.right.color === 'red' ? 'black' : 'red';
};

const insertLevelOrder = (root, value, id) => {
  if (!root) return createNode(value, id);
  const queue = [root];

  while (queue.length) {
    const node = queue.shift();
    if (!node.left) {
      node.left = createNode(value, id);
      return root;
    }
    if (!node.right) {
      node.right = createNode(value, id);
      return root;
    }
    queue.push(node.left, node.right);
  }
  return root;
};

const insertBst = (node, value, id) => {
  if (!node) return createNode(value, id);
  if (value < node.val) node.left = insertBst(node.left, value, id);
  else if (value > node.val) node.right = insertBst(node.right, value, id);
  return node;
};

const insertAvl = (node, value, id) => {
  if (!node) return createNode(value, id);

  if (value < node.val) node.left = insertAvl(node.left, value, id);
  else if (value > node.val) node.right = insertAvl(node.right, value, id);
  else return node;

  refreshAvlMetadata(node);

  if (node.balance > 1 && value < node.left.val) return rotateRight(node);
  if (node.balance < -1 && value > node.right.val) return rotateLeft(node);
  if (node.balance > 1 && value > node.left.val) {
    node.left = rotateLeft(node.left);
    return rotateRight(node);
  }
  if (node.balance < -1 && value < node.right.val) {
    node.right = rotateRight(node.right);
    return rotateLeft(node);
  }

  return node;
};

// Left-leaning Red-Black insertion maintains the usual Red-Black invariants.
const insertRedBlack = (node, value, id) => {
  if (!node) return createNode(value, id, 'red');

  if (value < node.val) node.left = insertRedBlack(node.left, value, id);
  else if (value > node.val) node.right = insertRedBlack(node.right, value, id);
  else return node;

  if (isRed(node.right) && !isRed(node.left)) node = rotateLeftRedBlack(node);
  if (isRed(node.left) && isRed(node.left.left)) node = rotateRightRedBlack(node);
  if (isRed(node.left) && isRed(node.right)) flipColors(node);

  return refreshAvlMetadata(node);
};

const containsValue = (root, value) => {
  if (!root) return false;
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    if (node.val === value) return true;
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return false;
};

const orderedPath = (root, value) => {
  const path = [];
  let node = root;
  while (node) {
    path.push(node.id);
    if (node.val === value) break;
    node = value < node.val ? node.left : node.right;
  }
  return path;
};

const levelOrderPath = (root, value, stopAtFirstOpenSlot = false) => {
  if (!root) return [];
  const queue = [root];
  const path = [];

  while (queue.length) {
    const node = queue.shift();
    path.push(node.id);
    if (node.val === value) return path;
    if (stopAtFirstOpenSlot && (!node.left || !node.right)) return path;
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return path;
};

const buildInitialTree = (type) => {
  const values = [50, 25, 75, 10, 35, 60, 90];
  let root = null;

  values.forEach((value, index) => {
    const id = `seed-${value}-${index}`;
    if (type === 'Binary Tree') root = insertLevelOrder(root, value, id);
    if (type === 'Binary Search Tree') root = insertBst(root, value, id);
    if (type === 'AVL Tree') root = insertAvl(root, value, id);
    if (type === 'Red-Black Tree') {
      root = insertRedBlack(root, value, id);
      root.color = 'black';
    }
  });

  return root;
};

const getLayout = (node, x = 400, y = 50, offset = 180) => {
  const nodes = [];
  const edges = [];

  const traverse = (current, cx, cy, currentOffset) => {
    if (!current) return;
    nodes.push({ ...current, x: cx, y: cy });
    if (current.left) {
      const childX = cx - currentOffset;
      const childY = cy + 80;
      edges.push({ id: `${current.id}-${current.left.id}`, x1: cx, y1: cy, x2: childX, y2: childY });
      traverse(current.left, childX, childY, currentOffset / 1.8);
    }
    if (current.right) {
      const childX = cx + currentOffset;
      const childY = cy + 80;
      edges.push({ id: `${current.id}-${current.right.id}`, x1: cx, y1: cy, x2: childX, y2: childY });
      traverse(current.right, childX, childY, currentOffset / 1.8);
    }
  };

  traverse(node, x, y, offset);
  return { nodes, edges };
};

const treeDetails = {
  'Binary Tree': {
    description: 'A binary tree is not ordered like a BST. This lab inserts nodes level by level, filling the next available left or right child.',
    time: 'O(n)',
    timeDescription: 'Level-order insertion and search may visit each node.',
  },
  'Binary Search Tree': {
    description: "A BST keeps smaller values in the left subtree and larger values in the right subtree. The visualizer follows those comparisons for search and insertion.",
    time: 'O(log n) expected',
    timeDescription: 'Balanced trees are fast; a skewed BST can reach O(n).',
  },
  'AVL Tree': {
    description: 'An AVL tree updates height and balance factors after each insertion, then performs LL, RR, LR, or RL rotations when required.',
    time: 'O(log n)',
    timeDescription: 'Rotations keep the height balanced after each insertion.',
  },
  'Red-Black Tree': {
    description: 'A Red-Black tree is a self-balancing BST. New nodes start red, then rotations and color flips preserve the Red-Black rules.',
    time: 'O(log n)',
    timeDescription: 'Color balancing prevents the tree from becoming too tall.',
  },
};

export default function BinaryTreeView({ type, onBack }) {
  const [root, setRoot] = useState(() => buildInitialTree(type));
  const [insertVal, setInsertVal] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [lastAction, setLastAction] = useState('Tree initialized');
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const { nodes, edges } = getLayout(root);
  const details = treeDetails[type];

  const animatePath = async (path) => {
    for (const nodeId of path) {
      setHighlightedNodes([nodeId]);
      await sleep(380);
    }
  };

  const insertNode = async () => {
    const value = Number.parseInt(insertVal, 10);
    if (Number.isNaN(value) || isAnimating) return;
    if (containsValue(root, value)) {
      setLastAction(`${value} already exists. Try a different value.`);
      return;
    }

    setIsAnimating(true);
    setInsertVal('');
    setLastAction(`Finding the correct position for ${value}...`);

    const path = type === 'Binary Tree'
      ? levelOrderPath(root, value, true)
      : orderedPath(root, value);
    await animatePath(path);

    const nextTree = cloneTree(root);
    const id = `node-${value}-${Date.now()}`;
    let updatedTree = nextTree;
    if (type === 'Binary Tree') updatedTree = insertLevelOrder(nextTree, value, id);
    if (type === 'Binary Search Tree') updatedTree = insertBst(nextTree, value, id);
    if (type === 'AVL Tree') updatedTree = insertAvl(nextTree, value, id);
    if (type === 'Red-Black Tree') {
      updatedTree = insertRedBlack(nextTree, value, id);
      updatedTree.color = 'black';
    }

    setRoot(updatedTree);
    setHighlightedNodes([id]);
    setLastAction(`Inserted ${value}${type === 'AVL Tree' ? ' and rebalanced the tree.' : '.'}`);
    await sleep(450);
    setHighlightedNodes([]);
    setIsAnimating(false);
  };

  const searchNode = async () => {
    const value = Number.parseInt(searchVal, 10);
    if (Number.isNaN(value) || isAnimating) return;

    setIsAnimating(true);
    setSearchVal('');
    setLastAction(`Searching for ${value}...`);

    const path = type === 'Binary Tree'
      ? levelOrderPath(root, value)
      : orderedPath(root, value);
    await animatePath(path);

    const found = containsValue(root, value);
    setLastAction(found ? `Found ${value}!` : `${value} is not in the tree.`);
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
              <button
                onClick={() => {
                  if (isAnimating) return;
                  setRoot(null);
                  setHighlightedNodes([]);
                  setLastAction('Tree cleared');
                }}
                className="text-xs text-error font-bold flex items-center gap-1 hover:opacity-80"
              >
                <RefreshCw className="w-3 h-3" /> Clear
              </button>
            </div>

            <div className="flex-grow w-full h-full relative overflow-x-auto overflow-y-hidden border border-outline/30 rounded-xl bg-surface-container-low/50">
              <div className="min-w-[800px] min-h-[400px] w-full h-full relative">
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {edges.map((edge) => (
                    <motion.line key={edge.id} {...edge} stroke="var(--color-outline-variant)" strokeWidth="2" />
                  ))}
                </svg>

                <AnimatePresence>
                  {nodes.map((node) => {
                    const highlighted = highlightedNodes.includes(node.id);
                    const redBlack = type === 'Red-Black Tree';
                    const redNode = redBlack && node.color === 'red';
                    const background = highlighted ? 'bg-primary-container' : redNode ? 'bg-error' : redBlack ? 'bg-surface-container-highest' : 'bg-surface';
                    const text = highlighted ? 'text-on-primary-container' : redBlack ? 'text-white' : 'text-on-surface';
                    const border = highlighted ? 'border-primary' : redNode ? 'border-error' : redBlack ? 'border-surface-container-highest' : 'border-outline';

                    return (
                      <motion.div
                        key={node.id}
                        layout
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, left: node.x - 24, top: node.y - 24 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className={`absolute w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border-2 shadow-sm transition-colors duration-300 ${background} ${text} ${border}`}
                      >
                        {node.val}
                        {type === 'AVL Tree' && (
                          <span className="absolute -top-2 -right-2 bg-surface text-on-surface-variant text-[9px] w-5 h-5 flex items-center justify-center rounded-full border border-outline font-mono">
                            {node.balance}
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex gap-4 mt-6 z-10 relative">
              <div className="flex items-center gap-2 flex-1 p-2 bg-surface-container-low rounded-xl border border-outline">
                <input type="number" placeholder="Value" value={insertVal} onChange={(event) => setInsertVal(event.target.value)} className="w-20 bg-surface border border-outline rounded px-3 py-2 text-sm focus:border-primary outline-none text-on-surface" />
                <button onClick={insertNode} disabled={isAnimating} className="bg-primary text-white flex-1 py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-colors disabled:opacity-50">
                  <Plus className="w-4 h-4" /> Insert
                </button>
              </div>
              <div className="flex items-center gap-2 flex-1 p-2 bg-surface-container-low rounded-xl border border-outline">
                <input type="number" placeholder="Target" value={searchVal} onChange={(event) => setSearchVal(event.target.value)} className="w-20 bg-surface border border-outline rounded px-3 py-2 text-sm focus:border-primary outline-none text-on-surface" />
                <button onClick={searchNode} disabled={isAnimating} className="bg-surface border border-outline text-on-surface flex-1 py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-colors disabled:opacity-50">
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
            <p className="text-sm text-on-surface-variant leading-relaxed">{details.description}</p>
          </div>
          <ComplexityCard title="Insertion and Search" description={details.timeDescription} complexity={details.time} />
          <CodeBlock filename={treeSnippetSets[type][0].filename} code={treeSnippetSets[type][0].code} snippets={treeSnippetSets[type]} />
        </div>
      </div>
    </div>
  );
}
