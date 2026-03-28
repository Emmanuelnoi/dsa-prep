import type { Category } from '@/types'

const hashMap: Category = {
  id: 'hash-map',
  title: 'Hash Map / Set',
  icon: 'Hash',
  group: 'foundations',
  templates: [
    {
      id: 'hm-frequency-count',
      title: 'Frequency / Count Map',
      description:
        'Count occurrences of elements using a dict or Counter. The foundation of anagram detection, top-K, and majority element problems.',
      difficulty: 'beginner',
      estimatedMinutes: 5,
      code: `from collections import Counter, defaultdict

def frequency_map(nums: list) -> dict:
    count = {}
    for x in nums:
        count[x] = count.get(x, 0) + 1
    return count


def frequency_counter(nums: list) -> Counter:
    return Counter(nums)


def group_by(items: list, key_fn) -> dict:
    groups = defaultdict(list)
    for item in items:
        groups[key_fn(item)].append(item)
    return dict(groups)`,
      annotatedCode: `from collections import Counter, defaultdict

def frequency_map(nums: list) -> dict:
    count = {}
    for x in nums:
        count[x] = count.get(x, 0) + 1  # .get(x, 0) avoids KeyError on first occurrence
    return count


def frequency_counter(nums: list) -> Counter:
    return Counter(nums)  # one-liner: Counter({'a': 3, 'b': 2, ...})
    # Counter supports: most_common(k), arithmetic (+/-), subtraction


def group_by(items: list, key_fn) -> dict:
    groups = defaultdict(list)   # defaultdict: auto-initialises missing keys
    for item in items:
        groups[key_fn(item)].append(item)  # e.g. key_fn = sorted → group anagrams
    return dict(groups)`,
      explanation: [
        { lines: [5, 6], text: '`dict.get(key, default)` returns the default if the key is absent — clean way to count without an if-check or try/except.' },
        { lines: [10, 11], text: '`Counter` is a dict subclass. Use `.most_common(k)` for top-K frequency, and arithmetic operators to compare two Counters.' },
        { lines: [14, 15, 16], text: '`defaultdict(list)` auto-creates an empty list for any new key. Perfect for grouping: group anagrams by sorted-tuple key, items by category, etc.' },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      tags: ['hash-map', 'counter', 'frequency', 'defaultdict'],
      commonMistakes: [
        'Using `count[x] += 1` without initialising — raises KeyError. Use `.get(x, 0) + 1` or `defaultdict(int)`.',
        'Counter({}) vs {} — Counter supports subtraction and `most_common()`; plain dict does not.',
      ],
      quizzes: [
        {
          question: 'How would you check if two strings are anagrams using Counter?',
          answer: 'Counter(s1) == Counter(s2). Two Counters are equal when all keys and counts match.',
          type: 'recall',
        },
      ],
      variants: ['defaultdict(int) — same as Counter but no .most_common()', 'collections.OrderedDict — preserves insertion order (Python 3.7+ dicts already do)'],
      prerequisites: [],
      nextTemplate: 'hm-two-sum',
    },
    {
      id: 'hm-two-sum',
      title: 'Two Sum (Hash Map Pattern)',
      description:
        'Find a pair with a target sum in O(n) using a hash map. The complement trick: for each element x, check if (target - x) was seen before.',
      difficulty: 'beginner',
      estimatedMinutes: 10,
      code: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, x in enumerate(nums):
        complement = target - x
        if complement in seen:
            return [seen[complement], i]
        seen[x] = i
    return []


def two_sum_all_pairs(nums: list[int], target: int) -> list[list[int]]:
    seen = {}
    pairs = []
    for i, x in enumerate(nums):
        complement = target - x
        if complement in seen:
            for j in seen[complement]:
                pairs.append([j, i])
        if x not in seen:
            seen[x] = []
        seen[x].append(i)
    return pairs`,
      annotatedCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}                     # value → index
    for i, x in enumerate(nums):
        complement = target - x   # what we need to have seen before
        if complement in seen:    # O(1) hash table lookup
            return [seen[complement], i]
        seen[x] = i               # record AFTER checking (handles x + x = target edge case)
    return []


def two_sum_all_pairs(nums: list[int], target: int) -> list[list[int]]:
    seen = {}           # value → [list of indices]
    pairs = []
    for i, x in enumerate(nums):
        complement = target - x
        if complement in seen:
            for j in seen[complement]:  # multiple prior occurrences possible
                pairs.append([j, i])
        if x not in seen:
            seen[x] = []
        seen[x].append(i)
    return pairs`,
      explanation: [
        { lines: [4, 5, 6], text: 'Instead of a nested loop (O(n²)), ask: "have I seen the complement yet?" The hash map answers in O(1).' },
        { lines: [7], text: 'Record the current element AFTER checking. If target=6 and x=3, checking before inserting prevents returning [i, i] (using same element twice).' },
        { lines: [10, 11, 12, 13, 14, 15, 16], text: 'For all pairs: store a list of indices per value since the same value can appear multiple times.' },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      tags: ['hash-map', 'two-sum', 'complement'],
      commonMistakes: [
        'Checking after inserting: `seen[x] = i` then `if complement in seen` — for input [3,3] and target=6, you\'d return [0,0]. Insert AFTER checking.',
        'Returning indices vs values — read the problem carefully.',
      ],
      quizzes: [
        {
          question: 'Why do we store x AFTER checking for the complement, not before?',
          answer: 'If we stored first, and x == complement (e.g., x=3, target=6), we\'d match x with itself at the same index. Storing after ensures we only match with previously seen elements.',
          type: 'recall',
        },
      ],
      variants: ['Two Sum II (sorted array) → Two Pointers', 'Three Sum → sort + two pointers'],
      prerequisites: ['hm-frequency-count'],
      nextTemplate: 'hm-hash-set',
    },
    {
      id: 'hm-hash-set',
      title: 'Hash Set Patterns',
      description:
        'Use a set for O(1) membership checks, deduplication, and cycle detection. Core to "contains duplicate", "longest consecutive sequence", and visited tracking.',
      difficulty: 'beginner',
      estimatedMinutes: 10,
      code: `def contains_duplicate(nums: list[int]) -> bool:
    return len(nums) != len(set(nums))


def contains_duplicate_early_exit(nums: list[int]) -> bool:
    seen = set()
    for x in nums:
        if x in seen:
            return True
        seen.add(x)
    return False


def longest_consecutive(nums: list[int]) -> int:
    num_set = set(nums)
    best = 0
    for x in num_set:
        if x - 1 not in num_set:
            length = 1
            while x + length in num_set:
                length += 1
            best = max(best, length)
    return best`,
      annotatedCode: `def contains_duplicate(nums: list[int]) -> bool:
    return len(nums) != len(set(nums))  # O(n): set removes dups; length differs if dups exist


def contains_duplicate_early_exit(nums: list[int]) -> bool:
    seen = set()
    for x in nums:
        if x in seen:    # O(1) lookup
            return True  # short-circuit — don't process the whole list
        seen.add(x)
    return False


def longest_consecutive(nums: list[int]) -> int:
    num_set = set(nums)   # O(1) lookup for any number
    best = 0
    for x in num_set:
        if x - 1 not in num_set:    # only start a sequence at its beginning
            length = 1
            while x + length in num_set:  # extend the streak
                length += 1
            best = max(best, length)
    return best  # O(n) total — each number is visited at most twice`,
      explanation: [
        { lines: [2], text: 'Set conversion deduplicates in O(n). If lengths differ, duplicates existed. Simple but processes the full list — no early exit.' },
        { lines: [5, 6, 7, 8], text: 'Manual set tracking exits as soon as a duplicate is found — better for large inputs where duplicates appear early.' },
        { lines: [13, 14, 15, 16, 17, 18], text: 'Only start counting from sequence beginnings (x-1 not in set). This keeps the algorithm O(n) despite the nested while loop — each element is part of at most one sequence.' },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      tags: ['hash-set', 'deduplication', 'consecutive', 'membership'],
      commonMistakes: [
        'Longest Consecutive: starting the inner while loop from every element makes it O(n²). The `x-1 not in num_set` guard reduces it to O(n).',
        'Using a list for `seen` instead of a set — `x in list` is O(n), making the whole algorithm O(n²).',
      ],
      quizzes: [
        {
          question: 'Why does the longest consecutive sequence algorithm run in O(n) despite having a while loop inside a for loop?',
          answer: 'The while loop only runs from the start of each sequence (guarded by `x-1 not in num_set`). Every number is visited at most twice across all iterations — once in the for loop and once in a while loop.',
          type: 'recall',
        },
      ],
      variants: ['frozenset — hashable set (can be used as dict key)', 'set operations: union |, intersection &, difference -'],
      prerequisites: ['hm-frequency-count'],
      nextTemplate: 'hm-sliding-window-map',
    },
    {
      id: 'hm-sliding-window-map',
      title: 'Hash Map + Sliding Window',
      description:
        'Combine a hash map with a sliding window for problems involving "at most K distinct", substrings with constraints, or character replacement.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `def length_of_longest_substring(s: str) -> int:
    char_index = {}
    left = 0
    best = 0
    for right, ch in enumerate(s):
        if ch in char_index and char_index[ch] >= left:
            left = char_index[ch] + 1
        char_index[ch] = right
        best = max(best, right - left + 1)
    return best


def at_most_k_distinct(s: str, k: int) -> int:
    count = {}
    left = 0
    best = 0
    for right, ch in enumerate(s):
        count[ch] = count.get(ch, 0) + 1
        while len(count) > k:
            left_ch = s[left]
            count[left_ch] -= 1
            if count[left_ch] == 0:
                del count[left_ch]
            left += 1
        best = max(best, right - left + 1)
    return best`,
      annotatedCode: `def length_of_longest_substring(s: str) -> int:
    char_index = {}   # char → most recent index
    left = 0
    best = 0
    for right, ch in enumerate(s):
        if ch in char_index and char_index[ch] >= left:  # ch is inside current window
            left = char_index[ch] + 1  # jump left past the duplicate
        char_index[ch] = right         # update to latest index
        best = max(best, right - left + 1)
    return best


def at_most_k_distinct(s: str, k: int) -> int:
    count = {}       # char → frequency in current window
    left = 0
    best = 0
    for right, ch in enumerate(s):
        count[ch] = count.get(ch, 0) + 1
        while len(count) > k:          # window has too many distinct chars
            left_ch = s[left]
            count[left_ch] -= 1
            if count[left_ch] == 0:
                del count[left_ch]     # remove from map when count hits 0
            left += 1
        best = max(best, right - left + 1)
    return best`,
      explanation: [
        { lines: [5, 6, 7], text: 'The `>= left` check is crucial: if the character\'s last occurrence is before the window start, it\'s not a duplicate in the current window — no need to shrink.' },
        { lines: [14, 15, 16, 17, 18, 19], text: 'For "at most K distinct": the while loop shrinks the window from the left until the constraint is satisfied. Delete from the map when count reaches 0 to keep `len(count)` accurate.' },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(min(n, alphabet_size))',
      tags: ['hash-map', 'sliding-window', 'substring', 'two-pointers'],
      commonMistakes: [
        'Forgetting `char_index[ch] >= left` — without this, old occurrences outside the window incorrectly shrink it.',
        'Not deleting from the count map when frequency hits 0 — `len(count)` will be wrong.',
      ],
      quizzes: [
        {
          question: 'In `length_of_longest_substring`, why do we check `char_index[ch] >= left`?',
          answer: 'The character may have appeared before the current window\'s left boundary. If so, it\'s not actually a duplicate in the current window — no need to move left.',
          type: 'recall',
        },
      ],
      variants: ['Minimum window substring (track needed vs have counts)', 'Fruit into baskets (at most 2 distinct)'],
      prerequisites: ['hm-frequency-count', 'hm-two-sum'],
    },
    {
      id: 'hm-prefix-sum',
      title: 'Prefix Sum + Hash Map',
      description:
        'Combine a running prefix sum with a hash map to find subarrays with a target sum in O(n). Classic pattern for "subarray sum equals k".',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `def subarray_sum(nums: list[int], k: int) -> int:
    count = 0
    prefix = 0
    seen = {0: 1}
    for x in nums:
        prefix += x
        count += seen.get(prefix - k, 0)
        seen[prefix] = seen.get(prefix, 0) + 1
    return count


def subarray_sum_equals_k_indices(nums: list[int], k: int) -> list[int]:
    prefix = 0
    seen = {0: -1}
    for i, x in enumerate(nums):
        prefix += x
        if prefix - k in seen:
            return list(range(seen[prefix - k] + 1, i + 1))
        seen[prefix] = i
    return []`,
      annotatedCode: `def subarray_sum(nums: list[int], k: int) -> int:
    count = 0
    prefix = 0
    seen = {0: 1}    # prefix_sum → frequency; seed with 0 (empty prefix)
    for x in nums:
        prefix += x
        count += seen.get(prefix - k, 0)  # how many prior prefixes differ by k?
        seen[prefix] = seen.get(prefix, 0) + 1  # record this prefix sum
    return count


def subarray_sum_equals_k_indices(nums: list[int], k: int) -> list[int]:
    prefix = 0
    seen = {0: -1}   # prefix_sum → last index; -1 means "before array start"
    for i, x in enumerate(nums):
        prefix += x
        if prefix - k in seen:    # subarray from seen[prefix-k]+1 to i sums to k
            return list(range(seen[prefix - k] + 1, i + 1))
        seen[prefix] = i
    return []`,
      explanation: [
        { lines: [4], text: 'Seed the map with `{0: 1}` — representing the empty prefix. Without this, subarrays that start at index 0 and sum to k are missed.' },
        { lines: [6], text: 'Key insight: if `prefix[j] - prefix[i] == k`, then the subarray `nums[i+1..j]` sums to k. We look up `prefix - k` to find all such i values.' },
        { lines: [7], text: 'Record AFTER looking up to avoid using the current element as both start and end (i.e., avoid counting a subarray starting and ending at the same index).' },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      tags: ['hash-map', 'prefix-sum', 'subarray', 'running-sum'],
      commonMistakes: [
        'Forgetting to seed `{0: 1}` — misses subarrays starting from index 0.',
        'Recording the prefix sum BEFORE checking — double-counts the current element.',
      ],
      quizzes: [
        {
          question: 'Why do we initialise `seen = {0: 1}` instead of `seen = {}`?',
          answer: 'We need to count subarrays that start at index 0. If prefix[j] == k, we need seen[prefix-k] = seen[0] = 1 to count that. Without seeding {0:1}, this case is missed.',
          type: 'recall',
        },
      ],
      variants: ['Maximum subarray length with sum ≤ k', 'Count subarrays with even sum (mod 2 prefix)'],
      prerequisites: ['hm-frequency-count', 'hm-two-sum'],
    },
  ],
}

export default hashMap
