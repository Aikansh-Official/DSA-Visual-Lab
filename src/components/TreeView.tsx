import React, { useState } from 'react';
import { Network, GitBranch, Share2, Layers, Search, Database } from 'lucide-react';
import { motion } from 'motion/react';
import BinaryTreeView from './BinaryTreeView';
import TrieView from './TrieView';
import { AVLArt, BSTArt, BTreeArt, BinaryTreeArt, RedBlackArt, TrieArt } from './ConceptArt';

interface TreeCardProps {
  title: string;
  description: string;
  visual: React.ReactNode;
  icon: React.ReactNode;
  complexity: string;
  onSelect: () => void;
  key?: number | string;
}

const TreeCard = ({ title, description, visual, icon, complexity, onSelect }: TreeCardProps) => (
  <motion.div 
    whileHover={{ y: -5 }}
    onClick={onSelect}
    className="bg-surface rounded-2xl border border-outline overflow-hidden flex flex-col group hover:border-primary transition-all duration-300 shadow-sm cursor-pointer"
  >
    <div className="relative h-48 overflow-hidden bg-surface-container-low">
      <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]">
        {visual}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <div className="p-2 bg-primary/10 backdrop-blur-md rounded-lg border border-primary/20">
          {icon}
        </div>
        <span className="text-xs font-mono font-bold text-primary bg-primary/10 backdrop-blur-md px-2 py-1 rounded border border-primary/20">
          {complexity}
        </span>
      </div>
    </div>
    <div className="p-6 flex flex-col gap-3">
      <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-on-surface-variant leading-relaxed">
        {description}
      </p>
      <button className="mt-4 w-full py-2 rounded-lg border border-outline hover:border-primary hover:text-primary text-xs font-bold uppercase tracking-widest transition-all">
        See Visualization
      </button>
    </div>
  </motion.div>
);

export default function TreeView() {
  const [selectedTree, setSelectedTree] = useState<string | null>(null);

  const trees = [
    {
      title: "Binary Tree",
      description: "A hierarchical structure where each node has at most two children, referred to as the left child and the right child.",
      visual: <BinaryTreeArt />,
      icon: <Network className="w-5 h-5 text-primary" />,
      complexity: "O(n)"
    },
    {
      title: "Binary Search Tree",
      description: "A binary tree where the left child is smaller and the right child is larger than the parent node, optimized for searching.",
      visual: <BSTArt />,
      icon: <Search className="w-5 h-5 text-primary" />,
      complexity: "O(log n)"
    },
    {
      title: "AVL Tree",
      description: "A self-balancing binary search tree where the heights of the two child subtrees of any node differ by at most one.",
      visual: <AVLArt />,
      icon: <Layers className="w-5 h-5 text-primary" />,
      complexity: "O(log n)"
    },
    {
      title: "Red-Black Tree",
      description: "A kind of self-balancing binary search tree where each node has an extra bit for denoting the color of the node.",
      visual: <RedBlackArt />,
      icon: <Share2 className="w-5 h-5 text-primary" />,
      complexity: "O(log n)"
    },
    {
      title: "B-Tree",
      description: "A self-balancing search tree in which each node can contain more than one key and can have more than two children.",
      visual: <BTreeArt />,
      icon: <Database className="w-5 h-5 text-primary" />,
      complexity: "O(log n)"
    },
    {
      title: "Trie (Prefix Tree)",
      description: "An ordered tree data structure used to store a dynamic set or associative array where the keys are usually strings.",
      visual: <TrieArt />,
      icon: <GitBranch className="w-5 h-5 text-primary" />,
      complexity: "O(k)"
    }
  ];

  if (selectedTree === "Trie (Prefix Tree)") {
    return <TrieView onBack={() => setSelectedTree(null)} />;
  }
  
  // Uses BinaryTreeView for all other trees. B-Tree is not fully implemented realistically 
  // but acts as a placeholder or uses the underlying binary structure conceptually for this demo.
  if (selectedTree) {
    return <BinaryTreeView type={selectedTree} onBack={() => setSelectedTree(null)} />;
  }

  return (
    <div className="flex flex-col gap-12 py-8">
      <section className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold text-on-surface tracking-tight">Tree Architectures</h2>
        <p className="text-on-surface-variant text-lg">
          Explore the hierarchical world of trees, from simple binary structures to self-balancing systems optimized for performance.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trees.map((tree, idx) => (
          <TreeCard 
            key={idx}
            title={tree.title}
            description={tree.description}
            visual={tree.visual}
            icon={tree.icon}
            complexity={tree.complexity}
            onSelect={() => setSelectedTree(tree.title)}
          />
        ))}
      </div>
    </div>
  );
}
