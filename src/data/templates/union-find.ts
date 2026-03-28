import type { Category } from '@/types'

const unionFind: Category = {
  id: 'union-find',
  title: 'Union-Find (DSU)',
  icon: 'GitMerge',
  group: 'trees-graphs',
  templates: [
    {
      id: 'uf-basic',
      title: 'Union-Find with Path Compression & Union by Rank',
      description: 'Disjoint Set Union: track which elements are in the same connected component. With path compression + union by rank, nearly O(1) amortized per operation.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `class UnionFind:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.components = n

    def find(self, x: int) -> int:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x: int, y: int) -> bool:
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        self.components -= 1
        return True

    def connected(self, x: int, y: int) -> bool:
        return self.find(x) == self.find(y)`,
      annotatedCode: `class UnionFind:
    def __init__(self, n: int):
        self.parent = list(range(n))  # each node is its own root
        self.rank = [0] * n           # tree height estimate for union by rank
        self.components = n           # number of disjoint components

    def find(self, x: int) -> int:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # path compression: flatten tree
        return self.parent[x]

    def union(self, x: int, y: int) -> bool:
        px, py = self.find(x), self.find(y)
        if px == py:          # already in the same component
            return False
        if self.rank[px] < self.rank[py]:
            px, py = py, px   # attach smaller tree under larger (by rank)
        self.parent[py] = px  # py's root points to px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1  # only increases when merging two equal-rank trees
        self.components -= 1
        return True           # merger happened

    def connected(self, x: int, y: int) -> bool:
        return self.find(x) == self.find(y)`,
      explanation: [
        { lines: [7, 8, 9], text: 'Path compression: during find(), make every node on the path point directly to the root. Subsequent find() calls on those nodes are O(1). This is the key optimization.' },
        { lines: [14, 15, 16], text: 'Union by rank: always attach the shorter tree under the taller one. This keeps the tree height logarithmic without path compression.' },
        { lines: [17, 18], text: 'Rank only increases when two trees of equal rank are merged — the result is one level taller.' },
      ],
      timeComplexity: 'O(α(n)) amortized per operation (inverse Ackermann — effectively O(1))',
      spaceComplexity: 'O(n)',
      tags: ['union-find', 'dsu', 'connected-components', 'path-compression'],
      commonMistakes: [
        'Checking `parent[x] == parent[y]` instead of `find(x) == find(y)` — parents may differ even if in the same component.',
        'Not returning True/False from union — callers often need to know if a merge occurred (e.g., cycle detection).',
      ],
      quizzes: [
        { question: 'How does Union-Find detect cycles in an undirected graph?', answer: 'Before adding edge (u, v): call find(u) and find(v). If they share the same root, adding this edge would create a cycle. Union returns False in this case.', type: 'recall' },
      ],
      variants: ['Weighted Union-Find (track edge weights)', 'Virtual node Union-Find (for bipartite checking)'],
      prerequisites: [],
      nextTemplate: 'uf-applications',
    },
    {
      id: 'uf-applications',
      title: 'Union-Find Applications',
      description: 'Common interview patterns using Union-Find: number of connected components, redundant connections, and number of islands.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `def count_components(n: int, edges: list[list[int]]) -> int:
    uf = UnionFind(n)
    for u, v in edges:
        uf.union(u, v)
    return uf.components


def find_redundant_connection(edges: list[list[int]]) -> list[int]:
    n = len(edges)
    uf = UnionFind(n + 1)
    for u, v in edges:
        if not uf.union(u, v):
            return [u, v]
    return []


def num_islands_uf(grid: list[list[str]]) -> int:
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    uf = UnionFind(rows * cols)
    land_count = sum(grid[r][c] == '1' for r in range(rows) for c in range(cols))
    uf.components = land_count
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                for dr, dc in [(0,1),(1,0)]:
                    nr, nc = r+dr, c+dc
                    if nr < rows and nc < cols and grid[nr][nc] == '1':
                        uf.union(r*cols+c, nr*cols+nc)
    return uf.components`,
      annotatedCode: `def count_components(n: int, edges: list[list[int]]) -> int:
    uf = UnionFind(n)
    for u, v in edges:
        uf.union(u, v)
    return uf.components  # decremented by 1 on each successful merge


def find_redundant_connection(edges: list[list[int]]) -> list[int]:
    n = len(edges)
    uf = UnionFind(n + 1)   # nodes labeled 1..n
    for u, v in edges:
        if not uf.union(u, v):  # union returns False if already connected = cycle
            return [u, v]       # this edge created the cycle
    return []


def num_islands_uf(grid: list[list[str]]) -> int:
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    uf = UnionFind(rows * cols)
    land_count = sum(grid[r][c] == '1' for r in range(rows) for c in range(cols))
    uf.components = land_count  # initialize to number of land cells
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                for dr, dc in [(0,1),(1,0)]:  # only right and down (avoid double-counting)
                    nr, nc = r+dr, c+dc
                    if nr < rows and nc < cols and grid[nr][nc] == '1':
                        uf.union(r*cols+c, nr*cols+nc)  # encode 2D pos as 1D index
    return uf.components`,
      explanation: [
        { lines: [1, 2, 3, 4, 5], text: 'Count components: initialize n components, merge on each edge. The final components count is the answer.' },
        { lines: [7, 8, 9, 10, 11, 12, 13], text: 'Redundant connection: add edges one by one. The first edge where union returns False (both already connected) is the redundant one.' },
        { lines: [17, 18, 19, 20], text: 'Islands: initialize components equal to land cells. Only check right and down neighbors to avoid double-counting edges.' },
      ],
      timeComplexity: 'O(n · α(n))',
      spaceComplexity: 'O(n)',
      tags: ['union-find', 'connected-components', 'cycle-detection', 'islands'],
      commonMistakes: [
        'For num_islands, initializing uf.components to n (total cells) — includes water cells, giving a wrong count.',
      ],
      quizzes: [
        { question: 'For num_islands, why do we only check right and down (not all 4 directions)?', answer: 'Checking all 4 directions would try to union (r,c) with a neighbor that may have already processed (r,c) — this is fine (union is idempotent), but checking only 2 directions is slightly more efficient.', type: 'recall' },
      ],
      variants: [],
      prerequisites: ['uf-basic'],
    },
    {
      id: 'uf-weighted',
      title: 'Weighted Union-Find',
      description: 'Extend Union-Find to store weights (ratios) along edges — used in "Evaluate Division" and similar ratio/equivalence problems.',
      difficulty: 'advanced',
      estimatedMinutes: 20,
      code: `class WeightedUF:
    def __init__(self):
        self.parent = {}
        self.weight = {}

    def add(self, x):
        if x not in self.parent:
            self.parent[x] = x
            self.weight[x] = 1.0

    def find(self, x):
        if self.parent[x] != x:
            root, w = self.find(self.parent[x])
            self.parent[x] = root
            self.weight[x] *= w
            return root, self.weight[x]
        return x, 1.0

    def union(self, x, y, ratio):
        rx, wx = self.find(x)
        ry, wy = self.find(y)
        if rx != ry:
            self.parent[rx] = ry
            self.weight[rx] = ratio * wy / wx

    def query(self, x, y):
        if x not in self.parent or y not in self.parent:
            return -1.0
        rx, wx = self.find(x)
        ry, wy = self.find(y)
        if rx != ry:
            return -1.0
        return wx / wy`,
      annotatedCode: `class WeightedUF:
    def __init__(self):
        self.parent = {}
        self.weight = {}  # weight[x] = ratio x / root_of_x

    def add(self, x):
        if x not in self.parent:
            self.parent[x] = x
            self.weight[x] = 1.0   # x / x = 1

    def find(self, x):
        if self.parent[x] != x:
            root, w = self.find(self.parent[x])  # path compress + accumulate weights
            self.parent[x] = root
            self.weight[x] *= w     # chain multiplication flattens ratios
            return root, self.weight[x]
        return x, 1.0

    def union(self, x, y, ratio):   # ratio = x / y
        rx, wx = self.find(x)       # wx = x / rx
        ry, wy = self.find(y)       # wy = y / ry
        if rx != ry:
            self.parent[rx] = ry
            self.weight[rx] = ratio * wy / wx  # derive: rx / ry

    def query(self, x, y):          # returns x / y, or -1 if not connected
        if x not in self.parent or y not in self.parent:
            return -1.0
        rx, wx = self.find(x)       # wx = x / root
        ry, wy = self.find(y)       # wy = y / root
        if rx != ry:
            return -1.0
        return wx / wy              # (x/root) / (y/root) = x/y`,
      explanation: [
        { lines: [3, 4], text: 'weight[x] stores the ratio of x to its root. When x is its own root, weight[x] = 1.0.' },
        { lines: [11, 12, 13, 14], text: 'Path compression propagates weight multiplication: as we flatten the path, we accumulate the product of weights along the chain.' },
        { lines: [24, 25, 26], text: 'Query: if x and y share the same root, return wx / wy = (x/root) / (y/root) = x/y.' },
      ],
      timeComplexity: 'O(α(n)) per operation',
      spaceComplexity: 'O(n)',
      tags: ['union-find', 'weighted', 'evaluate-division'],
      commonMistakes: [
        'Used in LeetCode 399 (Evaluate Division). The weight derivation in `union` is: weight[rx] = (x/y) * (y/ry) / (x/rx) = ratio * wy / wx.',
      ],
      quizzes: [
        { question: 'What does weight[x] represent in WeightedUF?', answer: 'weight[x] = x / root(x). During path compression, weights are multiplied along the path to maintain this invariant at all levels.', type: 'recall' },
      ],
      variants: [],
      prerequisites: ['uf-basic'],
    },
  ],
}

export default unionFind
