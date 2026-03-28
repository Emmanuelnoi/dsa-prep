import type { Category } from '@/types'

const stack: Category = {
  id: 'stack',
  title: 'Stack / Monotonic Stack',
  icon: 'Layers2',
  group: 'foundations',
  templates: [
    {
      id: 'stack-basics',
      title: 'Stack Basics: Push / Pop / Peek',
      description:
        'Master the core stack interface using Python list and collections.deque. Valid Parentheses is the canonical use case: push openings, match closings.',
      difficulty: 'beginner',
      estimatedMinutes: 10,
      code: `from collections import deque

def push_pop_peek_list():
    stack = []
    stack.append(1)
    stack.append(2)
    stack.append(3)
    top = stack[-1]
    stack.pop()
    return top


def push_pop_peek_deque():
    stack = deque()
    stack.append(1)
    stack.append(2)
    stack.append(3)
    top = stack[-1]
    stack.pop()
    return top


def is_valid(s: str) -> bool:
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    for ch in s:
        if ch in '({[':
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack[-1] != pairs[ch]:
                return False
            stack.pop()
    return len(stack) == 0`,
      annotatedCode: `from collections import deque

def push_pop_peek_list():
    stack = []                    # Python list is the simplest stack: push=append, pop=pop
    stack.append(1)              # push: amortized O(1)
    stack.append(2)
    stack.append(3)
    top = stack[-1]              # peek: read top without removing, O(1)
    stack.pop()                  # pop: remove from the end (top), O(1) amortized
    return top


def push_pop_peek_deque():
    stack = deque()             # deque from collections: O(1) append/pop from both ends
    stack.append(1)            # for stack usage: append (push) and pop from the right end
    stack.append(2)
    stack.append(3)
    top = stack[-1]            # peek: O(1)
    stack.pop()                # pop from right end (top of stack), O(1)
    return top


def is_valid(s: str) -> bool:
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}  # maps each closing bracket to its expected opening
    for ch in s:
        if ch in '({[':
            stack.append(ch)               # push opening bracket onto the stack
        elif ch in pairs:
            if not stack or stack[-1] != pairs[ch]:  # check empty BEFORE indexing to avoid IndexError
                return False
            stack.pop()                    # matched pair: discard both
    return len(stack) == 0               # valid only if all opening brackets were matched`,
      explanation: [
        {
          lines: [4, 5, 8, 9],
          text: 'Python list: `append()` pushes to the end, `[-1]` peeks, `pop()` removes the last element. All O(1) amortized — the most common stack in interview code.',
        },
        {
          lines: [13, 14],
          text: '`collections.deque` is backed by a doubly-linked list. Prefer it when performance matters: `list.pop(0)` is O(n) but `deque.popleft()` is O(1). For a pure stack (top-only access), both list and deque are equivalent.',
        },
        {
          lines: [24, 25],
          text: 'The `pairs` dict maps each closing bracket to the opening bracket it must match. This avoids three separate `if` checks.',
        },
        {
          lines: [29, 30, 31, 32],
          text: '`not stack` must be checked BEFORE `stack[-1]` — accessing an empty list raises IndexError. Short-circuit evaluation handles this: Python stops at `not stack` if it is True.',
        },
        {
          lines: [33],
          text: 'Return `len(stack) == 0`, not just `True`. Unmatched opening brackets like `"((("` would otherwise be incorrectly accepted.',
        },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      tags: ['stack', 'deque', 'parentheses', 'string'],
      commonMistakes: [
        'Calling `stack.pop()` without checking `if stack` first — raises IndexError on empty stack.',
        'Returning `True` at the end instead of `len(stack) == 0` — misses unclosed brackets like `"(("`.',
        'Using `stack.pop(0)` (O(n)) instead of `stack.pop()` (O(1)) for the stack top.',
      ],
      quizzes: [
        {
          question: 'Which bracket types does the Valid Parentheses problem require checking?',
          answer: 'All three: round `()`, curly `{}`, and square `[]`. Each closing bracket must match the most recently opened bracket of the same type.',
          type: 'recall',
        },
        {
          question: 'Trace `is_valid("({)}")`. What does `stack` contain just before returning, and what is returned?',
          answer: 'After `(` push: stack=[`(`]. After `{` push: stack=[`(`, `{`]. On `)`: stack[-1] is `{` but pairs[`)`) is `(` → mismatch → return False immediately.',
          type: 'predict-output',
        },
      ],
      variants: [
        'Minimum Remove to Make Valid Parentheses (LeetCode 1249)',
        'Longest Valid Parentheses (LeetCode 32)',
        'Score of Parentheses (LeetCode 856)',
      ],
      prerequisites: [],
      nextTemplate: 'stack-min',
    },
    {
      id: 'stack-min',
      title: 'Min Stack (O(1) getMin)',
      description:
        'Design a stack that returns the current minimum in O(1). Use an auxiliary min_stack in sync with the main stack — its top always holds the running minimum.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val: int) -> None:
        self.stack.append(val)
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)

    def pop(self) -> None:
        val = self.stack.pop()
        if val == self.min_stack[-1]:
            self.min_stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.min_stack[-1]`,
      annotatedCode: `class MinStack:
    def __init__(self):
        self.stack = []       # main stack: stores every pushed value
        self.min_stack = []   # auxiliary stack: top is always the current minimum

    def push(self, val: int) -> None:
        self.stack.append(val)                              # always push to main stack
        if not self.min_stack or val <= self.min_stack[-1]:  # <= not <: equal values need their own entry
            self.min_stack.append(val)                      # new minimum (or tie): track it

    def pop(self) -> None:
        val = self.stack.pop()                              # remove from main stack
        if val == self.min_stack[-1]:                       # was this value the current minimum?
            self.min_stack.pop()                            # yes: pop to restore the previous minimum

    def top(self) -> int:
        return self.stack[-1]                               # peek main stack, O(1)

    def getMin(self) -> int:
        return self.min_stack[-1]                           # O(1): current min always at top of min_stack`,
      explanation: [
        {
          lines: [3, 4],
          text: 'Two stacks in sync: `stack` holds all values; `min_stack` holds only values that are a minimum at the time of their push. The top of `min_stack` is always the current global minimum.',
        },
        {
          lines: [7, 8],
          text: '`<=` (not `<`) is critical. If you push `[3, 1, 1]` and pop once, the remaining min is still `1`. Using `<` would drop the second `1` from `min_stack`, leaving it empty when the first `1` is later popped.',
        },
        {
          lines: [11, 12, 13],
          text: 'On pop, only remove from `min_stack` if the popped value equals the current min. This restores the previous minimum — the new top of `min_stack` becomes the running minimum again.',
        },
        {
          lines: [19],
          text: '`getMin` is O(1): no scanning needed. The invariant guarantees the current minimum is always at the top of `min_stack`.',
        },
      ],
      timeComplexity: 'O(1) for all operations',
      spaceComplexity: 'O(n)',
      tags: ['stack', 'design', 'min-stack', 'auxiliary-stack'],
      commonMistakes: [
        'Using `val < self.min_stack[-1]` (strict less-than) instead of `<=` — fails when equal values are pushed then popped.',
        'Forgetting to check `not self.min_stack` before accessing `self.min_stack[-1]` in `push`.',
        'Popping `min_stack` unconditionally on every `pop()` instead of only when the popped value equals the current min.',
      ],
      quizzes: [
        {
          question: 'Why do we push to `min_stack` when `val <= self.min_stack[-1]` instead of `val < self.min_stack[-1]`?',
          answer: 'If we use strict `<`, pushing duplicates of the minimum (e.g., two 1s) only records one entry. When the first 1 is popped, `min_stack` loses the min entirely, breaking `getMin()` for the remaining 1.',
          type: 'recall',
        },
        {
          question: 'What is the time complexity of all four operations (push, pop, top, getMin) in MinStack?',
          answer: 'All four are O(1). Push and pop on both stacks are O(1); top and getMin read the top element without iteration.',
          type: 'complexity-choice',
        },
      ],
      variants: [
        'Max Stack (O(1) getMax) — same pattern with a max_stack',
        'Min Queue — use two MinStacks to simulate a queue with O(1) getMin',
      ],
      prerequisites: ['stack-basics'],
      nextTemplate: 'stack-monotonic-increasing',
    },
    {
      id: 'stack-monotonic-increasing',
      title: 'Monotonic Increasing Stack',
      description:
        'Maintain a stack where bottom-to-top is non-decreasing. Each new element pops all larger elements, which immediately reveals their "next smaller element". Template for: Next Smaller Element, Stock Span.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      code: `def next_smaller_element(nums: list[int]) -> list[int]:
    n = len(nums)
    result = [-1] * n
    stack = []
    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] > x:
            idx = stack.pop()
            result[idx] = x
        stack.append(i)
    return result


def stock_span(prices: list[int]) -> list[int]:
    span = []
    stack = []
    for price in prices:
        curr_span = 1
        while stack and stack[-1][0] <= price:
            curr_span += stack.pop()[1]
        stack.append((price, curr_span))
        span.append(curr_span)
    return span`,
      annotatedCode: `def next_smaller_element(nums: list[int]) -> list[int]:
    n = len(nums)
    result = [-1] * n                # -1 signals no smaller element exists to the right
    stack = []                       # stores indices; invariant: nums[stack[i]] <= nums[stack[i+1]]
    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] > x:  # x breaks the invariant → the top element's answer is x
            idx = stack.pop()
            result[idx] = x          # x is the next smaller element for the index we just popped
        stack.append(i)              # push index (not value) — needed to compute distances or update result
    return result


def stock_span(prices: list[int]) -> list[int]:
    span = []
    stack = []                       # stack of (price, cumulative_span) tuples
    for price in prices:
        curr_span = 1                # every day spans at least itself
        while stack and stack[-1][0] <= price:  # pop all consecutive days with price ≤ today's
            curr_span += stack.pop()[1]          # absorb their cumulative spans into today's
        stack.append((price, curr_span))         # push today with its total span
        span.append(curr_span)
    return span`,
      explanation: [
        {
          lines: [3, 4],
          text: 'Initialise `result` to -1 (no answer). The stack stores *indices* not values, so we can write to `result[idx]` when an element is popped.',
        },
        {
          lines: [5, 6, 7, 8],
          text: 'Core loop: when a new element `x` is smaller than the stack top, the top has found its "next smaller element" — it is `x`. Pop and record. This runs in O(n) amortized because each element is pushed and popped at most once.',
        },
        {
          lines: [9],
          text: 'After the while loop, the invariant is restored (stack top ≤ x), so we push `i`. Elements remaining in `stack` after the full loop have no smaller element to the right — their result stays -1.',
        },
        {
          lines: [14, 15, 16, 17, 18],
          text: 'Stock Span stores (price, span) pairs. Popping days with lower or equal price accumulates their spans. The stack always has increasing prices bottom-to-top (same monotonic increasing invariant).',
        },
      ],
      timeComplexity: 'O(n) amortized',
      spaceComplexity: 'O(n)',
      tags: ['stack', 'monotonic', 'monotonic-increasing', 'next-smaller', 'stock-span'],
      commonMistakes: [
        'Pushing values instead of indices — you lose the position information needed to update `result[idx]`.',
        'Using `>= x` instead of `> x` in the while condition — changes semantics to "next smaller or equal".',
        'Not handling elements left on the stack after the loop — they have no next smaller element and should remain -1.',
      ],
      quizzes: [
        {
          question: 'What invariant does a monotonic increasing stack maintain?',
          answer: 'Elements in the stack (bottom to top) are in non-decreasing order by value. Each new element is larger than or equal to the element below it.',
          type: 'recall',
        },
        {
          question: 'Trace `next_smaller_element([2, 1, 5, 3])`. What is returned?',
          answer: 'i=0 push 0. i=1: nums[0]=2>1 → pop 0, result[0]=1, push 1. i=2: 1<5, push 2. i=3: nums[2]=5>3 → pop 2, result[2]=3, push 3. Final: result=[-1 filled by loop but result[0]=1, result[2]=3, result[1]=-1, result[3]=-1] → [1, -1, 3, -1].',
          type: 'predict-output',
        },
      ],
      variants: [
        'Previous Smaller Element — iterate right to left instead of left to right',
        'Largest Rectangle in Histogram — uses the same popping mechanism (see stack-largest-rectangle)',
        'Sum of Subarray Minimums (LeetCode 907)',
      ],
      prerequisites: ['stack-basics'],
      nextTemplate: 'stack-monotonic-decreasing',
    },
    {
      id: 'stack-monotonic-decreasing',
      title: 'Monotonic Decreasing Stack',
      description:
        'Maintain a stack where bottom-to-top is non-increasing. Pops elements when a larger value arrives. Template for: Next Greater Element, Daily Temperatures, and a brute-force baseline for Largest Rectangle.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      code: `def next_greater_element(nums: list[int]) -> list[int]:
    n = len(nums)
    result = [-1] * n
    stack = []
    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] < x:
            idx = stack.pop()
            result[idx] = x
        stack.append(i)
    return result


