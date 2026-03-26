import type { Category } from '@/types'

const binarySearch: Category = {
  id: 'binary-search',
  title: 'Binary Search',
  icon: 'Search',
  group: 'foundations',
  templates: [
    {
      id: 'bs-classic',
      title: 'Classic Binary Search',
      description:
        'Search for a target value in a sorted array by repeatedly halving the search space. Returns the index of the target or -1 if not found.',
      difficulty: 'beginner',
      estimatedMinutes: 5,
      code: `def binary_search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = left + (right - left) // 2

        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1`,
      annotatedCode: `def binary_search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1  # search the entire array

    while left <= right:  # continue while the window is valid
        mid = left + (right - left) // 2  # avoid integer overflow

        if nums[mid] == target:  # found the target
            return mid
        elif nums[mid] < target:  # target is in the right half
            left = mid + 1  # discard the left half including mid
        else:  # target is in the left half
            right = mid - 1  # discard the right half including mid

    return -1  # target not found in array`,
      explanation: [
        {
          lines: [1, 2],
          text: 'Initialize two pointers covering the full array. `left` starts at index 0, `right` at the last index.',
        },
        {
          lines: [4],
          text: 'Loop while the search window contains at least one element. When `left > right`, the window is empty and the target is absent.',
        },
        {
          lines: [5],
          text: 'Compute the midpoint using `left + (right - left) // 2` instead of `(left + right) // 2` to prevent integer overflow in languages with fixed-width integers. In Python this is a best-practice habit.',
        },
        {
          lines: [7, 8],
          text: 'If the middle element equals the target, return its index immediately.',
        },
        {
          lines: [9, 10],
          text: 'If the middle element is less than the target, the target must be in the right half. Move `left` past `mid`.',
        },
        {
          lines: [11, 12],
          text: 'If the middle element is greater than the target, the target must be in the left half. Move `right` before `mid`.',
        },
        {
          lines: [14],
          text: 'If the loop exits without returning, the target is not in the array. Return -1.',
        },
      ],
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      tags: ['binary-search', 'sorted-array', 'divide-and-conquer'],
      commonMistakes: [
        'Using `(left + right) // 2` — causes overflow in languages with fixed-size integers.',
        'Using `left < right` instead of `left <= right` — misses the case where the target is the single remaining element.',
        'Forgetting to move past mid (`left = mid` instead of `left = mid + 1`) — causes infinite loop.',
      ],
      quizzes: [
        {
          question: 'What happens if you use `while left < right` (strict less-than) instead of `while left <= right`?',
          answer:
            'You will miss checking the element where `left == right`. If the target is at that position, the function incorrectly returns -1.',
          type: 'recall',
        },
        {
          question: 'Given `nums = [1, 3, 5, 7, 9]` and `target = 7`, trace the values of left, mid, right through each iteration.',
          answer:
            'Iteration 1: left=0, right=4, mid=2, nums[2]=5 < 7 → left=3. Iteration 2: left=3, right=4, mid=3, nums[3]=7 == 7 → return 3.',
          type: 'predict-output',
        },
      ],
      variants: ['Left Bound', 'Right Bound', 'Search in Rotated Array'],
      prerequisites: [],
      relatedTemplates: ['bs-left-bound', 'bs-rotated-array'],
      nextTemplate: 'bs-left-bound',
    },
    {
      id: 'bs-left-bound',
      title: 'Left Bound Binary Search',
      description:
        'Find the leftmost (first) position where target could be inserted to keep the array sorted. Equivalent to bisect_left. Returns the count of elements strictly less than target.',
      difficulty: 'intermediate',
      estimatedMinutes: 10,
      code: `def left_bound(nums: list[int], target: int) -> int:
    left, right = 0, len(nums)

    while left < right:
        mid = left + (right - left) // 2

        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid

    return left`,
      annotatedCode: `def left_bound(nums: list[int], target: int) -> int:
    left, right = 0, len(nums)  # right is len(nums), not len(nums)-1

    while left < right:  # strict less-than: converges when left == right
        mid = left + (right - left) // 2  # midpoint without overflow

        if nums[mid] < target:  # mid is too small — search right half
            left = mid + 1  # exclude mid from future searches
        else:  # nums[mid] >= target — answer could be mid or left of mid
            right = mid  # keep mid in the search space

    return left  # left == right == insertion point`,
      explanation: [
        {
          lines: [1, 2],
          text: '`right` is initialized to `len(nums)` (one past the last index) because the insertion point could be after all elements.',
        },
        {
          lines: [4],
          text: 'Use strict `<` because the algorithm converges when `left == right`, which is the answer.',
        },
        {
          lines: [5],
          text: 'Standard overflow-safe midpoint calculation.',
        },
        {
          lines: [7, 8],
          text: 'When `nums[mid] < target`, mid is definitely not the insertion point. Move `left` past it.',
        },
        {
          lines: [9, 10],
          text: 'When `nums[mid] >= target`, mid could be the answer. Set `right = mid` to keep it in the search window.',
        },
        {
          lines: [12],
          text: 'When the loop ends, `left == right` and both point to the leftmost position where target could be inserted.',
        },
      ],
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      tags: ['binary-search', 'bisect-left', 'insertion-point', 'sorted-array'],
      commonMistakes: [
        'Initializing `right = len(nums) - 1` — the insertion point can be at index `len(nums)`, so right must cover that.',
        'Using `right = mid - 1` instead of `right = mid` — skips the potential answer when `nums[mid] == target`.',
      ],
      quizzes: [
        {
          question: 'What does `left_bound` return when the target is not in the array?',
          answer:
            'It returns the index where target would be inserted to maintain sorted order — the count of elements strictly less than target.',
          type: 'recall',
        },
      ],
      variants: ['Right Bound Binary Search', 'Count Occurrences'],
      prerequisites: ['bs-classic'],
      relatedTemplates: ['bs-classic', 'bs-rotated-array'],
      nextTemplate: 'bs-rotated-array',
    },
    {
      id: 'bs-rotated-array',
      title: 'Search in Rotated Sorted Array',
      description:
        'Search for a target in a sorted array that has been rotated at an unknown pivot. One half of the array is always sorted — use that to decide which half to search.',
      difficulty: 'advanced',
      estimatedMinutes: 15,
      code: `def search_rotated(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = left + (right - left) // 2

        if nums[mid] == target:
            return mid

        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1

    return -1`,
      annotatedCode: `def search_rotated(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1  # standard two-pointer bounds

    while left <= right:  # search while the window is valid
        mid = left + (right - left) // 2  # safe midpoint

        if nums[mid] == target:  # found — return immediately
            return mid

        if nums[left] <= nums[mid]:  # left half [left..mid] is sorted
            if nums[left] <= target < nums[mid]:  # target is in sorted left half
                right = mid - 1  # search left half only
            else:  # target is NOT in sorted left half
                left = mid + 1  # search right half
        else:  # right half [mid..right] is sorted
            if nums[mid] < target <= nums[right]:  # target is in sorted right half
                left = mid + 1  # search right half only
            else:  # target is NOT in sorted right half
                right = mid - 1  # search left half

    return -1  # target not found`,
      explanation: [
        {
          lines: [1, 2],
          text: 'Standard binary search bounds over the full array.',
        },
        {
          lines: [4, 5],
          text: 'Standard loop and midpoint. The key insight is that even though the array is rotated, at least one half around `mid` is always sorted.',
        },
        {
          lines: [7, 8],
          text: 'Direct hit — return immediately.',
        },
        {
          lines: [10],
          text: 'Check if the left half `[left..mid]` is sorted by comparing `nums[left]` with `nums[mid]`. The `<=` handles the case where `left == mid`.',
        },
        {
          lines: [11, 12],
          text: 'If the left half is sorted and target falls within `[nums[left], nums[mid])`, narrow search to the left half.',
        },
        {
          lines: [13, 14],
          text: 'Otherwise, the target must be in the right (possibly unsorted) half.',
        },
        {
          lines: [15, 16, 17, 18, 19],
          text: 'Mirror logic: the right half `[mid..right]` is sorted. Check if target falls in that range and narrow accordingly.',
        },
        {
          lines: [21],
          text: 'If the loop exits, the target does not exist in the array.',
        },
      ],
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      tags: ['binary-search', 'rotated-array', 'divide-and-conquer'],
      commonMistakes: [
        'Using strict `<` in `nums[left] <= nums[mid]` — fails when `left == mid` (two-element subarray).',
        'Checking the wrong half first — always determine which half IS sorted, then check if target is in that sorted half.',
      ],
      quizzes: [
        {
          question: 'Why do we check `nums[left] <= nums[mid]` instead of `nums[left] < nums[mid]`?',
          answer:
            'When `left == mid` (subarray of size 1 or 2), `nums[left] == nums[mid]`. Using strict `<` would incorrectly assume the right half is sorted.',
          type: 'recall',
        },
      ],
      variants: ['Find Minimum in Rotated Array', 'Rotated Array with Duplicates'],
      prerequisites: ['bs-classic', 'bs-left-bound'],
      relatedTemplates: ['bs-classic', 'bs-left-bound'],
      nextTemplate: undefined,
    },
  ],
}

export default binarySearch
