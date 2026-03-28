import type { CategoryMeta, TemplateMeta } from '@/types'

export const categories: CategoryMeta[] = [
  { id: 'sorting', title: 'Sorting', icon: 'ArrowUpDown', group: 'foundations', templateCount: 8 },
  { id: 'binary-search', title: 'Binary Search', icon: 'Search', group: 'foundations', templateCount: 5 },
  { id: 'two-pointers', title: 'Two Pointers', icon: 'Columns2', group: 'foundations', templateCount: 4 },
  { id: 'sliding-window', title: 'Sliding Window', icon: 'PanelLeftOpen', group: 'foundations', templateCount: 4 },
  { id: 'hash-map', title: 'Hash Map / Set', icon: 'Hash', group: 'foundations', templateCount: 5 },
  { id: 'bfs-dfs', title: 'BFS / DFS', icon: 'Network', group: 'trees-graphs', templateCount: 5 },
  { id: 'dynamic-programming', title: 'Dynamic Programming', icon: 'Table2', group: 'advanced', templateCount: 8 },
  { id: 'backtracking', title: 'Backtracking', icon: 'Undo2', group: 'advanced', templateCount: 5 },
  { id: 'heap', title: 'Heap / Priority Queue', icon: 'Layers', group: 'advanced', templateCount: 4 },
  { id: 'union-find', title: 'Union-Find (DSU)', icon: 'GitMerge', group: 'advanced', templateCount: 3 },
  { id: 'trie', title: 'Trie', icon: 'FileText', group: 'trees-graphs', templateCount: 3 },
  { id: 'linked-list', title: 'Linked List', icon: 'Link', group: 'foundations', templateCount: 4 },
  { id: 'trees', title: 'Trees', icon: 'TreePine', group: 'trees-graphs', templateCount: 6 },
  { id: 'graphs', title: 'Graphs', icon: 'Waypoints', group: 'trees-graphs', templateCount: 4 },
  { id: 'intervals', title: 'Intervals', icon: 'CalendarRange', group: 'advanced', templateCount: 3 },
  { id: 'greedy', title: 'Greedy', icon: 'Zap', group: 'advanced', templateCount: 5 },
  { id: 'bit-manipulation', title: 'Bit Manipulation', icon: 'Binary', group: 'advanced', templateCount: 5 },
  { id: 'topological-sort', title: 'Topological Sort', icon: 'GitCommitHorizontal', group: 'trees-graphs', templateCount: 4 },
  { id: 'stack', title: 'Stack / Monotonic Stack', icon: 'Layers2', group: 'foundations', templateCount: 5 },
  { id: 'matrix', title: 'Matrix / 2D Grid', icon: 'Grid2X2', group: 'trees-graphs', templateCount: 5 },
]

