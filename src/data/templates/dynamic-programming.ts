import type { Category } from '@/types'

const dynamicProgramming: Category = {
  id: 'dynamic-programming',
  title: 'Dynamic Programming',
  icon: 'Grid',
  group: 'advanced',
  templates: [
    {
      id: 'dp-memoization',
      title: 'Memoization (Top-Down DP)',
      description: 'Recursion + caching. Use @functools.cache (Python 3.9+) or a manual dict. Start with the brute-force recursion, then add memoization.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `from functools import cache

@cache
def fib(n: int) -> int:
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)


def fib_manual(n: int, memo: dict = None) -> int:
    if memo is None:
        memo = {}
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib_manual(n - 1, memo) + fib_manual(n - 2, memo)
    return memo[n]`,
      annotatedCode: `from functools import cache

@cache                   # lru_cache(maxsize=None) — caches all calls
def fib(n: int) -> int:
    if n <= 1:           # base case
        return n
    return fib(n - 1) + fib(n - 2)  # subproblems overlap → cache hits prevent recomputation


def fib_manual(n: int, memo: dict = None) -> int:
    if memo is None:     # mutable default arg workaround
        memo = {}
    if n in memo:        # cache hit: return stored result
        return memo[n]
    if n <= 1:           # base case (check AFTER cache lookup for efficiency)
        return n
    memo[n] = fib_manual(n - 1, memo) + fib_manual(n - 2, memo)
    return memo[n]`,
      explanation: [
        { lines: [2, 3], text: '@cache (Python 3.9+) is the cleanest approach. It stores all results forever. Use @lru_cache(maxsize=128) if memory is a concern.' },
        { lines: [7], text: 'Without memoization, fib(n) runs in O(2^n). With memoization, each unique n is computed exactly once: O(n) total calls.' },
        { lines: [12, 13], text: 'Cache lookup before base case — if n=1 was already computed and cached, return immediately.' },
      ],
      timeComplexity: 'O(n) with memoization vs O(2^n) without',
      spaceComplexity: 'O(n)',
      tags: ['dp', 'memoization', 'top-down', 'recursion'],
      commonMistakes: [
        '@cache requires hashable arguments — lists/dicts as parameters won\'t work. Convert to tuples first.',
        'For problems with multiple parameters, both must be in the cache key: @cache on fib(i, j) works automatically.',
      ],
      quizzes: [
        { question: 'Why does fib(n) without memoization run in O(2^n)?', answer: 'fib(n) calls fib(n-1) and fib(n-2). Each of those calls two more, etc. The number of unique subproblems is n, but without caching, fib(2) is computed exponentially many times.', type: 'recall' },
      ],
      variants: ['@lru_cache(maxsize=None) — same as @cache but available in Python 3.2+'],
      prerequisites: [],
      nextTemplate: 'dp-tabulation',
    },
    {
      id: 'dp-tabulation',
      title: 'Tabulation (Bottom-Up DP)',
      description: 'Fill a DP table iteratively from base cases up. Usually more space-efficient than memoization and avoids recursion depth limits.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `def fib_tab(n: int) -> int:
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]


def fib_optimized(n: int) -> int:
    if n <= 1:
        return n
    prev, curr = 0, 1
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    return curr`,
      annotatedCode: `def fib_tab(n: int) -> int:
    if n <= 1:
        return n
    dp = [0] * (n + 1)   # dp[i] = fib(i)
    dp[1] = 1             # base cases
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]  # fill from small to large
    return dp[n]


