import type { Category } from '@/types'

const greedy: Category = {
  id: 'greedy',
  title: 'Greedy',
  icon: 'Zap',
  group: 'advanced',
  templates: [
    {
      id: 'greedy-jump-game',
      title: 'Jump Game I & II',
      description: 'Jump Game I: determine if you can reach the last index by tracking the maximum reachable index. Jump Game II: find the minimum number of jumps using a greedy window-expansion approach.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      code: `def can_jump(nums):
    max_reach = 0
    for i, jump in enumerate(nums):
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + jump)
    return True

def jump(nums):
    jumps = 0
    current_end = 0
    farthest = 0
    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])
        if i == current_end:
            jumps += 1
            current_end = farthest
    return jumps`,
      annotatedCode: `def can_jump(nums):
    max_reach = 0                          # farthest index reachable so far
    for i, jump in enumerate(nums):
        if i > max_reach:                  # current index is beyond what we can reach
            return False
        max_reach = max(max_reach, i + jump)  # greedily extend the frontier
    return True

def jump(nums):
    jumps = 0                              # number of jumps taken
    current_end = 0                        # end of the current jump window
    farthest = 0                           # farthest we can reach in this window
    for i in range(len(nums) - 1):         # stop before last index; no jump needed from it
        farthest = max(farthest, i + nums[i])  # track best reachable from any position in window
        if i == current_end:               # exhausted current window — must jump
            jumps += 1
            current_end = farthest         # advance window to farthest reachable
    return jumps`,
      explanation: [
        { lines: [1, 2, 3, 4, 5, 6], text: 'Jump Game I greedy insight: maintain a running maximum of the farthest reachable index. If at any point the current index exceeds that maximum, there is a gap we cannot cross.' },
        { lines: [8, 9, 10, 11, 12, 13, 14, 15, 16], text: 'Jump Game II uses a sliding-window greedy. Think of "current_end" as the boundary of the current jump. When we reach that boundary, we commit to one jump and slide the window out to the farthest point we observed.' },
        { lines: [12], text: 'We iterate only to len-2 because once we reach the last index we do not need another jump. Iterating to it would count an extra unnecessary jump.' },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      tags: ['greedy', 'array', 'jump-game'],
      commonMistakes: [
        'In Jump Game II, iterating through the last index causes an off-by-one extra jump.',
        'Confusing "farthest" (best we could reach) with "current_end" (boundary of current window).',
        'Forgetting the early-return false check in Jump Game I — the loop finishing alone does not mean success.',
      ],
      quizzes: [
        { question: 'Why does the greedy choice (always extend max_reach as far as possible) give an optimal answer for Jump Game II?', answer: 'Extending the window to the farthest reachable position is never worse than any shorter choice: a shorter extension would only restrict future options. This is the exchange argument — any solution that jumps shorter can be replaced by jumping to farthest without increasing jump count.', type: 'recall' },
        { question: 'Trace jump([2,3,1,1,4]). What are the values of jumps, current_end, and farthest at each iteration?', answer: 'i=0: farthest=2, i==current_end(0) → jumps=1, current_end=2. i=1: farthest=4. i=2: farthest=4, i==current_end(2) → jumps=2, current_end=4. Loop ends. Result: 2.', type: 'predict-output' },
      ],
      variants: ['Jump Game III (can jump ±k)', 'Jump Game VII (range jumps on string)'],
      prerequisites: ['two-pointer'],
      nextTemplate: 'greedy-intervals',
    },
    {
      id: 'greedy-intervals',
      title: 'Interval Scheduling & Meeting Rooms',
      description: 'Activity Selection: maximize non-overlapping intervals by always picking the one that finishes earliest. Meeting Rooms II: find the minimum number of rooms needed using a min-heap or two-pointer approach.',
      difficulty: 'intermediate',
      estimatedMinutes: 25,
      code: `def erase_overlap_intervals(intervals):
    if not intervals:
        return 0
    intervals.sort(key=lambda x: x[1])
    count = 0
    end = intervals[0][1]
    for i in range(1, len(intervals)):
        if intervals[i][0] < end:
            count += 1
        else:
            end = intervals[i][1]
    return count

import heapq

