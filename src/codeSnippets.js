export const stackSnippets = [
  {
    language: 'JavaScript',
    filename: 'stack.js',
    code: `class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element);
  }

  pop() {
    if (this.isEmpty()) return "Underflow";
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }
}`,
  },
  {
    language: 'C',
    filename: 'stack.c',
    code: `#define MAX 100
int stack[MAX], top = -1;

void push(int value) {
  if (top == MAX - 1) return;
  stack[++top] = value;
}

int pop() {
  if (top == -1) return -1;
  return stack[top--];
}

int peek() {
  if (top == -1) return -1;
  return stack[top];
}`,
  },
  {
    language: 'C++',
    filename: 'stack.cpp',
    code: `#include <stack>
using namespace std;

stack<int> plates;

void pushPlate(int value) {
  plates.push(value);
}

int popPlate() {
  if (plates.empty()) return -1;
  int top = plates.top();
  plates.pop();
  return top;
}

int peek() {
  return plates.empty() ? -1 : plates.top();
}`,
  },
  {
    language: 'Java',
    filename: 'StackDemo.java',
    code: `import java.util.Stack;

class StackDemo {
  Stack<Integer> stack = new Stack<>();

  void push(int value) {
    stack.push(value);
  }

  int pop() {
    if (stack.empty()) return -1;
    return stack.pop();
  }

  int peek() {
    return stack.empty() ? -1 : stack.peek();
  }
}`,
  },
];

export const queueSnippets = [
  {
    language: 'JavaScript',
    filename: 'queue.js',
    code: `class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element);
  }

  dequeue() {
    if (this.isEmpty()) return "Underflow";
    return this.items.shift();
  }

  front() {
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }
}`,
  },
  {
    language: 'C',
    filename: 'queue.c',
    code: `#define MAX 100
int queue[MAX], front = 0, rear = -1;

void enqueue(int value) {
  if (rear == MAX - 1) return;
  queue[++rear] = value;
}

int dequeue() {
  if (front > rear) return -1;
  return queue[front++];
}

int peek() {
  if (front > rear) return -1;
  return queue[front];
}`,
  },
  {
    language: 'C++',
    filename: 'queue.cpp',
    code: `#include <queue>
using namespace std;

queue<int> line;

void enqueue(int value) {
  line.push(value);
}

int dequeue() {
  if (line.empty()) return -1;
  int front = line.front();
  line.pop();
  return front;
}

int peek() {
  return line.empty() ? -1 : line.front();
}`,
  },
  {
    language: 'Java',
    filename: 'QueueDemo.java',
    code: `import java.util.LinkedList;
import java.util.Queue;

class QueueDemo {
  Queue<Integer> queue = new LinkedList<>();

  void enqueue(int value) {
    queue.add(value);
  }

  int dequeue() {
    if (queue.isEmpty()) return -1;
    return queue.remove();
  }

  int peek() {
    return queue.isEmpty() ? -1 : queue.peek();
  }
}`,
  },
];

export const arraySnippets = [
  {
    language: 'JavaScript',
    filename: 'array_ops.js',
    code: `const arr = [10, 20, 30];

arr.splice(index, 0, element);
arr.splice(index, 1);

const item = arr[index];

function search(val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === val) return i;
  }
  return -1;
}`,
  },
  {
    language: 'C',
    filename: 'array_ops.c',
    code: `int search(int arr[], int n, int value) {
  for (int i = 0; i < n; i++) {
    if (arr[i] == value) return i;
  }
  return -1;
}

void insertAt(int arr[], int *n, int index, int value) {
  for (int i = *n; i > index; i--) {
    arr[i] = arr[i - 1];
  }
  arr[index] = value;
  (*n)++;
}`,
  },
  {
    language: 'C++',
    filename: 'array_ops.cpp',
    code: `#include <vector>
using namespace std;

int search(vector<int>& arr, int value) {
  for (int i = 0; i < arr.size(); i++) {
    if (arr[i] == value) return i;
  }
  return -1;
}

void insertAt(vector<int>& arr, int index, int value) {
  arr.insert(arr.begin() + index, value);
}`,
  },
  {
    language: 'Java',
    filename: 'ArrayDemo.java',
    code: `import java.util.ArrayList;

class ArrayDemo {
  int search(ArrayList<Integer> arr, int value) {
    for (int i = 0; i < arr.size(); i++) {
      if (arr.get(i) == value) return i;
    }
    return -1;
  }

  void insertAt(ArrayList<Integer> arr, int index, int value) {
    arr.add(index, value);
  }
}`,
  },
];

