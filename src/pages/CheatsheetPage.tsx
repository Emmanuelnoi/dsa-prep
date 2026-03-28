import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Zap, BookOpen, ChevronDown, ChevronUp } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface KeywordGroup {
  pattern: string
  categoryId: string
  color: string
  phrases: string[]
  tip: string
}

interface Blind75Item {
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  patterns: { label: string; categoryId: string; templateId?: string }[]
}

interface Blind75Group {
  group: string
  items: Blind75Item[]
}

// ─── "When You See…" Data ─────────────────────────────────────────────────────

const KEYWORD_TRIGGERS: KeywordGroup[] = [
  {
    pattern: 'Binary Search',
    categoryId: 'binary-search',
    color: '#3b82f6',
    phrases: [
      'sorted array', 'rotated array', 'find minimum', 'find target',
      'search in sorted', 'log n required', 'peak element', 'first/last position',
      'koko eating bananas', 'minimum capacity', 'feasibility check on sorted answer',
    ],
    tip: 'If the search space is monotonic (answers are ordered), binary search on the answer.',
  },
  {
    pattern: 'Two Pointers',
    categoryId: 'two-pointers',
    color: '#10b981',
    phrases: [
      'two sum sorted', 'pair with target sum', 'palindrome check', 'reverse in-place',
      'remove duplicates', 'container with most water', '3sum', 'trapping rain water',
      'squaring sorted array', 'Dutch national flag',
    ],
    tip: 'Works on sorted arrays or when you need to compare elements from both ends simultaneously.',
  },
  {
    pattern: 'Sliding Window',
    categoryId: 'sliding-window',
    color: '#f59e0b',
    phrases: [
      'longest substring', 'minimum subarray', 'maximum sum subarray', 'contiguous subarray',
      'window of size k', 'at most k distinct', 'without repeating characters',
      'minimum window substring', 'character replacement',
    ],
    tip: 'Anytime you see "subarray/substring" + a constraint, think sliding window before O(n²).',
  },
  {
    pattern: 'BFS / DFS',
    categoryId: 'bfs-dfs',
    color: '#8b5cf6',
    phrases: [
      'shortest path unweighted', 'number of islands', 'connected components',
      'level order traversal', 'minimum steps', 'reachable nodes', 'graph traversal',
      'flood fill', 'word ladder', 'clone graph', 'pacific atlantic water flow',
    ],
    tip: 'BFS = shortest path. DFS = exhaustive search, cycle detection, topological sort.',
  },
  {
    pattern: 'Dynamic Programming',
    categoryId: 'dynamic-programming',
    color: '#ef4444',
    phrases: [
      'how many ways', 'maximum/minimum value', 'can you reach', 'count paths',
      'optimal strategy', 'overlapping subproblems', 'fibonacci-like',
      'longest subsequence', 'coin change', 'house robber', 'unique paths',
    ],
    tip: 'DP = recursion + memoization. If brute-force is exponential and subproblems repeat, use DP.',
  },
  {
    pattern: 'Backtracking',
    categoryId: 'backtracking',
    color: '#ec4899',
    phrases: [
      'generate all', 'all combinations', 'all permutations', 'all subsets',
      'word search grid', 'n-queens', 'sudoku solver', 'letter combinations',
      'palindrome partitioning',
    ],
    tip: 'Backtracking = DFS + undo. Choose → explore → unchoose. Prune early to cut search space.',
  },
  {
    pattern: 'Heap / Priority Queue',
    categoryId: 'heap',
    color: '#06b6d4',
    phrases: [
      'k largest elements', 'k smallest elements', 'k most frequent', 'top k',
      'kth largest', 'merge k sorted lists', 'find median stream',
      'task scheduler', 'reorganize string',
    ],
    tip: 'Whenever you need the "best K" from a stream or large dataset, reach for a heap.',
  },
  {
    pattern: 'Union-Find (DSU)',
    categoryId: 'union-find',
    color: '#f97316',
    phrases: [
      'connected components', 'number of provinces', 'friend circles',
      'cycle detection undirected graph', 'redundant connection',
      'number of islands union-find', 'accounts merge', 'graph valid tree',
    ],
    tip: 'Use Union-Find for "group/component" queries. Much simpler than BFS when you only need connectivity.',
  },
  {
    pattern: 'Trie',
    categoryId: 'trie',
    color: '#14b8a6',
    phrases: [
      'prefix search', 'autocomplete', 'starts with', 'dictionary of words',
      'word search II', 'implement trie', 'search suggestions', 'replace words',
    ],
    tip: 'Trie is the go-to for prefix queries. O(m) per operation where m = word length.',
  },
  {
    pattern: 'Linked List',
    categoryId: 'linked-list',
    color: '#a855f7',
    phrases: [
      'reverse linked list', 'detect cycle', 'find cycle start', 'merge sorted lists',
      'LRU cache', 'middle of linked list', 'remove nth from end',
      'reorder list', 'add two numbers', 'deep copy with random pointer',
    ],
    tip: 'For in-place reversal and cycle detection, always reach for the fast/slow pointer.',
  },
  {
    pattern: 'Trees',
    categoryId: 'trees',
    color: '#22c55e',
    phrases: [
      'lowest common ancestor', 'max depth', 'diameter of tree', 'path sum',
      'level order', 'serialize tree', 'invert binary tree', 'validate BST',
      'construct tree from traversals', 'kth smallest in BST',
    ],
    tip: 'Most tree problems = DFS (pre/in/post-order) or BFS (level-order). Pick based on what you compute.',
  },
  {
    pattern: 'Intervals',
    categoryId: 'intervals',
    color: '#eab308',
    phrases: [
      'merge intervals', 'overlapping intervals', 'insert interval',
      'meeting rooms', 'minimum rooms required', 'non-overlapping intervals',
      'employee free time', 'interval intersection',
    ],
    tip: 'Sort by start time. Use a heap of end times for "how many concurrent" questions.',
  },
  {
    pattern: 'Graphs (Weighted)',
    categoryId: 'graphs',
    color: '#64748b',
    phrases: [
      'shortest path weighted', 'network delay time', 'cheapest flights',
      'minimum spanning tree', 'path with max probability', 'Dijkstra',
      'Bellman-Ford', "Prim's", "Kruskal's",
    ],
    tip: 'Non-negative weights → Dijkstra\'s. Negative weights → Bellman-Ford. MST → Prim\'s or Kruskal\'s.',
  },
  {
    pattern: 'Sorting',
    categoryId: 'sorting',
    color: '#6366f1',
    phrases: [
      'sort array', 'sort nearly sorted', 'sort by custom comparator',
      'kth largest element sort', 'merge sort linked list', 'sort colors',
    ],
    tip: 'Know merge sort (stable, O(n log n)) and quick sort (in-place). Counting sort when range is small.',
  },
]