def min_meeting_rooms(intervals):
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
      annotatedCode: `def erase_overlap_intervals(intervals):
    if not intervals:
        return 0
    intervals.sort(key=lambda x: x[1])   # sort by END time — the greedy key insight
    count = 0
    end = intervals[0][1]                 # end time of the last accepted interval
    for i in range(1, len(intervals)):
        if intervals[i][0] < end:         # start before previous end → overlaps → remove it
            count += 1
        else:
            end = intervals[i][1]         # no overlap — accept this interval, update end
    return count

import heapq

def min_meeting_rooms(intervals):
    if not intervals:
        return 0
    intervals.sort(key=lambda x: x[0])   # sort by START time to process chronologically
    heap = []                             # min-heap of end times (one entry per active room)
    for start, end in intervals:
        if heap and heap[0] <= start:     # earliest-ending room is free by this meeting's start
            heapq.heapreplace(heap, end)  # reuse that room — replace its end time
        else:
            heapq.heappush(heap, end)     # no free room — open a new one
    return len(heap)                      # heap size = number of rooms used`,
      explanation: [
        { lines: [4], text: 'Sorting by end time is the greedy-optimal key. Finishing early leaves maximum room for future intervals. Sorting by start time or duration does NOT give the optimal solution.' },
        { lines: [7, 8, 9, 10], text: 'When an interval overlaps (starts before the current end), we discard it (count the removal). We never update "end" because keeping the earlier-finishing interval is always better.' },
        { lines: [18, 19, 20, 21, 22], text: 'The heap holds end-times of all active meetings. heap[0] is the meeting that ends soonest. If it ends before or at the new start, its room is available — we reuse it. Otherwise we need a new room.' },
      ],
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      tags: ['greedy', 'intervals', 'sorting', 'heap'],
      commonMistakes: [
        'Sorting by start time for Activity Selection — this is incorrect; you must sort by end time.',
        'Using >= instead of > in the overlap check, incorrectly treating touching intervals as overlapping.',
        'In Meeting Rooms II, forgetting to sort by start time first, producing wrong room counts.',
      ],
      quizzes: [
        { question: 'Why is sorting by end time (not start time or duration) the correct greedy choice for Activity Selection?', answer: 'Choosing the interval that ends earliest leaves the most remaining time for future intervals. Any other ordering can be shown suboptimal via an exchange argument: swapping a later-ending choice for the earliest-ending one never reduces the number of intervals we can fit.', type: 'recall' },
      ],
      variants: ['Minimum number of arrows to burst balloons', 'Non-overlapping intervals (return count)'],
      prerequisites: ['greedy-jump-game'],
      nextTemplate: 'greedy-gas-station',
    },
    {
      id: 'greedy-gas-station',
      title: 'Gas Station Circular Tour',
      description: 'Find the unique starting gas station index from which you can complete the circular route. If total gas >= total cost a solution always exists, and the valid start is found by resetting whenever the running tank goes negative.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `def can_complete_circuit(gas, cost):
    total_tank = 0
    current_tank = 0
    start = 0
    for i in range(len(gas)):
        gain = gas[i] - cost[i]
        total_tank += gain
        current_tank += gain
        if current_tank < 0:
            start = i + 1
            current_tank = 0
    return start if total_tank >= 0 else -1`,
      annotatedCode: `def can_complete_circuit(gas, cost):
    total_tank = 0      # cumulative net gas across all stations; determines if solution exists
    current_tank = 0    # running tank for the current candidate starting point
    start = 0           # current candidate starting station
    for i in range(len(gas)):
        gain = gas[i] - cost[i]   # net gas at station i (can be negative)
        total_tank += gain         # track global sum to check feasibility
        current_tank += gain       # track local sum from candidate start
        if current_tank < 0:       # ran out of gas — start cannot be anywhere in [start..i]
            start = i + 1          # reset: try the next station as a new candidate
            current_tank = 0       # wipe local accumulator for fresh start
    return start if total_tank >= 0 else -1  # global check: solution exists iff total >= 0`,
      explanation: [
        { lines: [2], text: 'total_tank sums up all (gas - cost) values. If this is negative, it is mathematically impossible to complete the circuit regardless of starting point.' },
        { lines: [8, 9, 10], text: 'The key greedy insight: if we cannot reach station i from our current start, none of the stations between start and i can be the answer either (they would have even less gas accumulated when they reach i). So we skip all of them and try i+1.' },
        { lines: [11], text: 'Because there is exactly one solution when total_tank >= 0, the last candidate start accumulated after all resets is guaranteed to be the answer.' },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      tags: ['greedy', 'array', 'circular'],
      commonMistakes: [
        'Checking only total_tank without tracking local tank, missing the starting point.',
        'Trying every station as a start in O(n²) — the greedy O(n) solution exploits the reset insight.',
        'Off-by-one: setting start = i instead of i + 1 when current_tank goes negative.',
      ],
      quizzes: [
        { question: 'Why is the last candidate starting position (after all resets) always a valid answer when total_tank >= 0?', answer: 'When we reset start to i+1, we know no station from the old start through i can work. The final candidate has never caused current_tank to go negative, and because total_tank >= 0 the remaining deficit from previous stations is covered by the surplus in the suffix starting at our candidate.', type: 'recall' },
      ],
      variants: ['Circular tour with variable capacity', 'Find all valid starting points'],
      prerequisites: ['greedy-intervals'],
      nextTemplate: 'greedy-task-scheduler',
    },
    {
      id: 'greedy-task-scheduler',
      title: 'Task Scheduler',
      description: 'Given tasks with a cooldown n between identical tasks, find the minimum time to finish all tasks. The most frequent task is the bottleneck — use the formula (max_freq - 1) * (n + 1) + count_of_max_freq, then take max with len(tasks).',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `from collections import Counter

def least_interval(tasks, n):
    freq = Counter(tasks)
    max_freq = max(freq.values())
    count_max = sum(1 for f in freq.values() if f == max_freq)
    formula = (max_freq - 1) * (n + 1) + count_max
    return max(formula, len(tasks))`,
      annotatedCode: `from collections import Counter

def least_interval(tasks, n):
    freq = Counter(tasks)                  # count occurrences of each task type
    max_freq = max(freq.values())          # the most frequent task determines the frame count
    count_max = sum(1 for f in freq.values() if f == max_freq)  # tasks tied for highest frequency
    # (max_freq - 1) full frames of (n+1) slots, plus a final partial frame for max-freq tasks
    formula = (max_freq - 1) * (n + 1) + count_max
    # if tasks are dense enough to fill all idle slots, len(tasks) is the actual answer
    return max(formula, len(tasks))`,
      explanation: [
        { lines: [4, 5], text: 'The most-frequent task forces a fixed number of "frames". If task A appears max_freq times, we need at least max_freq - 1 gaps of size n between them, plus the final occurrence.' },
        { lines: [7], text: 'Formula derivation: imagine placing the most frequent task in a grid with (n+1) columns. We fill (max_freq - 1) complete rows and one partial row. count_max fills the last partial row. Each unfilled slot in the grid is an idle slot.' },
        { lines: [8], text: 'When tasks are numerous enough to fill all idle slots, there are no idles at all and the answer is simply len(tasks). max() selects whichever bound is tighter.' },
      ],
      timeComplexity: 'O(n) where n = number of tasks',
      spaceComplexity: 'O(1) — at most 26 distinct task types',
      tags: ['greedy', 'counting', 'task-scheduler'],
      commonMistakes: [
        'Forgetting count_max in the formula — only counting one task in the final frame.',
        'Not taking max(formula, len(tasks)) — when tasks are dense, the formula underestimates.',
        'Confusing n (cooldown) with n+1 (frame size) in the formula.',
      ],
      quizzes: [
        { question: 'When does len(tasks) take over from the formula as the answer?', answer: 'When there are enough varied tasks to completely fill the idle slots in every frame. Formally: when len(tasks) >= (max_freq - 1) * (n + 1) + count_max. This happens when the cooldown n is small relative to task variety.', type: 'complexity-choice' },
      ],
      variants: ['Task scheduler with heap simulation (returns actual order)', 'Reorganize String (n=1 case)'],
      prerequisites: ['greedy-gas-station'],
      nextTemplate: 'greedy-two-city',
    },
    {
      id: 'greedy-two-city',
      title: 'Two-City Scheduling',
      description: 'Send exactly n people to city A and n to city B to minimize total cost. Sort by the cost difference (aCost - bCost): people who are cheapest to redirect to A go first, rest go to B.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `def two_city_sched_cost(costs):
    costs.sort(key=lambda x: x[0] - x[1])
    n = len(costs) // 2
    total = 0
    for i in range(n):
        total += costs[i][0]
    for i in range(n, 2 * n):
        total += costs[i][1]
    return total`,
      annotatedCode: `def two_city_sched_cost(costs):
    # sort by (aCost - bCost): most beneficial to send to A comes first
    # a negative difference means city A is cheaper → strong candidate for A
    costs.sort(key=lambda x: x[0] - x[1])
    n = len(costs) // 2                  # exactly n people go to each city
    total = 0
    for i in range(n):                   # first half: cheapest to send to A (smallest diff)
        total += costs[i][0]
    for i in range(n, 2 * n):            # second half: relatively cheaper to send to B
        total += costs[i][1]
    return total`,
      explanation: [
        { lines: [2, 3], text: 'The key insight: start by pretending everyone flies to city B (take costs[i][1] for all). The "upgrade" cost to redirect person i to city A instead is (costs[i][0] - costs[i][1]). To minimize total, greedily pick the n people with the smallest (most negative) upgrade cost.' },
        { lines: [4], text: 'Sorting by (aCost - bCost) orders people from "cheapest to redirect to A" to "most expensive to redirect to A". The first n naturally go to A, the rest to B.' },
        { lines: [6, 7, 8, 9], text: 'After sorting, the split is clean: first-half indices are city A passengers, second-half are city B passengers.' },
      ],
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(1) ignoring sort space',
      tags: ['greedy', 'sorting', 'two-city'],
      commonMistakes: [
        'Sorting by aCost or bCost alone instead of their difference — this ignores relative value.',
        'Forgetting to split exactly at n — some implementations use wrong boundary indices.',
        'Thinking a DP solution is required; the greedy sort-by-difference is provably optimal via exchange argument.',
      ],
      quizzes: [
        { question: 'Why is sorting by (aCost - bCost) the correct greedy criterion rather than sorting by aCost alone?', answer: 'We care about relative savings, not absolute cost. Person i should go to A if the marginal benefit (bCost - aCost) is maximized compared to others. Sorting by the difference captures this trade-off; sorting by aCost alone could send an expensive-but-even-more-expensive-in-B person to B.', type: 'recall' },
      ],
      variants: ['K-closest partition problems', 'Minimum cost to connect ropes (related greedy)'],
      prerequisites: ['greedy-task-scheduler'],
    },
  ],
}

export default greedy