export const treeSnippets = [
  {
    language: 'JavaScript',
    filename: 'traverse.js',
    code: `function traverse(node, target) {
  if (!node) return null;
  if (node.val === target) return node;
  if (target < node.val) return traverse(node.left, target);
  return traverse(node.right, target);
}`,
  },
  {
    language: 'C',
    filename: 'tree_search.c',
    code: `struct Node {
  int val;
  struct Node *left;
  struct Node *right;
};

struct Node* search(struct Node* root, int target) {
  if (root == 0 || root->val == target) return root;
  if (target < root->val) return search(root->left, target);
  return search(root->right, target);
}`,
  },
  {
    language: 'C++',
    filename: 'tree_search.cpp',
    code: `struct Node {
  int val;
  Node* left;
  Node* right;
};

Node* search(Node* root, int target) {
  if (!root || root->val == target) return root;
  if (target < root->val) return search(root->left, target);
  return search(root->right, target);
}`,
  },
  {
    language: 'Java',
    filename: 'TreeSearch.java',
    code: `class Node {
  int val;
  Node left, right;
}

class TreeSearch {
  Node search(Node root, int target) {
    if (root == null || root.val == target) return root;
    if (target < root.val) return search(root.left, target);
    return search(root.right, target);
  }
}`,
  },
];

const binaryTreeSnippets = [
  {
    language: 'JavaScript',
    filename: 'binaryTree.js',
    code: `function insertLevelOrder(root, value) {
  const fresh = { value, left: null, right: null };
  if (!root) return fresh;

  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    if (!node.left) { node.left = fresh; break; }
    if (!node.right) { node.right = fresh; break; }
    queue.push(node.left, node.right);
  }
  return root;
}`,
  },
  {
    language: 'C',
    filename: 'binary_tree.c',
    code: `void insertLevelOrder(struct Node **root, int value) {
  struct Node *fresh = newNode(value);
  if (*root == NULL) { *root = fresh; return; }

  struct Node *queue[100]; int front = 0, rear = 0;
  queue[rear++] = *root;
  while (front < rear) {
    struct Node *node = queue[front++];
    if (!node->left) { node->left = fresh; return; }
    if (!node->right) { node->right = fresh; return; }
    queue[rear++] = node->left;
    queue[rear++] = node->right;
  }
}`,
  },
  {
    language: 'C++',
    filename: 'binary_tree.cpp',
    code: `void insertLevelOrder(Node*& root, int value) {
  Node* fresh = new Node{value, nullptr, nullptr};
  if (!root) { root = fresh; return; }

  queue<Node*> q; q.push(root);
  while (!q.empty()) {
    Node* node = q.front(); q.pop();
    if (!node->left) { node->left = fresh; return; }
    if (!node->right) { node->right = fresh; return; }
    q.push(node->left); q.push(node->right);
  }
}`,
  },
  {
    language: 'Java',
    filename: 'BinaryTree.java',
    code: `void insertLevelOrder(int value) {
  Node fresh = new Node(value);
  if (root == null) { root = fresh; return; }

  Queue<Node> queue = new LinkedList<>();
  queue.add(root);
  while (!queue.isEmpty()) {
    Node node = queue.remove();
    if (node.left == null) { node.left = fresh; return; }
    if (node.right == null) { node.right = fresh; return; }
    queue.add(node.left); queue.add(node.right);
  }
}`,
  },
];