def daily_temperatures(temperatures: list[int]) -> list[int]:
    n = len(temperatures)
    result = [0] * n
    stack = []
    for i, temp in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < temp:
            idx = stack.pop()
            result[idx] = i - idx
        stack.append(i)
    return result


def largest_rectangle_naive(heights: list[int]) -> int:
    max_area = 0
    for i in range(len(heights)):
        min_h = heights[i]
        for j in range(i, len(heights)):
            min_h = min(min_h, heights[j])
            max_area = max(max_area, min_h * (j - i + 1))
    return max_area`,
      annotatedCode: `def next_greater_element(nums: list[int]) -> list[int]:
    n = len(nums)
    result = [-1] * n               # default: no greater element to the right
    stack = []                      # indices; invariant: nums[stack[i]] >= nums[stack[i+1]] (decreasing)
    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] < x:  # x is larger → top has found its next greater element
            idx = stack.pop()
            result[idx] = x
        stack.append(i)
    return result


def daily_temperatures(temperatures: list[int]) -> list[int]:
    n = len(temperatures)
    result = [0] * n               # 0 = no warmer future day
    stack = []                     # indices of days still waiting for a warmer day
    for i, temp in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < temp:  # today is warmer than the day at stack top
            idx = stack.pop()
            result[idx] = i - idx  # days waited = today's index − the stored index
        stack.append(i)            # push today; it will be popped when a warmer day appears
    return result


