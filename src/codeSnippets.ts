export type CodeLanguage = 'JavaScript' | 'C' | 'C++' | 'Java';

export interface CodeSnippet {
  language: CodeLanguage;
  filename: string;
  code: string;
}

export const stackSnippets: CodeSnippet[] = [
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

export const queueSnippets: CodeSnippet[] = [
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

export const arraySnippets: CodeSnippet[] = [
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

export const treeSnippets: CodeSnippet[] = [
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

export const trieSnippets: CodeSnippet[] = [
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
