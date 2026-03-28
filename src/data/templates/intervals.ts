import type { Category } from '@/types'

const intervals: Category = {
  id: 'intervals',
  title: 'Intervals',
  icon: 'AlignJustify',
  group: 'foundations',
  templates: [
    {
      id: 'intervals-merge',
      title: 'Merge Intervals',
      description: 'Merge all overlapping intervals. Sort by start time, then greedily merge. O(n log n).',
      difficulty: 'intermediate',
      estimatedMinutes: 10,
      code: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged`,
      annotatedCode: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])  # sort by start time
    merged = [intervals[0]]              # initialize with first interval
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:       # overlaps (or touches) last merged interval
            merged[-1][1] = max(merged[-1][1], end)  # extend the end
        else:
            merged.append([start, end])  # no overlap: start a new interval
    return merged`,
      explanation: [
        { lines: [2], text: 'Sort by start time — this ensures we only need to compare each interval with the last merged interval, not all previous ones.' },
        { lines: [3], text: 'Initialize merged with the first interval. We compare subsequent intervals against `merged[-1]` (the current last interval).' },
        { lines: [5, 6], text: 'Overlap condition: current start ≤ last end. Note ≤ not < — [1,3],[3,5] do overlap (share the point 3). Extend the end to max of both ends.' },
        { lines: [7, 8], text: 'No overlap: current start > last end. Push as a new distinct interval.' },
      ],
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      tags: ['intervals', 'sorting', 'greedy'],
      commonMistakes: [
        'Using `< merged[-1][1]` instead of `<= merged[-1][1]` — misses touching intervals like [1,3] and [3,5].',
        'Not taking `max(end, merged[-1][1])` — a fully contained interval [2,3] inside [1,5] would incorrectly shrink the end to 3.',
      ],
      quizzes: [
        { question: 'Why do we use max(merged[-1][1], end) instead of just updating to end?', answer: 'An interval could be fully contained within the last merged interval. E.g., [1,10] followed by [2,3]: end=3 < 10, so we must keep 10.', type: 'recall' },
      ],
      variants: ['Number of non-overlapping intervals (greedy, sort by end time)'],
      prerequisites: [],
      nextTemplate: 'intervals-insert',
    },
    {
      id: 'intervals-insert',
      title: 'Insert Interval',
      description: 'Insert a new interval into a sorted non-overlapping list of intervals. Three phases: copy non-overlapping before, merge overlapping, copy non-overlapping after.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `def insert_interval(intervals: list[list[int]], new_interval: list[int]) -> list[list[int]]:
    result = []
    i = 0
    n = len(intervals)
    while i < n and intervals[i][1] < new_interval[0]:
        result.append(intervals[i])
        i += 1
    while i < n and intervals[i][0] <= new_interval[1]:
        new_interval[0] = min(new_interval[0], intervals[i][0])
        new_interval[1] = max(new_interval[1], intervals[i][1])
        i += 1
    result.append(new_interval)
    while i < n:
        result.append(intervals[i])
        i += 1
    return result`,
      annotatedCode: `def insert_interval(intervals: list[list[int]], new_interval: list[int]) -> list[list[int]]:
    result = []
    i = 0
    n = len(intervals)
    # Phase 1: copy intervals that end BEFORE new_interval starts (no overlap)
    while i < n and intervals[i][1] < new_interval[0]:
        result.append(intervals[i])
        i += 1
    # Phase 2: merge all overlapping intervals into new_interval
    while i < n and intervals[i][0] <= new_interval[1]:
        new_interval[0] = min(new_interval[0], intervals[i][0])
        new_interval[1] = max(new_interval[1], intervals[i][1])
        i += 1
    result.append(new_interval)  # append the fully merged interval
    # Phase 3: copy intervals that start AFTER new_interval ends (no overlap)
    while i < n:
        result.append(intervals[i])
        i += 1
    return result`,
      explanation: [
        { lines: [5, 6, 7], text: 'Phase 1: append all intervals that end before new_interval starts. Condition: intervals[i][1] < new_interval[0].' },
        { lines: [8, 9, 10, 11], text: 'Phase 2: merge all overlapping intervals. Condition: intervals[i][0] ≤ new_interval[1] (current interval starts before new_interval ends). Expand new_interval to cover all.' },
        { lines: [12], text: 'Append the fully merged new_interval (which may have grown to cover many original intervals).' },
        { lines: [13, 14, 15], text: 'Phase 3: append all remaining intervals (they start after new_interval ends, so no overlap).' },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      tags: ['intervals', 'three-pointer', 'merge'],
      commonMistakes: [
        'Off-by-one in overlap condition: phase 2 requires `<=` not `<` — an interval starting exactly at new_interval end does overlap.',
      ],
      quizzes: [
        { question: 'Why is Insert Interval O(n) while Merge Intervals is O(n log n)?', answer: 'Insert Interval assumes the input is already sorted — we do a single linear pass. Merge Intervals starts with unsorted input and requires sorting first.', type: 'recall' },
      ],
      variants: ['Can merge with a one-pass approach (same logic, slightly more compact)'],
      prerequisites: ['intervals-merge'],
      nextTemplate: 'intervals-meeting-rooms',
    },
    {
      id: 'intervals-meeting-rooms',
      title: 'Meeting Rooms',
      description: 'Two variants: (1) can a person attend all meetings? (2) minimum meeting rooms required? Sort by start; use a min-heap of end times for variant 2.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `def can_attend_all(intervals: list[list[int]]) -> bool:
    intervals.sort(key=lambda x: x[0])
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i-1][1]:
            return False
    return True


import heapq

def min_meeting_rooms(intervals: list[list[int]]) -> int:
    if not intervals:
        return 0
    intervals.sort(key=lambda x: x[0])
    heap = []
    for start, end in intervals:
        if heap and heap[0] <= start:
            heapq.heapreplace(heap, end)
        else:
            heapq.heappush(heap, end)
    return len(heap)`,
      annotatedCode: `def can_attend_all(intervals: list[list[int]]) -> bool:
    intervals.sort(key=lambda x: x[0])  # sort by start
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i-1][1]:  # new meeting starts before prev ends
            return False
    return True


import heapq

def min_meeting_rooms(intervals: list[list[int]]) -> int:
    if not intervals:
        return 0
    intervals.sort(key=lambda x: x[0])   # sort by start time
    heap = []  # min-heap of END times of active meetings
    for start, end in intervals:
        if heap and heap[0] <= start:     # earliest-ending meeting is done
            heapq.heapreplace(heap, end)  # reuse that room (pop min, push new end)
        else:
            heapq.heappush(heap, end)     # need a new room
    return len(heap)  # number of rooms = number of active meetings at peak`,
      explanation: [
        { lines: [3, 4, 5], text: 'Variant 1: after sorting, two meetings conflict iff the next starts before the previous ends (strictly less than, not ≤).' },
        { lines: [14, 15, 16, 17, 18], text: 'Variant 2: the heap stores end times of currently active meetings. heap[0] is the earliest ending. If a new meeting starts after heap[0], reuse that room. Otherwise, open a new room.' },
        { lines: [19], text: 'At the end, len(heap) = peak number of concurrent meetings = minimum rooms needed.' },
      ],
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      tags: ['intervals', 'heap', 'greedy', 'sorting'],
      commonMistakes: [
        'Variant 1: using `<=` instead of `<` — back-to-back meetings [1,2] and [2,3] don\'t conflict.',
        'Variant 2: not using heapreplace (pop+push atomically) — heappop then heappush is correct but less efficient.',
      ],
      quizzes: [
        { question: 'Why do we use a min-heap of end times (not start times) for minimum meeting rooms?', answer: 'We need to know when the earliest meeting ends to decide if we can reuse a room. The min-heap efficiently gives us the earliest end time in O(log n).', type: 'recall' },
      ],
      variants: ['Minimum platforms in a train station (same pattern)', 'Event-based approach: list all starts/ends, sort, scan'],
      prerequisites: ['intervals-merge'],
    },
  ],
}

export default intervals