def largest_rectangle_naive(heights: list[int]) -> int:
    max_area = 0                   # O(n²) brute force — provided as a contrast to the O(n) stack solution
    for i in range(len(heights)):
        min_h = heights[i]
        for j in range(i, len(heights)):
            min_h = min(min_h, heights[j])   # minimum height in the window [i..j] limits the rectangle
            max_area = max(max_area, min_h * (j - i + 1))
    return max_area`,
      explanation: [
        {
          lines: [3, 4],
          text: 'Decreasing stack stores indices in order of non-increasing values. When element `x` pops an index, `x` is the first element to the right that is greater — the classic "next greater element" answer.',
        },
        {
          lines: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
          text: 'Daily Temperatures is Next Greater Element but the answer is the *distance* not the value. Storing the index (not temperature) lets us compute `i - idx` directly on pop.',
        },
        {
          lines: [20, 21],
          text: '`stack[-1]` at any step represents the most recent day that has not yet found a warmer future day. When today\'s temperature is higher, that day\'s wait is resolved.',
        },
        {
          lines: [25, 26, 27, 28, 29, 30, 31],
          text: 'O(n²) baseline: for every starting bar `i`, track the minimum height as the right boundary `j` extends. This is correct but too slow — see `stack-largest-rectangle` for the O(n) solution.',
        },
      ],
      timeComplexity: 'O(n) amortized',
      spaceComplexity: 'O(n)',
      tags: ['stack', 'monotonic', 'monotonic-decreasing', 'next-greater', 'daily-temperatures'],
      commonMistakes: [
        'Using `<=` instead of `<` in the while condition — changes semantics and may skip equal-valued elements incorrectly.',
        'Pushing the value instead of the index — you cannot compute `i - idx` (the wait time) without the index.',
        'Forgetting that elements remaining on the stack after the loop have no next greater element (result stays 0 or -1).',
      ],
      quizzes: [
        {
          question: 'In Daily Temperatures, what does `stack[-1]` represent at each iteration?',
          answer: 'The index of the most recent day that is still waiting for a warmer future day. It will be popped and resolved as soon as a warmer temperature appears.',
          type: 'recall',
        },
        {
          question: 'Trace `daily_temperatures([73, 74, 75, 71, 69, 72, 76, 73])`. What is `result[4]` (temperature 69)?',
          answer: 'At i=5, temp=72 > temperatures[4]=69, so idx=4 is popped and result[4] = 5-4 = 1. Temperature 69 must wait 1 day.',
          type: 'predict-output',
        },
      ],
      variants: [
        'Next Greater Element II — circular array, iterate twice or use modulo',
        'Online Stock Span (LeetCode 901) — streaming version of stock span',
        'Largest Rectangle in Histogram O(n) — see stack-largest-rectangle',
      ],
      prerequisites: ['stack-monotonic-increasing'],
      nextTemplate: 'stack-largest-rectangle',
    },
    {
      id: 'stack-largest-rectangle',
      title: 'Largest Rectangle in Histogram',
      description:
        'Classic hard problem: find the largest axis-aligned rectangle in a histogram. A monotonic increasing stack tracks left boundaries. Append a sentinel 0 to flush all remaining bars at the end. O(n) time.',
      difficulty: 'advanced',
      estimatedMinutes: 25,
      code: `def largest_rectangle_in_histogram(heights: list[int]) -> int:
    heights = heights + [0]
    stack = []
    max_area = 0
    for i, h in enumerate(heights):
        start = i
        while stack and stack[-1][1] > h:
            idx, height = stack.pop()
            max_area = max(max_area, height * (i - idx))
            start = idx
        stack.append((start, h))
    return max_area`,
      annotatedCode: `def largest_rectangle_in_histogram(heights: list[int]) -> int:
    heights = heights + [0]        # sentinel: height 0 forces every remaining bar to be popped and evaluated
    stack = []                     # (start_index, height): the bar can extend leftward to start_index
    max_area = 0
    for i, h in enumerate(heights):
        start = i                  # optimistically, this bar extends only to its own position
        while stack and stack[-1][1] > h:   # h is shorter → the top bar cannot extend further right
            idx, height = stack.pop()
            max_area = max(max_area, height * (i - idx))  # rectangle width = i (exclusive right) - idx (left)
            start = idx            # the current bar h can extend left to where the popped bar started
        stack.append((start, h))  # push with leftmost reachable start (may be earlier than i)
    return max_area`,
      explanation: [
        {
          lines: [2],
          text: 'Appending `0` is the sentinel trick. Without it, bars remaining in the stack after the main loop are never evaluated. The sentinel bar (height 0) is shorter than everything, so it flushes the entire stack.',
        },
        {
          lines: [3],
          text: 'The stack stores `(start_index, height)` pairs. `start_index` is the leftmost column the bar can include in its rectangle — it may reach further left than the bar\'s own position because shorter bars to its left were already popped.',
        },
        {
          lines: [6, 7, 8, 9, 10],
          text: 'When bar `h` is shorter than the stack top, the top bar can no longer extend right (it is blocked by `h`). Its rectangle spans from `idx` to `i` (exclusive), giving width `i - idx`. After popping, `start` is updated: `h` can now reach as far left as the popped bar could.',
        },
        {
          lines: [11],
          text: 'Push `(start, h)` not `(i, h)`. Because all taller bars to the left were popped, `h` can extend its left boundary back to `start` — this is the "extend left" intuition.',
        },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      tags: ['stack', 'monotonic', 'histogram', 'hard', 'sentinel'],
      commonMistakes: [
        'Forgetting the sentinel `0` — bars at the end of the array are never popped and their rectangles are missed.',
        'Computing width as `i - idx - 1` instead of `i - idx` — off-by-one error because `start_index` is the inclusive left boundary.',
        'Pushing `(i, h)` instead of `(start, h)` — loses the "extended left reach" and produces incorrect areas for wide, short rectangles.',
      ],
      quizzes: [
        {
          question: 'Why do we append a sentinel `0` to `heights` at the start?',
          answer: 'Without it, bars that are never shorter than any element to their right stay on the stack and are never evaluated. The sentinel (height 0, shorter than everything) forces all remaining bars to be popped in the final iteration.',
          type: 'recall',
        },
        {
          question: 'For `heights = [2, 1, 5, 6, 2, 3]`, what is the largest rectangle area?',
          answer: '10. The rectangle uses bars at indices 2 and 3 (heights 5 and 6): min height = 5, width = 2, area = 10.',
          type: 'predict-output',
        },
      ],
      variants: [
        'Maximal Rectangle (LeetCode 85) — apply this histogram solution row-by-row on a binary matrix',
        'Container With Most Water (LeetCode 11) — two-pointer variant',
        'Trapping Rain Water (LeetCode 42) — stack or two-pointer',
      ],
      prerequisites: ['stack-monotonic-increasing', 'stack-monotonic-decreasing'],
    },
  ],
}

export default stack
