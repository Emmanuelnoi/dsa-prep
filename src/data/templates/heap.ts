import type { Category } from '@/types'

const heap: Category = {
  id: 'heap',
  title: 'Heap / Priority Queue',
  icon: 'Triangle',
  group: 'foundations',
  templates: [
    {
      id: 'heap-operations',
      title: 'Min Heap Operations',
      description: 'Python\'s heapq module implements a min-heap. For a max-heap, negate values. Master push, pop, heapify, and nlargest/nsmallest.',
      difficulty: 'beginner',
      estimatedMinutes: 10,
      code: `import heapq

def heap_demo():
    h = []
    heapq.heappush(h, 3)
    heapq.heappush(h, 1)
    heapq.heappush(h, 4)
    print(h[0])
    smallest = heapq.heappop(h)
    
    data = [5, 2, 8, 1, 9]
    heapq.heapify(data)
    
    max_heap = []
    heapq.heappush(max_heap, -5)
    heapq.heappush(max_heap, -2)
    max_val = -heapq.heappop(max_heap)
    
    k_smallest = heapq.nsmallest(3, [5, 1, 3, 9, 2])
    k_largest = heapq.nlargest(3, [5, 1, 3, 9, 2])`,
      annotatedCode: `import heapq

def heap_demo():
    h = []
    heapq.heappush(h, 3)      # O(log n): push 3
    heapq.heappush(h, 1)      # O(log n): push 1 (becomes root)
    heapq.heappush(h, 4)
    print(h[0])               # O(1): peek minimum without removing
    smallest = heapq.heappop(h)  # O(log n): remove and return minimum
    
    data = [5, 2, 8, 1, 9]
    heapq.heapify(data)       # O(n): in-place convert list to heap
    
    max_heap = []             # max-heap trick: negate all values
    heapq.heappush(max_heap, -5)
    heapq.heappush(max_heap, -2)
    max_val = -heapq.heappop(max_heap)  # negate back when popping
    
    k_smallest = heapq.nsmallest(3, [5, 1, 3, 9, 2])  # O(n log k)
    k_largest = heapq.nlargest(3, [5, 1, 3, 9, 2])    # O(n log k)`,
      explanation: [
        { lines: [4, 5, 6, 7], text: 'heapq is a min-heap: the smallest element is always at index 0. heappush is O(log n).' },
        { lines: [8], text: 'Peek the minimum in O(1) with `h[0]` — do NOT pop if you only need to look.' },
        { lines: [12], text: 'heapify converts an arbitrary list to a valid heap in O(n) — faster than n heappush calls which would be O(n log n).' },
        { lines: [14, 15, 16, 17], text: 'Max-heap trick: negate values on push, negate again on pop. Works for numbers. For objects, use a wrapper class with reversed comparison.' },
      ],
      timeComplexity: 'O(log n) push/pop, O(n) heapify, O(n log k) nlargest/nsmallest',
      spaceComplexity: 'O(n)',
      tags: ['heap', 'priority-queue', 'min-heap', 'max-heap'],
      commonMistakes: [
        'Treating h[0] access as O(log n) — it is O(1). Only push/pop are O(log n).',
        'For a max-heap with tuples: use `(-priority, value)` as the tuple.',
      ],
      quizzes: [
        { question: 'You need the K smallest elements from a list. heapq.nsmallest(k, lst) is O(n log k). Is there a faster way when k << n?', answer: 'Yes: maintain a max-heap of size k. For each element, if it is smaller than the max (h[0]), push it and pop the max. Final heap contains k smallest. O(n log k).', type: 'recall' },
      ],
      variants: ['Heap with custom comparator using (priority, value) tuples'],
      prerequisites: [],
      nextTemplate: 'heap-k-largest',
    },
    {
      id: 'heap-k-largest',
      title: 'K-Largest Elements',
      description: 'Find the K largest elements efficiently. Use a min-heap of size K: maintain only the K largest seen so far.',
      difficulty: 'intermediate',
      estimatedMinutes: 10,
      code: `import heapq

def k_largest(nums: list[int], k: int) -> list[int]:
    heap = []
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)
    return sorted(heap, reverse=True)


def kth_largest(nums: list[int], k: int) -> int:
    return heapq.nlargest(k, nums)[-1]`,
      annotatedCode: `import heapq

def k_largest(nums: list[int], k: int) -> list[int]:
    heap = []                     # min-heap of size k
    for num in nums:
        heapq.heappush(heap, num) # O(log k) per element
        if len(heap) > k:
            heapq.heappop(heap)   # evict the smallest of the k+1 elements
    # heap now contains exactly the k largest elements
    return sorted(heap, reverse=True)


def kth_largest(nums: list[int], k: int) -> int:
    return heapq.nlargest(k, nums)[-1]  # last of the k largest = kth largest`,
      explanation: [
        { lines: [4, 5, 6, 7, 8], text: 'Maintain a min-heap of exactly k elements. Each new element is pushed; if the heap exceeds k, pop the minimum. After iterating, the heap contains the k largest — the root is the kth largest.' },
        { lines: [3], text: 'This approach uses O(k) space and O(n log k) time — better than sorting the full list (O(n log n)) when k << n.' },
        { lines: [11, 12], text: 'For just the kth largest: `nlargest(k, nums)[-1]` is simple but O(n log k).' },
      ],
      timeComplexity: 'O(n log k)',
      spaceComplexity: 'O(k)',
      tags: ['heap', 'top-k', 'min-heap'],
      commonMistakes: [
        'Using a max-heap and popping k times — this is O(n + k log n), valid but uses O(n) space.',
        'Sorting the full list — O(n log n) space and time, wastes work when k << n.',
      ],
      quizzes: [
        { question: 'Why use a MIN-heap (not max-heap) to find K LARGEST elements?', answer: 'The min-heap root is the smallest of the current K candidates. When a new element is larger than the root, swap it in. This efficiently maintains the K largest without storing all elements.', type: 'recall' },
      ],
      variants: ['K closest points to origin (use distance as key)', 'Online median (two heaps)'],
      prerequisites: ['heap-operations'],
      nextTemplate: 'heap-merge-k',
    },
    {
      id: 'heap-merge-k',
      title: 'Merge K Sorted Lists',
      description: 'Merge K sorted lists efficiently. Use a min-heap seeded with the first element of each list. O(n log k) where n = total elements.',
      difficulty: 'advanced',
      estimatedMinutes: 15,
      code: `import heapq

def merge_k_sorted(lists: list[list[int]]) -> list[int]:
    heap = []
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))
    result = []
    while heap:
        val, list_idx, elem_idx = heapq.heappop(heap)
        result.append(val)
        next_idx = elem_idx + 1
        if next_idx < len(lists[list_idx]):
            heapq.heappush(heap, (lists[list_idx][next_idx], list_idx, next_idx))
    return result`,
      annotatedCode: `import heapq

def merge_k_sorted(lists: list[list[int]]) -> list[int]:
    heap = []
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))  # (value, list_index, element_index)
    result = []
    while heap:
        val, list_idx, elem_idx = heapq.heappop(heap)  # extract smallest overall
        result.append(val)
        next_idx = elem_idx + 1
        if next_idx < len(lists[list_idx]):              # list has more elements
            heapq.heappush(heap, (lists[list_idx][next_idx], list_idx, next_idx))
    return result`,
      explanation: [
        { lines: [4, 5, 6, 7], text: 'Seed the heap with the first element of each non-empty list. Tuple format: (value, list_index, element_index) — value is compared first.' },
        { lines: [9, 10, 11], text: 'Pop the global minimum (smallest across all K lists).' },
        { lines: [12, 13, 14], text: 'Push the next element from the same list. The heap stays at most size K at all times.' },
      ],
      timeComplexity: 'O(n log k)',
      spaceComplexity: 'O(k)',
      tags: ['heap', 'merge', 'k-way-merge', 'priority-queue'],
      commonMistakes: [
        'Storing only the value in the heap — when two lists have the same value, Python tries to compare list_idx (fine since it\'s an int), but if values repeat you still need the index to know which list to advance.',
        'Not handling empty lists in the initial seeding loop.',
      ],
      quizzes: [
        { question: 'What is the time complexity of merge-k-sorted vs merging pairs repeatedly?', answer: 'Heap approach: O(n log k). Repeated pairwise merging: O(n log k) as well (if done like merge sort). But the heap approach processes each element exactly once.', type: 'recall' },
      ],
      variants: ['Merge K sorted linked lists'],
      prerequisites: ['heap-operations'],
      nextTemplate: 'heap-top-k-frequent',
    },
    {
      id: 'heap-top-k-frequent',
      title: 'Top K Frequent Elements',
      description: 'Find the K most frequent elements using a frequency map + min-heap of size K. O(n log k).',
      difficulty: 'intermediate',
      estimatedMinutes: 10,
      code: `import heapq
from collections import Counter

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    count = Counter(nums)
    heap = []
    for num, freq in count.items():
        heapq.heappush(heap, (freq, num))
        if len(heap) > k:
            heapq.heappop(heap)
    return [num for freq, num in heap]`,
      annotatedCode: `import heapq
from collections import Counter

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    count = Counter(nums)           # O(n): frequency map
    heap = []                       # min-heap by frequency
    for num, freq in count.items():
        heapq.heappush(heap, (freq, num))  # tuple: frequency first for comparison
        if len(heap) > k:
            heapq.heappop(heap)     # evict least frequent when heap exceeds k
    return [num for freq, num in heap]  # extract just the element values`,
      explanation: [
        { lines: [5], text: 'Counter({3: 3, 1: 2, 2: 1}) for [1,1,2,3,3,3] — frequency map in O(n).' },
        { lines: [7, 8, 9, 10], text: 'Maintain a min-heap by frequency of size K. When we exceed K elements, pop the one with the lowest frequency. What remains in the heap are the K most frequent.' },
        { lines: [11], text: 'Extract elements from the (freq, num) tuples. Note: heap does not guarantee sorted order by default.' },
      ],
      timeComplexity: 'O(n log k)',
      spaceComplexity: 'O(n)',
      tags: ['heap', 'hash-map', 'top-k', 'counter'],
      commonMistakes: [
        'Bucket sort alternative is O(n) — create buckets[freq] = [elements], then read from highest freq down. Use when k is close to n.',
      ],
      quizzes: [
        { question: 'What is the bucket sort approach for top-K frequent, and when is it better?', answer: 'Create a list of buckets where bucket[freq] = [elements with that frequency]. Scan from highest frequency down, collect k elements. O(n) time — better when you need all unique elements or k is large.', type: 'recall' },
      ],
      variants: ['Bucket sort O(n)', 'Top K frequent words (lexicographic tie-break)'],
      prerequisites: ['heap-operations', 'heap-k-largest'],
    },
  ],
}

export default heap