const avlTreeSnippets = [
  {
    language: 'JavaScript',
    filename: 'avlTree.js',
    code: `function insert(node, value) {
  if (!node) return new Node(value);
  if (value < node.value) node.left = insert(node.left, value);
  else if (value > node.value) node.right = insert(node.right, value);
  else return node;

  updateHeight(node);
  const balance = height(node.left) - height(node.right);
  if (balance > 1 && value < node.left.value) return rotateRight(node);
  if (balance < -1 && value > node.right.value) return rotateLeft(node);
  if (balance > 1 && value > node.left.value) {
    node.left = rotateLeft(node.left); return rotateRight(node);
  }
  if (balance < -1 && value < node.right.value) {
    node.right = rotateRight(node.right); return rotateLeft(node);
  }
  return node;
}`,
  },
  {
    language: 'C',
    filename: 'avl_tree.c',
    code: `struct Node* insert(struct Node* node, int value) {
  if (node == NULL) return newNode(value);
  if (value < node->value) node->left = insert(node->left, value);
  else if (value > node->value) node->right = insert(node->right, value);
  else return node;

  updateHeight(node);
  int balance = getBalance(node);
  if (balance > 1 && value < node->left->value) return rotateRight(node);
  if (balance < -1 && value > node->right->value) return rotateLeft(node);
  if (balance > 1) { node->left = rotateLeft(node->left); return rotateRight(node); }
  if (balance < -1) { node->right = rotateRight(node->right); return rotateLeft(node); }
  return node;
}`,
  },
  {
    language: 'C++',
    filename: 'avl_tree.cpp',
    code: `Node* insert(Node* node, int value) {
  if (!node) return new Node(value);
  if (value < node->value) node->left = insert(node->left, value);
  else if (value > node->value) node->right = insert(node->right, value);
  else return node;

  updateHeight(node);
  int balance = getBalance(node);
  if (balance > 1 && value < node->left->value) return rotateRight(node);
  if (balance < -1 && value > node->right->value) return rotateLeft(node);
  if (balance > 1) { node->left = rotateLeft(node->left); return rotateRight(node); }
  if (balance < -1) { node->right = rotateRight(node->right); return rotateLeft(node); }
  return node;
}`,
  },
  {
    language: 'Java',
    filename: 'AVLTree.java',
    code: `Node insert(Node node, int value) {
  if (node == null) return new Node(value);
  if (value < node.value) node.left = insert(node.left, value);
  else if (value > node.value) node.right = insert(node.right, value);
  else return node;

  updateHeight(node);
  int balance = getBalance(node);
  if (balance > 1 && value < node.left.value) return rotateRight(node);
  if (balance < -1 && value > node.right.value) return rotateLeft(node);
  if (balance > 1) { node.left = rotateLeft(node.left); return rotateRight(node); }
  if (balance < -1) { node.right = rotateRight(node.right); return rotateLeft(node); }
  return node;
}`,
  },
];

const redBlackTreeSnippets = [
  {
    language: 'JavaScript',
    filename: 'redBlackTree.js',
    code: `function insert(node, value) {
  if (!node) return new Node(value, 'red');
  if (value < node.value) node.left = insert(node.left, value);
  else if (value > node.value) node.right = insert(node.right, value);

  if (isRed(node.right) && !isRed(node.left)) node = rotateLeft(node);
  if (isRed(node.left) && isRed(node.left.left)) node = rotateRight(node);
  if (isRed(node.left) && isRed(node.right)) flipColors(node);
  return node;
}

root = insert(root, value);
root.color = 'black';`,
  },
  {
    language: 'C',
    filename: 'red_black_tree.c',
    code: `struct Node* insert(struct Node* root, int value) {
  struct Node* fresh = newNode(value, RED);
  root = bstInsert(root, fresh);
  fixAfterInsert(&root, fresh);
  root->color = BLACK;
  return root;
}

/* fixAfterInsert uses rotations and recoloring so
   the root is black and no red node has a red child. */`,
  },
  {
    language: 'C++',
    filename: 'red_black_tree.cpp',
    code: `Node* insert(Node* root, int value) {
  Node* fresh = new Node(value, RED);
  root = bstInsert(root, fresh);
  fixAfterInsert(root, fresh);
  root->color = BLACK;
  return root;
}

// fixAfterInsert rotates and recolors around the uncle node.`,
  },
  {
    language: 'Java',
    filename: 'RedBlackTree.java',
    code: `Node insert(Node root, int value) {
  Node fresh = new Node(value, RED);
  root = bstInsert(root, fresh);
  root = fixAfterInsert(root, fresh);
  root.color = BLACK;
  return root;
}

// fixAfterInsert performs recoloring and rotations.`,
  },
];

