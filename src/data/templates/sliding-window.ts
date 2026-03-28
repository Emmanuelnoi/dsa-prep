import type { Category } from '@/types'

const slidingWindow: Category = {
  id: 'sliding-window',
  title: 'Sliding Window',
  icon: 'PanelLeftOpen',
  group: 'foundations',
  templates: [
    {
      id: 'sw-fixed',
      title: 'Fixed Size Window',
      description: 'Maintain a window of exactly k elements. Add the incoming element and remove the outgoing element in O(1) per step.',
      difficulty: 'beginner',
      estimatedMinutes: 10,
      code: `def max_sum_subarray(arr: list[int], k: int) -> int:
    if len(arr) < k:
        return 0
    window_sum = sum(arr[:k])
    max_sum = window_sum
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum`,
      annotatedCode: `def max_sum_subarray(arr: list[int], k: int) -> int:
    if len(arr) < k:
        return 0
    window_sum = sum(arr[:k])  # compute first window in O(k)
    max_sum = window_sum
    for i in range(k, len(arr)):  # slide window one step at a time
        window_sum += arr[i] - arr[i - k]  # add incoming, remove outgoing
        max_sum = max(max_sum, window_sum)
    return max_sum`,
      explanation: [
        { lines: [4, 5], text: 'Initialize the first window of size k by summing arr[0..k-1]. This is the only time we do O(k) work.' },
        { lines: [6, 7], text: 'Slide right: add the new element entering the window (arr[i]) and subtract the element leaving it (arr[i-k]). O(1) per step.' },
        { lines: [8], text: 'Track the running maximum.' },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      tags: ['sliding-window', 'fixed-size', 'subarray'],
      commonMistakes: [
        'Recomputing the window sum from scratch each step — O(n·k) instead of O(n).',
        'Off-by-one in the outgoing element: when i is the NEW right edge (0-indexed), the element leaving is at i-k (not i-k+1).',
      ],
      quizzes: [
        { question: 'What is the index of the element being removed from the window when the new right edge is at index i?', answer: 'arr[i - k]. The window contains indices [i-k+1 .. i], so the element that just left is at i-k.', type: 'predict-output' },
      ],
      variants: ['Average of k-size subarrays', 'Max of k-size subarrays (use deque — see sw-max-window)'],
      prerequisites: [],
      nextTemplate: 'sw-variable',
    },
    {
      id: 'sw-variable',
      title: 'Variable Size Window',
      description: 'Expand the right edge to grow the window; shrink from the left when the window violates a constraint. Find the longest/shortest valid subarray.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `def longest_subarray_sum_at_most_k(arr: list[int], k: int) -> int:
    left = 0
    window_sum = 0
    max_len = 0
    for right in range(len(arr)):
        window_sum += arr[right]
        while window_sum > k:
            window_sum -= arr[left]
            left += 1
        max_len = max(max_len, right - left + 1)
    return max_len`,
      annotatedCode: `def longest_subarray_sum_at_most_k(arr: list[int], k: int) -> int:
    left = 0
    window_sum = 0
    max_len = 0
    for right in range(len(arr)):   # right pointer always advances
        window_sum += arr[right]    # expand window
        while window_sum > k:       # window violates constraint
            window_sum -= arr[left] # shrink from the left
            left += 1
        max_len = max(max_len, right - left + 1)  # valid window: record its size
    return max_len`,
      explanation: [
        { lines: [5, 6], text: '`right` advances every iteration, expanding the window one element at a time.' },
        { lines: [7, 8, 9], text: 'When the constraint is violated, shrink from the left until the window is valid again. This is the key decision — use `while` not `if` because one removal may not be enough.' },
        { lines: [10], text: 'Only record the window size when it is valid (after the shrink step).' },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      tags: ['sliding-window', 'variable-size', 'two-pointers'],
      commonMistakes: [
        'Using `if` instead of `while` to shrink — one shrink may still leave the window invalid.',
        'For "shortest subarray" problems: shrink when the window IS valid (not when it is invalid).',
      ],
      quizzes: [
        { question: 'How does this pattern change for finding the SHORTEST valid subarray?', answer: 'Move the shrink condition: use `while window_is_valid: record length; shrink from left`. Expand unconditionally, shrink while valid, track minimum length.', type: 'recall' },
      ],
      variants: ['Longest Substring Without Repeating Characters', 'Longest Substring with At Most K Distinct Characters'],
      prerequisites: ['sw-fixed'],
      nextTemplate: 'sw-min-window',
    },
    {
      id: 'sw-min-window',
      title: 'Minimum Window Substring',
      description: 'Find the shortest substring of s that contains all characters in t. Uses a frequency-map to track how many required characters are still missing.',
      difficulty: 'advanced',
      estimatedMinutes: 20,
      code: `from collections import Counter

def min_window(s: str, t: str) -> str:
    if not t or not s:
        return ""
    need = Counter(t)
    have = {}
    formed = 0
    required = len(need)
    left = 0
    min_len = float('inf')
    result = ""
    for right in range(len(s)):
        c = s[right]
        have[c] = have.get(c, 0) + 1
        if c in need and have[c] == need[c]:
            formed += 1
        while formed == required:
            if right - left + 1 < min_len:
                min_len = right - left + 1
                result = s[left:right + 1]
            have[s[left]] -= 1
            if s[left] in need and have[s[left]] < need[s[left]]:
                formed -= 1
            left += 1
    return result`,
      annotatedCode: `from collections import Counter

def min_window(s: str, t: str) -> str:
    if not t or not s:
        return ""
    need = Counter(t)   # frequency of each char required
    have = {}           # frequency of each char in current window
    formed = 0          # how many unique chars from t are fully satisfied
    required = len(need)  # total unique chars needed
    left = 0
    min_len = float('inf')
    result = ""
    for right in range(len(s)):  # expand right
        c = s[right]
        have[c] = have.get(c, 0) + 1
        if c in need and have[c] == need[c]:  # this char is now fully satisfied
            formed += 1
        while formed == required:  # window contains all required chars → try to shrink
            if right - left + 1 < min_len:  # update answer
                min_len = right - left + 1
                result = s[left:right + 1]
            have[s[left]] -= 1
            if s[left] in need and have[s[left]] < need[s[left]]:  # satisfaction lost
                formed -= 1
            left += 1  # shrink from left
    return result`,
      explanation: [
        { lines: [5, 6, 7, 8], text: '`need` = required frequencies. `have` = current window frequencies. `formed` counts how many unique characters are fully covered (have[c] >= need[c]).' },
        { lines: [13, 14, 15, 16], text: 'Expand right: add the character. If its count in `have` just reached the required count in `need`, increment `formed`.' },
        { lines: [17, 18, 19, 20], text: 'When all required chars are covered (`formed == required`), record the window if it is the smallest so far.' },
        { lines: [21, 22, 23, 24], text: 'Shrink from left: remove the outgoing character. If its count drops below required, decrement `formed` (window is no longer valid).' },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(k)',
      tags: ['sliding-window', 'hashmap', 'string', 'frequency-count'],
      commonMistakes: [
        'Updating `formed` whenever any count changes — only update when the count crosses the threshold (reaches or drops below `need[c]`).',
        'Forgetting to track both the window size and start index — need both to reconstruct the answer.',
      ],
      quizzes: [
        { question: 'Why do we only increment `formed` when `have[c] == need[c]` (not when have[c] > need[c])?', answer: '`formed` tracks fully satisfied characters. Once have[c] == need[c], the character is newly satisfied. Going beyond the needed count does not change satisfaction status — avoid double-counting.', type: 'recall' },
      ],
      variants: [],
      prerequisites: ['sw-variable'],
      nextTemplate: 'sw-max-window',
    },
    {
      id: 'sw-max-window',
      title: 'Max Sliding Window',
      description: 'Find the maximum in every window of size k in O(n) using a monotonic deque. The deque stores indices in decreasing order of their values.',
      difficulty: 'advanced',
      estimatedMinutes: 15,
      code: `from collections import deque

def max_sliding_window(nums: list[int], k: int) -> list[int]:
    dq = deque()
    result = []
    for i in range(len(nums)):
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            result.append(nums[dq[0]])
    return result`,
      annotatedCode: `from collections import deque

def max_sliding_window(nums: list[int], k: int) -> list[int]:
    dq = deque()  # monotonic decreasing deque: stores INDICES
    result = []
    for i in range(len(nums)):
        while dq and dq[0] < i - k + 1:  # remove indices outside the window
            dq.popleft()
        while dq and nums[dq[-1]] < nums[i]:  # remove smaller elements (they can never be max)
            dq.pop()
        dq.append(i)  # add current index
        if i >= k - 1:  # window is full — record the maximum (front of deque)
            result.append(nums[dq[0]])
    return result`,
      explanation: [
        { lines: [4], text: 'Deque stores indices (not values). Values are accessed as `nums[dq[...]]`. The deque is monotonically decreasing by value.' },
        { lines: [7, 8], text: 'Remove the front index if it has slid out of the current window (index < i - k + 1).' },
        { lines: [9, 10], text: 'Remove from the back any index whose value is smaller than nums[i]. Those elements can never be the window maximum — nums[i] is both larger AND more recent.' },
        { lines: [11], text: 'Always append the current index to the back.' },
        { lines: [12, 13], text: 'Once the first full window is formed (i >= k-1), the front of the deque is the index of the current window\'s maximum.' },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(k)',
      tags: ['sliding-window', 'deque', 'monotonic-deque', 'fixed-size'],
      commonMistakes: [
        'Storing values instead of indices in the deque — you cannot check if the front is out of the window without the index.',
        'The deque stores indices in DECREASING order of their VALUES — front always has the index of the current max.',
      ],
      quizzes: [
        { question: 'What is the amortized time complexity per element, and why is the overall algorithm O(n)?', answer: 'Each index is added to the deque exactly once and removed at most once. Total operations ≤ 2n, giving O(n) overall.', type: 'complexity-choice' },
      ],
      variants: ['Min Sliding Window (flip comparison)', 'Monotonic Stack (similar idea without window expiry)'],
      prerequisites: ['sw-fixed', 'sw-variable'],
    },
  ],
}

export default slidingWindow
