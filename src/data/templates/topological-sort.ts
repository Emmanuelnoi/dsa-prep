import type { Category } from '@/types'

const topo: Category = {
  id: 'topological-sort',
  title: 'Topological Sort',
  icon: 'GitCommitHorizontal',
  group: 'trees-graphs',
  templates: [
    {
      id: 'topo-kahn',
      title: "Kahn's Algorithm (BFS Topological Sort)",
      description: "BFS-based topological sort using in-degree tracking. Start all zero-in-degree nodes in a queue, process them, decrement neighbors' in-degrees, and enqueue any that reach zero. If the result is shorter than the total nodes, a cycle exists.",
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      code: `from collections import deque, defaultdict

def topological_sort_kahn(num_nodes, edges):
    graph = defaultdict(list)
    in_degree = [0] * num_nodes
    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1
    queue = deque(i for i in range(num_nodes) if in_degree[i] == 0)
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    if len(order) < num_nodes:
        return []
    return order`,
      annotatedCode: `from collections import deque, defaultdict

def topological_sort_kahn(num_nodes, edges):
    graph = defaultdict(list)
    in_degree = [0] * num_nodes           # in_degree[v] = number of edges pointing into v
    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1                 # each edge u→v increments v's in-degree
    # all nodes with no prerequisites can be processed immediately
    queue = deque(i for i in range(num_nodes) if in_degree[i] == 0)
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)                # node is now fully processed
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1      # removing node satisfies one prerequisite of neighbor
            if in_degree[neighbor] == 0:  # all prerequisites met — neighbor is now ready
                queue.append(neighbor)
    # cycle detection: if not all nodes were processed, some were stuck waiting on each other
    if len(order) < num_nodes:
        return []                         # cycle exists — no valid topological ordering
    return order`,
      explanation: [
        { lines: [5, 6, 7, 8], text: 'Build the directed graph and compute in-degrees. In-degree of a node equals the number of edges (prerequisites) pointing into it. Nodes with in-degree 0 have no prerequisites.' },
        { lines: [9, 10], text: 'Seed the queue with all nodes that have no prerequisites. These are the only valid starting points for a topological order.' },
        { lines: [13, 14, 15, 16, 17], text: 'Processing a node means it is "done". Removing it conceptually deletes all its outgoing edges, decrementing neighbors\' in-degrees. When a neighbor reaches 0, all its prerequisites are complete and it enters the queue.' },
        { lines: [19, 20], text: 'Cycle detection: nodes inside a cycle can never reach in-degree 0 because they always wait on each other. If any nodes were never processed, a cycle prevented them from being enqueued.' },
      ],
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V + E)',
      tags: ['topological-sort', 'BFS', 'graphs', 'cycle-detection'],
      commonMistakes: [
        "Seeding the queue with only node 0 — you must include ALL nodes with in-degree 0, not just the first.",
        "Forgetting the len(order) < num_nodes cycle check — without it, the function silently returns a partial order.",
        "Decrementing in_degree before appending the node to order, causing incorrect cycle detection counts.",
      ],
      quizzes: [
        { question: "What does it mean if len(order) < numCourses after running Kahn's algorithm?", answer: "Some courses were never added to the queue because their in-degree never reached 0. This means those courses form a cycle — each waits on another in the cycle, so none can ever be taken. The course schedule is impossible.", type: 'recall' },
      ],
      variants: ["Kahn's with priority queue for lexicographically smallest order"],
      prerequisites: ['bfs-dfs'],
      nextTemplate: 'topo-dfs',
    },
    {
      id: 'topo-dfs',
      title: 'DFS-Based Topological Sort',
      description: 'DFS topological sort using three-color node marking: unvisited (0), in current DFS path/gray (1), fully processed/black (2). Nodes are appended to result in postorder then reversed. Encountering a gray node means a cycle.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      code: `from collections import defaultdict

def topological_sort_dfs(num_nodes, edges):
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
    color = [0] * num_nodes
    result = []
    has_cycle = [False]

    def dfs(node):
        if has_cycle[0]:
            return
        color[node] = 1
        for neighbor in graph[node]:
            if color[neighbor] == 1:
                has_cycle[0] = True
                return
            if color[neighbor] == 0:
                dfs(neighbor)
        color[node] = 2
        result.append(node)

    for i in range(num_nodes):
        if color[i] == 0:
            dfs(i)
    if has_cycle[0]:
        return []
    return result[::-1]`,
      annotatedCode: `from collections import defaultdict

def topological_sort_dfs(num_nodes, edges):
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
    color = [0] * num_nodes   # 0=unvisited, 1=in-progress (gray), 2=done (black)
    result = []
    has_cycle = [False]       # list wrapper allows mutation inside nested function

    def dfs(node):
        if has_cycle[0]:
            return
        color[node] = 1       # mark gray: we are currently exploring from this node
        for neighbor in graph[node]:
            if color[neighbor] == 1:   # gray neighbor = back edge = cycle detected
                has_cycle[0] = True
                return
            if color[neighbor] == 0:   # white neighbor = not yet visited, recurse
                dfs(neighbor)
        color[node] = 2       # mark black: all descendants fully explored
        result.append(node)   # postorder append: dependents added before this node

    for i in range(num_nodes):
        if color[i] == 0:     # start DFS from every unvisited node (handles disconnected graphs)
            dfs(i)
    if has_cycle[0]:
        return []
    return result[::-1]       # reverse postorder gives topological order`,
      explanation: [
        { lines: [7], text: 'Three colors track DFS state. White (0) = not started. Gray (1) = currently on the DFS call stack (processing). Black (2) = fully done, all descendants explored.' },
        { lines: [14, 15, 16], text: 'A gray neighbor means we found an edge pointing back to a node still on the current DFS path — this is a back edge, which only exists in cyclic graphs.' },
        { lines: [19, 20], text: 'A node is appended to result only AFTER all its descendants are fully processed (postorder). This means dependents come before their prerequisite in the result list.' },
        { lines: [25], text: 'Reversing the postorder list converts it to topological order: prerequisites come before dependents, matching the expected ordering.' },
      ],
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V) for color array and recursion stack',
      tags: ['topological-sort', 'DFS', 'graphs', 'cycle-detection'],
      commonMistakes: [
        'Appending the node to result before recursing into neighbors — this gives reverse topological order without the reversal fix.',
        'Using a boolean visited array instead of three colors — a two-state visited set cannot distinguish "in current path" from "fully processed", missing back edges.',
        'Forgetting to call dfs() for all nodes (only calling from node 0) — disconnected components are missed.',
      ],
      quizzes: [
        { question: 'What does encountering a gray node during DFS mean, and why does a black node not indicate a cycle?', answer: 'A gray node is on the current DFS call stack. An edge to a gray node is a back edge (points to an ancestor), which creates a cycle. A black node is fully processed — an edge to it is a cross edge or forward edge, both valid in a DAG.', type: 'recall' },
        { question: 'Why do we reverse the result at the end in DFS topological sort?', answer: 'DFS appends nodes in postorder: a node is added only after all its descendants. So dependents appear before prerequisites. Reversing places prerequisites first — the standard topological ordering where u appears before v if u→v is an edge.', type: 'recall' },
      ],
      variants: ['Iterative DFS topological sort using explicit stack'],
      prerequisites: ['bfs-dfs', 'topo-kahn'],
      nextTemplate: 'topo-course-schedule',
    },
    {
      id: 'topo-course-schedule',
      title: 'Course Schedule I & II',
      description: "Direct application of Kahn's algorithm. Course Schedule I asks whether all courses can be finished (cycle detection). Course Schedule II returns the actual order to take them. Both reduce to topological sort on the prerequisite graph.",
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      code: `from collections import deque, defaultdict

def can_finish(num_courses, prerequisites):
    graph = defaultdict(list)
    in_degree = [0] * num_courses
    for course, prereq in prerequisites:
        graph[prereq].append(course)
        in_degree[course] += 1
    queue = deque(i for i in range(num_courses) if in_degree[i] == 0)
    taken = 0
    while queue:
        course = queue.popleft()
        taken += 1
        for next_course in graph[course]:
            in_degree[next_course] -= 1
            if in_degree[next_course] == 0:
                queue.append(next_course)
    return taken == num_courses

def find_order(num_courses, prerequisites):
    graph = defaultdict(list)
    in_degree = [0] * num_courses
    for course, prereq in prerequisites:
        graph[prereq].append(course)
        in_degree[course] += 1
    queue = deque(i for i in range(num_courses) if in_degree[i] == 0)
    order = []
    while queue:
        course = queue.popleft()
        order.append(course)
        for next_course in graph[course]:
            in_degree[next_course] -= 1
            if in_degree[next_course] == 0:
                queue.append(next_course)
    return order if len(order) == num_courses else []`,
      annotatedCode: `from collections import deque, defaultdict

def can_finish(num_courses, prerequisites):
    graph = defaultdict(list)
    in_degree = [0] * num_courses
    for course, prereq in prerequisites:
        graph[prereq].append(course)   # prereq → course (edge direction: prereq must come first)
        in_degree[course] += 1         # course requires one more prerequisite
    queue = deque(i for i in range(num_courses) if in_degree[i] == 0)  # courses with no prereqs
    taken = 0
    while queue:
        course = queue.popleft()
        taken += 1                     # count courses we can actually take
        for next_course in graph[course]:
            in_degree[next_course] -= 1
            if in_degree[next_course] == 0:
                queue.append(next_course)
    return taken == num_courses        # True only if every course was reachable (no cycle)

def find_order(num_courses, prerequisites):
    graph = defaultdict(list)
    in_degree = [0] * num_courses
    for course, prereq in prerequisites:
        graph[prereq].append(course)   # same graph construction as can_finish
        in_degree[course] += 1
    queue = deque(i for i in range(num_courses) if in_degree[i] == 0)
    order = []
    while queue:
        course = queue.popleft()
        order.append(course)           # record the course in the order it becomes takeable
        for next_course in graph[course]:
            in_degree[next_course] -= 1
            if in_degree[next_course] == 0:
                queue.append(next_course)
    return order if len(order) == num_courses else []  # empty list signals impossible schedule`,
      explanation: [
        { lines: [6, 7], text: 'Edge direction matters: prerequisites[i] = [course, prereq] means prereq must be taken before course. We add an edge prereq → course in the graph, so completing prereq unlocks course.' },
        { lines: [9, 10, 11, 12], text: 'Kahn\'s BFS processes courses as their prerequisites are fulfilled. "taken" counts courses actually processed — if a cycle exists, some courses are stuck and taken < num_courses.' },
        { lines: [17], text: 'Course Schedule I only needs a boolean: did we process every course? The structure is otherwise identical to full topological sort.' },
        { lines: [26, 27], text: 'Course Schedule II collects the processing order. The BFS order is a valid schedule because a course only enters the queue when all its prerequisites have been taken.' },
      ],
      timeComplexity: 'O(V + E) where V = num_courses, E = len(prerequisites)',
      spaceComplexity: 'O(V + E)',
      tags: ['topological-sort', 'BFS', 'course-schedule', 'cycle-detection'],
      commonMistakes: [
        'Reversing the edge direction: adding graph[course].append(prereq) instead of graph[prereq].append(course) inverts the dependency and gives wrong results.',
        'Returning order without checking len(order) == num_courses, silently returning partial orderings when a cycle exists.',
        'Using num_courses as loop upper bound but 0-indexing inconsistently with the input course numbering.',
      ],
      quizzes: [
        { question: 'In Course Schedule, why do we add the edge prereq → course (not course → prereq) when building the graph?', answer: "Topological sort processes nodes once all their incoming edges' sources are done. We want 'course' to be unblocked after 'prereq' finishes, so the edge must go from prereq to course. In-degree of course goes up, and processing prereq decrements it.", type: 'complexity-choice' },
      ],
      variants: ['Course Schedule III (time-bounded scheduling with greedy)', 'Parallel Courses (minimum semesters)'],
      prerequisites: ['topo-kahn', 'topo-dfs'],
      nextTemplate: 'topo-alien-dict',
    },
    {
      id: 'topo-alien-dict',
      title: 'Alien Dictionary',
      description: 'Derive character ordering from a sorted alien word list by comparing adjacent words. Each differing character pair gives a directed edge. Topological sort yields the alien alphabet. Handle the edge case where a longer word precedes a prefix.',
      difficulty: 'advanced',
      estimatedMinutes: 30,
      code: `from collections import deque, defaultdict

def alien_order(words):
    graph = defaultdict(set)
    in_degree = {c: 0 for word in words for c in word}
    for i in range(len(words) - 1):
        w1, w2 = words[i], words[i + 1]
        min_len = min(len(w1), len(w2))
        if len(w1) > len(w2) and w1[:min_len] == w2[:min_len]:
            return ""
        for j in range(min_len):
            if w1[j] != w2[j]:
                if w2[j] not in graph[w1[j]]:
                    graph[w1[j]].add(w2[j])
                    in_degree[w2[j]] += 1
                break
    queue = deque(c for c in in_degree if in_degree[c] == 0)
    result = []
    while queue:
        c = queue.popleft()
        result.append(c)
        for neighbor in graph[c]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    return "".join(result) if len(result) == len(in_degree) else ""`,
      annotatedCode: `from collections import deque, defaultdict

def alien_order(words):
    graph = defaultdict(set)
    # initialize in_degree for every character that appears (even isolated ones)
    in_degree = {c: 0 for word in words for c in word}
    for i in range(len(words) - 1):
        w1, w2 = words[i], words[i + 1]
        min_len = min(len(w1), len(w2))
        # edge case: "abc" appears before "ab" — a longer word cannot prefix a shorter one
        # in a valid sorted list; this input is contradictory → return ""
        if len(w1) > len(w2) and w1[:min_len] == w2[:min_len]:
            return ""
        for j in range(min_len):
            if w1[j] != w2[j]:              # first differing character gives us an ordering rule
                if w2[j] not in graph[w1[j]]:  # avoid duplicate edges inflating in_degree
                    graph[w1[j]].add(w2[j])
                    in_degree[w2[j]] += 1
                break                        # only the FIRST difference tells us the order; stop here
    queue = deque(c for c in in_degree if in_degree[c] == 0)  # characters with no ordering constraint yet
    result = []
    while queue:
        c = queue.popleft()
        result.append(c)
        for neighbor in graph[c]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    # if result is shorter than distinct characters, a cycle exists → invalid ordering
    return "".join(result) if len(result) == len(in_degree) else ""`,
      explanation: [
        { lines: [5], text: 'Pre-populate in_degree with every character that appears, even those with no edges. Characters that never differ from neighbors still need to appear in the output.' },
        { lines: [10, 11, 12], text: 'Invalid input edge case: if word1 is longer than word2 and word2 is a prefix of word1, the list is not validly sorted (e.g. ["abc", "ab"]). In a real sorted dict, the shorter word must come first. Return "" immediately.' },
        { lines: [13, 14, 15, 16, 17, 18], text: 'Only the first differing character between adjacent words is meaningful. Characters after the first difference are irrelevant — the ordering is already determined. The "break" is essential.' },
        { lines: [20, 21, 22, 23, 24, 25, 26], text: 'Standard Kahn\'s BFS on the character graph. Result length must equal the number of distinct characters; shorter means a cycle in the character constraints, which is invalid.' },
      ],
      timeComplexity: 'O(C) where C is the total number of characters across all words',
      spaceComplexity: 'O(1) — at most 26 nodes (letters) in the graph',
      tags: ['topological-sort', 'BFS', 'alien-dictionary', 'graphs', 'strings'],
      commonMistakes: [
        'Not breaking after the first differing character — comparing all positions adds false edges (e.g., w1="ab", w2="cd" only tells us a < c, not b < d).',
        'Missing the prefix edge case ("abc" before "ab") — this causes a silent wrong answer without the early return.',
        'Allowing duplicate edges without the `if w2[j] not in graph[w1[j]]` guard, inflating in_degree and preventing valid characters from ever reaching 0.',
      ],
      quizzes: [
        { question: 'Why do we break after finding the first differing character between two adjacent words?', answer: "The alien dictionary is sorted: the FIRST difference between adjacent words defines their relative order. Characters at later positions are from different 'branches' of the ordering and provide no information. Adding edges for later positions would introduce false constraints.", type: 'recall' },
        { question: 'Input is ["abc", "ab"]. What should the function return and why?', answer: 'Return "". In a valid sorted dictionary, "ab" must come before "abc" (shorter prefix first). Having "abc" before "ab" is a contradiction — the list is not validly sorted.', type: 'complexity-choice' },
      ],
      variants: ['Verify alien dictionary (check if a given word list is sorted)', 'Reconstruct itinerary (Eulerian path)'],
      prerequisites: ['topo-kahn', 'topo-course-schedule'],
    },
  ],
}

export default topo
