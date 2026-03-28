import type { Category } from '@/types'

const twoPointers: Category = {
  id: 'two-pointers',
  title: 'Two Pointers',
  icon: 'Columns2',
  group: 'foundations',
  templates: [
    {
      id: 'tp-opposite',
      title: 'Opposite Ends',
      description: 'Place one pointer at each end of a sorted array and move them toward each other. Used for target sum, palindrome check, and container problems.',
      difficulty: 'beginner',
      estimatedMinutes: 5,
      code: `def two_sum_sorted(nums: list[int], target: int) -> list[int]:
    left, right = 0, len(nums) - 1
    while left < right:
        s = nums[left] + nums[right]
        if s == target:
            return [left, right]
        elif s < target:
            left += 1
        else:
            right -= 1
    return []`,
      annotatedCode: `def two_sum_sorted(nums: list[int], target: int) -> list[int]:
    left, right = 0, len(nums) - 1  # start at both ends
    while left < right:  # stop when pointers meet
        s = nums[left] + nums[right]
        if s == target:      # found the pair
            return [left, right]
        elif s < target:     # sum too small → move left pointer right (increase sum)
            left += 1
        else:                # sum too large → move right pointer left (decrease sum)
            right -= 1
    return []  # no pair found`,
      explanation: [
        { lines: [2], text: 'Initialize one pointer at each end. Because the array is sorted, moving `left` right increases the sum; moving `right` left decreases it.' },
        { lines: [3], text: 'Continue while the window is non-empty (`left < right`). At `left == right`, we have a single element — no pair.' },
        { lines: [5, 6], text: 'Exact match found. Return the indices.' },
        { lines: [7, 8], text: 'Sum is too small. The only way to increase it is to move the left pointer right to a larger value.' },
        { lines: [9, 10], text: 'Sum is too large. Move the right pointer left to a smaller value.' },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      tags: ['two-pointers', 'sorted-array', 'target-sum'],
      commonMistakes: [
        'Using `left <= right` — when `left == right` it is the same element, not a valid pair.',
        'Only works on SORTED arrays. For unsorted, use a hash map: O(n) time, O(n) space.',
      ],
      quizzes: [
        { question: 'How would you use this pattern to check if a string is a palindrome?', answer: 'Set left=0, right=len(s)-1. While left < right: if s[left] != s[right] return False; move both pointers inward. Return True.', type: 'recall' },
      ],
      variants: ['Palindrome Check', 'Container With Most Water', 'Trapping Rain Water'],
      prerequisites: [],
      nextTemplate: 'tp-fast-slow',
    },
    {
      id: 'tp-fast-slow',
      title: "Fast/Slow Pointers (Floyd's Cycle)",
      description: "Detect cycles in linked lists or arrays. The slow pointer moves 1 step at a time; the fast pointer moves 2. If they meet, a cycle exists.",
      difficulty: 'intermediate',
      estimatedMinutes: 10,
      code: `def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False

def find_cycle_start(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            break
    else:
        return None
    slow = head
    while slow is not fast:
        slow = slow.next
        fast = fast.next
    return slow`,
      annotatedCode: `def has_cycle(head):
    slow = fast = head  # both start at head
    while fast and fast.next:  # fast needs 2 valid nodes to move
        slow = slow.next        # slow: 1 step
        fast = fast.next.next   # fast: 2 steps
        if slow is fast:        # they meet → cycle exists
            return True
    return False  # fast reached end → no cycle

def find_cycle_start(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:  # phase 1: detect meeting point inside cycle
            break
    else:
        return None  # no cycle
    slow = head  # phase 2: reset slow to head; keep fast at meeting point
    while slow is not fast:  # both move 1 step — meet at cycle start
        slow = slow.next
        fast = fast.next
    return slow  # cycle entry node`,
      explanation: [
        { lines: [2], text: 'Both pointers start at head. If there is a cycle, the fast pointer (moving 2x) will lap the slow pointer.' },
        { lines: [4, 5], text: 'Fast moves 2 steps per iteration; slow moves 1. The gap between them changes by 1 each step when inside a cycle.' },
        { lines: [6, 7], text: 'If they meet, a cycle exists. The meeting point is somewhere inside the cycle (not necessarily the start).' },
        { lines: [15, 16], text: 'Phase 2 — finding the cycle start: mathematical proof shows that resetting slow to head and moving both 1 step at a time makes them meet exactly at the cycle entry.' },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      tags: ['two-pointers', 'linked-list', 'cycle-detection', 'fast-slow'],
      commonMistakes: [
        'Using `==` instead of `is` for node comparison — compares values, not identity.',
        'Checking `fast == fast.next` before moving — should check AFTER moving both pointers.',
      ],
      quizzes: [
        { question: 'Why does resetting slow to head (phase 2) cause both pointers to meet at the cycle start?', answer: 'If the cycle starts at distance F from head, the meeting point is at distance C-F inside the cycle (C = cycle length). After F more steps from head and from the meeting point, both reach the cycle entry simultaneously.', type: 'recall' },
      ],
      variants: ['Find Middle of Linked List (slow stops at mid when fast reaches end)', 'Find Duplicate Number (array as linked list)'],
      prerequisites: ['tp-opposite'],
      nextTemplate: 'tp-merge-sorted',
    },
    {
      id: 'tp-merge-sorted',
      title: 'Merge Sorted Arrays',
      description: 'Given two sorted arrays, merge them into one sorted array using two pointers — one per array. Classic O(n + m) approach.',
      difficulty: 'beginner',
      estimatedMinutes: 10,
      code: `def merge_sorted(a: list[int], b: list[int]) -> list[int]:
    result = []
    i = j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            result.append(a[i])
            i += 1
        else:
            result.append(b[j])
            j += 1
    result.extend(a[i:])
    result.extend(b[j:])
    return result`,
      annotatedCode: `def merge_sorted(a: list[int], b: list[int]) -> list[int]:
    result = []
    i = j = 0  # pointers for array a and array b
    while i < len(a) and j < len(b):  # advance while both have elements
        if a[i] <= b[j]:   # a's current element is smaller (or equal — stable)
            result.append(a[i])
            i += 1
        else:              # b's current element is smaller
            result.append(b[j])
            j += 1
    result.extend(a[i:])  # append remaining elements from a (already sorted)
    result.extend(b[j:])  # append remaining elements from b (already sorted)
    return result`,
      explanation: [
        { lines: [3, 4], text: 'The loop runs while BOTH arrays have elements. As soon as one is exhausted, we break.' },
        { lines: [5, 6, 7], text: 'Pick the smaller element. `<=` ensures stability — when elements are equal, a\'s element comes first.' },
        { lines: [10, 11], text: 'One array runs out first. The remaining elements of the other are already sorted, so just append them all at once.' },
      ],
      timeComplexity: 'O(n + m)',
      spaceComplexity: 'O(n + m)',
      tags: ['two-pointers', 'sorted-array', 'merge'],
      commonMistakes: [
        'Forgetting to extend with the remaining elements after the main while loop.',
        'In-place merge (for Merge Sort): start from the END and work backwards to avoid overwriting elements.',
      ],
      quizzes: [
        { question: 'How do you merge two sorted arrays IN-PLACE when one has enough trailing space? (LeetCode 88)', answer: 'Use three pointers: p1 at end of first array\'s data, p2 at end of second array, p at the very end of first array\'s space. Compare and place the LARGER element from the back.', type: 'recall' },
      ],
      variants: ['In-place merge (LeetCode 88)', 'Merge K sorted arrays (use heap)'],
      prerequisites: ['tp-opposite'],
      nextTemplate: 'tp-dutch-flag',
    },
    {
      id: 'tp-dutch-flag',
      title: 'Dutch National Flag (3-way Partition)',
      description: 'Partition an array of 0s, 1s, and 2s (or any 3-way partition) in a single pass using three pointers: low, mid, and high.',
      difficulty: 'intermediate',
      estimatedMinutes: 10,
      code: `def sort_colors(arr: list[int]) -> None:
    low = mid = 0
    high = len(arr) - 1
    while mid <= high:
        if arr[mid] == 0:
            arr[low], arr[mid] = arr[mid], arr[low]
            low += 1
            mid += 1
        elif arr[mid] == 1:
            mid += 1
        else:
            arr[mid], arr[high] = arr[high], arr[mid]
            high -= 1`,
      annotatedCode: `def sort_colors(arr: list[int]) -> None:
    low = mid = 0  # boundary: arr[0..low-1] = 0s, arr[low..mid-1] = 1s
    high = len(arr) - 1  # boundary: arr[high+1..n-1] = 2s
    while mid <= high:  # arr[mid..high] is the unexplored region
        if arr[mid] == 0:
            arr[low], arr[mid] = arr[mid], arr[low]  # 0 goes to the front
            low += 1   # 0-region grows
            mid += 1   # arr[low..mid-1] is still 1s, so mid advances too
        elif arr[mid] == 1:
            mid += 1   # 1 is already in correct region, just advance
        else:          # arr[mid] == 2
            arr[mid], arr[high] = arr[high], arr[mid]  # 2 goes to the back
            high -= 1  # 2-region grows; do NOT advance mid (swapped element is unexplored)`,
      explanation: [
        { lines: [1, 2, 3], text: 'Three invariants: arr[0..low-1] contains 0s, arr[low..mid-1] contains 1s, arr[high+1..n-1] contains 2s. arr[mid..high] is unprocessed.' },
        { lines: [4], text: 'Process elements until mid crosses high — when that happens, all elements are classified.' },
        { lines: [5, 6, 7, 8], text: 'Found a 0: swap it to the low boundary, then advance both low and mid (the swapped element was a 1 in the 1-region).' },
        { lines: [9, 10], text: 'Found a 1: already in the right place. Just advance mid.' },
        { lines: [11, 12, 13], text: 'Found a 2: swap to high boundary. Do NOT advance mid — the newly placed element at arr[mid] came from the unexplored region.' },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      tags: ['two-pointers', 'partitioning', 'in-place', 'three-way'],
      commonMistakes: [
        'Advancing `mid` after swapping with `high` — the swapped element has not been examined yet.',
        'The key insight: when swapping with `low`, the element at `low` was definitely a 1 (it was in the 1s region), so advancing `mid` is safe.',
      ],
      quizzes: [
        { question: 'Why do we advance `mid` after swapping arr[mid] with arr[low], but NOT after swapping arr[mid] with arr[high]?', answer: 'When swapping with arr[low], the element at arr[low] was in the 1s region (arr[low..mid-1]), so it is known to be a 1 — safe to pass. When swapping with arr[high], the element came from the unexplored region and could be anything.', type: 'recall' },
      ],
      variants: ['General k-way partition', 'Quick Sort 3-way partition for duplicates'],
      prerequisites: ['tp-opposite'],
    },
  ],
}

export default twoPointers