const bTreeSnippets = [
  {
    language: 'JavaScript',
    filename: 'bTree.js',
    code: `function insert(root, value) {
  if (root.keys.length === 2 * T - 1) {
    const nextRoot = new BTreeNode(false);
    nextRoot.children[0] = root;
    splitChild(nextRoot, 0);
    insertNonFull(nextRoot, value);
    return nextRoot;
  }
  insertNonFull(root, value);
  return root;
}

function splitChild(parent, index) {
  const full = parent.children[index];
  const right = new BTreeNode(full.leaf);
  parent.keys.splice(index, 0, full.keys[T - 1]);
  right.keys = full.keys.splice(T);
  full.keys.length = T - 1;
  parent.children.splice(index + 1, 0, right);
}`,
  },
  {
    language: 'C',
    filename: 'b_tree.c',
    code: `void insert(struct BTreeNode **root, int value) {
  if ((*root)->count == 2 * T - 1) {
    struct BTreeNode *next = newNode(0);
    next->children[0] = *root;
    splitChild(next, 0);
    insertNonFull(next, value);
    *root = next;
  } else {
    insertNonFull(*root, value);
  }
}`,
  },
  {
    language: 'C++',
    filename: 'b_tree.cpp',
    code: `void insert(int value) {
  if (root->keys.size() == 2 * T - 1) {
    Node* next = new Node(false);
    next->children.push_back(root);
    splitChild(next, 0);
    insertNonFull(next, value);
    root = next;
  } else {
    insertNonFull(root, value);
  }
}`,
  },
  {
    language: 'Java',
    filename: 'BTree.java',
    code: `void insert(int value) {
  if (root.keys.size() == 2 * T - 1) {
    Node next = new Node(false);
    next.children.add(root);
    splitChild(next, 0);
    insertNonFull(next, value);
    root = next;
  } else {
    insertNonFull(root, value);
  }
}`,
  },
];

export const treeSnippetSets = {
  'Binary Tree': binaryTreeSnippets,
  'Binary Search Tree': treeSnippets,
  'AVL Tree': avlTreeSnippets,
  'Red-Black Tree': redBlackTreeSnippets,
  'B-Tree': bTreeSnippets,
};

export const trieSnippets = [
  {
    language: 'JavaScript',
    filename: 'trieSearch.js',
    code: `function search(word) {
  let curr = root;
  for (let char of word) {
    if (!curr.children[char]) return false;
    curr = curr.children[char];
  }
  return curr.isWord;
}`,
  },
  {
    language: 'C',
    filename: 'trie_search.c',
    code: `#include <stdbool.h>

struct TrieNode {
  bool isWord;
  struct TrieNode* children[26];
};

bool search(struct TrieNode* root, char word[]) {
  struct TrieNode* curr = root;
  for (int i = 0; word[i] != '\\0'; i++) {
    int idx = word[i] - 'a';
    if (curr->children[idx] == 0) return false;
    curr = curr->children[idx];
  }
  return curr->isWord;
}`,
  },
  {
    language: 'C++',
    filename: 'trie_search.cpp',
    code: `#include <string>
using namespace std;

struct TrieNode {
  bool isWord = false;
  TrieNode* children[26] = {};
};

bool search(TrieNode* root, string word) {
  TrieNode* curr = root;
  for (char ch : word) {
    int idx = ch - 'a';
    if (!curr->children[idx]) return false;
    curr = curr->children[idx];
  }
  return curr->isWord;
}`,
  },
  {
    language: 'Java',
    filename: 'TrieSearch.java',
    code: `class TrieNode {
  boolean isWord;
  TrieNode[] children = new TrieNode[26];
}

class TrieSearch {
  boolean search(TrieNode root, String word) {
    TrieNode curr = root;
    for (char ch : word.toCharArray()) {
      int idx = ch - 'a';
      if (curr.children[idx] == null) return false;
      curr = curr.children[idx];
    }
    return curr.isWord;
  }
}`,
  },
];
