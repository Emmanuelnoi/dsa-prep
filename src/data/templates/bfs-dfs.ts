import type { Category } from '@/types'

const bfsDfs: Category = {
  id: 'bfs-dfs',
  title: 'BFS / DFS',
  icon: 'Network',
  group: 'trees-graphs',
  templates: [
    {
      id: 'bfs-graph',
      title: 'Graph BFS',
      description: 'Explore a graph level by level using a queue. Finds the shortest path in an unweighted graph. Uses a visited set to avoid revisiting nodes.',
      difficulty: 'intermediate',
      estimatedMinutes: 10,
      code: `from collections import deque

def bfs(graph: dict, start: int) -> list[int]:
    visited = {start}
    queue = deque([start])
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order`,
      annotatedCode: `from collections import deque

def bfs(graph: dict, start: int) -> list[int]:
    visited = {start}       # mark start as visited immediately (not after dequeue)
    queue = deque([start])  # FIFO queue
    order = []
    while queue:
        node = queue.popleft()   # process nodes in FIFO order = level by level
        order.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)     # mark visited BEFORE enqueuing, not after
                queue.append(neighbor)
    return order`,
      explanation: [
        { lines: [4, 5], text: 'Mark start as visited BEFORE the loop — prevents it from being added to the queue multiple times if it has back-edges.' },
        { lines: [8], text: 'popleft() gives FIFO order — nodes are processed in the order they were discovered (level by level).' },
        { lines: [11, 12, 13], text: 'Mark neighbors visited BEFORE enqueuing — not after dequeuing. This prevents the same node from being enqueued multiple times by different parents.' },
      ],
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      tags: ['bfs', 'graph', 'queue', 'shortest-path'],
      commonMistakes: [
        'Marking visited AFTER dequeue — the same node can be enqueued multiple times, leading to O(E) time and incorrect shortest paths.',
        'Using a list as a queue (list.pop(0) is O(n)) — use collections.deque.',
      ],
      quizzes: [
        { question: 'Why does BFS find the shortest path in an unweighted graph?', answer: 'BFS explores nodes level by level (distance 1, then 2, then 3, ...). The first time a node is reached, it is via the shortest path. In a weighted graph, use Dijkstra\'s.', type: 'recall' },
      ],
      variants: ['Multi-source BFS (start with multiple nodes in the queue)', 'BFS for shortest path with reconstruction'],
      prerequisites: [],
      nextTemplate: 'bfs-grid',
    },
    {
      id: 'bfs-grid',
      title: 'Grid BFS',
      description: 'BFS on a 2D grid. Treat each cell as a node; neighbors are the 4 (or 8) adjacent cells. Classic for shortest path in a maze.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `from collections import deque

def bfs_grid(grid: list[list[int]], start: tuple, end: tuple) -> int:
    rows, cols = len(grid), len(grid[0])
    r0, c0 = start
    if grid[r0][c0] == 1:
        return -1
    queue = deque([(r0, c0, 0)])
    visited = {(r0, c0)}
    dirs = [(0,1),(0,-1),(1,0),(-1,0)]
    while queue:
        r, c, dist = queue.popleft()
        if (r, c) == end:
            return dist
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and (nr, nc) not in visited and grid[nr][nc] == 0:
                visited.add((nr, nc))
                queue.append((nr, nc, dist + 1))
    return -1`,
      annotatedCode: `from collections import deque

def bfs_grid(grid: list[list[int]], start: tuple, end: tuple) -> int:
    rows, cols = len(grid), len(grid[0])
    r0, c0 = start
    if grid[r0][c0] == 1:  # start is blocked
        return -1
    queue = deque([(r0, c0, 0)])  # (row, col, distance)
    visited = {(r0, c0)}
    dirs = [(0,1),(0,-1),(1,0),(-1,0)]  # 4-directional movement
    while queue:
        r, c, dist = queue.popleft()
        if (r, c) == end:      # reached destination
            return dist
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if (0 <= nr < rows and 0 <= nc < cols   # in bounds
                    and (nr, nc) not in visited       # not visited
                    and grid[nr][nc] == 0):           # not blocked
                visited.add((nr, nc))
                queue.append((nr, nc, dist + 1))
    return -1  # no path found`,
      explanation: [
        { lines: [8], text: 'Store the distance in the queue tuple — no need for a separate distance array.' },
        { lines: [10], text: 'Direction vectors for 4-connected movement. For 8-connected, add the 4 diagonal tuples.' },
        { lines: [15, 16, 17, 18], text: 'Bounds check + visited check + obstacle check. All three conditions required before enqueuing.' },
      ],
      timeComplexity: 'O(m·n)',
      spaceComplexity: 'O(m·n)',
      tags: ['bfs', 'grid', 'matrix', 'shortest-path'],
      commonMistakes: [
        'Not checking bounds before accessing grid[nr][nc] — causes IndexError.',
        'For multi-source BFS (e.g., 0s spreading from all 1s): initialize queue with ALL sources at distance 0.',
      ],
      quizzes: [
        { question: 'How would you modify this for 0/1 BFS (edges have weight 0 or 1)?', answer: 'Use a deque: append to front for weight-0 edges (deque.appendleft) and to back for weight-1 edges (deque.append). This is Dijkstra\'s algorithm specialized for 0/1 weights.', type: 'recall' },
      ],
      variants: ['0/1 BFS', 'Multi-source BFS'],
      prerequisites: ['bfs-graph'],
      nextTemplate: 'dfs-recursive',
    },
    {
      id: 'dfs-recursive',
      title: 'DFS Recursive',
      description: 'Explore as deep as possible along each branch before backtracking. The call stack implicitly acts as the stack.',
      difficulty: 'beginner',
      estimatedMinutes: 10,
      code: `def dfs(graph: dict, node: int, visited: set = None) -> list[int]:
    if visited is None:
        visited = set()
    visited.add(node)
    order = [node]
    for neighbor in graph[node]:
        if neighbor not in visited:
            order.extend(dfs(graph, neighbor, visited))
    return order`,
      annotatedCode: `def dfs(graph: dict, node: int, visited: set = None) -> list[int]:
    if visited is None:
        visited = set()   # mutable default argument workaround
    visited.add(node)
    order = [node]
    for neighbor in graph[node]:
        if neighbor not in visited:
            order.extend(dfs(graph, neighbor, visited))  # recurse
    return order`,
      explanation: [
        { lines: [2, 3], text: 'Python gotcha: never use a mutable default argument. Use `None` and create the set inside the function.' },
        { lines: [4, 5], text: 'Mark visited and process current node before recursing into children.' },
        { lines: [7, 8], text: 'Recurse into unvisited neighbors. The function returns after exploring the full subtree of each neighbor.' },
      ],
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      tags: ['dfs', 'graph', 'recursion'],
      commonMistakes: [
        'Python mutable default argument: `def dfs(graph, node, visited=set())` — the same set is reused across all calls!',
        'For large graphs, recursion can hit Python\'s default recursion limit (~1000). Use iterative DFS.',
      ],
      quizzes: [
        { question: 'DFS vs BFS: which is better for detecting cycles in a directed graph?', answer: 'DFS — using "gray" (in-stack) and "black" (fully explored) coloring. A back edge (to a gray node) indicates a cycle. BFS can also detect cycles but DFS is more natural.', type: 'recall' },
      ],
      variants: ['Pre-order DFS', 'Post-order DFS (process node AFTER children)'],
      prerequisites: [],
      nextTemplate: 'dfs-iterative',
    },
    {
      id: 'dfs-iterative',
      title: 'DFS Iterative',
      description: 'DFS using an explicit stack instead of recursion. Avoids Python\'s recursion limit and is preferred for large graphs.',
      difficulty: 'intermediate',
      estimatedMinutes: 10,
      code: `def dfs_iterative(graph: dict, start: int) -> list[int]:
    visited = set()
    stack = [start]
    order = []
    while stack:
        node = stack.pop()
        if node in visited:
            continue
        visited.add(node)
        order.append(node)
        for neighbor in reversed(graph[node]):
            if neighbor not in visited:
                stack.append(neighbor)
    return order`,
      annotatedCode: `def dfs_iterative(graph: dict, start: int) -> list[int]:
    visited = set()
    stack = [start]
    order = []
    while stack:
        node = stack.pop()    # LIFO — explore most recently pushed node first
        if node in visited:   # may be pushed multiple times by different parents
            continue
        visited.add(node)
        order.append(node)
        for neighbor in reversed(graph[node]):  # reversed to match recursive DFS order
            if neighbor not in visited:
                stack.append(neighbor)
    return order`,
      explanation: [
        { lines: [6], text: '`stack.pop()` gives LIFO order — unlike BFS which uses popleft().' },
        { lines: [7, 8], text: 'Unlike BFS, we mark visited AFTER popping (not before pushing) to handle nodes pushed multiple times. Either approach works; this style is simpler.' },
        { lines: [11], text: 'Reverse neighbors to match the traversal order of recursive DFS (first neighbor is explored first).' },
      ],
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      tags: ['dfs', 'graph', 'stack', 'iterative'],
      commonMistakes: [
        'Using a regular list as a stack with pop() is O(1) — no issue. But list.pop(0) would be O(n) (that\'s a queue, not a stack).',
        'Not handling the "node already visited" check after popping — nodes can be in the stack multiple times.',
      ],
      quizzes: [
        { question: 'Why might a node appear in the stack multiple times?', answer: 'Multiple neighbors can push the same node before it is ever popped. The visited check after popping ensures it is only processed once.', type: 'recall' },
      ],
      variants: [],
      prerequisites: ['dfs-recursive'],
      nextTemplate: 'topo-sort',
    },
    {
      id: 'topo-sort',
      title: 'Topological Sort',
      description: 'Order nodes in a DAG so every directed edge u→v has u before v. Use DFS post-order (reverse finish order) or Kahn\'s algorithm (BFS + in-degree).',
      difficulty: 'advanced',
      estimatedMinutes: 15,
      code: `from collections import deque

def topo_sort_kahn(graph: dict, n: int) -> list[int]:
    in_degree = [0] * n
    for u in graph:
        for v in graph[u]:
            in_degree[v] += 1
    queue = deque([i for i in range(n) if in_degree[i] == 0])
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    return order if len(order) == n else []`,
      annotatedCode: `from collections import deque

def topo_sort_kahn(graph: dict, n: int) -> list[int]:
    in_degree = [0] * n
    for u in graph:
        for v in graph[u]:
            in_degree[v] += 1   # count incoming edges per node
    queue = deque([i for i in range(n) if in_degree[i] == 0])  # start with nodes that have no prerequisites
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1          # "remove" this edge
            if in_degree[neighbor] == 0:      # all prerequisites satisfied
                queue.append(neighbor)
    return order if len(order) == n else []   # empty list = cycle detected`,
      explanation: [
        { lines: [4, 5, 6, 7], text: 'Count in-degrees (number of prerequisites) for every node by scanning all edges.' },
        { lines: [8], text: 'Seed the queue with all nodes that have zero prerequisites — they are safe to process first.' },
        { lines: [13, 14, 15], text: 'After processing a node, "remove" its outgoing edges by decrementing in-degrees of neighbors. When a neighbor reaches 0, all its prerequisites are satisfied — add to queue.' },
        { lines: [17], text: 'If the output order contains all n nodes, the graph is a valid DAG. If fewer nodes were processed, a cycle exists and topological sort is impossible.' },
      ],
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      tags: ['dfs', 'dag', 'topological-sort', 'bfs', 'kahn'],
      commonMistakes: [
        'Not checking `len(order) == n` — a cycle means not all nodes are reachable from in-degree-0 nodes.',
        'For DFS topological sort: append node to result AFTER visiting all descendants (post-order), then reverse.',
      ],
      quizzes: [
        { question: 'What does it mean if Kahn\'s algorithm processes fewer than n nodes?', answer: 'A cycle exists in the graph. Nodes in the cycle never reach in-degree 0, so they are never added to the queue.', type: 'recall' },
      ],
      variants: ['DFS post-order topological sort'],
      prerequisites: ['bfs-graph', 'dfs-iterative'],
    },
  ],
}

export default bfsDfs