def fib_optimized(n: int) -> int:
    if n <= 1:
        return n
    prev, curr = 0, 1     # only need last 2 values → O(1) space
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    return curr`,
      explanation: [
        { lines: [4, 5, 6], text: 'Allocate the full table and set base cases explicitly. Then fill in order of dependency: dp[i] depends on dp[i-1] and dp[i-2], so fill left to right.' },
        { lines: [11, 12, 13, 14, 15], text: 'Space optimization: if dp[i] only depends on the previous 1-2 values, keep only those variables instead of the full array. Reduces O(n) space to O(1).' },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n), optimized to O(1)',
      tags: ['dp', 'tabulation', 'bottom-up'],
      commonMistakes: [
        'Iterating in the wrong direction — always fill dp in the order that dependencies are satisfied (usually left-to-right).',
        'Off-by-one: dp array size should be (n+1) to index dp[n].',
      ],
      quizzes: [
        { question: 'When would you prefer tabulation over memoization?', answer: 'When recursion depth is large (Python\'s default limit is ~1000). When you need O(1) space by rolling over the dp array. When the iteration order is clear.', type: 'recall' },
      ],
      variants: ['2D tabulation (grid problems)', 'Space-optimized tabulation'],
      prerequisites: ['dp-memoization'],
      nextTemplate: 'dp-knapsack-01',
    },
    {
      id: 'dp-knapsack-01',
      title: '0/1 Knapsack',
      description: 'Classic: given items with weights and values, maximize value with a weight capacity. Each item used 0 or 1 times.',
      difficulty: 'advanced',
      estimatedMinutes: 20,
      code: `def knapsack_01(weights: list[int], values: list[int], capacity: int) -> int:
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            dp[i][w] = dp[i-1][w]
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i][w], dp[i-1][w - weights[i-1]] + values[i-1])
    return dp[n][capacity]


def knapsack_01_optimized(weights: list[int], values: list[int], capacity: int) -> int:
    dp = [0] * (capacity + 1)
    for i in range(len(weights)):
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    return dp[capacity]`,
      annotatedCode: `def knapsack_01(weights: list[int], values: list[int], capacity: int) -> int:
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    # dp[i][w] = max value using items 0..i-1 with weight limit w
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            dp[i][w] = dp[i-1][w]             # option 1: skip item i
            if weights[i-1] <= w:              # item i fits
                dp[i][w] = max(dp[i][w],
                               dp[i-1][w - weights[i-1]] + values[i-1])  # option 2: take item i
    return dp[n][capacity]


