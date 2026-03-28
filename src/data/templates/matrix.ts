import type { Category } from '@/types'

const matrix: Category = {
  id: 'matrix',
  title: 'Matrix / 2D Grid',
  icon: 'Grid2X2',
  group: 'trees-graphs',
  templates: [
    {
      id: 'matrix-bfs',
      title: 'BFS on 2D Grid',
      description:
        'Flood fill and Number of Islands using BFS. Mark cells visited before enqueuing (not after dequeuing) to prevent duplicate entries. Supports 4-directional and 8-directional traversal via a direction array.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `from collections import deque

def num_islands(grid: list[list[str]]) -> int:
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0
    dirs = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                queue = deque([(r, c)])
                grid[r][c] = '0'
                while queue:
                    row, col = queue.popleft()
                    for dr, dc in dirs:
                        nr, nc = row + dr, col + dc
                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1':
                            grid[nr][nc] = '0'
                            queue.append((nr, nc))
    return count


def flood_fill(image: list[list[int]], sr: int, sc: int, color: int) -> list[list[int]]:
    rows, cols = len(image), len(image[0])
    original = image[sr][sc]
    if original == color:
        return image
    queue = deque([(sr, sc)])
    image[sr][sc] = color
    dirs = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    while queue:
        r, c = queue.popleft()
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and image[nr][nc] == original:
                image[nr][nc] = color
                queue.append((nr, nc))
    return image`,
      annotatedCode: `from collections import deque

def num_islands(grid: list[list[str]]) -> int:
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0
    dirs = [(0, 1), (0, -1), (1, 0), (-1, 0)]   # 4-directional: right, left, down, up
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':               # unvisited land cell = start of a new island
                count += 1
                queue = deque([(r, c)])
                grid[r][c] = '0'                # mark visited BEFORE enqueuing — prevents duplicates in the queue
                while queue:
                    row, col = queue.popleft()  # BFS: process level by level (shortest path)
                    for dr, dc in dirs:
                        nr, nc = row + dr, col + dc
                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1':  # in-bounds and unvisited
                            grid[nr][nc] = '0'  # mark before enqueue, not after dequeue
                            queue.append((nr, nc))
    return count


def flood_fill(image: list[list[int]], sr: int, sc: int, color: int) -> list[list[int]]:
    rows, cols = len(image), len(image[0])
    original = image[sr][sc]                    # colour we are replacing
    if original == color:                       # early exit: avoids infinite loop if colour is unchanged
        return image
    queue = deque([(sr, sc)])
    image[sr][sc] = color                      # paint start cell and mark visited before enqueue
    dirs = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    while queue:
        r, c = queue.popleft()
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and image[nr][nc] == original:  # same original colour
                image[nr][nc] = color           # paint immediately, before enqueue
                queue.append((nr, nc))
    return image`,
      explanation: [
        {
          lines: [8],
          text: '`dirs` encodes the four cardinal directions as (row_delta, col_delta) pairs. For 8-directional traversal, add the four diagonals: `(-1,-1), (-1,1), (1,-1), (1,1)`. The trick generalises to any connectivity.',
        },
        {
          lines: [13, 14],
          text: 'Mark visited (`grid[r][c] = "0"`) BEFORE enqueuing, not after dequeuing. If you wait until dequeue, the same cell can be enqueued multiple times by its neighbours — wasting O(4n) work and potentially causing TLE.',
        },
        {
          lines: [18, 19, 20, 21],
          text: 'Bounds check `0 <= nr < rows and 0 <= nc < cols` guards every neighbour access. Short-circuit evaluation means the grid access `grid[nr][nc]` is never reached out of bounds.',
        },
        {
          lines: [27, 28],
          text: 'The `original == color` early exit is essential. Without it, flood fill would keep repainting already-painted cells, looping forever because the condition `image[nr][nc] == original` would always match after repainting.',
        },
      ],
      timeComplexity: 'O(m·n)',
      spaceComplexity: 'O(m·n)',
      tags: ['matrix', 'bfs', 'grid', 'flood-fill', 'islands', 'deque'],
      commonMistakes: [
        'Marking visited after dequeuing instead of before enqueuing — the same cell gets enqueued multiple times, causing redundant work.',
        'Missing the `original == color` early-exit check in flood fill — causes infinite loop when the source cell is already the target colour.',
        'Forgetting the bounds check before accessing `grid[nr][nc]` — raises IndexError on edge cells.',
      ],
      quizzes: [
        {
          question: 'Why must we mark a cell visited BEFORE adding it to the queue, not after popping it?',
          answer: 'If we mark after popping, multiple neighbours can all see the same unvisited cell and each enqueue it independently. The cell gets processed multiple times. Marking on enqueue ensures it is added exactly once.',
          type: 'recall',
        },
        {
          question: 'How would you adapt `num_islands` for 8-directional connectivity (including diagonals)?',
          answer: 'Add the four diagonal deltas to `dirs`: `(-1,-1), (-1,1), (1,-1), (1,1)`. No other changes needed — the bounds check and visited marking logic remain identical.',
          type: 'recall',
        },
      ],
      variants: [
        'Rotting Oranges (LeetCode 994) — multi-source BFS from all initially rotten cells',
        'Shortest Path in Binary Matrix (LeetCode 1091)',
        'Pacific Atlantic Water Flow (LeetCode 417) — reverse multi-source BFS',
      ],
      prerequisites: [],
      nextTemplate: 'matrix-dfs',
    },
    {
      id: 'matrix-dfs',
      title: 'DFS on 2D Grid',
      description:
        'Recursive and iterative DFS for grid problems. Number of Islands is the canonical example. Recursive DFS uses the call stack; iterative DFS uses an explicit stack. Both have the same complexity.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `def num_islands_dfs_recursive(grid: list[list[str]]) -> int:
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '0'
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                dfs(r, c)
                count += 1
    return count


def num_islands_dfs_iterative(grid: list[list[str]]) -> int:
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0
    dirs = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                stack = [(r, c)]
                grid[r][c] = '0'
                while stack:
                    row, col = stack.pop()
                    for dr, dc in dirs:
                        nr, nc = row + dr, col + dc
                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1':
                            grid[nr][nc] = '0'
                            stack.append((nr, nc))
    return count`,
      annotatedCode: `def num_islands_dfs_recursive(grid: list[list[str]]) -> int:
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':  # base case: OOB or water/visited
            return
        grid[r][c] = '0'    # mark visited in-place: '1' → '0' eliminates a separate visited set
        dfs(r + 1, c)        # recurse into all four neighbours; invalid ones hit the base case
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':   # unvisited land: DFS sinks the entire connected island
                dfs(r, c)
                count += 1          # increment AFTER dfs: the full island is sunk first
    return count


def num_islands_dfs_iterative(grid: list[list[str]]) -> int:
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0
    dirs = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                stack = [(r, c)]                    # explicit stack replaces the call stack
                grid[r][c] = '0'                    # mark before pushing to avoid double-processing
                while stack:
                    row, col = stack.pop()          # LIFO: depth-first order (vs. BFS popleft)
                    for dr, dc in dirs:
                        nr, nc = row + dr, col + dc
                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1':
                            grid[nr][nc] = '0'      # mark on push, not on pop
                            stack.append((nr, nc))
    return count`,
      explanation: [
        {
          lines: [6, 7, 8],
          text: 'The recursive base case handles everything: out-of-bounds (four checks) and already-visited/water cells (`!= "1"`). The combined condition is cleaner than checking each separately.',
        },
        {
          lines: [9],
          text: 'Mutating the grid (`"1"` → `"0"`) is the visited marker. This avoids allocating an `O(m·n)` `visited` set. Only use this if mutating the input is acceptable — if not, use a `visited: set[tuple]` instead.',
        },
        {
          lines: [10, 11, 12, 13],
          text: 'Four recursive calls in any order — the order doesn\'t change correctness or complexity. Each call either hits the base case immediately (O(1)) or sinks another land cell.',
        },
        {
          lines: [32, 33, 34, 35],
          text: 'Iterative DFS: `stack.pop()` gives LIFO (depth-first) behaviour, unlike `popleft()` (BFS). Mark before pushing to avoid the same cell being added twice by different neighbours.',
        },
      ],
      timeComplexity: 'O(m·n)',
      spaceComplexity: 'O(m·n)',
      tags: ['matrix', 'dfs', 'grid', 'recursion', 'iterative', 'islands'],
      commonMistakes: [
        'Marking visited after recursing (`grid[r][c] = "0"` at the end) instead of at the start — allows a cell to be visited multiple times before it is marked.',
        'Recursive DFS on very large grids (1000×1000) may hit Python\'s default recursion limit (~1000). Use `sys.setrecursionlimit` or prefer iterative DFS.',
        'Checking bounds after accessing the grid — always check bounds before indexing.',
      ],
      quizzes: [
        {
          question: 'What are the two base cases for recursive DFS on a grid?',
          answer: '1) Out-of-bounds: `r < 0 or r >= rows or c < 0 or c >= cols`. 2) Cell is not land (or already visited): `grid[r][c] != "1"`. Both must return immediately without recursing.',
          type: 'recall',
        },
        {
          question: 'What is the key difference between the recursive and iterative implementations that makes iterative preferable on very large grids?',
          answer: 'Recursive DFS uses the call stack (O(m·n) frames), which can hit Python\'s recursion limit. Iterative DFS uses an explicit stack on the heap — no limit applies.',
          type: 'recall',
        },
      ],
      variants: [
        'Max Area of Island (LeetCode 695) — return size of the largest island',
        'Surrounded Regions (LeetCode 130) — DFS from border, flip interior',
        'Number of Distinct Islands (LeetCode 694) — hash the DFS path shape',
      ],
      prerequisites: ['matrix-bfs'],
      nextTemplate: 'matrix-spiral',
    },
    {
      id: 'matrix-spiral',
      title: 'Spiral Matrix Traversal',
      description:
        'Traverse a matrix in spiral order by shrinking four boundaries (top, bottom, left, right) after each pass. Guards prevent processing a row or column twice when the matrix reduces to a single row or column.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `def spiral_order(matrix: list[list[int]]) -> list[int]:
    result = []
    if not matrix:
        return result
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    while top <= bottom and left <= right:
        for c in range(left, right + 1):
            result.append(matrix[top][c])
        top += 1
        for r in range(top, bottom + 1):
            result.append(matrix[r][right])
        right -= 1
        if top <= bottom:
            for c in range(right, left - 1, -1):
                result.append(matrix[bottom][c])
            bottom -= 1
        if left <= right:
            for r in range(bottom, top - 1, -1):
                result.append(matrix[r][left])
            left += 1
    return result`,
      annotatedCode: `def spiral_order(matrix: list[list[int]]) -> list[int]:
    result = []
    if not matrix:
        return result
    top, bottom = 0, len(matrix) - 1         # four boundaries that shrink inward each layer
    left, right = 0, len(matrix[0]) - 1
    while top <= bottom and left <= right:
        for c in range(left, right + 1):       # → traverse top row left to right
            result.append(matrix[top][c])
        top += 1                              # top boundary consumed: move inward
        for r in range(top, bottom + 1):      # ↓ traverse right column top to bottom
            result.append(matrix[r][right])
        right -= 1                            # right boundary consumed
        if top <= bottom:                     # guard: single remaining row already traversed above
            for c in range(right, left - 1, -1):  # ← traverse bottom row right to left
                result.append(matrix[bottom][c])
            bottom -= 1                       # bottom boundary consumed
        if left <= right:                     # guard: single remaining column already traversed above
            for r in range(bottom, top - 1, -1):  # ↑ traverse left column bottom to top
                result.append(matrix[r][left])
            left += 1                         # left boundary consumed
    return result`,
      explanation: [
        {
          lines: [5, 6],
          text: 'Four boundary variables define the current "shell" being traversed. Each completed pass around the perimeter shrinks all four boundaries inward by one.',
        },
        {
          lines: [7, 8, 9, 10, 11, 12, 13],
          text: 'The four traversal directions follow a fixed order: right → down → left → up. After each direction, the corresponding boundary is moved inward. Note `top += 1` before the downward pass so the top-right corner is not repeated.',
        },
        {
          lines: [14, 15, 16, 17],
          text: '`if top <= bottom` guards the leftward pass. After consuming the top row, if `top > bottom`, the matrix was a single row — there is no bottom row to traverse. Without this guard, the single row is visited twice.',
        },
        {
          lines: [18, 19, 20, 21],
          text: '`if left <= right` guards the upward pass. After consuming the right column, if `left > right`, the matrix was a single column — no additional left column pass is needed.',
        },
      ],
      timeComplexity: 'O(m·n)',
      spaceComplexity: 'O(1) extra (excluding output)',
      tags: ['matrix', 'spiral', 'boundaries', 'simulation'],
      commonMistakes: [
        'Not guarding the bottom-row and left-column passes — single-row or single-column matrices are traversed twice.',
        'Using `range(right, left, -1)` instead of `range(right, left - 1, -1)` — misses the leftmost cell.',
        'Not updating `top += 1` before the downward pass — the top-right corner cell is appended twice.',
      ],
      quizzes: [
        {
          question: 'In what order are the four boundaries updated during a single spiral layer?',
          answer: 'top → right → bottom → left. After the rightward top pass, `top += 1`. After the downward right pass, `right -= 1`. After the leftward bottom pass (guarded), `bottom -= 1`. After the upward left pass (guarded), `left += 1`.',
          type: 'recall',
        },
        {
          question: 'Why do we check `if top <= bottom` before the leftward (bottom row) pass?',
          answer: 'After consuming the top row and moving `top += 1`, if `top > bottom`, the matrix had only one row. The right column pass already covered all elements — traversing a bottom row would revisit them.',
          type: 'recall',
        },
      ],
      variants: [
        'Spiral Matrix II (LeetCode 59) — fill a matrix in spiral order',
        'Diagonal Traversal (LeetCode 498)',
        'Rotate Matrix — see matrix-rotate',
      ],
      prerequisites: [],
      nextTemplate: 'matrix-rotate',
    },
    {
      id: 'matrix-rotate',
      title: 'Rotate Matrix In-Place',
      description:
        'Rotate an n×n matrix 90° clockwise in O(1) space: transpose (swap matrix[i][j] with matrix[j][i]) then reverse each row. Counterclockwise reverses row order instead. 180° is reverse each row then reverse row order.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `def rotate_90_clockwise(matrix: list[list[int]]) -> None:
    n = len(matrix)
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    for row in matrix:
        row.reverse()


def rotate_180(matrix: list[list[int]]) -> None:
    for row in matrix:
        row.reverse()
    matrix.reverse()


def rotate_90_counterclockwise(matrix: list[list[int]]) -> None:
    n = len(matrix)
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    matrix.reverse()`,
      annotatedCode: `def rotate_90_clockwise(matrix: list[list[int]]) -> None:
    n = len(matrix)
    for i in range(n):
        for j in range(i + 1, n):              # start j at i+1: only swap the upper triangle to avoid swapping back
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]  # step 1: transpose
    for row in matrix:
        row.reverse()                          # step 2: reverse each row → net effect is 90° clockwise rotation


def rotate_180(matrix: list[list[int]]) -> None:
    for row in matrix:
        row.reverse()                          # reverse each row horizontally (flip left-right)
    matrix.reverse()                           # reverse the list of rows (flip top-bottom) → 180° rotation


def rotate_90_counterclockwise(matrix: list[list[int]]) -> None:
    n = len(matrix)
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]  # step 1: transpose (same as clockwise)
    matrix.reverse()                           # step 2: reverse row ORDER (not each row) → 90° counterclockwise`,
      explanation: [
        {
          lines: [3, 4, 5],
          text: 'Transposing flips the matrix along its main diagonal: element at `[i][j]` swaps with `[j][i]`. Starting `j` at `i+1` visits only the upper triangle — if you started at 0, you\'d swap every pair twice, undoing all changes.',
        },
        {
          lines: [6, 7],
          text: 'After transposing, reversing each *row* completes the 90° clockwise rotation. Intuition: the first column of the original becomes the first row after transpose; reversing makes it the last row — matching clockwise rotation.',
        },
        {
          lines: [10, 11, 12],
          text: '180° rotation = transpose + reverse rows = reverse each row + reverse row order. The second form (used here) avoids the transpose step entirely: flip horizontally then flip vertically.',
        },
        {
          lines: [18, 19],
          text: 'Counterclockwise uses the same transpose but reverses row *order* (`matrix.reverse()`) instead of reversing each row. The transpose step is identical; only the second step differs.',
        },
      ],
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      tags: ['matrix', 'rotate', 'transpose', 'in-place'],
      commonMistakes: [
        'Starting the inner loop at `j = 0` instead of `j = i + 1` — swaps every pair twice, leaving the matrix unchanged.',
        'Confusing clockwise (reverse each row) with counterclockwise (reverse row order) after transposing.',
        'Allocating a new matrix for the result — the whole point of this algorithm is in-place O(1) space.',
      ],
      quizzes: [
        {
          question: 'For clockwise 90° rotation, after transposing, do you reverse rows (each row individually) or reverse row order (the list of rows)?',
          answer: 'Reverse each row individually (`row.reverse()`). For counterclockwise, you reverse row order (`matrix.reverse()`). The transpose step is the same for both.',
          type: 'recall',
        },
        {
          question: 'Why does the transpose loop use `for j in range(i + 1, n)` instead of `for j in range(n)`?',
          answer: 'We only need to swap each off-diagonal pair once. If `j` started at 0, we would swap `matrix[i][j]` with `matrix[j][i]` and then later swap them back, leaving everything unchanged.',
          type: 'recall',
        },
      ],
      variants: [
        'Rotate Image in-place (LeetCode 48) — same algorithm',
        'Transpose Matrix (LeetCode 867) — first step only, non-square handled differently',
        'Flip the matrix: `matrix.reverse()` (flip vertical) or `row.reverse()` (flip horizontal)',
      ],
      prerequisites: [],
      nextTemplate: 'matrix-dp',
    },
    {
      id: 'matrix-dp',
      title: 'Matrix DP: Unique Paths & Min Path Sum',
      description:
        'Two foundational 2D DP problems: count paths from top-left to bottom-right (Unique Paths), and find the minimum cost path (Min Path Sum). Both use the same recurrence: each cell depends on the cell above and the cell to the left.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      code: `def unique_paths(m: int, n: int) -> int:
    dp = [[1] * n for _ in range(m)]
    for r in range(1, m):
        for c in range(1, n):
            dp[r][c] = dp[r-1][c] + dp[r][c-1]
    return dp[m-1][n-1]


def unique_paths_1d(m: int, n: int) -> int:
    dp = [1] * n
    for _ in range(1, m):
        for c in range(1, n):
            dp[c] += dp[c-1]
    return dp[n-1]


def min_path_sum(grid: list[list[int]]) -> int:
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    dp[0][0] = grid[0][0]
    for c in range(1, n):
        dp[0][c] = dp[0][c-1] + grid[0][c]
    for r in range(1, m):
        dp[r][0] = dp[r-1][0] + grid[r][0]
    for r in range(1, m):
        for c in range(1, n):
            dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1])
    return dp[m-1][n-1]`,
      annotatedCode: `def unique_paths(m: int, n: int) -> int:
    dp = [[1] * n for _ in range(m)]    # base case: first row and first col = 1 (only one direction possible)
    for r in range(1, m):
        for c in range(1, n):
            dp[r][c] = dp[r-1][c] + dp[r][c-1]  # recurrence: paths from above + paths from left
    return dp[m-1][n-1]


