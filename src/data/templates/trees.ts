import type { Category } from '@/types'

const trees: Category = {
  id: 'trees',
  title: 'Trees',
  icon: 'Layers',
  group: 'trees-graphs',
  templates: [
    {
      id: 'tree-traversals',
      title: 'DFS Traversals (Inorder / Preorder / Postorder)',
      description: 'Three fundamental binary tree traversals. Inorder: left-root-right (BST sorted order). Preorder: root-left-right (copy/serialize). Postorder: left-right-root (delete/evaluate).',
      difficulty: 'beginner',
      estimatedMinutes: 10,
      code: `def inorder(root) -> list[int]:
    result = []
    def dfs(node):
        if not node:
            return
        dfs(node.left)
        result.append(node.val)
        dfs(node.right)
    dfs(root)
    return result


def preorder(root) -> list[int]:
    result = []
    def dfs(node):
        if not node:
            return
        result.append(node.val)
        dfs(node.left)
        dfs(node.right)
    dfs(root)
    return result


def postorder(root) -> list[int]:
    result = []
    def dfs(node):
        if not node:
            return
        dfs(node.left)
        dfs(node.right)
        result.append(node.val)
    dfs(root)
    return result`,
      annotatedCode: `def inorder(root) -> list[int]:
    result = []
    def dfs(node):
        if not node:     # base case: null node
            return
        dfs(node.left)       # explore left subtree first
        result.append(node.val)  # process root (between left and right)
        dfs(node.right)      # then right subtree
    dfs(root)
    return result  # for a BST, this gives sorted ascending order


def preorder(root) -> list[int]:
    result = []
    def dfs(node):
        if not node:
            return
        result.append(node.val)  # process root FIRST
        dfs(node.left)
        dfs(node.right)
    dfs(root)
    return result  # useful for serialization — root appears before children


def postorder(root) -> list[int]:
    result = []
    def dfs(node):
        if not node:
            return
        dfs(node.left)
        dfs(node.right)
        result.append(node.val)  # process root LAST (after both children)
    dfs(root)
    return result  # useful for deletion — children processed before parent`,
      explanation: [
        { lines: [4, 5, 6, 7], text: 'Inorder (L-Root-R): visiting nodes in this order on a BST yields sorted ascending output. The base case handles null nodes — no check needed before each recursive call.' },
        { lines: [14, 15, 16], text: 'Preorder (Root-L-R): root is processed first, making it ideal for serialization (you can reconstruct the tree from preorder + inorder).' },
        { lines: [24, 25, 26], text: 'Postorder (L-R-Root): children are fully processed before the parent. Used for computing sizes, deleting nodes, or evaluating expression trees.' },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h) where h = height of tree',
      tags: ['trees', 'dfs', 'traversal', 'inorder', 'preorder', 'postorder'],
      commonMistakes: [
        'For iterative inorder: push left nodes onto stack, pop and process, then push right. Common interview question.',
      ],
      quizzes: [
        { question: 'Which traversal gives sorted output on a BST?', answer: 'Inorder (left-root-right). Since BST invariant ensures left < root < right, inorder visits nodes in ascending order.', type: 'recall' },
      ],
      variants: ['Iterative inorder using explicit stack', 'Morris traversal O(1) space'],
      prerequisites: [],
      nextTemplate: 'tree-level-order',
    },
    {
      id: 'tree-level-order',
      title: 'Level Order Traversal (BFS)',
      description: 'Visit nodes level by level using a queue. Returns a list of lists — each inner list is one level. Basis for many tree problems.',
      difficulty: 'beginner',
      estimatedMinutes: 10,
      code: `from collections import deque

def level_order(root) -> list[list[int]]:
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        level_size = len(queue)
        level = []
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    return result`,
      annotatedCode: `from collections import deque

def level_order(root) -> list[list[int]]:
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        level_size = len(queue)   # snapshot: how many nodes are on this level
        level = []
        for _ in range(level_size):  # process exactly one level per outer loop iteration
            node = queue.popleft()
            level.append(node.val)
            if node.left:            # only enqueue non-null children
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    return result`,
      explanation: [
        { lines: [8, 9, 10, 11], text: 'Snapshot the queue size at the START of each outer loop iteration. This tells us exactly how many nodes are on the current level — process only those, then the loop ends and the next outer iteration handles the next level.' },
        { lines: [13, 14, 15, 16], text: 'Only enqueue non-null children. Never enqueue None into the queue.' },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(w) where w = max width of tree',
      tags: ['trees', 'bfs', 'level-order', 'queue'],
      commonMistakes: [
        'Not snapshotting `len(queue)` before the inner loop — nodes from the next level sneak into the current level.',
        'For zigzag level order: reverse the level list on even-numbered levels.',
      ],
      quizzes: [
        { question: 'How do you return the rightmost node of each level (right side view)?', answer: 'In the inner loop, the last node processed per level is the rightmost. After the inner loop, result.append(node.val) where node is the last popleft.', type: 'recall' },
      ],
      variants: ['Zigzag level order', 'Average of levels', 'Right side view'],
      prerequisites: ['tree-traversals'],
      nextTemplate: 'tree-lca',
    },
    {
      id: 'tree-lca',
      title: 'Lowest Common Ancestor (LCA)',
      description: 'Find the lowest common ancestor of two nodes in a binary tree. One recursive pass: if both nodes are in different subtrees, the current node is the LCA.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `def lowest_common_ancestor(root, p, q):
    if not root or root == p or root == q:
        return root
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)
    if left and right:
        return root
    return left or right`,
      annotatedCode: `def lowest_common_ancestor(root, p, q):
    if not root or root == p or root == q:
        return root   # base case: null OR found one of the target nodes
    left = lowest_common_ancestor(root.left, p, q)   # search left subtree
    right = lowest_common_ancestor(root.right, p, q) # search right subtree
    if left and right:
        return root   # p and q found in different subtrees — current root is LCA
    return left or right  # one side found both, or neither side found anything`,
      explanation: [
        { lines: [2, 3], text: 'Base case: if we hit null (return None) or find p or q, propagate that node upward.' },
        { lines: [4, 5], text: 'Recurse into both subtrees. Each call returns either None (not found), p, q, or the LCA.' },
        { lines: [6, 7], text: 'If both subtrees returned something non-null, p is in one and q is in the other — current node is the LCA.' },
        { lines: [8], text: 'If only one side returned something, both p and q are in that subtree — return that result (it\'s either the deeper LCA or the node itself).' },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h)',
      tags: ['trees', 'lca', 'dfs', 'recursion'],
      commonMistakes: [
        'This assumes both p and q exist in the tree. If not guaranteed, track a found flag.',
        'For BST: LCA is simpler — if both < root, go left; if both > root, go right; else root is LCA.',
      ],
      quizzes: [
        { question: 'What does the function return if only p exists in the tree (q is missing)?', answer: 'It returns p — the algorithm finds p and propagates it upward. This is incorrect behavior if you need to verify both exist. Add a separate existence check if required.', type: 'predict-output' },
      ],
      variants: ['LCA in a BST (no recursion needed)', 'LCA with parent pointers (common ancestor in linked list style)'],
      prerequisites: ['tree-traversals'],
      nextTemplate: 'tree-serialize',
    },
    {
      id: 'tree-serialize',
      title: 'Serialize / Deserialize Binary Tree',
      description: 'Encode a binary tree to a string and decode it back. Use preorder traversal with null markers.',
      difficulty: 'advanced',
      estimatedMinutes: 20,
      code: `from collections import deque

def serialize(root) -> str:
    parts = []
    def dfs(node):
        if not node:
            parts.append('#')
            return
        parts.append(str(node.val))
        dfs(node.left)
        dfs(node.right)
    dfs(root)
    return ','.join(parts)


def deserialize(data: str):
    nodes = deque(data.split(','))
    def dfs():
        val = nodes.popleft()
        if val == '#':
            return None
        node = TreeNode(int(val))
        node.left = dfs()
        node.right = dfs()
        return node
    return dfs()`,
      annotatedCode: `from collections import deque

def serialize(root) -> str:
    parts = []
    def dfs(node):
        if not node:
            parts.append('#')   # null marker: distinguishes shape
            return
        parts.append(str(node.val))
        dfs(node.left)     # preorder: root → left → right
        dfs(node.right)
    dfs(root)
    return ','.join(parts)  # e.g., "1,2,#,#,3,#,#"


def deserialize(data: str):
    nodes = deque(data.split(','))  # deque for O(1) popleft
    def dfs():
        val = nodes.popleft()
        if val == '#':
            return None       # reconstruct null node
        node = TreeNode(int(val))
        node.left = dfs()     # reconstruct in same preorder sequence
        node.right = dfs()
        return node
    return dfs()`,
      explanation: [
        { lines: [5, 6, 7], text: 'Null markers (#) are essential — they encode the tree\'s shape. Without them, you can\'t distinguish [1, 2] from [1, null, 2].' },
        { lines: [14, 15], text: 'Use a deque (not a list + index) for O(1) popleft during deserialization.' },
        { lines: [18, 19, 20, 21], text: 'Deserialization mirrors serialization: pop one token, create a node, then recursively build left and right. The preorder structure guarantees the tokens arrive in the right order.' },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      tags: ['trees', 'serialization', 'dfs', 'preorder'],
      commonMistakes: [
        'Using a list index instead of a deque — list.pop(0) is O(n).',
        'Forgetting null markers — you need them to reconstruct the exact tree shape.',
      ],
      quizzes: [
        { question: 'Why can\'t you serialize a binary tree with just the values (no null markers)?', answer: 'Different trees can produce the same value sequence. E.g., [1,2] could be a root with left child 2 or root with right child 2. Null markers encode the structure unambiguously.', type: 'recall' },
      ],
      variants: ['Level-order serialization'],
      prerequisites: ['tree-traversals', 'tree-level-order'],
    },
    {
      id: 'tree-height-diameter',
      title: 'Tree Height & Diameter',
      description: 'Compute tree height (max depth) and diameter (longest path between any two nodes, which may not pass through root). Both use DFS post-order.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `def max_depth(root) -> int:
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))


def diameter_of_binary_tree(root) -> int:
    diameter = [0]
    def dfs(node) -> int:
        if not node:
            return 0
        left = dfs(node.left)
        right = dfs(node.right)
        diameter[0] = max(diameter[0], left + right)
        return 1 + max(left, right)
    dfs(root)
    return diameter[0]`,
      annotatedCode: `def max_depth(root) -> int:
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))  # post-order: compute children first