def knapsack_01_optimized(weights: list[int], values: list[int], capacity: int) -> int:
    dp = [0] * (capacity + 1)  # 1D space optimization
    for i in range(len(weights)):
        for w in range(capacity, weights[i] - 1, -1):  # REVERSE to avoid using item twice
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    return dp[capacity]`,
      explanation: [
        { lines: [3, 4], text: 'dp[i][w] = max value using the first i items with weight capacity w. Size (n+1)×(capacity+1) to handle base cases (0 items or 0 capacity = 0 value).' },
        { lines: [6, 7, 8, 9], text: 'For each item, two choices: skip it (keep dp[i-1][w]) or take it (add its value, reduce capacity by its weight). Take the max.' },
        { lines: [14, 15], text: 'Space-optimized 1D version: iterate capacity in REVERSE ORDER when processing each item. This prevents using item i multiple times (forward iteration would let dp[w] use the already-updated dp[w-weight[i]]).' },
      ],
      timeComplexity: 'O(n·W)',
      spaceComplexity: 'O(n·W), optimized to O(W)',
      tags: ['dp', 'knapsack', '0-1-knapsack', 'optimization'],
      commonMistakes: [
        'In the 1D optimization, iterating forward instead of backward — allows an item to be used multiple times, turning it into an unbounded knapsack.',
      ],
      quizzes: [
        { question: 'Why do we iterate `w` in reverse in the 1D knapsack?', answer: 'Forward iteration would allow dp[w] to use the value of dp[w - weight] that was ALREADY updated in this iteration — meaning we could take the same item multiple times. Reverse order ensures dp[w - weight] still reflects the state BEFORE this item was considered.', type: 'recall' },
      ],
      variants: ['Unbounded knapsack (iterate forward)', 'Subset sum (values == weights)'],
      prerequisites: ['dp-tabulation'],
      nextTemplate: 'dp-lcs',
    },
    {
      id: 'dp-lcs',
      title: 'Longest Common Subsequence (LCS)',
      description: 'Find the length of the longest subsequence common to two strings. A 2D DP problem that models "take or skip" decisions.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `def lcs(s1: str, s2: str) -> int:
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]`,
      annotatedCode: `def lcs(s1: str, s2: str) -> int:
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    # dp[i][j] = LCS length of s1[:i] and s2[:j]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:          # characters match
                dp[i][j] = dp[i-1][j-1] + 1 # extend the common subsequence
            else:                             # characters don't match
                dp[i][j] = max(dp[i-1][j],  # skip s1[i]
                               dp[i][j-1])   # skip s2[j]
    return dp[m][n]`,
      explanation: [
        { lines: [3, 4], text: 'dp[i][j] represents the LCS length of the first i characters of s1 and the first j of s2. Row/column 0 are base cases (empty string = LCS 0).' },
        { lines: [6, 7], text: 'When characters match, the LCS extends by 1 from dp[i-1][j-1] (both strings advanced).' },
        { lines: [9, 10], text: 'When they don\'t match, take the best of: skipping the current s1 character, or skipping the current s2 character.' },
      ],
      timeComplexity: 'O(m·n)',
      spaceComplexity: 'O(m·n)',
      tags: ['dp', 'lcs', 'strings', '2d-dp'],
      commonMistakes: [
        'LCS ≠ LCS substring. LCS allows gaps (subsequence), edit distance allows insertions/deletions/substitutions.',
      ],
      quizzes: [
        { question: 'How do you reconstruct the actual LCS string (not just the length)?', answer: 'Backtrack from dp[m][n]: if s1[i-1]==s2[j-1], include that character and go to dp[i-1][j-1]. Otherwise move to the larger neighbor (dp[i-1][j] or dp[i][j-1]).', type: 'recall' },
      ],
      variants: ['Edit distance (Levenshtein)', 'Shortest common supersequence'],
      prerequisites: ['dp-tabulation'],
    },
    {
      id: 'dp-lis',
      title: 'Longest Increasing Subsequence (LIS)',
      description: 'Find the length of the longest strictly increasing subsequence. O(n²) DP or O(n log n) with binary search (patience sorting).',
      difficulty: 'advanced',
      estimatedMinutes: 20,
      code: `def lis_dp(nums: list[int]) -> int:
    if not nums:
        return 0
    dp = [1] * len(nums)
    for i in range(1, len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)


import bisect

