import type { Category } from '@/types'

const sorting: Category = {
  id: 'sorting',
  title: 'Sorting',
  icon: 'ArrowUpDown',
  group: 'foundations',
  templates: [
    {
      id: 'sort-bubble',
      title: 'Bubble Sort',
      description: 'Repeatedly swap adjacent elements that are out of order. After each pass, the largest unsorted element "bubbles" to its correct position.',
      difficulty: 'beginner',
      estimatedMinutes: 5,
      code: `def bubble_sort(arr: list[int]) -> list[int]:
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,
      annotatedCode: `def bubble_sort(arr: list[int]) -> list[int]:
    n = len(arr)
    for i in range(n):  # n passes max; each pass fixes one element at the end
        swapped = False  # early-exit optimization
        for j in range(0, n - i - 1):  # last i elements are already in place
            if arr[j] > arr[j + 1]:  # out-of-order pair found
                arr[j], arr[j + 1] = arr[j + 1], arr[j]  # swap in-place
                swapped = True
        if not swapped:  # no swaps → already sorted → stop early
            break
    return arr`,
      explanation: [
        { lines: [2], text: 'We need at most n passes. After pass i, the i largest elements are correctly placed at the end.' },
        { lines: [3], text: '`swapped` flag enables early exit when the array becomes sorted before all n passes complete.' },
        { lines: [4], text: 'Inner loop shrinks by 1 each pass (`n - i - 1`) because the last i positions are already finalized.' },
        { lines: [5, 6, 7], text: 'Compare adjacent pair. If left > right, swap them. This moves larger values rightward one step.' },
        { lines: [8, 9], text: 'If no swap occurred in an entire pass, the array is sorted. Break early to avoid unnecessary work.' },
      ],
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      tags: ['sorting', 'comparison', 'in-place', 'stable'],
      commonMistakes: [
        'Missing the early-exit (`swapped`) optimization — without it, always runs O(n²) even on sorted input.',
        'Inner loop going to `n - 1` instead of `n - i - 1` — re-compares already-sorted elements.',
      ],
      quizzes: [
        { question: 'What is the best-case time complexity of bubble sort with the early-exit optimization?', answer: 'O(n) — on an already-sorted array, the first pass makes zero swaps and the loop exits immediately.', type: 'complexity-choice' },
        { question: 'Is bubble sort a stable sort?', answer: 'Yes. Equal elements are never swapped (we only swap when arr[j] > arr[j+1], strict), so their relative order is preserved.', type: 'recall' },
      ],
      variants: ['Cocktail Shaker Sort (bidirectional bubble sort)'],
      prerequisites: [],
      nextTemplate: 'sort-selection',
    },
    {
      id: 'sort-selection',
      title: 'Selection Sort',
      description: 'Divide the array into sorted and unsorted halves. Repeatedly find the minimum of the unsorted half and move it to the end of the sorted half.',
      difficulty: 'beginner',
      estimatedMinutes: 5,
      code: `def selection_sort(arr: list[int]) -> list[int]:
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
      annotatedCode: `def selection_sort(arr: list[int]) -> list[int]:
    n = len(arr)
    for i in range(n):  # boundary between sorted (left) and unsorted (right)
        min_idx = i  # assume first unsorted element is the minimum
        for j in range(i + 1, n):  # scan unsorted portion
            if arr[j] < arr[min_idx]:  # found a smaller element
                min_idx = j  # update minimum index
        arr[i], arr[min_idx] = arr[min_idx], arr[i]  # place minimum at boundary
    return arr`,
      explanation: [
        { lines: [3], text: '`i` marks the boundary — everything to the left is sorted. We extend this boundary by 1 each iteration.' },
        { lines: [4], text: 'We start by assuming position `i` holds the minimum of the unsorted section.' },
        { lines: [5, 6, 7], text: 'Scan the rest of the unsorted section to find the actual minimum.' },
        { lines: [8], text: 'Swap the minimum to position `i`. Now position `i` is correctly placed and the sorted region grows by 1.' },
      ],
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      tags: ['sorting', 'comparison', 'in-place'],
      commonMistakes: [
        'Selection sort is NOT stable — the swap can jump an equal element past others.',
        'Always runs O(n²) regardless of input order — no early-exit optimization is possible.',
      ],
      quizzes: [
        { question: 'Selection sort makes at most how many swaps on an array of n elements?', answer: 'At most n-1 swaps — exactly one swap per outer iteration. This makes it useful when write cost is high.', type: 'recall' },
      ],
      variants: [],
      prerequisites: ['sort-bubble'],
      nextTemplate: 'sort-insertion',
    },
    {
      id: 'sort-insertion',
      title: 'Insertion Sort',
      description: 'Build the sorted output one element at a time by inserting each new element into its correct position within the already-sorted prefix.',
      difficulty: 'beginner',
      estimatedMinutes: 5,
      code: `def insertion_sort(arr: list[int]) -> list[int]:
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
      annotatedCode: `def insertion_sort(arr: list[int]) -> list[int]:
    for i in range(1, len(arr)):  # start at 1; arr[0] is trivially sorted
        key = arr[i]  # element to be inserted into the sorted prefix
        j = i - 1  # start comparing from the last sorted element
        while j >= 0 and arr[j] > key:  # shift elements right until correct spot
            arr[j + 1] = arr[j]  # shift right to make room
            j -= 1
        arr[j + 1] = key  # insert key in its correct position
    return arr`,
      explanation: [
        { lines: [1, 2], text: 'We treat `arr[0]` as sorted. For each subsequent element, we find its insertion point in the sorted prefix.' },
        { lines: [3], text: '`key` holds the value to insert. We save it because the shifting loop will overwrite `arr[i]`.' },
        { lines: [5, 6], text: 'Shift all sorted elements that are larger than `key` one position to the right, opening a gap.' },
        { lines: [7], text: 'Place `key` in the gap — the position where all elements to the left are ≤ key and all to the right are > key.' },
      ],
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      tags: ['sorting', 'comparison', 'in-place', 'stable', 'adaptive'],
      commonMistakes: [
        'Using swap instead of shift — swap is O(n²) comparisons AND O(n²) writes; shift is O(n²) comparisons but fewer writes.',
        'Starting the outer loop at 0 — arr[0] is already sorted, loop should start at 1.',
      ],
      quizzes: [
        { question: 'Why is insertion sort preferred for nearly-sorted arrays over merge/quick sort?', answer: 'Its best-case is O(n) — each element only needs O(1) comparisons if it is already close to its final position. O(n log n) sorts always pay the full cost.', type: 'recall' },
      ],
      variants: ['Binary Insertion Sort (use binary search to find insertion point)'],
      prerequisites: ['sort-bubble'],
      nextTemplate: 'sort-merge',
    },
    {
      id: 'sort-merge',
      title: 'Merge Sort',
      description: 'Divide the array in half recursively until single elements, then merge sorted halves back together. Guaranteed O(n log n).',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `def merge_sort(arr: list[int]) -> list[int]:
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left: list[int], right: list[int]) -> list[int]:
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
      annotatedCode: `def merge_sort(arr: list[int]) -> list[int]:
    if len(arr) <= 1:  # base case: 0 or 1 elements are already sorted
        return arr

    mid = len(arr) // 2  # split at the midpoint
    left = merge_sort(arr[:mid])   # recursively sort left half
    right = merge_sort(arr[mid:])  # recursively sort right half
    return merge(left, right)  # merge the two sorted halves

def merge(left: list[int], right: list[int]) -> list[int]:
    result = []
    i = j = 0  # pointers into left and right
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:  # <= preserves stability
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])   # append remaining left elements
    result.extend(right[j:])  # append remaining right elements
    return result`,
      explanation: [
        { lines: [2, 3], text: 'Base case: an array of 0 or 1 elements is already sorted. Recursion bottoms out here.' },
        { lines: [5, 6, 7], text: 'Split the problem in half and recursively sort each part. The recursion tree has log n levels.' },
        { lines: [8], text: 'Merge the two sorted halves. This is where the actual ordering work happens.' },
        { lines: [10, 11], text: 'Two pointers — `i` for the left half, `j` for the right half — walk through both arrays.' },
        { lines: [12, 13, 14, 15, 16, 17], text: 'Pick the smaller of the two current elements. Using `<=` (not `<`) keeps equal elements in their original order (stable).' },
        { lines: [18, 19], text: 'One of the halves runs out first. Extend with the remaining elements — they are already sorted.' },
      ],
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      tags: ['sorting', 'divide-and-conquer', 'stable', 'recursive'],
      commonMistakes: [
        'Using `<` instead of `<=` in the merge comparison — breaks stability.',
        'Forgetting to append remaining elements after the while loop.',
      ],
      quizzes: [
        { question: 'Why does merge sort use O(n) space while quick sort uses O(log n)?', answer: 'Merge sort creates new arrays during the merge step, requiring O(n) total auxiliary space. Quick sort sorts in-place; its O(log n) space is only the recursion stack.', type: 'recall' },
        { question: 'What is the time complexity of the merge step for two arrays of total size n?', answer: 'O(n) — each element is examined at most once by one of the two pointers.', type: 'complexity-choice' },
      ],
      variants: ['Bottom-up (iterative) Merge Sort', 'External Merge Sort (for data too large to fit in RAM)'],
      prerequisites: ['sort-insertion'],
      nextTemplate: 'sort-quick',
    },
    {
      id: 'sort-quick',
      title: 'Quick Sort',
      description: 'Choose a pivot, partition the array so all elements < pivot come before it and all > pivot come after, then recursively sort the partitions.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `def quick_sort(arr: list[int], low: int = 0, high: int = -1) -> list[int]:
    if high == -1:
        high = len(arr) - 1
    if low < high:
        pivot_idx = partition(arr, low, high)
        quick_sort(arr, low, pivot_idx - 1)
        quick_sort(arr, pivot_idx + 1, high)
    return arr

def partition(arr: list[int], low: int, high: int) -> int:
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
      annotatedCode: `def quick_sort(arr: list[int], low: int = 0, high: int = -1) -> list[int]:
    if high == -1:
        high = len(arr) - 1  # initialize on first call
    if low < high:  # base case: subarray has 0 or 1 elements
        pivot_idx = partition(arr, low, high)  # place pivot in correct position
        quick_sort(arr, low, pivot_idx - 1)   # sort left partition
        quick_sort(arr, pivot_idx + 1, high)  # sort right partition
    return arr

def partition(arr: list[int], low: int, high: int) -> int:
    pivot = arr[high]  # choose last element as pivot (Lomuto scheme)
    i = low - 1  # i tracks the boundary: everything <= pivot is at arr[low..i]
    for j in range(low, high):  # j scans the unsorted region
        if arr[j] <= pivot:  # element belongs in the left partition
            i += 1  # expand left partition
            arr[i], arr[j] = arr[j], arr[i]  # swap into left partition
    arr[i + 1], arr[high] = arr[high], arr[i + 1]  # place pivot at its final position
    return i + 1  # return pivot's final index`,
      explanation: [
        { lines: [4, 5], text: '`low < high` is the base case — a single element or empty subarray is already sorted.' },
        { lines: [5], text: 'Partition places the pivot in its final sorted position and returns that index. The pivot is now "done".' },
        { lines: [6, 7], text: 'Recursively sort everything to the left of pivot and everything to the right. Pivot is excluded — it is already placed.' },
        { lines: [10, 11], text: 'Lomuto partition scheme: choose last element as pivot. `i` marks the end of the "≤ pivot" region.' },
        { lines: [12, 13, 14, 15], text: '`j` scans all elements. When arr[j] ≤ pivot, expand the left region and swap arr[j] into it.' },
        { lines: [16, 17], text: 'After scanning all elements, swap pivot (at arr[high]) to position i+1 — the boundary between left and right partitions.' },
      ],
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(log n)',
      tags: ['sorting', 'divide-and-conquer', 'in-place', 'partition'],
      commonMistakes: [
        'Choosing first/last element as pivot on nearly-sorted data causes O(n²) worst case. Use random pivot or median-of-three.',
        'Including pivot in recursive calls (`quick_sort(arr, low, pivot_idx)`) causes infinite recursion on duplicates.',
      ],
      quizzes: [
        { question: 'What is the worst-case time complexity of quick sort and when does it occur?', answer: 'O(n²) — when the pivot is always the smallest or largest element (e.g., sorted/reverse-sorted input with first/last pivot). Each partition produces one empty subarray and one of size n-1.', type: 'complexity-choice' },
        { question: 'How does randomized quick sort avoid the O(n²) worst case?', answer: 'By choosing a random pivot before each partition, no specific input pattern (sorted, reverse-sorted, etc.) can reliably trigger worst-case behavior. Expected time is O(n log n).', type: 'recall' },
      ],
      variants: ['Randomized Quick Sort', 'Three-way Partition (Dutch flag) for duplicates', 'Hoare Partition Scheme'],
      prerequisites: ['sort-merge'],
      nextTemplate: 'sort-heap',
    },
    {
      id: 'sort-heap',
      title: 'Heap Sort',
      description: 'Build a max-heap from the array, then repeatedly extract the maximum to produce a sorted array in-place. Combines in-place with guaranteed O(n log n).',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `def heap_sort(arr: list[int]) -> list[int]:
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)
    return arr

def heapify(arr: list[int], n: int, i: int) -> None:
    largest = i
    left, right = 2 * i + 1, 2 * i + 2
    if left < n and arr[left] > arr[largest]:
        largest = left
    if right < n and arr[right] > arr[largest]:
        largest = right
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)`,
      annotatedCode: `def heap_sort(arr: list[int]) -> list[int]:
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):  # build max-heap (bottom-up)
        heapify(arr, n, i)                # only non-leaf nodes need heapifying
    for i in range(n - 1, 0, -1):        # extract max n-1 times
        arr[0], arr[i] = arr[i], arr[0]  # move current max to end
        heapify(arr, i, 0)               # restore heap property (heap size shrinks)
    return arr

def heapify(arr: list[int], n: int, i: int) -> None:
    largest = i            # assume current node is the largest
    left, right = 2 * i + 1, 2 * i + 2  # children in 0-indexed array
    if left < n and arr[left] > arr[largest]:    # left child is larger
        largest = left
    if right < n and arr[right] > arr[largest]:  # right child is larger
        largest = right
    if largest != i:                             # current node is not the largest
        arr[i], arr[largest] = arr[largest], arr[i]  # swap
        heapify(arr, n, largest)  # recursively heapify the affected subtree`,
      explanation: [
        { lines: [3, 4], text: 'Build the max-heap bottom-up. Leaf nodes (indices n//2 to n-1) are already valid heaps, so start at n//2-1.' },
        { lines: [5, 6, 7], text: 'Extraction phase: swap root (max) with last element, shrink heap size, restore heap property. After n-1 swaps, array is sorted.' },
        { lines: [10, 11], text: 'For a 0-indexed array, node `i` has children at `2i+1` (left) and `2i+2` (right).' },
        { lines: [12, 13, 14, 15], text: 'Find the largest among node `i` and its children.' },
        { lines: [16, 17, 18], text: 'If a child is larger, swap and recursively heapify the subtree — the heap property may have been violated further down.' },
      ],
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(1)',
      tags: ['sorting', 'heap', 'in-place'],
      commonMistakes: [
        'NOT stable — swapping elements far apart can change relative order of equal elements.',
        'In 0-indexed array: left child is `2i+1`, right is `2i+2`. In 1-indexed: left is `2i`, right is `2i+1`.',
      ],
      quizzes: [
        { question: 'Why does building the heap bottom-up take O(n) rather than O(n log n)?', answer: 'Most nodes are near the bottom and need very little heapification work. Mathematically, the sum n/4·1 + n/8·2 + n/16·3 + ... converges to O(n).', type: 'recall' },
      ],
      variants: [],
      prerequisites: ['sort-merge'],
      nextTemplate: 'sort-counting',
    },
    {
      id: 'sort-counting',
      title: 'Counting Sort',
      description: 'Count occurrences of each value, then use a prefix-sum to reconstruct the sorted array. Beats O(n log n) when the value range k is small.',
      difficulty: 'intermediate',
      estimatedMinutes: 10,
      code: `def counting_sort(arr: list[int]) -> list[int]:
    if not arr:
        return arr
    min_val, max_val = min(arr), max(arr)
    k = max_val - min_val + 1
    count = [0] * k
    for x in arr:
        count[x - min_val] += 1
    for i in range(1, k):
        count[i] += count[i - 1]
    output = [0] * len(arr)
    for x in reversed(arr):
        count[x - min_val] -= 1
        output[count[x - min_val]] = x
    return output`,
      annotatedCode: `def counting_sort(arr: list[int]) -> list[int]:
    if not arr:
        return arr
    min_val, max_val = min(arr), max(arr)
    k = max_val - min_val + 1  # range of values
    count = [0] * k  # frequency table
    for x in arr:
        count[x - min_val] += 1  # offset by min_val to handle negatives
    for i in range(1, k):
        count[i] += count[i - 1]  # prefix sum: count[i] = number of elements <= i
    output = [0] * len(arr)
    for x in reversed(arr):  # iterate in reverse for stability
        count[x - min_val] -= 1  # decrement: next equal element goes one position earlier
        output[count[x - min_val]] = x
    return output`,
      explanation: [
        { lines: [4, 5, 6], text: 'Offset by min_val so the count array handles negative integers and doesn\'t waste space.' },
        { lines: [7, 8], text: 'Count how many times each value appears.' },
        { lines: [9, 10], text: 'Prefix sum transforms counts into final positions. After this, `count[v]` = number of elements ≤ v.' },
        { lines: [12, 13, 14], text: 'Iterate in reverse to maintain stability — equal elements appear in their original relative order in the output.' },
      ],
      timeComplexity: 'O(n + k)',
      spaceComplexity: 'O(k)',
      tags: ['sorting', 'non-comparison', 'stable', 'integer-sort'],
      commonMistakes: [
        'Forgetting the `min_val` offset — causes IndexError when array contains negative numbers or large gaps.',
        'Iterating forward (not reversed) in the output phase — breaks stability.',
      ],
      quizzes: [
        { question: 'When is counting sort worse than merge sort?', answer: 'When k >> n — if values range from 0 to 10^9 but there are only 100 elements, the count array is 10^9 entries (wasteful). Use radix sort instead.', type: 'recall' },
      ],
      variants: [],
      prerequisites: ['sort-quick'],
      nextTemplate: 'sort-radix',
    },
    {
      id: 'sort-radix',
      title: 'Radix Sort',
      description: 'Sort integers digit by digit from least-significant to most-significant, using a stable sort (counting sort) at each digit position.',
      difficulty: 'advanced',
      estimatedMinutes: 15,
      code: `def radix_sort(arr: list[int]) -> list[int]:
    if not arr:
        return arr
    max_val = max(arr)
    exp = 1
    while max_val // exp > 0:
        arr = counting_sort_by_digit(arr, exp)
        exp *= 10
    return arr

def counting_sort_by_digit(arr: list[int], exp: int) -> list[int]:
    n = len(arr)
    output = [0] * n
    count = [0] * 10
    for x in arr:
        digit = (x // exp) % 10
        count[digit] += 1
    for i in range(1, 10):
        count[i] += count[i - 1]
    for x in reversed(arr):
        digit = (x // exp) % 10
        count[digit] -= 1
        output[count[digit]] = x
    return output`,
      annotatedCode: `def radix_sort(arr: list[int]) -> list[int]:
    if not arr:
        return arr
    max_val = max(arr)  # determines how many digit positions to process
    exp = 1  # start with the ones digit (10^0)
    while max_val // exp > 0:  # process each digit position until max_val is exhausted
        arr = counting_sort_by_digit(arr, exp)  # stable sort on current digit
        exp *= 10  # move to next digit (tens, hundreds, ...)
    return arr

def counting_sort_by_digit(arr: list[int], exp: int) -> list[int]:
    n = len(arr)
    output = [0] * n
    count = [0] * 10  # digits are 0-9
    for x in arr:
        digit = (x // exp) % 10  # extract the digit at position exp
        count[digit] += 1
    for i in range(1, 10):
        count[i] += count[i - 1]  # prefix sum for stable placement
    for x in reversed(arr):  # reverse iteration for stability
        digit = (x // exp) % 10
        count[digit] -= 1
        output[count[digit]] = x
    return output`,
      explanation: [
        { lines: [5, 6, 7, 8], text: 'Process each digit position: ones, tens, hundreds, ... until we pass the most significant digit of max_val.' },
        { lines: [6], text: '`max_val // exp > 0` is equivalent to "there are still meaningful digits to process". When exp exceeds max_val, this becomes 0.' },
        { lines: [7], text: 'Each pass must use a STABLE sort so that ordering from previous passes is preserved when digits are equal.' },
        { lines: [13, 14, 15], text: 'Isolate the digit at position `exp` using integer division and modulo.' },
        { lines: [16, 17, 18, 19, 20, 21], text: 'Standard counting sort stable-output phase — reverse iteration places equal digits in their original relative order.' },
      ],
      timeComplexity: 'O(d·(n + k))',
      spaceComplexity: 'O(n + k)',
      tags: ['sorting', 'non-comparison', 'stable', 'integer-sort', 'digit'],
      commonMistakes: [
        'Using an unstable sort at each digit — previous digit orderings get destroyed.',
        'Only works on non-negative integers in the standard form. Handling negatives requires sorting by absolute value and reversing negative subarray.',
      ],
      quizzes: [
        { question: 'Why must the per-digit sort be stable?', answer: 'When two numbers have the same digit at the current position, they must stay in the order established by previous (lower) digit sorts. An unstable sort would destroy that ordering.', type: 'recall' },
      ],
      variants: ['LSD (Least Significant Digit) — shown above', 'MSD (Most Significant Digit) — process left-to-right, recursively partitions'],
      prerequisites: ['sort-counting'],
    },
  ],
}

export default sorting