// ─── Blind 75 Data ────────────────────────────────────────────────────────────

const BLIND_75: Blind75Group[] = [
  {
    group: 'Arrays & Hashing',
    items: [
      { title: 'Two Sum', difficulty: 'Easy', patterns: [{ label: 'Hash Map', categoryId: 'hash-map', templateId: 'hm-two-sum' }] },
      { title: 'Contains Duplicate', difficulty: 'Easy', patterns: [{ label: 'Hash Set', categoryId: 'hash-map', templateId: 'hm-hash-set' }] },
      { title: 'Valid Anagram', difficulty: 'Easy', patterns: [{ label: 'Frequency Map', categoryId: 'hash-map', templateId: 'hm-frequency-count' }] },
      { title: 'Group Anagrams', difficulty: 'Medium', patterns: [{ label: 'Hash Map + Sort Key', categoryId: 'hash-map', templateId: 'hm-frequency-count' }] },
      { title: 'Top K Frequent Elements', difficulty: 'Medium', patterns: [{ label: 'Heap', categoryId: 'heap', templateId: 'heap-top-k-freq' }] },
      { title: 'Product of Array Except Self', difficulty: 'Medium', patterns: [{ label: 'Prefix Sum', categoryId: 'hash-map', templateId: 'hm-prefix-sum' }] },
      { title: 'Longest Consecutive Sequence', difficulty: 'Medium', patterns: [{ label: 'Hash Set', categoryId: 'hash-map', templateId: 'hm-hash-set' }] },
      { title: 'Encode and Decode Strings', difficulty: 'Medium', patterns: [{ label: 'Sliding Window', categoryId: 'sliding-window', templateId: 'sw-variable' }] },
    ],
  },
  {
    group: 'Two Pointers',
    items: [
      { title: 'Valid Palindrome', difficulty: 'Easy', patterns: [{ label: 'Two Pointers', categoryId: 'two-pointers', templateId: 'tp-opposite' }] },
      { title: 'Two Sum II (Sorted)', difficulty: 'Medium', patterns: [{ label: 'Two Pointers', categoryId: 'two-pointers', templateId: 'tp-opposite' }] },
      { title: '3Sum', difficulty: 'Medium', patterns: [{ label: 'Two Pointers', categoryId: 'two-pointers', templateId: 'tp-opposite' }] },
      { title: 'Container With Most Water', difficulty: 'Medium', patterns: [{ label: 'Two Pointers', categoryId: 'two-pointers', templateId: 'tp-opposite' }] },
      { title: 'Trapping Rain Water', difficulty: 'Hard', patterns: [{ label: 'Two Pointers', categoryId: 'two-pointers', templateId: 'tp-opposite' }, { label: 'Monotonic Stack', categoryId: 'stack', templateId: 'stack-monotonic-decreasing' }] },
    ],
  },
  {
    group: 'Sliding Window',
    items: [
      { title: 'Best Time to Buy & Sell Stock', difficulty: 'Easy', patterns: [{ label: 'Sliding Window', categoryId: 'sliding-window', templateId: 'sw-variable' }] },
      { title: 'Longest Substring Without Repeating', difficulty: 'Medium', patterns: [{ label: 'Hash Map + Window', categoryId: 'hash-map', templateId: 'hm-sliding-window-map' }] },
      { title: 'Longest Repeating Character Replacement', difficulty: 'Medium', patterns: [{ label: 'Sliding Window', categoryId: 'sliding-window', templateId: 'sw-variable' }] },
      { title: 'Minimum Window Substring', difficulty: 'Hard', patterns: [{ label: 'Sliding Window', categoryId: 'sliding-window', templateId: 'sw-min-window' }] },
    ],
  },
  {
    group: 'Binary Search',
    items: [
      { title: 'Binary Search', difficulty: 'Easy', patterns: [{ label: 'Binary Search', categoryId: 'binary-search', templateId: 'bs-classic' }] },
      { title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', patterns: [{ label: 'Binary Search', categoryId: 'binary-search', templateId: 'bs-rotated-array' }] },
      { title: 'Search in Rotated Sorted Array', difficulty: 'Medium', patterns: [{ label: 'Binary Search', categoryId: 'binary-search', templateId: 'bs-rotated-array' }] },
      { title: 'Koko Eating Bananas', difficulty: 'Medium', patterns: [{ label: 'Binary Search on Answer', categoryId: 'binary-search', templateId: 'bs-left-bound' }] },
      { title: 'Find Median of Two Sorted Arrays', difficulty: 'Hard', patterns: [{ label: 'Binary Search', categoryId: 'binary-search', templateId: 'bs-classic' }] },
    ],
  },
  {
    group: 'Linked List',
    items: [
      { title: 'Reverse Linked List', difficulty: 'Easy', patterns: [{ label: 'Linked List', categoryId: 'linked-list', templateId: 'll-reverse' }] },
      { title: 'Merge Two Sorted Lists', difficulty: 'Easy', patterns: [{ label: 'Linked List', categoryId: 'linked-list', templateId: 'll-merge-sorted' }] },
      { title: 'Linked List Cycle', difficulty: 'Easy', patterns: [{ label: 'Fast / Slow Pointer', categoryId: 'linked-list', templateId: 'll-cycle' }] },
      { title: 'Remove Nth Node From End', difficulty: 'Medium', patterns: [{ label: 'Fast / Slow Pointer', categoryId: 'linked-list', templateId: 'll-cycle' }] },
      { title: 'Reorder List', difficulty: 'Medium', patterns: [{ label: 'Fast / Slow Pointer', categoryId: 'linked-list', templateId: 'll-cycle' }] },
      { title: 'Add Two Numbers', difficulty: 'Medium', patterns: [{ label: 'Linked List', categoryId: 'linked-list', templateId: 'll-reverse' }] },
      { title: 'LRU Cache', difficulty: 'Medium', patterns: [{ label: 'Linked List + Hash Map', categoryId: 'linked-list', templateId: 'll-lru-cache' }] },
      { title: 'Merge K Sorted Lists', difficulty: 'Hard', patterns: [{ label: 'Heap', categoryId: 'linked-list', templateId: 'll-merge-k' }] },
      { title: 'Reverse Nodes in K-Group', difficulty: 'Hard', patterns: [{ label: 'Linked List', categoryId: 'linked-list', templateId: 'll-reverse' }] },
    ],
  },
  {
    group: 'Trees',
    items: [
      { title: 'Invert Binary Tree', difficulty: 'Easy', patterns: [{ label: 'DFS', categoryId: 'trees', templateId: 'tree-inorder' }] },
      { title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', patterns: [{ label: 'DFS', categoryId: 'trees', templateId: 'tree-inorder' }] },
      { title: 'Same Tree', difficulty: 'Easy', patterns: [{ label: 'DFS', categoryId: 'trees', templateId: 'tree-inorder' }] },
      { title: 'Diameter of Binary Tree', difficulty: 'Easy', patterns: [{ label: 'DFS Post-order', categoryId: 'trees', templateId: 'tree-inorder' }] },
      { title: 'Balanced Binary Tree', difficulty: 'Easy', patterns: [{ label: 'DFS Post-order', categoryId: 'trees', templateId: 'tree-inorder' }] },
      { title: 'Subtree of Another Tree', difficulty: 'Easy', patterns: [{ label: 'DFS', categoryId: 'trees', templateId: 'tree-inorder' }] },
      { title: 'Lowest Common Ancestor of BST', difficulty: 'Medium', patterns: [{ label: 'Tree LCA', categoryId: 'trees', templateId: 'tree-lca' }] },
      { title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', patterns: [{ label: 'BFS', categoryId: 'trees', templateId: 'tree-level-order' }] },
      { title: 'Binary Tree Right Side View', difficulty: 'Medium', patterns: [{ label: 'BFS Level Order', categoryId: 'trees', templateId: 'tree-level-order' }] },
      { title: 'Count Good Nodes in Binary Tree', difficulty: 'Medium', patterns: [{ label: 'DFS', categoryId: 'trees', templateId: 'tree-inorder' }] },
      { title: 'Validate Binary Search Tree', difficulty: 'Medium', patterns: [{ label: 'DFS Inorder', categoryId: 'trees', templateId: 'tree-inorder' }] },
      { title: 'Kth Smallest Element in BST', difficulty: 'Medium', patterns: [{ label: 'DFS Inorder', categoryId: 'trees', templateId: 'tree-inorder' }] },
      { title: 'Construct Tree from Preorder + Inorder', difficulty: 'Medium', patterns: [{ label: 'DFS', categoryId: 'trees', templateId: 'tree-inorder' }] },
      { title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', patterns: [{ label: 'DFS Post-order', categoryId: 'trees', templateId: 'tree-inorder' }] },
      { title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', patterns: [{ label: 'DFS Preorder', categoryId: 'trees', templateId: 'tree-serialize' }] },
    ],
  },
  {
    group: 'Tries',
    items: [
      { title: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', patterns: [{ label: 'Trie', categoryId: 'trie', templateId: 'trie-basic' }] },
      { title: 'Design Add and Search Words', difficulty: 'Medium', patterns: [{ label: 'Trie + DFS', categoryId: 'trie', templateId: 'trie-word-dict' }] },
      { title: 'Word Search II', difficulty: 'Hard', patterns: [{ label: 'Trie + Backtracking', categoryId: 'trie', templateId: 'trie-word-dict' }] },
    ],
  },
  {
    group: 'Heap / Priority Queue',
    items: [
      { title: 'Kth Largest Element in Array', difficulty: 'Medium', patterns: [{ label: 'Heap', categoryId: 'heap', templateId: 'heap-k-largest' }] },
      { title: 'K Closest Points to Origin', difficulty: 'Medium', patterns: [{ label: 'Heap', categoryId: 'heap', templateId: 'heap-k-largest' }] },
      { title: 'Task Scheduler', difficulty: 'Medium', patterns: [{ label: 'Greedy + Heap', categoryId: 'greedy', templateId: 'greedy-task-scheduler' }] },
      { title: 'Find Median from Data Stream', difficulty: 'Hard', patterns: [{ label: 'Two Heaps', categoryId: 'heap', templateId: 'heap-min-ops' }] },
    ],
  },
  {
    group: 'Backtracking',
    items: [
      { title: 'Subsets', difficulty: 'Medium', patterns: [{ label: 'Backtracking', categoryId: 'backtracking', templateId: 'bt-subsets' }] },
      { title: 'Combination Sum', difficulty: 'Medium', patterns: [{ label: 'Backtracking', categoryId: 'backtracking', templateId: 'bt-combinations' }] },
      { title: 'Permutations', difficulty: 'Medium', patterns: [{ label: 'Backtracking', categoryId: 'backtracking', templateId: 'bt-permutations' }] },
      { title: 'Subsets II (with duplicates)', difficulty: 'Medium', patterns: [{ label: 'Backtracking + Sort', categoryId: 'backtracking', templateId: 'bt-subsets' }] },
      { title: 'Combination Sum II', difficulty: 'Medium', patterns: [{ label: 'Backtracking + Pruning', categoryId: 'backtracking', templateId: 'bt-combinations' }] },
      { title: 'Word Search', difficulty: 'Medium', patterns: [{ label: 'Backtracking on Grid', categoryId: 'backtracking', templateId: 'bt-word-search' }] },
      { title: 'Palindrome Partitioning', difficulty: 'Medium', patterns: [{ label: 'Backtracking', categoryId: 'backtracking', templateId: 'bt-combinations' }] },
      { title: 'Letter Combinations of a Phone Number', difficulty: 'Medium', patterns: [{ label: 'Backtracking', categoryId: 'backtracking', templateId: 'bt-combinations' }] },
      { title: 'N-Queens', difficulty: 'Hard', patterns: [{ label: 'Backtracking', categoryId: 'backtracking', templateId: 'bt-n-queens' }] },
    ],
  },
  {
    group: 'Graphs',
    items: [
      { title: 'Number of Islands', difficulty: 'Medium', patterns: [{ label: 'Matrix BFS', categoryId: 'matrix', templateId: 'matrix-bfs' }, { label: 'Union-Find', categoryId: 'union-find', templateId: 'uf-basic' }] },
      { title: 'Clone Graph', difficulty: 'Medium', patterns: [{ label: 'DFS/BFS', categoryId: 'bfs-dfs', templateId: 'bfs-graph' }] },
      { title: 'Max Area of Island', difficulty: 'Medium', patterns: [{ label: 'Matrix DFS', categoryId: 'matrix', templateId: 'matrix-dfs' }] },
      { title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', patterns: [{ label: 'BFS/DFS Multi-source', categoryId: 'bfs-dfs', templateId: 'bfs-grid' }] },
      { title: 'Surrounded Regions', difficulty: 'Medium', patterns: [{ label: 'DFS/BFS', categoryId: 'bfs-dfs', templateId: 'bfs-grid' }] },
      { title: 'Course Schedule', difficulty: 'Medium', patterns: [{ label: 'Topological Sort', categoryId: 'topological-sort', templateId: 'topo-course-schedule' }] },
      { title: 'Course Schedule II', difficulty: 'Medium', patterns: [{ label: 'Topological Sort', categoryId: 'topological-sort', templateId: 'topo-course-schedule' }] },
      { title: 'Graph Valid Tree', difficulty: 'Medium', patterns: [{ label: 'Union-Find', categoryId: 'union-find', templateId: 'uf-basic' }] },
      { title: 'Number of Connected Components', difficulty: 'Medium', patterns: [{ label: 'Union-Find', categoryId: 'union-find', templateId: 'uf-path-compression' }] },
      { title: 'Redundant Connection', difficulty: 'Medium', patterns: [{ label: 'Union-Find', categoryId: 'union-find', templateId: 'uf-union-by-rank' }] },
      { title: 'Word Ladder', difficulty: 'Hard', patterns: [{ label: 'BFS', categoryId: 'bfs-dfs', templateId: 'bfs-graph' }] },
    ],
  },
  {
    group: 'Dynamic Programming',
    items: [
      { title: 'Climbing Stairs', difficulty: 'Easy', patterns: [{ label: '1D DP', categoryId: 'dynamic-programming', templateId: 'dp-tab' }] },
      { title: 'House Robber', difficulty: 'Medium', patterns: [{ label: '1D DP', categoryId: 'dynamic-programming', templateId: 'dp-1d' }] },
      { title: 'House Robber II', difficulty: 'Medium', patterns: [{ label: '1D DP', categoryId: 'dynamic-programming', templateId: 'dp-1d' }] },
      { title: 'Longest Palindromic Substring', difficulty: 'Medium', patterns: [{ label: '2D DP / Expand Center', categoryId: 'dynamic-programming', templateId: 'dp-2d' }] },
      { title: 'Palindromic Substrings', difficulty: 'Medium', patterns: [{ label: '2D DP / Expand Center', categoryId: 'dynamic-programming', templateId: 'dp-2d' }] },
      { title: 'Decode Ways', difficulty: 'Medium', patterns: [{ label: '1D DP', categoryId: 'dynamic-programming', templateId: 'dp-tab' }] },
      { title: 'Coin Change', difficulty: 'Medium', patterns: [{ label: 'Unbounded Knapsack DP', categoryId: 'dynamic-programming', templateId: 'dp-unbounded-knapsack' }] },
      { title: 'Maximum Product Subarray', difficulty: 'Medium', patterns: [{ label: '1D DP', categoryId: 'dynamic-programming', templateId: 'dp-1d' }] },
      { title: 'Word Break', difficulty: 'Medium', patterns: [{ label: '1D DP', categoryId: 'dynamic-programming', templateId: 'dp-word-break' }] },
      { title: 'Combination Sum IV', difficulty: 'Medium', patterns: [{ label: 'Unbounded Knapsack DP', categoryId: 'dynamic-programming', templateId: 'dp-unbounded-knapsack' }] },
      { title: 'Unique Paths', difficulty: 'Medium', patterns: [{ label: '2D DP', categoryId: 'matrix', templateId: 'matrix-dp' }] },
      { title: 'Jump Game', difficulty: 'Medium', patterns: [{ label: 'Greedy', categoryId: 'greedy', templateId: 'greedy-jump-game' }] },
      { title: 'Longest Increasing Subsequence', difficulty: 'Medium', patterns: [{ label: 'LIS DP', categoryId: 'dynamic-programming', templateId: 'dp-lis' }] },
      { title: 'Longest Common Subsequence', difficulty: 'Medium', patterns: [{ label: '2D DP', categoryId: 'dynamic-programming', templateId: 'dp-lcs' }] },
      { title: 'Best Time to Buy/Sell Stock with Cooldown', difficulty: 'Medium', patterns: [{ label: 'State Machine DP', categoryId: 'dynamic-programming', templateId: 'dp-1d' }] },
      { title: 'Coin Change II', difficulty: 'Medium', patterns: [{ label: '0/1 Knapsack DP', categoryId: 'dynamic-programming', templateId: 'dp-01-knapsack' }] },
      { title: 'Target Sum', difficulty: 'Medium', patterns: [{ label: '0/1 Knapsack DP', categoryId: 'dynamic-programming', templateId: 'dp-01-knapsack' }] },
      { title: 'Interleaving String', difficulty: 'Medium', patterns: [{ label: '2D DP', categoryId: 'dynamic-programming', templateId: 'dp-2d' }] },
      { title: 'Edit Distance', difficulty: 'Hard', patterns: [{ label: '2D DP (LCS variant)', categoryId: 'dynamic-programming', templateId: 'dp-edit-distance' }] },
      { title: 'Burst Balloons', difficulty: 'Hard', patterns: [{ label: 'Interval DP', categoryId: 'dynamic-programming', templateId: 'dp-2d' }] },
      { title: 'Regular Expression Matching', difficulty: 'Hard', patterns: [{ label: '2D DP', categoryId: 'dynamic-programming', templateId: 'dp-2d' }] },
    ],
  },
  {
    group: 'Intervals',
    items: [
      { title: 'Meeting Rooms', difficulty: 'Easy', patterns: [{ label: 'Intervals Sort', categoryId: 'intervals', templateId: 'int-merge' }] },
      { title: 'Insert Interval', difficulty: 'Medium', patterns: [{ label: 'Intervals', categoryId: 'intervals', templateId: 'int-insert' }] },
      { title: 'Merge Intervals', difficulty: 'Medium', patterns: [{ label: 'Intervals', categoryId: 'intervals', templateId: 'int-merge' }] },
      { title: 'Non-overlapping Intervals', difficulty: 'Medium', patterns: [{ label: 'Greedy Intervals', categoryId: 'greedy', templateId: 'greedy-intervals' }] },
      { title: 'Meeting Rooms II', difficulty: 'Medium', patterns: [{ label: 'Intervals + Heap', categoryId: 'intervals', templateId: 'int-meeting-rooms' }] },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DIFF_COLOR = {
  Easy: 'var(--success)',
  Medium: 'var(--warning)',
  Hard: 'var(--danger)',
} as const

// ─── Component ────────────────────────────────────────────────────────────────

export function CheatsheetPage() {
  const navigate = useNavigate()
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState<'keywords' | 'blind75'>('keywords')

  const toggleGroup = (group: string) =>
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }))

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Cheat Sheet
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Pattern recognition shortcuts for technical interviews.
        </p>
      </div>

      {/* Tab switcher */}
      <div
        className="flex gap-1 p-1 rounded-lg mb-8 w-fit"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        {(
          [
            { key: 'keywords', icon: <Zap size={14} />, label: 'When You See…' },
            { key: 'blind75', icon: <BookOpen size={14} />, label: 'Blind 75' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-all"
            style={
              activeTab === tab.key
                ? { backgroundColor: 'var(--accent-primary)', color: '#fff' }
                : { color: 'var(--text-muted)' }
            }
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: When You See… ────────────────────────────────────────────── */}
      {activeTab === 'keywords' && (
        <div className="space-y-4">
          <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
            Spot these words/phrases in a problem → jump straight to the right template.
          </p>
          {KEYWORD_TRIGGERS.map((group) => (
            <div
              key={group.categoryId}
              className="rounded-lg border overflow-hidden"
              style={{ borderColor: 'var(--border-default)' }}
            >
              {/* Row header */}
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                style={{ backgroundColor: 'var(--bg-surface)' }}
                onClick={() => navigate(`/category/${group.categoryId}`)}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: group.color }}
                  />
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {group.pattern}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 justify-end max-w-[65%]">
                  {group.phrases.slice(0, 4).map((phrase) => (
                    <span
                      key={phrase}
                      className="text-xs rounded-full px-2 py-0.5 border"
                      style={{
                        backgroundColor: 'var(--bg-canvas)',
                        borderColor: group.color + '55',
                        color: group.color,
                      }}
                    >
                      {phrase}
                    </span>
                  ))}
                  {group.phrases.length > 4 && (
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      +{group.phrases.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Expanded phrase list + tip */}
              <div
                className="px-4 pb-4 pt-2 border-t"
                style={{
                  borderColor: 'var(--border-default)',
                  backgroundColor: 'var(--bg-canvas)',
                }}
              >
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {group.phrases.map((phrase) => (
                    <span
                      key={phrase}
                      className="text-xs rounded-full px-2.5 py-0.5 border"
                      style={{
                        borderColor: group.color + '55',
                        color: group.color,
                      }}
                    >
                      {phrase}
                    </span>
                  ))}
                </div>
                <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>
                  💡 {group.tip}
                </p>
                <button
                  className="mt-2 text-xs underline"
                  style={{ color: 'var(--accent-primary)' }}
                  onClick={() => navigate(`/category/${group.categoryId}`)}
                >
                  View {group.pattern} templates →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Tab: Blind 75 ─────────────────────────────────────────────────── */}
      {activeTab === 'blind75' && (
        <div className="space-y-3">
          <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
            The 75 most-asked LeetCode interview questions mapped to their core DSA pattern.
            Click a pattern chip to open that template.
          </p>
          {BLIND_75.map((section) => {
            const isOpen = openGroups[section.group] !== false // default open
            return (
              <div
                key={section.group}
                className="rounded-lg border overflow-hidden"
                style={{ borderColor: 'var(--border-default)' }}
              >
                {/* Section header */}
                <button
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                  style={{ backgroundColor: 'var(--bg-surface)' }}
                  onClick={() => toggleGroup(section.group)}
                >
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {section.group}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {section.items.length} problems
                    </span>
                    {isOpen ? (
                      <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} />
                    ) : (
                      <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
                    )}
                  </div>
                </button>

                {/* Problem rows */}
                {isOpen && (
                  <div style={{ backgroundColor: 'var(--bg-canvas)' }}>
                    {section.items.map((item, idx) => (
                      <div
                        key={item.title}
                        className="flex items-center justify-between px-4 py-2.5 border-t"
                        style={{ borderColor: 'var(--border-default)' }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className="text-xs w-5 text-right flex-shrink-0"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            {idx + 1}
                          </span>
                          <span
                            className="text-sm truncate"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {item.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                          <span
                            className="text-xs font-medium"
                            style={{ color: DIFF_COLOR[item.difficulty] }}
                          >
                            {item.difficulty}
                          </span>
                          {item.patterns.map((p) => (
                            <Badge
                              key={p.label}
                              variant="outline"
                              className="text-xs cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap"
                              style={{
                                borderColor: 'var(--accent-primary)',
                                color: 'var(--accent-primary)',
                              }}
                              onClick={() =>
                                navigate(
                                  p.templateId
                                    ? `/category/${p.categoryId}/template/${p.templateId}`
                                    : `/category/${p.categoryId}`
                                )
                              }
                            >
                              {p.label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