def unique_paths_1d(m: int, n: int) -> int:
    dp = [1] * n                         # rolling array: represents the current row; init = first row (all 1s)
    for _ in range(1, m):                # process rows 1 through m-1
        for c in range(1, n):
            dp[c] += dp[c-1]             # dp[c] holds "from above" value; dp[c-1] is the updated "from left"
    return dp[n-1]                       # reduces space from O(m·n) to O(n)


def min_path_sum(grid: list[list[int]]) -> int:
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    dp[0][0] = grid[0][0]                # top-left: only starting point, cost is the cell itself
    for c in range(1, n):
        dp[0][c] = dp[0][c-1] + grid[0][c]    # first row: only reachable from the left
    for r in range(1, m):
        dp[r][0] = dp[r-1][0] + grid[r][0]    # first col: only reachable from above
    for r in range(1, m):
        for c in range(1, n):
            dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1])  # cell cost + minimum of above or left
    return dp[m-1][n-1]`,
      explanation: [
        {
          lines: [2],
          text: 'Base case: the entire first row and first column are initialised to 1. The first row can only be reached by moving right; the first column only by moving down. There is exactly one path to each of those cells.',
        },
        {
          lines: [3, 4, 5],
          text: 'Recurrence: `dp[r][c] = dp[r-1][c] + dp[r][c-1]`. Every cell is reachable only from the cell above or the cell to the left (you can only move right or down). The total paths is the sum.',
        },
        {
          lines: [9, 10, 11, 12, 13],
          text: '1D space optimisation: reuse a single array. Before processing row `r`, `dp[c]` holds the answer for row `r-1` (the "above" value). After `dp[c] += dp[c-1]`, it holds the answer for the current row. O(n) space instead of O(m·n).',
        },
        {
          lines: [20, 21, 22, 23],
          text: 'Min Path Sum initialises the first row and first column explicitly — they have no choice of direction. The general recurrence `grid[r][c] + min(above, left)` then fills in the rest.',
        },
        {
          lines: [25, 26],
          text: '`dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1])`: add the current cell cost to the cheaper of the two incoming paths. This ensures the accumulated cost at `dp[m-1][n-1]` is globally optimal.',
        },
      ],
      timeComplexity: 'O(m·n)',
      spaceComplexity: 'O(m·n) or O(n) with 1D rolling array',
      tags: ['matrix', 'dp', 'unique-paths', 'min-path-sum', 'bottom-up', 'rolling-array'],
      commonMistakes: [
        'Initialising `dp = [[0]*n for _ in range(m)]` without setting the first row/column to 1 in Unique Paths — gives wrong answers for all border cells.',
        'In the 1D optimisation, iterating columns right-to-left — this reads a stale "from left" value instead of the freshly updated one.',
        'Forgetting to seed `dp[0][0] = grid[0][0]` in Min Path Sum — leads to an incorrect accumulated cost of 0 at the start.',
      ],
      quizzes: [
        {
          question: 'What is the base case for the first row and first column in Unique Paths, and why?',
          answer: 'Every cell in the first row and first column equals 1 because there is only one way to reach them: move only right (first row) or only down (first column). There are no turns possible along the borders.',
          type: 'recall',
        },
        {
          question: 'How does the 1D rolling array reduce space from O(m·n) to O(n) without losing correctness?',
          answer: 'Before updating column `c`, `dp[c]` still holds the value from the previous row (the "above" contribution). `dp[c-1]` has already been updated for the current row (the "left" contribution). Both required values are available in-place.',
          type: 'recall',
        },
      ],
      variants: [
        'Unique Paths II (LeetCode 63) — grid has obstacles, set `dp[r][c] = 0` when `grid[r][c] == 1`',
        'Minimum Falling Path Sum (LeetCode 931) — can also move diagonally',
        'Dungeon Game (LeetCode 174) — min path sum with health constraints, requires reverse DP',
      ],
      prerequisites: [],
    },
  ],
}

export default matrix