def diameter_of_binary_tree(root) -> int:
    diameter = [0]   # use list to allow mutation inside nested function
    def dfs(node) -> int:
        if not node:
            return 0
        left = dfs(node.left)    # height of left subtree
        right = dfs(node.right)  # height of right subtree
        diameter[0] = max(diameter[0], left + right)  # path through this node = left + right
        return 1 + max(left, right)  # return height (not diameter) to parent
    dfs(root)
    return diameter[0]`,
      explanation: [
        { lines: [2, 3, 4], text: 'Height: base case 0 for null. Add 1 for the current node, take max of left and right subtree heights.' },
        { lines: [8, 9, 10, 11, 12, 13, 14], text: 'Diameter: at each node, the path through it has length left_height + right_height. Track the global max. But return height (not diameter) to the parent — the parent needs heights, not diameters.' },
        { lines: [7], text: 'Using a list `[0]` instead of `nonlocal diameter` — works in Python 2 and 3; `nonlocal` is cleaner in Python 3.' },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h)',
      tags: ['trees', 'dfs', 'height', 'diameter', 'post-order'],
      commonMistakes: [
        'Returning `diameter` from dfs instead of `height` — the parent needs heights to compute its own diameter.',
        'Using a global variable instead of `nonlocal` or a list — works but pollutes scope.',
      ],
      quizzes: [
        { question: 'Why does dfs return height instead of diameter?', answer: 'Each node needs the heights of its subtrees to compute the diameter of paths passing through it. If dfs returned diameter, the parent couldn\'t compute left_height + right_height.', type: 'recall' },
      ],
      variants: ['Max path sum (same pattern, but sum node values instead of counting edges)'],
      prerequisites: ['tree-traversals'],
    },
  ],
}

export default trees
