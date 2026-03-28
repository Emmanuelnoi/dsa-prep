import type { Category } from '@/types'

const trie: Category = {
  id: 'trie',
  title: 'Trie',
  icon: 'GitBranch',
  group: 'trees-graphs',
  templates: [
    {
      id: 'trie-basic',
      title: 'Trie Insert / Search / StartsWith',
      description: 'Build a Trie for O(m) insert, search, and prefix queries — where m is the word length. Uses nested dicts or TrieNode objects.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word: str) -> bool:
        node = self.root
        for ch in word:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return node.is_end

    def starts_with(self, prefix: str) -> bool:
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return True`,
      annotatedCode: `class TrieNode:
    def __init__(self):
        self.children = {}    # char → TrieNode (dict allows any alphabet)
        self.is_end = False   # True if a word ends at this node

class Trie:
    def __init__(self):
        self.root = TrieNode()  # empty root (no character)

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()  # create node if missing
            node = node.children[ch]             # walk down
        node.is_end = True  # mark end of word

    def search(self, word: str) -> bool:
        node = self.root
        for ch in word:
            if ch not in node.children:
                return False   # prefix doesn't exist at all
            node = node.children[ch]
        return node.is_end     # must be a complete word, not just a prefix

    def starts_with(self, prefix: str) -> bool:
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return True  # prefix exists — we don't check is_end`,
      explanation: [
        { lines: [2, 3], text: 'Each TrieNode stores a dict of children (one per character) and a flag marking if a complete word ends here.' },
        { lines: [9, 10, 11, 12, 13, 14], text: 'Insert: walk the trie, creating nodes for missing characters. Mark is_end=True at the last character.' },
        { lines: [16, 17, 18, 19, 20, 21], text: 'Search: walk the trie; return False at any missing character. At the end, check is_end — "ap" should return False if only "apple" was inserted.' },
        { lines: [23, 24, 25, 26, 27, 28], text: 'StartsWith: same as search but does NOT check is_end. Any path that reaches the end of the prefix returns True.' },
      ],
      timeComplexity: 'O(m) per operation where m = word length',
      spaceComplexity: 'O(n · m) total for n words of avg length m',
      tags: ['trie', 'prefix-tree', 'strings'],
      commonMistakes: [
        'Forgetting to check `node.is_end` in search — "ap" would incorrectly return True if "apple" was inserted.',
        'For large alphabets (Unicode), defaultdict(TrieNode) or dict is better than an array of 26.',
      ],
      quizzes: [
        { question: 'What is the difference between search("ap") and starts_with("ap") after inserting "apple"?', answer: 'search("ap") returns False — "ap" was never inserted as a complete word. starts_with("ap") returns True — "ap" is a valid prefix of "apple".', type: 'predict-output' },
      ],
      variants: ['Array-based Trie (26 lowercase letters): `self.children = [None] * 26`', 'Compressed Trie / Radix Tree'],
      prerequisites: [],
      nextTemplate: 'trie-word-dict',
    },
    {
      id: 'trie-word-dict',
      title: 'Word Dictionary (Search with Wildcards)',
      description: 'Design a data structure that supports adding words and searching with `.` as a wildcard. Use DFS/recursion at wildcard nodes.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `class WordDictionary:
    def __init__(self):
        self.root = TrieNode()

    def add_word(self, word: str) -> None:
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word: str) -> bool:
        def dfs(node, i):
            if i == len(word):
                return node.is_end
            ch = word[i]
            if ch == '.':
                return any(dfs(child, i + 1) for child in node.children.values())
            if ch not in node.children:
                return False
            return dfs(node.children[ch], i + 1)
        return dfs(self.root, 0)`,
      annotatedCode: `class WordDictionary:
    def __init__(self):
        self.root = TrieNode()

    def add_word(self, word: str) -> None:
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word: str) -> bool:
        def dfs(node, i):
            if i == len(word):   # processed all characters
                return node.is_end
            ch = word[i]
            if ch == '.':        # wildcard: try every existing child
                return any(dfs(child, i + 1) for child in node.children.values())
            if ch not in node.children:
                return False
            return dfs(node.children[ch], i + 1)
        return dfs(self.root, 0)`,
      explanation: [
        { lines: [13, 14, 15], text: 'Base case: if we\'ve consumed all characters, check is_end. This handles exact matches at the end.' },
        { lines: [16, 17], text: 'Wildcard \'.\': recursively try ALL children. `any()` short-circuits on the first True — avoids exploring all paths unnecessarily.' },
        { lines: [18, 19, 20], text: 'Normal character: standard Trie traversal.' },
      ],
      timeComplexity: 'O(m) search best-case, O(n·m) worst-case (all wildcards)',
      spaceComplexity: 'O(n·m)',
      tags: ['trie', 'dfs', 'wildcards', 'pattern-matching'],
      commonMistakes: [
        'Using a loop instead of recursion for wildcards — recursion is cleaner since the position index changes.',
      ],
      quizzes: [
        { question: 'Why use `any()` for the wildcard case instead of a loop with early return?', answer: '`any(generator)` is lazy — it evaluates the generator until the first True. This is equivalent to a loop with `if ... return True`, but more Pythonic.', type: 'recall' },
      ],
      variants: [],
      prerequisites: ['trie-basic'],
      nextTemplate: 'trie-prefix-sum',
    },
    {
      id: 'trie-prefix-sum',
      title: 'Prefix Search & Autocomplete',
      description: 'Return all words with a given prefix. Traverse to the prefix node, then DFS to collect all words ending below it.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `class AutocompleteTrie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True
        node.word = word

    def search_prefix(self, prefix: str) -> list[str]:
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return []
            node = node.children[ch]
        results = []
        def dfs(n):
            if n.is_end:
                results.append(n.word)
            for child in n.children.values():
                dfs(child)
        dfs(node)
        return results`,
      annotatedCode: `class AutocompleteTrie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True
        node.word = word   # store full word at end node (avoids reconstruction)

    def search_prefix(self, prefix: str) -> list[str]:
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return []       # prefix not found — no completions
            node = node.children[ch]
        results = []
        def dfs(n):
            if n.is_end:
                results.append(n.word)  # found a complete word
            for child in n.children.values():
                dfs(child)              # explore all branches below prefix
        dfs(node)      # start DFS from the end of the prefix
        return results`,
      explanation: [
        { lines: [11], text: 'Store the full word at each end node — avoids having to reconstruct the word by passing a string down the DFS.' },
        { lines: [13, 14, 15, 16, 17], text: 'Navigate to the prefix endpoint. If any character in the prefix is missing, return empty list immediately.' },
        { lines: [19, 20, 21, 22, 23], text: 'DFS from the prefix node collects all complete words in the subtree below it.' },
      ],
      timeComplexity: 'O(m + k) where m = prefix length, k = total characters in all results',
      spaceComplexity: 'O(n·m)',
      tags: ['trie', 'autocomplete', 'dfs', 'prefix-search'],
      commonMistakes: [
        'Reconstructing words during DFS (passing path as string) is error-prone. Storing the full word at is_end nodes is cleaner.',
      ],
      quizzes: [
        { question: 'For a top-3 autocomplete feature, what would you add to this?', answer: 'Store a frequency count per word. Use a min-heap of size 3 during DFS to track the top-3 by frequency. Stop exploring branches whose maximum possible frequency can\'t beat the heap minimum.', type: 'recall' },
      ],
      variants: ['Top-K frequent completions using a heap'],
      prerequisites: ['trie-basic'],
    },
  ],
}

export default trie
