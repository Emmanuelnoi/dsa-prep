import type { Category } from '@/types'

const backtracking: Category = {
  id: 'backtracking',
  title: 'Backtracking',
  icon: 'RefreshCw',
  group: 'advanced',
  templates: [
    {
      id: 'bt-permutations',
      title: 'Permutations',
      description: 'Generate all permutations of a list. Use a used[] boolean array to track which elements are in the current path.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `def permutations(nums: list[int]) -> list[list[int]]:
    result = []
    def backtrack(path: list[int], used: list[bool]):
        if len(path) == len(nums):
            result.append(path[:])
            return
        for i in range(len(nums)):
            if used[i]:
                continue
            used[i] = True
            path.append(nums[i])
            backtrack(path, used)
            path.pop()
            used[i] = False
    backtrack([], [False] * len(nums))
    return result`,
      annotatedCode: `def permutations(nums: list[int]) -> list[list[int]]:
    result = []
    def backtrack(path: list[int], used: list[bool]):
        if len(path) == len(nums):  # base case: used all elements
            result.append(path[:])  # append a COPY — path is mutated
            return
        for i in range(len(nums)):
            if used[i]:             # skip already-used elements
                continue
            used[i] = True          # choose
            path.append(nums[i])
            backtrack(path, used)   # explore
            path.pop()              # unchoose (backtrack)
            used[i] = False
    backtrack([], [False] * len(nums))
    return result`,
      explanation: [
        { lines: [4, 5], text: 'Base case: when path contains all n elements, we have a complete permutation. Append a copy — not a reference, since path will be modified on the way out.' },
        { lines: [7, 8], text: 'Skip elements already in the current path. The used[] array tracks membership in O(1) vs O(n) for `if num in path`.' },
        { lines: [9, 10, 11, 12, 13], text: 'The choose → explore → unchoose pattern is the backbone of all backtracking. After the recursive call returns, undo the choice to try the next option.' },
      ],
      timeComplexity: 'O(n! · n)',
      spaceComplexity: 'O(n)',
      tags: ['backtracking', 'permutations', 'recursion'],
      commonMistakes: [
        'Appending `path` instead of `path[:]` — all results will be empty lists (or the same mutated path).',
        'Not resetting `used[i] = False` after recursion — subsequent iterations skip elements that should be available.',
      ],
      quizzes: [
        { question: 'Why do we append `path[:]` instead of `path`?', answer: '`path` is a reference to the same list that is mutated throughout the recursion. `path[:]` creates a shallow copy of the current state.', type: 'recall' },
      ],
      variants: ['Permutations with duplicates: sort + skip if nums[i] == nums[i-1] and not used[i-1]'],
      prerequisites: [],
      nextTemplate: 'bt-combinations',
    },
    {
      id: 'bt-combinations',
      title: 'Combinations',
      description: 'Generate all K-element subsets (combinations) from 1..n. Start index prevents using the same element again and avoids duplicate subsets.',
      difficulty: 'intermediate',
      estimatedMinutes: 10,
      code: `def combinations(n: int, k: int) -> list[list[int]]:
    result = []
    def backtrack(start: int, path: list[int]):
        if len(path) == k:
            result.append(path[:])
            return
        for i in range(start, n + 1):
            path.append(i)
            backtrack(i + 1, path)
            path.pop()
    backtrack(1, [])
    return result`,
      annotatedCode: `def combinations(n: int, k: int) -> list[list[int]]:
    result = []
    def backtrack(start: int, path: list[int]):
        if len(path) == k:           # collected k elements
            result.append(path[:])
            return
        for i in range(start, n + 1):  # start prevents duplicates & reuse
            path.append(i)
            backtrack(i + 1, path)  # i+1: each element used at most once
            path.pop()
    backtrack(1, [])
    return result`,
      explanation: [
        { lines: [7, 8], text: 'The `start` parameter ensures we only consider elements i ≥ start. This prevents both reusing elements and generating duplicate combinations (e.g., [1,2] and [2,1] are the same combination).' },
        { lines: [8], text: 'Pass `i + 1` (not `start`) — for each position, we advance the pointer to the next element.' },
      ],
      timeComplexity: 'O(C(n,k) · k)',
      spaceComplexity: 'O(k)',
      tags: ['backtracking', 'combinations', 'recursion'],
      commonMistakes: [
        'Passing `start` instead of `i + 1` in the recursive call — allows reusing the same element.',
        'For combinations with repetition (can reuse elements): pass `i` instead of `i + 1`.',
      ],
      quizzes: [
        { question: 'Combinations vs Permutations: what is the key structural difference in the code?', answer: 'Combinations use a `start` index (only elements ≥ start are considered). Permutations use a `used[]` array (all elements can be chosen in any order).', type: 'recall' },
      ],
      variants: ['Combination Sum (duplicates allowed, unbounded reuse)', 'Combination Sum II (with duplicates in input)'],
      prerequisites: ['bt-permutations'],
      nextTemplate: 'bt-subsets',
    },
    {
      id: 'bt-subsets',
      title: 'Subsets (Power Set)',
      description: 'Generate all 2^n subsets of a list. Include the empty set. Uses the same start-index technique as combinations.',
      difficulty: 'beginner',
      estimatedMinutes: 10,
      code: `def subsets(nums: list[int]) -> list[list[int]]:
    result = []
    def backtrack(start: int, path: list[int]):
        result.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    backtrack(0, [])
    return result`,
      annotatedCode: `def subsets(nums: list[int]) -> list[list[int]]:
    result = []
    def backtrack(start: int, path: list[int]):
        result.append(path[:])   # add current path BEFORE the loop (includes empty set and partial subsets)
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)  # next element must have index > i
            path.pop()
    backtrack(0, [])
    return result`,
      explanation: [
        { lines: [4], text: 'Unlike combinations, we add to result at EVERY call — not just at the base case. This captures all 2^n subsets including the empty set (added on first call before any iteration).' },
        { lines: [6], text: 'Same start-index technique as combinations. Ensures each subset is generated exactly once.' },
      ],
      timeComplexity: 'O(2^n · n)',
      spaceComplexity: 'O(n)',
      tags: ['backtracking', 'subsets', 'power-set'],
      commonMistakes: [
        'For subsets with duplicates: sort nums first, then skip `if i > start and nums[i] == nums[i-1]: continue`.',
      ],
      quizzes: [
        { question: 'How many subsets does a set of n elements have?', answer: '2^n — each element is either included or excluded. The empty set and the full set are both included.', type: 'recall' },
      ],
      variants: ['Subsets with duplicates (sort + pruning)', 'Bitmask approach: iterate 0..2^n-1'],
      prerequisites: ['bt-combinations'],
      nextTemplate: 'bt-nqueens',
    },
    {
      id: 'bt-nqueens',
      title: 'N-Queens',
      description: 'Place N queens on an N×N chessboard so no two attack each other. Constraint propagation with sets for rows, diagonals, and anti-diagonals.',
      difficulty: 'advanced',
      estimatedMinutes: 20,
      code: `def solve_n_queens(n: int) -> list[list[str]]:
    result = []
    cols = set()
    diag1 = set()
    diag2 = set()

    def backtrack(row: int, board: list[str]):
        if row == n:
            result.append(board[:])
            return
        for col in range(n):
            if col in cols or (row - col) in diag1 or (row + col) in diag2:
                continue
            cols.add(col)
            diag1.add(row - col)
            diag2.add(row + col)
            board.append('.' * col + 'Q' + '.' * (n - col - 1))
            backtrack(row + 1, board)
            board.pop()
            cols.discard(col)
            diag1.discard(row - col)
            diag2.discard(row + col)

    backtrack(0, [])
    return result`,
      annotatedCode: `def solve_n_queens(n: int) -> list[list[str]]:
    result = []
    cols = set()    # occupied columns
    diag1 = set()   # occupied major diagonals (row - col is constant per diagonal)
    diag2 = set()   # occupied anti-diagonals (row + col is constant per anti-diagonal)

    def backtrack(row: int, board: list[str]):
        if row == n:              # placed n queens successfully
            result.append(board[:])
            return
        for col in range(n):
            if col in cols or (row - col) in diag1 or (row + col) in diag2:
                continue          # skip attacked positions
            cols.add(col)         # place queen
            diag1.add(row - col)
            diag2.add(row + col)
            board.append('.' * col + 'Q' + '.' * (n - col - 1))
            backtrack(row + 1, board)  # try next row
            board.pop()           # remove queen (backtrack)
            cols.discard(col)
            diag1.discard(row - col)
            diag2.discard(row + col)

    backtrack(0, [])
    return result`,
      explanation: [
        { lines: [2, 3, 4], text: 'Three sets track under-attack positions. O(1) lookup is key. Diagonal: row - col is the same for all cells on the same major diagonal. Anti-diagonal: row + col is the same on the same anti-diagonal.' },
        { lines: [11, 12], text: 'If any of the three sets contains the current (row, col) identifier, the position is attacked — skip it.' },
        { lines: [13, 14, 15, 16, 17, 18, 19, 20], text: 'Standard choose → explore → unchoose. We process one row per recursive call — queens in the same row would attack each other, so this constraint is implicit.' },
      ],
      timeComplexity: 'O(n!)',
      spaceComplexity: 'O(n)',
      tags: ['backtracking', 'n-queens', 'constraint-propagation'],
      commonMistakes: [
        'Using a 2D board and checking all existing queens — O(n) per placement. The sets approach reduces each check to O(1).',
      ],
      quizzes: [
        { question: 'Why does `row - col` uniquely identify a major diagonal?', answer: 'All cells (r, c) on the same major diagonal (top-left to bottom-right) share the same value of r - c. E.g., (0,0), (1,1), (2,2) all give 0.', type: 'recall' },
      ],
      variants: ['Sudoku solver (more complex constraint propagation)'],
      prerequisites: ['bt-combinations', 'bt-subsets'],
    },
  ],
}

export default backtracking
