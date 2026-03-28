import type { Category } from '@/types'

const linkedList: Category = {
  id: 'linked-list',
  title: 'Linked List',
  icon: 'Link',
  group: 'foundations',
  templates: [
    {
      id: 'll-reverse',
      title: 'Reverse Linked List',
      description: 'Reverse a singly linked list in-place using three pointers: prev, curr, and next. O(n) time, O(1) space.',
      difficulty: 'beginner',
      estimatedMinutes: 5,
      code: `def reverse_list(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev`,
      annotatedCode: `def reverse_list(head):
    prev = None   # will become the new tail (points to None)
    curr = head   # current node being processed
    while curr:
        next_node = curr.next  # save next before overwriting
        curr.next = prev       # reverse the pointer
        prev = curr            # advance prev
        curr = next_node       # advance curr
    return prev  # prev is now the new head`,
      explanation: [
        { lines: [2, 3], text: '`prev` starts as None (the new tail of reversed list). `curr` starts at head.' },
        { lines: [5], text: 'Save `curr.next` before overwriting it — this is the key step to avoid losing the rest of the list.' },
        { lines: [6], text: 'Reverse the pointer: instead of pointing forward, point backward to `prev`.' },
        { lines: [7, 8], text: 'Advance both pointers one step. When `curr` becomes None, `prev` is at the original tail — the new head.' },
        { lines: [9], text: 'Return `prev` (the new head), not `curr` (which is now None).' },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      tags: ['linked-list', 'pointers', 'in-place'],
      commonMistakes: [
        'Returning `curr` instead of `prev` — `curr` is None when the loop ends.',
        'Not saving `curr.next` before reversing — permanently loses the rest of the list.',
      ],
      quizzes: [
        { question: 'Trace the algorithm on [1→2→3→None]. What are prev and curr after each iteration?', answer: 'Start: prev=None, curr=1. Iter 1: prev=1, curr=2. Iter 2: prev=2, curr=3. Iter 3: prev=3, curr=None. Return 3.', type: 'predict-output' },
      ],
      variants: ['Recursive reverse', 'Reverse in groups of k (LeetCode 25)'],
      prerequisites: [],
      nextTemplate: 'll-cycle',
    },
    {
      id: 'll-cycle',
      title: 'Detect Cycle',
      description: "Use Floyd's fast/slow pointer algorithm to detect a cycle and find its entry point in O(n) time and O(1) space.",
      difficulty: 'intermediate',
      estimatedMinutes: 10,
      code: `def detect_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            slow = head
            while slow is not fast:
                slow = slow.next
                fast = fast.next
            return slow
    return None`,
      annotatedCode: `def detect_cycle(head):
    slow = fast = head
    while fast and fast.next:    # fast needs 2 valid nodes
        slow = slow.next          # 1 step
        fast = fast.next.next     # 2 steps
        if slow is fast:          # meeting point found (inside cycle)
            slow = head           # phase 2: reset slow to head
            while slow is not fast:  # move both at 1 step until they meet
                slow = slow.next
                fast = fast.next
            return slow           # meeting point = cycle entry
    return None  # no cycle`,
      explanation: [
        { lines: [2, 3, 4, 5], text: 'Phase 1: detect if a cycle exists. Fast moves at 2x speed — if they meet, a cycle exists.' },
        { lines: [6, 7, 8, 9, 10], text: 'Phase 2: find cycle start. Reset slow to head. Move both at 1 step. The math guarantees they meet at the cycle entry node.' },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      tags: ['linked-list', 'fast-slow', 'cycle-detection'],
      commonMistakes: ['Using `==` instead of `is` — compares values not node identity.'],
      quizzes: [
        { question: 'What does this function return if the tail points back to the 2nd node in [1→2→3→4→2]?', answer: 'The node with value 2 (the cycle entry). That is the node where the cycle begins.', type: 'predict-output' },
      ],
      variants: [],
      prerequisites: ['ll-reverse'],
      nextTemplate: 'll-merge-sorted',
    },
    {
      id: 'll-merge-sorted',
      title: 'Merge Two Sorted Lists',
      description: 'Merge two sorted linked lists into one sorted linked list. Use a dummy head node to simplify edge cases.',
      difficulty: 'beginner',
      estimatedMinutes: 10,
      code: `def merge_two_lists(l1, l2):
    dummy = ListNode(0)
    curr = dummy
    while l1 and l2:
        if l1.val <= l2.val:
            curr.next = l1
            l1 = l1.next
        else:
            curr.next = l2
            l2 = l2.next
        curr = curr.next
    curr.next = l1 or l2
    return dummy.next`,
      annotatedCode: `def merge_two_lists(l1, l2):
    dummy = ListNode(0)  # sentinel: avoids special-casing the first node
    curr = dummy         # curr tracks the tail of the merged list
    while l1 and l2:     # both lists have nodes
        if l1.val <= l2.val:  # l1 is smaller (or equal — stable)
            curr.next = l1    # append l1 node
            l1 = l1.next      # advance l1
        else:
            curr.next = l2    # append l2 node
            l2 = l2.next      # advance l2
        curr = curr.next      # advance merged tail
    curr.next = l1 or l2  # attach the non-empty remainder
    return dummy.next     # skip the sentinel dummy node`,
      explanation: [
        { lines: [2, 3], text: 'Dummy head node eliminates the "empty result" special case. We always return `dummy.next`.' },
        { lines: [5, 6, 7], text: 'When l1.val ≤ l2.val, stitch l1\'s node into the merged list and advance l1.' },
        { lines: [11], text: '`l1 or l2` is a Python idiom: returns the first truthy value. One of them is None, the other has the remaining nodes.' },
      ],
      timeComplexity: 'O(n + m)',
      spaceComplexity: 'O(1)',
      tags: ['linked-list', 'merge', 'dummy-head'],
      commonMistakes: [
        'Not using a dummy node — forces a special case to initialize the head of the result.',
        'Forgetting to attach the remaining non-empty list at the end.',
      ],
      quizzes: [
        { question: 'Why is the dummy node pattern useful here?', answer: 'Without it, you need special logic to handle the case where the result starts empty. The dummy node gives curr.next a valid starting point, making the loop uniform.', type: 'recall' },
      ],
      variants: ['Merge K sorted lists (use min-heap)', 'Recursive merge'],
      prerequisites: ['ll-reverse'],
      nextTemplate: 'll-lru-cache',
    },
    {
      id: 'll-lru-cache',
      title: 'LRU Cache',
      description: 'Implement a Least Recently Used cache with O(1) get and put. Combine a doubly-linked list (for order) with a hash map (for O(1) lookup).',
      difficulty: 'advanced',
      estimatedMinutes: 20,
      code: `class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}
        self.head = Node(0, 0)
        self.tail = Node(0, 0)
        self.head.next = self.tail
        self.tail.prev = self.head

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self._move_to_front(self.cache[key])
        return self.cache[key].val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, value)
        self._insert_front(node)
        self.cache[key] = node
        if len(self.cache) > self.cap:
            lru = self.tail.prev
            self._remove(lru)
            del self.cache[lru.key]

    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _insert_front(self, node):
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def _move_to_front(self, node):
        self._remove(node)
        self._insert_front(node)`,
      annotatedCode: `class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}          # key → Node (O(1) lookup)
        self.head = Node(0, 0)   # sentinel head (most recent side)
        self.tail = Node(0, 0)   # sentinel tail (LRU side)
        self.head.next = self.tail
        self.tail.prev = self.head

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self._move_to_front(self.cache[key])  # accessing = recently used
        return self.cache[key].val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])  # remove old node before re-inserting
        node = Node(key, value)
        self._insert_front(node)      # new node = most recently used
        self.cache[key] = node
        if len(self.cache) > self.cap:
            lru = self.tail.prev      # node before sentinel tail = least recently used
            self._remove(lru)
            del self.cache[lru.key]   # evict from both map and list

    def _remove(self, node):  # O(1): pointer surgery
        node.prev.next = node.next
        node.next.prev = node.prev

    def _insert_front(self, node):  # O(1): insert after sentinel head
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def _move_to_front(self, node):
        self._remove(node)
        self._insert_front(node)`,
      explanation: [
        { lines: [3, 4, 5, 6, 7, 8], text: 'Sentinel head and tail nodes simplify insertion/deletion at boundaries — no null pointer checks needed. Most-recently-used is near head; LRU is near tail.' },
        { lines: [9, 10, 11, 12, 13], text: 'get: look up the node, move it to front (mark as recently used), return its value.' },
        { lines: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23], text: 'put: if key exists, remove old node first. Insert new at front. If over capacity, evict from tail (LRU node) and delete from map.' },
        { lines: [24, 25, 26], text: '_remove: O(1) doubly-linked list removal — just update 4 pointers.' },
      ],
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(n)',
      tags: ['linked-list', 'hashmap', 'design', 'doubly-linked-list'],
      commonMistakes: [
        'Using a singly-linked list — deletion requires O(n) traversal to find prev. Must use doubly-linked.',
        'Forgetting to delete from the hash map when evicting — causes stale key lookups.',
        'Not using sentinel nodes — edge cases for empty/single-element lists require extra if-checks.',
      ],
      quizzes: [
        { question: 'Why do we need both a hash map AND a doubly-linked list?', answer: 'Hash map gives O(1) key lookup. Doubly-linked list gives O(1) insertion/deletion anywhere (needed to move nodes to front on access). Neither alone provides O(1) for all operations.', type: 'recall' },
      ],
      variants: ['LFU Cache (uses two hash maps + doubly-linked lists)'],
      prerequisites: ['ll-reverse', 'll-merge-sorted'],
    },
    {
      id: 'll-merge-k',
      title: 'Merge K Sorted Lists',
      description:
        'Merge k sorted linked lists into one sorted list. Use a min-heap of size k: always extract the smallest current node. O(N log k) where N = total nodes.',
      difficulty: 'advanced',
      estimatedMinutes: 20,
      code: `import heapq
from typing import Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_k_lists(lists: list[Optional[ListNode]]) -> Optional[ListNode]:
    heap = []
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    dummy = ListNode(0)
    curr = dummy
    while heap:
        val, i, node = heapq.heappop(heap)
        curr.next = node
        curr = curr.next
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next


def merge_k_lists_divide(lists: list[Optional[ListNode]]) -> Optional[ListNode]:
    if not lists:
        return None
    while len(lists) > 1:
        merged = []
        for i in range(0, len(lists), 2):
            l1 = lists[i]
            l2 = lists[i + 1] if i + 1 < len(lists) else None
            merged.append(merge_two(l1, l2))
        lists = merged
    return lists[0]

def merge_two(l1, l2):
    dummy = ListNode(0)
    curr = dummy
    while l1 and l2:
        if l1.val <= l2.val:
            curr.next, l1 = l1, l1.next
        else:
            curr.next, l2 = l2, l2.next
        curr = curr.next
    curr.next = l1 or l2
    return dummy.next`,
      annotatedCode: `import heapq
from typing import Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_k_lists(lists: list[Optional[ListNode]]) -> Optional[ListNode]:
    heap = []
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))  # i breaks val ties (avoids comparing ListNode)
    dummy = ListNode(0)   # sentinel head — avoids edge case of empty result
    curr = dummy
    while heap:
        val, i, node = heapq.heappop(heap)  # always the current global minimum
        curr.next = node
        curr = curr.next
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))  # advance that list
    return dummy.next


def merge_k_lists_divide(lists: list[Optional[ListNode]]) -> Optional[ListNode]:
    if not lists:
        return None
    while len(lists) > 1:   # divide and conquer: halve the list each round
        merged = []
        for i in range(0, len(lists), 2):
            l1 = lists[i]
            l2 = lists[i + 1] if i + 1 < len(lists) else None  # odd list gets a free pass
            merged.append(merge_two(l1, l2))
        lists = merged       # next round merges the merged lists
    return lists[0]

def merge_two(l1, l2):
    dummy = ListNode(0)
    curr = dummy
    while l1 and l2:
        if l1.val <= l2.val:
            curr.next, l1 = l1, l1.next  # advance the smaller pointer
        else:
            curr.next, l2 = l2, l2.next
        curr = curr.next
    curr.next = l1 or l2   # attach the remaining non-empty list
    return dummy.next`,
      explanation: [
        { lines: [12], text: 'Include `i` (list index) as the second element of the heap tuple. If two nodes have equal val, Python would try to compare `ListNode` objects which crashes. The index breaks ties without comparing nodes.' },
        { lines: [13, 14], text: 'Dummy head simplifies insertion — we never check "is the result list empty?" and always do `curr.next = node`.' },
        { lines: [17, 18], text: 'After popping the min, immediately push that list\'s next node. This keeps the heap size at most k at all times — O(log k) per push/pop.' },
        { lines: [24, 25, 26], text: 'Divide & conquer alternative: merge pairs of lists in each round, halving the count. O(N log k) like the heap but with O(1) extra space per merge.' },
      ],
      timeComplexity: 'O(N log k)',
      spaceComplexity: 'O(k) for heap',
      tags: ['linked-list', 'heap', 'merge', 'divide-and-conquer'],
      commonMistakes: [
        'Storing ListNode directly in the heap without a tiebreaker — Python will try to compare nodes and raise TypeError if vals are equal.',
        'Not checking `if node` before the initial push — null/None heads will cause a crash.',
      ],
      quizzes: [
        { question: 'Why do we include `i` (list index) as the second element in the heap tuple?', answer: 'Python compares tuple elements left-to-right. If two nodes have equal val, it would try comparing ListNode objects (the third element) which raises TypeError. The index `i` provides a unique tiebreaker.', type: 'recall' },
      ],
      variants: ['Merge K sorted arrays (same approach)', 'Find the K-th smallest element across K sorted lists'],
      prerequisites: ['ll-merge-sorted', 'heap-basics'],
    },
  ],
}

export default linkedList