export const templateIndex: TemplateMeta[] = [
  // Binary Search
  { id: 'bs-classic', title: 'Classic Binary Search', categoryId: 'binary-search', difficulty: 'beginner', estimatedMinutes: 5, tags: ['binary-search', 'sorted-array', 'divide-and-conquer'], timeComplexity: 'O(log n)', spaceComplexity: 'O(1)' },
  { id: 'bs-left-bound', title: 'Left Bound Binary Search', categoryId: 'binary-search', difficulty: 'intermediate', estimatedMinutes: 10, tags: ['binary-search', 'bisect-left', 'insertion-point', 'sorted-array'], timeComplexity: 'O(log n)', spaceComplexity: 'O(1)' },
  { id: 'bs-right-bound', title: 'Right Bound Binary Search', categoryId: 'binary-search', difficulty: 'intermediate', estimatedMinutes: 10, tags: ['binary-search', 'bisect-right', 'sorted-array'], timeComplexity: 'O(log n)', spaceComplexity: 'O(1)' },
  { id: 'bs-rotated-array', title: 'Search in Rotated Sorted Array', categoryId: 'binary-search', difficulty: 'advanced', estimatedMinutes: 15, tags: ['binary-search', 'rotated-array', 'divide-and-conquer'], timeComplexity: 'O(log n)', spaceComplexity: 'O(1)' },
  { id: 'bs-find-peak', title: 'Find Peak Element', categoryId: 'binary-search', difficulty: 'intermediate', estimatedMinutes: 10, tags: ['binary-search', 'peak-element'], timeComplexity: 'O(log n)', spaceComplexity: 'O(1)' },
  // Sorting
  { id: 'sort-bubble', title: 'Bubble Sort', categoryId: 'sorting', difficulty: 'beginner', estimatedMinutes: 5, tags: ['sorting', 'comparison'], timeComplexity: 'O(n²)', spaceComplexity: 'O(1)' },
  { id: 'sort-selection', title: 'Selection Sort', categoryId: 'sorting', difficulty: 'beginner', estimatedMinutes: 5, tags: ['sorting', 'comparison'], timeComplexity: 'O(n²)', spaceComplexity: 'O(1)' },
  { id: 'sort-insertion', title: 'Insertion Sort', categoryId: 'sorting', difficulty: 'beginner', estimatedMinutes: 5, tags: ['sorting', 'comparison'], timeComplexity: 'O(n²)', spaceComplexity: 'O(1)' },
  { id: 'sort-merge', title: 'Merge Sort', categoryId: 'sorting', difficulty: 'intermediate', estimatedMinutes: 15, tags: ['sorting', 'divide-and-conquer'], timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)' },
  { id: 'sort-quick', title: 'Quick Sort', categoryId: 'sorting', difficulty: 'intermediate', estimatedMinutes: 15, tags: ['sorting', 'divide-and-conquer'], timeComplexity: 'O(n log n)', spaceComplexity: 'O(log n)' },
  { id: 'sort-heap', title: 'Heap Sort', categoryId: 'sorting', difficulty: 'intermediate', estimatedMinutes: 15, tags: ['sorting', 'heap'], timeComplexity: 'O(n log n)', spaceComplexity: 'O(1)' },
  { id: 'sort-counting', title: 'Counting Sort', categoryId: 'sorting', difficulty: 'intermediate', estimatedMinutes: 10, tags: ['sorting', 'non-comparison'], timeComplexity: 'O(n + k)', spaceComplexity: 'O(k)' },
  { id: 'sort-radix', title: 'Radix Sort', categoryId: 'sorting', difficulty: 'advanced', estimatedMinutes: 15, tags: ['sorting', 'non-comparison'], timeComplexity: 'O(d·(n + k))', spaceComplexity: 'O(n + k)' },
  // Two Pointers
  { id: 'tp-opposite', title: 'Opposite Ends', categoryId: 'two-pointers', difficulty: 'beginner', estimatedMinutes: 5, tags: ['two-pointers', 'sorted-array'], timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
  { id: 'tp-fast-slow', title: "Fast/Slow (Floyd's Cycle)", categoryId: 'two-pointers', difficulty: 'intermediate', estimatedMinutes: 10, tags: ['two-pointers', 'linked-list', 'cycle-detection'], timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
  { id: 'tp-merge-sorted', title: 'Merge Sorted Arrays', categoryId: 'two-pointers', difficulty: 'beginner', estimatedMinutes: 10, tags: ['two-pointers', 'sorted-array', 'merge'], timeComplexity: 'O(n + m)', spaceComplexity: 'O(n + m)' },
  { id: 'tp-dutch-flag', title: 'Dutch National Flag', categoryId: 'two-pointers', difficulty: 'intermediate', estimatedMinutes: 10, tags: ['two-pointers', 'partitioning'], timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
  // Sliding Window
  { id: 'sw-fixed', title: 'Fixed Size Window', categoryId: 'sliding-window', difficulty: 'beginner', estimatedMinutes: 10, tags: ['sliding-window', 'subarray'], timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
  { id: 'sw-variable', title: 'Variable Size Window', categoryId: 'sliding-window', difficulty: 'intermediate', estimatedMinutes: 15, tags: ['sliding-window', 'subarray'], timeComplexity: 'O(n)', spaceComplexity: 'O(k)' },
  { id: 'sw-min-window', title: 'Minimum Window Substring', categoryId: 'sliding-window', difficulty: 'advanced', estimatedMinutes: 20, tags: ['sliding-window', 'hashmap', 'string'], timeComplexity: 'O(n)', spaceComplexity: 'O(k)' },
  { id: 'sw-max-window', title: 'Max Sliding Window', categoryId: 'sliding-window', difficulty: 'advanced', estimatedMinutes: 15, tags: ['sliding-window', 'deque', 'monotonic'], timeComplexity: 'O(n)', spaceComplexity: 'O(k)' },
  // BFS/DFS
  { id: 'bfs-graph', title: 'Graph BFS', categoryId: 'bfs-dfs', difficulty: 'intermediate', estimatedMinutes: 10, tags: ['bfs', 'graph', 'queue'], timeComplexity: 'O(V + E)', spaceComplexity: 'O(V)' },
  { id: 'bfs-grid', title: 'Grid BFS', categoryId: 'bfs-dfs', difficulty: 'intermediate', estimatedMinutes: 15, tags: ['bfs', 'grid', 'matrix'], timeComplexity: 'O(m·n)', spaceComplexity: 'O(m·n)' },
  { id: 'dfs-iterative', title: 'DFS Iterative', categoryId: 'bfs-dfs', difficulty: 'intermediate', estimatedMinutes: 10, tags: ['dfs', 'graph', 'stack'], timeComplexity: 'O(V + E)', spaceComplexity: 'O(V)' },
  { id: 'dfs-recursive', title: 'DFS Recursive', categoryId: 'bfs-dfs', difficulty: 'beginner', estimatedMinutes: 10, tags: ['dfs', 'graph', 'recursion'], timeComplexity: 'O(V + E)', spaceComplexity: 'O(V)' },
  { id: 'topo-sort', title: 'Topological Sort', categoryId: 'bfs-dfs', difficulty: 'advanced', estimatedMinutes: 15, tags: ['dfs', 'dag', 'topological-sort'], timeComplexity: 'O(V + E)', spaceComplexity: 'O(V)' },
  // Dynamic Programming
  { id: 'dp-memo', title: 'Memoization', categoryId: 'dynamic-programming', difficulty: 'intermediate', estimatedMinutes: 10, tags: ['dp', 'memoization', 'top-down'], timeComplexity: 'varies', spaceComplexity: 'O(n)' },
  { id: 'dp-tab', title: 'Tabulation', categoryId: 'dynamic-programming', difficulty: 'intermediate', estimatedMinutes: 10, tags: ['dp', 'tabulation', 'bottom-up'], timeComplexity: 'varies', spaceComplexity: 'O(n)' },
  { id: 'dp-1d', title: '1D DP', categoryId: 'dynamic-programming', difficulty: 'intermediate', estimatedMinutes: 15, tags: ['dp', '1d'], timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
  { id: 'dp-2d', title: '2D DP', categoryId: 'dynamic-programming', difficulty: 'advanced', estimatedMinutes: 20, tags: ['dp', '2d', 'matrix'], timeComplexity: 'O(m·n)', spaceComplexity: 'O(m·n)' },
  { id: 'dp-01-knapsack', title: '0/1 Knapsack', categoryId: 'dynamic-programming', difficulty: 'advanced', estimatedMinutes: 20, tags: ['dp', 'knapsack'], timeComplexity: 'O(n·W)', spaceComplexity: 'O(n·W)' },
  { id: 'dp-unbounded-knapsack', title: 'Unbounded Knapsack', categoryId: 'dynamic-programming', difficulty: 'advanced', estimatedMinutes: 15, tags: ['dp', 'knapsack'], timeComplexity: 'O(n·W)', spaceComplexity: 'O(W)' },
  { id: 'dp-lcs', title: 'Longest Common Subsequence', categoryId: 'dynamic-programming', difficulty: 'intermediate', estimatedMinutes: 15, tags: ['dp', 'string', 'subsequence'], timeComplexity: 'O(m·n)', spaceComplexity: 'O(m·n)' },
  { id: 'dp-lis', title: 'Longest Increasing Subsequence', categoryId: 'dynamic-programming', difficulty: 'intermediate', estimatedMinutes: 15, tags: ['dp', 'subsequence', 'binary-search'], timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)' },
  { id: 'dp-word-break', title: 'Word Break', categoryId: 'dynamic-programming', difficulty: 'intermediate', estimatedMinutes: 15, tags: ['dp', 'word-break', 'string'], timeComplexity: 'O(n²)', spaceComplexity: 'O(n)' },
  { id: 'dp-edit-distance', title: 'Edit Distance', categoryId: 'dynamic-programming', difficulty: 'advanced', estimatedMinutes: 20, tags: ['dp', 'edit-distance', 'string', '2d-dp'], timeComplexity: 'O(m·n)', spaceComplexity: 'O(n)' },
  // Backtracking
  { id: 'bt-permutations', title: 'Permutations', categoryId: 'backtracking', difficulty: 'intermediate', estimatedMinutes: 15, tags: ['backtracking', 'recursion'], timeComplexity: 'O(n!)', spaceComplexity: 'O(n)' },
  { id: 'bt-combinations', title: 'Combinations', categoryId: 'backtracking', difficulty: 'intermediate', estimatedMinutes: 15, tags: ['backtracking', 'recursion'], timeComplexity: 'O(C(n,k))', spaceComplexity: 'O(k)' },
  { id: 'bt-subsets', title: 'Subsets', categoryId: 'backtracking', difficulty: 'intermediate', estimatedMinutes: 10, tags: ['backtracking', 'recursion'], timeComplexity: 'O(2^n)', spaceComplexity: 'O(n)' },
  { id: 'bt-n-queens', title: 'N-Queens', categoryId: 'backtracking', difficulty: 'advanced', estimatedMinutes: 20, tags: ['backtracking', 'constraint-satisfaction'], timeComplexity: 'O(n!)', spaceComplexity: 'O(n)' },
  { id: 'bt-word-search', title: 'Word Search', categoryId: 'backtracking', difficulty: 'advanced', estimatedMinutes: 15, tags: ['backtracking', 'grid', 'dfs'], timeComplexity: 'O(m·n·4^L)', spaceComplexity: 'O(L)' },
  // Heap
  { id: 'heap-min-ops', title: 'Min Heap Operations', categoryId: 'heap', difficulty: 'intermediate', estimatedMinutes: 10, tags: ['heap', 'priority-queue'], timeComplexity: 'O(log n)', spaceComplexity: 'O(n)' },
  { id: 'heap-k-largest', title: 'K-Largest Elements', categoryId: 'heap', difficulty: 'intermediate', estimatedMinutes: 10, tags: ['heap', 'top-k'], timeComplexity: 'O(n log k)', spaceComplexity: 'O(k)' },
  { id: 'heap-merge-k', title: 'Merge K Sorted Lists', categoryId: 'heap', difficulty: 'advanced', estimatedMinutes: 15, tags: ['heap', 'merge', 'linked-list'], timeComplexity: 'O(N log k)', spaceComplexity: 'O(k)' },
  { id: 'heap-top-k-freq', title: 'Top K Frequent Elements', categoryId: 'heap', difficulty: 'intermediate', estimatedMinutes: 10, tags: ['heap', 'hashmap', 'top-k'], timeComplexity: 'O(n log k)', spaceComplexity: 'O(n)' },
  // Union-Find
  { id: 'uf-basic', title: 'Basic Union-Find', categoryId: 'union-find', difficulty: 'intermediate', estimatedMinutes: 10, tags: ['union-find', 'disjoint-set'], timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
  { id: 'uf-path-compression', title: 'Path Compression', categoryId: 'union-find', difficulty: 'intermediate', estimatedMinutes: 10, tags: ['union-find', 'optimization'], timeComplexity: 'O(α(n))', spaceComplexity: 'O(n)' },
  { id: 'uf-union-by-rank', title: 'Union by Rank', categoryId: 'union-find', difficulty: 'intermediate', estimatedMinutes: 10, tags: ['union-find', 'optimization'], timeComplexity: 'O(α(n))', spaceComplexity: 'O(n)' },
  // Trie
  { id: 'trie-basic', title: 'Insert/Search/Delete', categoryId: 'trie', difficulty: 'intermediate', estimatedMinutes: 15, tags: ['trie', 'string'], timeComplexity: 'O(m)', spaceComplexity: 'O(m)' },
  { id: 'trie-prefix', title: 'Prefix Search', categoryId: 'trie', difficulty: 'intermediate', estimatedMinutes: 10, tags: ['trie', 'prefix', 'autocomplete'], timeComplexity: 'O(m)', spaceComplexity: 'O(1)' },
  { id: 'trie-word-dict', title: 'Word Dictionary', categoryId: 'trie', difficulty: 'advanced', estimatedMinutes: 15, tags: ['trie', 'wildcard', 'dfs'], timeComplexity: 'O(m·26^m)', spaceComplexity: 'O(m)' },
  // Linked List
  { id: 'll-reverse', title: 'Reverse Linked List', categoryId: 'linked-list', difficulty: 'beginner', estimatedMinutes: 5, tags: ['linked-list', 'pointers'], timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
  { id: 'll-cycle', title: 'Detect Cycle', categoryId: 'linked-list', difficulty: 'intermediate', estimatedMinutes: 10, tags: ['linked-list', 'fast-slow', 'cycle-detection'], timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
  { id: 'll-merge-sorted', title: 'Merge Sorted Lists', categoryId: 'linked-list', difficulty: 'beginner', estimatedMinutes: 10, tags: ['linked-list', 'merge', 'two-pointers'], timeComplexity: 'O(n + m)', spaceComplexity: 'O(1)' },
  { id: 'll-lru-cache', title: 'LRU Cache', categoryId: 'linked-list', difficulty: 'advanced', estimatedMinutes: 20, tags: ['linked-list', 'hashmap', 'design'], timeComplexity: 'O(1)', spaceComplexity: 'O(n)' },
  { id: 'll-merge-k', title: 'Merge K Sorted Lists', categoryId: 'linked-list', difficulty: 'advanced', estimatedMinutes: 20, tags: ['linked-list', 'heap', 'merge'], timeComplexity: 'O(N log k)', spaceComplexity: 'O(k)' },
  // Trees
  { id: 'tree-inorder', title: 'Inorder Traversal', categoryId: 'trees', difficulty: 'beginner', estimatedMinutes: 5, tags: ['tree', 'traversal', 'bst'], timeComplexity: 'O(n)', spaceComplexity: 'O(h)' },
  { id: 'tree-preorder', title: 'Preorder Traversal', categoryId: 'trees', difficulty: 'beginner', estimatedMinutes: 5, tags: ['tree', 'traversal'], timeComplexity: 'O(n)', spaceComplexity: 'O(h)' },
  { id: 'tree-postorder', title: 'Postorder Traversal', categoryId: 'trees', difficulty: 'beginner', estimatedMinutes: 5, tags: ['tree', 'traversal'], timeComplexity: 'O(n)', spaceComplexity: 'O(h)' },
  { id: 'tree-level-order', title: 'Level Order Traversal', categoryId: 'trees', difficulty: 'intermediate', estimatedMinutes: 10, tags: ['tree', 'bfs', 'queue'], timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
  { id: 'tree-lca', title: 'Lowest Common Ancestor', categoryId: 'trees', difficulty: 'intermediate', estimatedMinutes: 15, tags: ['tree', 'recursion', 'bst'], timeComplexity: 'O(n)', spaceComplexity: 'O(h)' },
  { id: 'tree-serialize', title: 'Serialize/Deserialize', categoryId: 'trees', difficulty: 'advanced', estimatedMinutes: 20, tags: ['tree', 'bfs', 'design'], timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
  // Graphs
  { id: 'graph-dijkstra', title: "Dijkstra's Algorithm", categoryId: 'graphs', difficulty: 'advanced', estimatedMinutes: 20, tags: ['graph', 'shortest-path', 'heap'], timeComplexity: 'O((V+E) log V)', spaceComplexity: 'O(V)' },
  { id: 'graph-bellman-ford', title: 'Bellman-Ford', categoryId: 'graphs', difficulty: 'advanced', estimatedMinutes: 15, tags: ['graph', 'shortest-path', 'negative-weights'], timeComplexity: 'O(V·E)', spaceComplexity: 'O(V)' },
  { id: 'graph-prims', title: "Prim's MST", categoryId: 'graphs', difficulty: 'advanced', estimatedMinutes: 15, tags: ['graph', 'mst', 'heap'], timeComplexity: 'O((V+E) log V)', spaceComplexity: 'O(V)' },
  { id: 'graph-kruskals', title: "Kruskal's MST", categoryId: 'graphs', difficulty: 'advanced', estimatedMinutes: 15, tags: ['graph', 'mst', 'union-find'], timeComplexity: 'O(E log E)', spaceComplexity: 'O(V)' },
  // Hash Map / Set
  { id: 'hm-frequency-count', title: 'Frequency / Count Map', categoryId: 'hash-map', difficulty: 'beginner', estimatedMinutes: 5, tags: ['hash-map', 'counter', 'frequency'], timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
  { id: 'hm-two-sum', title: 'Two Sum (Hash Map)', categoryId: 'hash-map', difficulty: 'beginner', estimatedMinutes: 10, tags: ['hash-map', 'complement', 'two-sum'], timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
  { id: 'hm-hash-set', title: 'Hash Set Patterns', categoryId: 'hash-map', difficulty: 'beginner', estimatedMinutes: 10, tags: ['hash-set', 'deduplication', 'consecutive'], timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
  { id: 'hm-sliding-window-map', title: 'Hash Map + Sliding Window', categoryId: 'hash-map', difficulty: 'intermediate', estimatedMinutes: 15, tags: ['hash-map', 'sliding-window', 'substring'], timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
  { id: 'hm-prefix-sum', title: 'Prefix Sum + Hash Map', categoryId: 'hash-map', difficulty: 'intermediate', estimatedMinutes: 15, tags: ['hash-map', 'prefix-sum', 'subarray'], timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
  // Intervals
  { id: 'int-merge', title: 'Merge Intervals', categoryId: 'intervals', difficulty: 'intermediate', estimatedMinutes: 10, tags: ['intervals', 'sorting'], timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)' },
  { id: 'int-insert', title: 'Insert Interval', categoryId: 'intervals', difficulty: 'intermediate', estimatedMinutes: 15, tags: ['intervals', 'binary-search'], timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
  { id: 'int-meeting-rooms', title: 'Meeting Rooms', categoryId: 'intervals', difficulty: 'intermediate', estimatedMinutes: 10, tags: ['intervals', 'sorting', 'heap'], timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)' },
  // Greedy
  { id: 'greedy-jump-game', title: 'Jump Game I & II', categoryId: 'greedy', difficulty: 'intermediate', estimatedMinutes: 20, tags: ['greedy', 'array', 'jump-game'], timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
  { id: 'greedy-intervals', title: 'Interval Scheduling & Meeting Rooms', categoryId: 'greedy', difficulty: 'intermediate', estimatedMinutes: 25, tags: ['greedy', 'intervals', 'sorting', 'heap'], timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)' },
  { id: 'greedy-gas-station', title: 'Gas Station Circular Tour', categoryId: 'greedy', difficulty: 'intermediate', estimatedMinutes: 15, tags: ['greedy', 'array', 'circular'], timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
  { id: 'greedy-task-scheduler', title: 'Task Scheduler', categoryId: 'greedy', difficulty: 'intermediate', estimatedMinutes: 15, tags: ['greedy', 'counting', 'task-scheduler'], timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
  { id: 'greedy-two-city', title: 'Two-City Scheduling', categoryId: 'greedy', difficulty: 'intermediate', estimatedMinutes: 15, tags: ['greedy', 'sorting', 'two-city'], timeComplexity: 'O(n log n)', spaceComplexity: 'O(1)' },
  // Bit Manipulation
  { id: 'bit-basics', title: 'Bit Operations Cheatsheet', categoryId: 'bit-manipulation', difficulty: 'beginner', estimatedMinutes: 15, tags: ['bit-manipulation', 'fundamentals', 'bitmask'], timeComplexity: 'O(1)', spaceComplexity: 'O(1)' },
  { id: 'bit-xor-tricks', title: 'XOR Tricks', categoryId: 'bit-manipulation', difficulty: 'intermediate', estimatedMinutes: 20, tags: ['bit-manipulation', 'xor', 'single-number'], timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
  { id: 'bit-counting', title: 'Counting Bits', categoryId: 'bit-manipulation', difficulty: 'beginner', estimatedMinutes: 15, tags: ['bit-manipulation', 'dynamic-programming', 'counting-bits'], timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
  { id: 'bit-masks', title: 'Bitmask for Subsets', categoryId: 'bit-manipulation', difficulty: 'intermediate', estimatedMinutes: 20, tags: ['bit-manipulation', 'bitmask', 'subsets', 'combinatorics'], timeComplexity: 'O(2^n · n)', spaceComplexity: 'O(n)' },
  { id: 'bit-reverse', title: 'Reverse Bits', categoryId: 'bit-manipulation', difficulty: 'intermediate', estimatedMinutes: 15, tags: ['bit-manipulation', 'reverse-bits', '32-bit'], timeComplexity: 'O(1)', spaceComplexity: 'O(1)' },
  // Topological Sort
  { id: 'topo-kahn', title: "Kahn's Algorithm (BFS Topological Sort)", categoryId: 'topological-sort', difficulty: 'intermediate', estimatedMinutes: 20, tags: ['topological-sort', 'BFS', 'graphs', 'cycle-detection'], timeComplexity: 'O(V + E)', spaceComplexity: 'O(V + E)' },
  { id: 'topo-dfs', title: 'DFS-Based Topological Sort', categoryId: 'topological-sort', difficulty: 'intermediate', estimatedMinutes: 20, tags: ['topological-sort', 'DFS', 'graphs', 'cycle-detection'], timeComplexity: 'O(V + E)', spaceComplexity: 'O(V)' },
  { id: 'topo-course-schedule', title: 'Course Schedule I & II', categoryId: 'topological-sort', difficulty: 'intermediate', estimatedMinutes: 20, tags: ['topological-sort', 'BFS', 'course-schedule', 'cycle-detection'], timeComplexity: 'O(V + E)', spaceComplexity: 'O(V + E)' },
  { id: 'topo-alien-dict', title: 'Alien Dictionary', categoryId: 'topological-sort', difficulty: 'advanced', estimatedMinutes: 30, tags: ['topological-sort', 'BFS', 'alien-dictionary', 'graphs', 'strings'], timeComplexity: 'O(C)', spaceComplexity: 'O(1)' },
  // Stack / Monotonic Stack
  { id: 'stack-basics', title: 'Stack Basics: Push / Pop / Peek', categoryId: 'stack', difficulty: 'beginner', estimatedMinutes: 10, tags: ['stack', 'deque', 'parentheses'], timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
  { id: 'stack-min', title: 'Min Stack (O(1) getMin)', categoryId: 'stack', difficulty: 'intermediate', estimatedMinutes: 15, tags: ['stack', 'design', 'min-stack'], timeComplexity: 'O(1)', spaceComplexity: 'O(n)' },
  { id: 'stack-monotonic-increasing', title: 'Monotonic Increasing Stack', categoryId: 'stack', difficulty: 'intermediate', estimatedMinutes: 20, tags: ['stack', 'monotonic', 'next-smaller'], timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
  { id: 'stack-monotonic-decreasing', title: 'Monotonic Decreasing Stack', categoryId: 'stack', difficulty: 'intermediate', estimatedMinutes: 20, tags: ['stack', 'monotonic', 'next-greater', 'daily-temperatures'], timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
  { id: 'stack-largest-rectangle', title: 'Largest Rectangle in Histogram', categoryId: 'stack', difficulty: 'advanced', estimatedMinutes: 25, tags: ['stack', 'monotonic', 'histogram', 'hard'], timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
  // Matrix / 2D Grid
  { id: 'matrix-bfs', title: 'BFS on 2D Grid', categoryId: 'matrix', difficulty: 'intermediate', estimatedMinutes: 15, tags: ['matrix', 'bfs', 'grid', 'flood-fill', 'islands'], timeComplexity: 'O(m·n)', spaceComplexity: 'O(m·n)' },
  { id: 'matrix-dfs', title: 'DFS on 2D Grid', categoryId: 'matrix', difficulty: 'intermediate', estimatedMinutes: 15, tags: ['matrix', 'dfs', 'grid', 'recursion', 'islands'], timeComplexity: 'O(m·n)', spaceComplexity: 'O(m·n)' },
  { id: 'matrix-spiral', title: 'Spiral Matrix Traversal', categoryId: 'matrix', difficulty: 'intermediate', estimatedMinutes: 15, tags: ['matrix', 'spiral', 'boundaries', 'simulation'], timeComplexity: 'O(m·n)', spaceComplexity: 'O(1)' },
  { id: 'matrix-rotate', title: 'Rotate Matrix In-Place', categoryId: 'matrix', difficulty: 'intermediate', estimatedMinutes: 15, tags: ['matrix', 'rotate', 'transpose', 'in-place'], timeComplexity: 'O(n²)', spaceComplexity: 'O(1)' },
  { id: 'matrix-dp', title: 'Matrix DP: Unique Paths & Min Path Sum', categoryId: 'matrix', difficulty: 'intermediate', estimatedMinutes: 20, tags: ['matrix', 'dp', 'unique-paths', 'min-path-sum'], timeComplexity: 'O(m·n)', spaceComplexity: 'O(m·n)' },
]

export function getTemplatesByCategory(categoryId: string): TemplateMeta[] {
  return templateIndex.filter((t) => t.categoryId === categoryId)
}

export function getCategoryMeta(categoryId: string): CategoryMeta | undefined {
  return categories.find((c) => c.id === categoryId)
}

export async function loadCategory(categoryId: string) {
  const loaders: Record<string, () => Promise<{ default: import('@/types').Category }>> = {
    'sorting': () => import('./templates/sorting'),
    'binary-search': () => import('./templates/binary-search'),
    'two-pointers': () => import('./templates/two-pointer'),
    'sliding-window': () => import('./templates/sliding-window'),
    'bfs-dfs': () => import('./templates/bfs-dfs'),
    'dynamic-programming': () => import('./templates/dynamic-programming'),
    'backtracking': () => import('./templates/backtracking'),
    'heap': () => import('./templates/heap'),
    'union-find': () => import('./templates/union-find'),
    'trie': () => import('./templates/trie'),
    'linked-list': () => import('./templates/linked-list'),
    'trees': () => import('./templates/trees'),
    'graphs': () => import('./templates/graphs'),
    'intervals': () => import('./templates/intervals'),
    'hash-map': () => import('./templates/hash-map'),
    'greedy': () => import('./templates/greedy'),
    'bit-manipulation': () => import('./templates/bit-manipulation'),
    'topological-sort': () => import('./templates/topological-sort'),
    'stack': () => import('./templates/stack'),
    'matrix': () => import('./templates/matrix'),
  }

  const loader = loaders[categoryId]
  if (!loader) throw new Error(`Unknown category: ${categoryId}`)

  const module = await loader()
  return module.default
}