def lis_nlogn(nums: list[int]) -> int:
    tails = []
    for num in nums:
        pos = bisect.bisect_left(tails, num)
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
    return len(tails)`,
      annotatedCode: `def lis_dp(nums: list[int]) -> int:
    if not nums:
        return 0
    dp = [1] * len(nums)  # dp[i] = LIS length ending at index i (min 1: element itself)
    for i in range(1, len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:         # strictly increasing
                dp[i] = max(dp[i], dp[j] + 1)  # extend LIS ending at j
    return max(dp)


import bisect

def lis_nlogn(nums: list[int]) -> int:
    tails = []  # tails[i] = smallest tail of any IS of length i+1
    for num in nums:
        pos = bisect.bisect_left(tails, num)   # position to replace
        if pos == len(tails):
            tails.append(num)   # num extends the longest IS so far
        else:
            tails[pos] = num    # replace: maintains smallest possible tail
    return len(tails)  # length of tails = length of LIS`,
      explanation: [
        { lines: [3, 4, 5, 6, 7, 8], text: 'O(n²) DP: for each position i, check all j < i. If nums[j] < nums[i], we can extend the LIS ending at j. dp[i] = best extension.' },
        { lines: [12, 13, 14, 15, 16, 17, 18, 19], text: 'O(n log n) patience sort: maintain "tails" array where tails[k] is the smallest tail of any IS of length k+1. Binary search finds where to place each number.' },
        { lines: [16, 17], text: 'If num > all tails, it extends the longest IS (append). Otherwise, replace tails[pos] — this is the key insight: maintaining the smallest tail keeps future possibilities open.' },
      ],
      timeComplexity: 'O(n²) naive, O(n log n) with bisect',
      spaceComplexity: 'O(n)',
      tags: ['dp', 'lis', 'binary-search', 'patience-sorting'],
      commonMistakes: [
        '`tails` in the O(n log n) version is NOT the actual LIS — it\'s a virtual sequence used to track the count. Reconstruct with a parent array if you need the actual subsequence.',
      ],
      quizzes: [
        { question: 'What does tails[i] represent in the O(n log n) LIS algorithm?', answer: 'The minimum last element among all increasing subsequences of length i+1. Keeping the minimum tail gives the most "room" to extend the subsequence in the future.', type: 'recall' },
      ],
      variants: ['Non-decreasing LIS (use bisect_right)', 'LIS reconstruction'],
      prerequisites: ['dp-memoization', 'dp-tabulation'],
    },
    {
      id: 'dp-word-break',
      title: 'Word Break',
      description:
        'Can a string be segmented into dictionary words? Classic 1D DP: dp[i] = True if s[:i] can be formed. Check all valid j < i where dp[j] is True and s[j:i] is in the word set.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `def word_break(s: str, word_dict: list[str]) -> bool:
    words = set(word_dict)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
    return dp[n]


def word_break_sentences(s: str, word_dict: list[str]) -> list[str]:
    words = set(word_dict)
    memo: dict[int, list[str]] = {}

    def backtrack(start: int) -> list[str]:
        if start in memo:
            return memo[start]
        if start == len(s):
            return ['']
        result = []
        for end in range(start + 1, len(s) + 1):
            word = s[start:end]
            if word in words:
                for rest in backtrack(end):
                    result.append(word + (' ' + rest if rest else ''))
        memo[start] = result
        return result

    return backtrack(0)`,
      annotatedCode: `def word_break(s: str, word_dict: list[str]) -> bool:
    words = set(word_dict)   # O(1) lookup instead of O(len(word)) list search
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True             # empty string is always "breakable" — the base case
    for i in range(1, n + 1):
        for j in range(i):   # try every possible last word ending at i
            if dp[j] and s[j:i] in words:  # dp[j]=True means s[:j] is breakable
                dp[i] = True
                break        # found one valid split — no need to check more j values
    return dp[n]


def word_break_sentences(s: str, word_dict: list[str]) -> list[str]:
    words = set(word_dict)
    memo: dict[int, list[str]] = {}  # memoize by start index

    def backtrack(start: int) -> list[str]:
        if start in memo:
            return memo[start]  # already computed all sentences from this position
        if start == len(s):
            return ['']         # base case: empty string signals a complete sentence
        result = []
        for end in range(start + 1, len(s) + 1):
            word = s[start:end]
            if word in words:
                for rest in backtrack(end):  # recursively build remaining sentence
                    result.append(word + (' ' + rest if rest else ''))
        memo[start] = result
        return result

    return backtrack(0)`,
      explanation: [
        { lines: [5], text: '`dp[0] = True` is the critical seed: an empty prefix is always breakable. Without this, dp[i] can never become True for any i.' },
        { lines: [6, 7, 8], text: 'For each end position i, we scan all split points j. If s[:j] is breakable (dp[j]) AND s[j:i] is a word, then s[:i] is breakable.' },
        { lines: [17, 18], text: 'In the sentence-building version, memoization by start index prevents re-exploring the same suffix repeatedly — reduces exponential to polynomial in typical cases.' },
      ],
      timeComplexity: 'O(n² · m) where m = avg word length for slicing',
      spaceComplexity: 'O(n)',
      tags: ['dp', 'word-break', 'string', 'backtracking'],
      commonMistakes: [
        'Forgetting dp[0] = True — without it, no valid segmentation can ever be found.',
        'Using a list for word_dict — `s[j:i] in list` is O(word_count) per check, making the whole algorithm O(n³). Use a set.',
      ],
      quizzes: [
        { question: 'What does dp[i] represent in the Word Break DP array?', answer: 'dp[i] is True if s[:i] (the first i characters) can be segmented into valid dictionary words.', type: 'recall' },
      ],
      variants: ['Word Break II (return all valid sentences — backtracking + memo)', 'Word Break with limited word reuse'],
      prerequisites: ['dp-tabulation'],
    },
    {
      id: 'dp-edit-distance',
      title: 'Edit Distance (Levenshtein)',
      description:
        'Minimum operations (insert, delete, replace) to transform one string into another. Classic 2D DP. dp[i][j] = min edits to convert word1[:i] → word2[:j]. Space-optimisable to O(n).',
      difficulty: 'advanced',
      estimatedMinutes: 20,
      code: `def min_distance(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(
                    dp[i - 1][j],
                    dp[i][j - 1],
                    dp[i - 1][j - 1],
                )
    return dp[m][n]


def min_distance_optimised(word1: str, word2: str) -> int:
    n = len(word2)
    prev = list(range(n + 1))
    for i, c1 in enumerate(word1, 1):
        curr = [i] + [0] * n
        for j, c2 in enumerate(word2, 1):
            if c1 == c2:
                curr[j] = prev[j - 1]
            else:
                curr[j] = 1 + min(prev[j], curr[j - 1], prev[j - 1])
        prev = curr
    return prev[n]`,
      annotatedCode: `def min_distance(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i   # delete all i chars from word1 to reach empty word2
    for j in range(n + 1):
        dp[0][j] = j   # insert all j chars to reach word2 from empty word1
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:   # chars match — no operation needed
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(
                    dp[i - 1][j],      # delete from word1
                    dp[i][j - 1],      # insert into word1
                    dp[i - 1][j - 1],  # replace in word1
                )
    return dp[m][n]


def min_distance_optimised(word1: str, word2: str) -> int:
    n = len(word2)
    prev = list(range(n + 1))  # prev row initialised as base case dp[0][*]
    for i, c1 in enumerate(word1, 1):
        curr = [i] + [0] * n   # curr[0] = i (delete i chars from word1)
        for j, c2 in enumerate(word2, 1):
            if c1 == c2:
                curr[j] = prev[j - 1]   # diagonal — same as 2D version
            else:
                curr[j] = 1 + min(prev[j], curr[j - 1], prev[j - 1])
        prev = curr  # slide window — discard the previous row
    return prev[n]`,
      explanation: [
        { lines: [4, 5, 6, 7], text: 'Base cases: transforming between a string and an empty string costs exactly len(string) operations (all inserts or all deletes).' },
        { lines: [10, 11], text: 'When characters match, carry over the diagonal value — no operation is needed, so the cost is unchanged.' },
        { lines: [12, 13, 14, 15, 16], text: 'The three operations: `dp[i-1][j]` = delete (we consumed word1[i] without advancing word2), `dp[i][j-1]` = insert, `dp[i-1][j-1]` = replace.' },
        { lines: [21, 22, 23, 24], text: 'Space optimisation: only the previous row is needed to compute the current row. Roll a single `prev` array to reduce space from O(m·n) to O(n).' },
      ],
      timeComplexity: 'O(m·n)',
      spaceComplexity: 'O(m·n) or O(n) with rolling array',
      tags: ['dp', 'edit-distance', 'levenshtein', 'string', '2d-dp'],
      commonMistakes: [
        'Confusing which direction each operation maps to: delete = move up (i-1,j), insert = move left (i,j-1), replace = diagonal (i-1,j-1).',
        'Off-by-one: `word1[i-1]` not `word1[i]` — the dp table is 1-indexed but the strings are 0-indexed.',
      ],
      quizzes: [
        { question: 'What do the three terms `dp[i-1][j]`, `dp[i][j-1]`, `dp[i-1][j-1]` represent in the recurrence?', answer: 'dp[i-1][j] = delete word1[i]; dp[i][j-1] = insert word2[j]; dp[i-1][j-1] = replace word1[i] with word2[j]. We take the min and add 1.', type: 'recall' },
      ],
      variants: ['One Edit Distance (check if exactly 1 edit apart)', 'Longest Common Subsequence (cousin problem)'],
      prerequisites: ['dp-lcs', 'dp-tabulation'],
    },
  ],
}

export default dynamicProgramming
