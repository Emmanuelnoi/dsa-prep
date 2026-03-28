import type { Category } from '@/types'

const graphs: Category = {
  id: 'graphs',
  title: 'Graphs',
  icon: 'Share2',
  group: 'trees-graphs',
  templates: [
    {
      id: 'graph-dijkstra',
      title: "Dijkstra's Shortest Path",
      description: "Single-source shortest path for graphs with non-negative edge weights. Uses a min-heap priority queue. O((V + E) log V).",
      difficulty: 'advanced',
      estimatedMinutes: 20,
      code: `import heapq

def dijkstra(graph: dict, start: int) -> dict:
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    heap = [(0, start)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:
            continue
        for v, weight in graph[u]:
            new_dist = dist[u] + weight
            if new_dist < dist[v]:
                dist[v] = new_dist
                heapq.heappush(heap, (new_dist, v))
    return dist`,
      annotatedCode: `import heapq

def dijkstra(graph: dict, start: int) -> dict:
    # graph format: {node: [(neighbor, weight), ...]}
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    heap = [(0, start)]   # (distance, node)
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:   # stale entry: we already found a shorter path to u
            continue
        for v, weight in graph[u]:
            new_dist = dist[u] + weight
            if new_dist < dist[v]:   # relaxation: found shorter path to v
                dist[v] = new_dist
                heapq.heappush(heap, (new_dist, v))  # may push duplicates (ok)
    return dist`,
      explanation: [
        { lines: [4, 5, 6], text: 'Initialize all distances to infinity, start node to 0. The heap processes (distance, node) in non-decreasing distance order.' },
        { lines: [9, 10], text: 'Lazy deletion: when we pop (d, u), check if d > dist[u]. If so, we already processed u via a shorter path — skip this stale entry.' },
        { lines: [11, 12, 13, 14, 15], text: 'Relaxation: for each neighbor v, if going through u is cheaper than any previously known path to v, update and enqueue.' },
      ],
      timeComplexity: 'O((V + E) log V)',
      spaceComplexity: 'O(V + E)',
      tags: ['graphs', 'dijkstra', 'shortest-path', 'heap'],
      commonMistakes: [
        'Negative weights: Dijkstra\'s fails with negative edges. Use Bellman-Ford instead.',
        'Not skipping stale heap entries — processes same node multiple times unnecessarily.',
      ],
      quizzes: [
        { question: 'Why does Dijkstra\'s fail with negative edge weights?', answer: 'Dijkstra\'s assumes that once a node is popped from the heap, its shortest distance is finalized. Negative edges can create shorter paths via later-discovered routes, violating this assumption.', type: 'recall' },
      ],
      variants: ['Dijkstra with path reconstruction', '0/1 BFS for 0 or 1 weight edges'],
      prerequisites: ['bfs-graph'],
      nextTemplate: 'graph-bellman-ford',
    },
    {
      id: 'graph-bellman-ford',
      title: 'Bellman-Ford',
      description: 'Single-source shortest path that handles negative edge weights. Detects negative cycles. Runs V-1 relaxation passes over all edges.',
      difficulty: 'advanced',
      estimatedMinutes: 15,
      code: `def bellman_ford(n: int, edges: list, start: int) -> list[float]:
    dist = [float('inf')] * n
    dist[start] = 0
    for _ in range(n - 1):
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            return []
    return dist`,
      annotatedCode: `def bellman_ford(n: int, edges: list, start: int) -> list[float]:
    # edges format: [(u, v, weight), ...]
    dist = [float('inf')] * n
    dist[start] = 0
    for _ in range(n - 1):   # n-1 passes: longest simple path has at most n-1 edges
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w    # relax edge (u,v)
    # n-th pass: if any relaxation still happens, negative cycle exists
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            return []   # negative cycle detected
    return dist`,
      explanation: [
        { lines: [4, 5, 6, 7], text: 'After k passes, dist[v] contains the shortest path using at most k edges. After n-1 passes, all shortest paths in a graph with no negative cycles are found.' },
        { lines: [9, 10, 11], text: 'The n-th pass checks if any edge can still be relaxed. If yes, a negative cycle is reachable from start — distances can decrease infinitely.' },
      ],
      timeComplexity: 'O(V · E)',
      spaceComplexity: 'O(V)',
      tags: ['graphs', 'bellman-ford', 'shortest-path', 'negative-weights'],
      commonMistakes: [
        'Running only n-2 passes — not enough for graphs where the shortest path uses exactly n-1 edges.',
      ],
      quizzes: [
        { question: 'When should you use Bellman-Ford over Dijkstra\'s?', answer: 'When the graph has negative edge weights. Bellman-Ford handles them correctly. Dijkstra\'s requires non-negative weights.', type: 'recall' },
      ],
      variants: ['SPFA (Bellman-Ford with queue optimization)'],
      prerequisites: ['graph-dijkstra'],
      nextTemplate: 'graph-prims',
    },
    {
      id: 'graph-prims',
      title: "Prim's MST",
      description: "Build a Minimum Spanning Tree greedily. Start from any node, always add the cheapest edge connecting the MST to a new node. Uses a min-heap.",
      difficulty: 'advanced',
      estimatedMinutes: 20,
      code: `import heapq

def prims_mst(graph: dict, start: int) -> int:
    visited = set()
    heap = [(0, start)]
    total_cost = 0
    while heap:
        cost, u = heapq.heappop(heap)
        if u in visited:
            continue
        visited.add(u)
        total_cost += cost
        for v, weight in graph[u]:
            if v not in visited:
                heapq.heappush(heap, (weight, v))
    return total_cost`,
      annotatedCode: `import heapq

def prims_mst(graph: dict, start: int) -> int:
    visited = set()               # nodes already in the MST
    heap = [(0, start)]           # (edge_weight, node)
    total_cost = 0
    while heap:
        cost, u = heapq.heappop(heap)
        if u in visited:
            continue              # already in MST, skip
        visited.add(u)
        total_cost += cost        # add this edge to MST
        for v, weight in graph[u]:
            if v not in visited:  # only consider nodes not yet in MST
                heapq.heappush(heap, (weight, v))
    return total_cost`,
      explanation: [
        { lines: [4, 5], text: 'Start with a virtual edge of cost 0 to the start node. The heap stores (edge_cost, destination_node).' },
        { lines: [8, 9, 10], text: 'Lazy deletion: skip nodes already in the MST. The first time a node is popped, it is added via its cheapest available edge.' },
        { lines: [12, 13, 14], text: 'Add all edges from u to non-MST neighbors. The heap ensures we always process the cheapest edge next.' },
      ],
      timeComplexity: 'O((V + E) log V)',
      spaceComplexity: 'O(V + E)',
      tags: ['graphs', 'mst', 'prims', 'greedy', 'heap'],
      commonMistakes: [
        'Adding the start node with cost 0 — Prim\'s counts the edge cost, not node cost. The first node added has edge cost 0 (no edge).',
      ],
      quizzes: [
        { question: 'Prim\'s vs Kruskal\'s MST: what is the key difference?', answer: 'Prim\'s grows the MST from a single start node (node-centric, like Dijkstra\'s). Kruskal\'s sorts all edges and greedily adds the cheapest one that doesn\'t form a cycle (edge-centric, uses Union-Find).', type: 'recall' },
      ],
      variants: ['Kruskal\'s MST (sort edges + Union-Find)'],
      prerequisites: ['graph-dijkstra'],
      nextTemplate: 'graph-kruskals',
    },
    {
      id: 'graph-kruskals',
      title: "Kruskal's MST",
      description: "Build an MST by sorting all edges by weight and greedily adding edges that don't create cycles. Uses Union-Find for O(1) cycle detection.",
      difficulty: 'advanced',
      estimatedMinutes: 15,
      code: `def kruskals_mst(n: int, edges: list[list[int]]) -> int:
    edges.sort(key=lambda e: e[2])
    uf = UnionFind(n)
    total_cost = 0
    edges_used = 0
    for u, v, w in edges:
        if uf.union(u, v):
            total_cost += w
            edges_used += 1
            if edges_used == n - 1:
                break
    return total_cost if edges_used == n - 1 else -1`,
      annotatedCode: `def kruskals_mst(n: int, edges: list[list[int]]) -> int:
    # edges format: [[u, v, weight], ...]
    edges.sort(key=lambda e: e[2])  # sort all edges by weight ascending
    uf = UnionFind(n)
    total_cost = 0
    edges_used = 0
    for u, v, w in edges:
        if uf.union(u, v):    # union returns False if u,v already connected (cycle)
            total_cost += w   # safe to add this edge: no cycle
            edges_used += 1
            if edges_used == n - 1:  # MST is complete: n nodes need exactly n-1 edges
                break
    return total_cost if edges_used == n - 1 else -1  # -1 if graph is disconnected`,
      explanation: [
        { lines: [2], text: 'Sort all edges by weight. Greedy: process cheapest edges first.' },
        { lines: [6, 7, 8, 9, 10, 11], text: 'For each edge: try to union the two endpoints. If they\'re already connected (same component), adding this edge would create a cycle — skip it. Otherwise add to MST.' },
        { lines: [12], text: 'An MST of n nodes has exactly n-1 edges. If edges_used < n-1 after processing all edges, the graph is disconnected — no MST exists.' },
      ],
      timeComplexity: 'O(E log E)',
      spaceComplexity: 'O(V)',
      tags: ['graphs', 'mst', 'kruskals', 'union-find', 'greedy'],
      commonMistakes: [
        'Using a sort key on edge index instead of weight.',
        'Not checking if edges_used == n-1 at the end — assumes the graph is connected.',
      ],
      quizzes: [
        { question: 'When is Kruskal\'s preferred over Prim\'s?', answer: 'Kruskal\'s is better for sparse graphs (fewer edges) since sorting E edges is O(E log E). Prim\'s with a heap is O((V+E) log V) — better for dense graphs where E >> V.', type: 'recall' },
      ],
      variants: [],
      prerequisites: ['uf-basic'],
    },
  ],
}

export default graphs
