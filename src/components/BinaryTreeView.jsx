import React, { useState } from 'react';
import { ArrowLeft, Info, Plus, RefreshCw, Search as SearchIcon, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import CodeBlock from './CodeBlock';
import ComplexityCard from './ComplexityCard';
import TreeReasoningPanel from './TreeReasoningPanel';
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

const findNode = (root, value) => {
  if (!root) return null;
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    if (node.val === value) return node;
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return null;
};

const leftmostNode = (node) => {
  let current = node;
  while (current?.left) current = current.left;
  return current;
};

const deleteBinaryTreeNode = (root, value) => {
  if (!root) return null;
  const queue = [{ node: root, parent: null, side: null }];
  let target = null;
  let deepest = queue[0];

  while (queue.length) {
    const current = queue.shift();
    deepest = current;
    if (current.node.val === value) target = current;
    if (current.node.left) queue.push({ node: current.node.left, parent: current.node, side: 'left' });
    if (current.node.right) queue.push({ node: current.node.right, parent: current.node, side: 'right' });
  }

  if (!target) return root;
  if (target.node.id === deepest.node.id) return null;
  target.node.val = deepest.node.val;
  deepest.parent[deepest.side] = null;
  return root;
};

const deleteBst = (node, value) => {
  if (!node) return null;
  if (value < node.val) node.left = deleteBst(node.left, value);
  else if (value > node.val) node.right = deleteBst(node.right, value);
  else {
    if (!node.left) return node.right;
    if (!node.right) return node.left;
    const successor = leftmostNode(node.right);
    node.val = successor.val;
    node.right = deleteBst(node.right, successor.val);
  }
  return node;
};

const deleteAvl = (node, value) => {
  if (!node) return null;
  if (value < node.val) node.left = deleteAvl(node.left, value);
  else if (value > node.val) node.right = deleteAvl(node.right, value);
  else {
    if (!node.left) return node.right;
    if (!node.right) return node.left;
    const successor = leftmostNode(node.right);
    node.val = successor.val;
    node.right = deleteAvl(node.right, successor.val);
  }

  refreshAvlMetadata(node);
  if (node.balance > 1 && (node.left?.balance || 0) >= 0) return rotateRight(node);
  if (node.balance > 1 && (node.left?.balance || 0) < 0) {
    node.left = rotateLeft(node.left);
    return rotateRight(node);
  }
  if (node.balance < -1 && (node.right?.balance || 0) <= 0) return rotateLeft(node);
  if (node.balance < -1 && (node.right?.balance || 0) > 0) {
    node.right = rotateRight(node.right);
    return rotateLeft(node);
  }
  return node;
};

const fixRedBlack = (node) => {
  if (isRed(node.right)) node = rotateLeftRedBlack(node);
  if (isRed(node.left) && isRed(node.left.left)) node = rotateRightRedBlack(node);
  if (isRed(node.left) && isRed(node.right)) flipColors(node);
  return refreshAvlMetadata(node);
};

const moveRedLeft = (node) => {
  flipColors(node);
  if (isRed(node.right?.left)) {
    node.right = rotateRightRedBlack(node.right);
    node = rotateLeftRedBlack(node);
    flipColors(node);
  }
  return node;
};

const moveRedRight = (node) => {
  flipColors(node);
  if (isRed(node.left?.left)) {
    node = rotateRightRedBlack(node);
    flipColors(node);
  }
  return node;
};

const deleteRedBlackMinimum = (node) => {
  if (!node.left) return null;
  if (!isRed(node.left) && !isRed(node.left.left)) node = moveRedLeft(node);
  node.left = deleteRedBlackMinimum(node.left);
  return fixRedBlack(node);
};

const deleteRedBlack = (node, value) => {
  if (value < node.val) {
    if (node.left) {
      if (!isRed(node.left) && !isRed(node.left.left)) node = moveRedLeft(node);
      node.left = deleteRedBlack(node.left, value);
    }
  } else {
    if (isRed(node.left)) node = rotateRightRedBlack(node);
    if (value === node.val && !node.right) return null;
    if (node.right) {
      if (!isRed(node.right) && !isRed(node.right.left)) node = moveRedRight(node);
      if (value === node.val) {
        const successor = leftmostNode(node.right);
        node.val = successor.val;
        node.right = deleteRedBlackMinimum(node.right);
      } else {
        node.right = deleteRedBlack(node.right, value);
      }
    }
  }
  return fixRedBlack(node);
};

const decisionSteps = (root, value, type, operation) => {
  if (!root) return [{ id: null, text: 'The tree is empty, so there is no existing node to inspect.' }];
  const steps = [];

  if (type === 'Binary Tree') {
    const queue = [root];
    while (queue.length) {
      const node = queue.shift();
      if (node.val === value) {
        steps.push({ id: node.id, text: `Visit ${node.val}. It matches the requested value, so this is the target node.` });
        break;
      }
      if (operation === 'insert' && (!node.left || !node.right)) {
        const slot = !node.left ? 'left' : 'right';
        steps.push({ id: node.id, text: `Visit ${node.val}. A plain Binary Tree has no smaller-left rule, so we fill level by level. Its ${slot} child is the first open slot.` });
        break;
      }
      steps.push({ id: node.id, text: `Visit ${node.val}. It is not the target${operation === 'insert' ? ' and already has two children' : ''}, so continue across this level from left to right.` });
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    return steps;
  }

  let node = root;
  while (node) {
    if (node.val === value) {
      steps.push({ id: node.id, text: `Compare ${value} with ${node.val}. They match, so this is the target node.` });
      break;
    }
    const direction = value < node.val ? 'left' : 'right';
    const reason = value < node.val ? 'smaller' : 'larger';
    const next = node[direction];
    steps.push({ id: node.id, text: `Compare ${value} with ${node.val}. ${value} is ${reason}, so move ${direction} to preserve the search-tree order.` });
    if (!next) {
      steps.push({ id: node.id, text: operation === 'insert' ? `The ${direction} child of ${node.val} is empty, so ${value} belongs exactly there.` : `There is no ${direction} child to inspect, so ${value} is not in this tree.` });
      break;
    }
    node = next;
  }

  return steps;
};

const deleteConclusion = (root, value, type) => {
  const target = findNode(root, value);
  if (!target) return 'No deletion is performed because the value was not found.';
  if (type === 'Binary Tree') return 'Replace the target with the deepest, rightmost node, then remove that deepest node to keep the tree compact.';
  if (!target.left && !target.right) return 'The target is a leaf, so it can be removed directly.';
  if (!target.left || !target.right) return 'The target has one child, so that child takes the target’s place.';
  if (type === 'AVL Tree') return 'The target has two children, so use its inorder successor, then update heights and rotate if the balance factor requires it.';
  if (type === 'Red-Black Tree') return 'The target has two children, so use its inorder successor, then rebalance with color moves, rotations, and recoloring.';
  return 'The target has two children, so replace it with its inorder successor: the smallest value in its right subtree.';
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
  const [deleteVal, setDeleteVal] = useState('');
  const [lastAction, setLastAction] = useState('Tree initialized');
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [reasoningSteps, setReasoningSteps] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const { nodes, edges } = getLayout(root);
  const details = treeDetails[type];

  const animateSteps = async (steps) => {
    const visibleSteps = [];
    for (const step of steps) {
      visibleSteps.push(step.text);
      setReasoningSteps([...visibleSteps]);
      setHighlightedNodes(step.id ? [step.id] : []);
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
    await animateSteps(decisionSteps(root, value, type, 'insert'));

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
    const balancingNote = type === 'AVL Tree'
      ? 'The AVL balance factors were updated and any required rotation was applied.'
      : type === 'Red-Black Tree'
        ? 'The new node was balanced with the Red-Black color and rotation rules.'
        : `Inserted ${value}.`;
    setReasoningSteps((steps) => [...steps, balancingNote]);
    setLastAction(`Inserted ${value}${type === 'AVL Tree' ? ' and checked balance.' : '.'}`);
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
    await animateSteps(decisionSteps(root, value, type, 'search'));

    const found = containsValue(root, value);
    setReasoningSteps((steps) => [...steps, found ? `Search complete: ${value} was found.` : `Search complete: ${value} was not found.`]);
    setLastAction(found ? `Found ${value}!` : `${value} is not in the tree.`);
    await sleep(650);
    setHighlightedNodes([]);
    setIsAnimating(false);
  };

  const deleteNode = async () => {
    const value = Number.parseInt(deleteVal, 10);
    if (Number.isNaN(value) || isAnimating) return;

    setIsAnimating(true);
    setDeleteVal('');
    setLastAction(`Finding ${value} before deletion...`);
    await animateSteps(decisionSteps(root, value, type, 'delete'));

    if (!containsValue(root, value)) {
      setReasoningSteps((steps) => [...steps, 'No deletion is performed because the value was not found.']);
      setLastAction(`${value} is not in the tree.`);
      setHighlightedNodes([]);
      setIsAnimating(false);
      return;
    }

    setReasoningSteps((steps) => [...steps, deleteConclusion(root, value, type)]);
    const nextTree = cloneTree(root);
    let updatedTree = nextTree;
    if (type === 'Binary Tree') updatedTree = deleteBinaryTreeNode(nextTree, value);
    if (type === 'Binary Search Tree') updatedTree = deleteBst(nextTree, value);
    if (type === 'AVL Tree') updatedTree = deleteAvl(nextTree, value);
    if (type === 'Red-Black Tree') {
      if (!isRed(nextTree.left) && !isRed(nextTree.right)) nextTree.color = 'red';
      updatedTree = deleteRedBlack(nextTree, value);
      if (updatedTree) updatedTree.color = 'black';
    }

    setRoot(updatedTree);
    setLastAction(`Deleted ${value}.`);
    await sleep(500);
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

            <TreeReasoningPanel steps={reasoningSteps} />

            <div className="flex flex-wrap gap-4 mt-6 z-10 relative">
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
              <div className="flex items-center gap-2 flex-1 p-2 bg-surface-container-low rounded-xl border border-outline">
                <input type="number" placeholder="Target" value={deleteVal} onChange={(event) => setDeleteVal(event.target.value)} className="w-20 bg-surface border border-outline rounded px-3 py-2 text-sm focus:border-error outline-none text-on-surface" />
                <button onClick={deleteNode} disabled={isAnimating} className="bg-error/10 border border-error/30 text-error flex-1 py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-colors disabled:opacity-50">
                  <Trash2 className="w-4 h-4" /> Delete
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
