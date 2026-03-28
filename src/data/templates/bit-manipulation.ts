import type { Category } from '@/types'

const bits: Category = {
  id: 'bit-manipulation',
  title: 'Bit Manipulation',
  icon: 'Binary',
  group: 'advanced',
  templates: [
    {
      id: 'bit-basics',
      title: 'Bit Operations Cheatsheet',
      description: 'Core bitwise operations: AND, OR, XOR, NOT, shifts. Recipes for checking/setting/clearing/toggling a single bit, testing power-of-2, and counting set bits.',
      difficulty: 'beginner',
      estimatedMinutes: 15,
      code: `def bit_operations(n, k):
    check  = (n >> k) & 1
    set_   = n | (1 << k)
    clear  = n & ~(1 << k)
    toggle = n ^ (1 << k)
    return check, set_, clear, toggle

def is_power_of_two(n):
    return n > 0 and (n & (n - 1)) == 0

def count_set_bits(n):
    return bin(n).count('1')

def bit_demo():
    print(5 & 3)
    print(5 | 3)
    print(5 ^ 3)
    print(~5)
    print(5 << 1)
    print(5 >> 1)`,
      annotatedCode: `def bit_operations(n, k):
    check  = (n >> k) & 1      # shift bit k to position 0, then isolate it with AND 1
    set_   = n | (1 << k)      # force bit k to 1 by OR-ing a mask with only bit k set
    clear  = n & ~(1 << k)     # force bit k to 0 by AND-ing with all-ones except bit k
    toggle = n ^ (1 << k)      # flip bit k: XOR with 1 flips, XOR with 0 leaves unchanged
    return check, set_, clear, toggle

def is_power_of_two(n):
    # a power of 2 has exactly one set bit: 1000...0
    # subtracting 1 gives 0111...1 — AND with original yields 0
    return n > 0 and (n & (n - 1)) == 0

def count_set_bits(n):
    return bin(n).count('1')   # bin() produces '0b...' string; count '1' chars

def bit_demo():
    print(5 & 3)    # AND:  0101 & 0011 = 0001 = 1  — both bits must be 1
    print(5 | 3)    # OR:   0101 | 0011 = 0111 = 7  — either bit can be 1
    print(5 ^ 3)    # XOR:  0101 ^ 0011 = 0110 = 6  — bits differ
    print(~5)       # NOT:  ~0101 = ...11111010 = -6 in two's complement
    print(5 << 1)   # left shift:  multiply by 2 → 10
    print(5 >> 1)   # right shift: integer divide by 2 → 2`,
      explanation: [
        { lines: [2], text: 'Checking bit k: right-shift n by k to bring bit k to position 0, then AND with 1 to isolate it. Result is 0 or 1.' },
        { lines: [3], text: 'Setting bit k: 1 << k creates a mask like 000100. OR-ing with n sets that bit without touching others.' },
        { lines: [4], text: 'Clearing bit k: ~(1 << k) flips all bits of the mask, giving 111011. AND-ing zeros out only bit k.' },
        { lines: [5], text: 'Toggling bit k: XOR with 1 flips a bit; XOR with 0 preserves it. 1 << k has a 1 only at position k.' },
        { lines: [10], text: 'Power-of-2 trick: powers of 2 are 1, 10, 100, 1000 in binary. Subtracting 1 produces a string of lower ones. Their AND is always zero. The n > 0 guard handles the n=0 edge case.' },
      ],
      timeComplexity: 'O(1) per operation',
      spaceComplexity: 'O(1)',
      tags: ['bit-manipulation', 'fundamentals', 'bitmask'],
      commonMistakes: [
        'Operator precedence: `n >> k & 1` is parsed as `n >> (k & 1)` — always add parentheses: `(n >> k) & 1`.',
        'In Python, ~n = -(n+1) due to two\'s complement. This surprises people expecting bitwise NOT of an unsigned integer.',
        'Using `n & n-1 == 0` without the `n > 0` guard — 0 incorrectly passes the power-of-2 test.',
      ],
      quizzes: [
        { question: 'What single expression checks whether bit 3 of integer x is set?', answer: '(x >> 3) & 1  — shift bit 3 to position 0, then mask with 1. Returns 1 if set, 0 if not.', type: 'complexity-choice' },
      ],
      variants: ['Bitwise tricks for swap without temp variable', 'Gray code generation'],
      prerequisites: [],
      nextTemplate: 'bit-xor-tricks',
    },
    {
      id: 'bit-xor-tricks',
      title: 'XOR Tricks',
      description: 'XOR self-cancellation and identity properties solve several classic problems in O(n) time and O(1) space: Single Number, Missing Number, and finding two unique numbers in an array.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      code: `def single_number(nums):
    result = 0
    for n in nums:
        result ^= n
    return result

def missing_number(nums):
    result = len(nums)
    for i, n in enumerate(nums):
        result ^= i ^ n
    return result

def single_number_iii(nums):
    xor_all = 0
    for n in nums:
        xor_all ^= n
    diff_bit = xor_all & (-xor_all)
    a, b = 0, 0
    for n in nums:
        if n & diff_bit:
            a ^= n
        else:
            b ^= n
    return [a, b]`,
      annotatedCode: `def single_number(nums):
    result = 0
    for n in nums:
        result ^= n    # XOR identity: a ^ a = 0, a ^ 0 = a
    # all paired numbers cancel; only the unique element remains
    return result

def missing_number(nums):
    result = len(nums)            # start with n (the index that has no match in array)
    for i, n in enumerate(nums):
        result ^= i ^ n           # XOR index i and value n together; pairs cancel over full loop
    return result                 # whatever is left unpaired is the missing number

def single_number_iii(nums):
    xor_all = 0
    for n in nums:
        xor_all ^= n              # xor_all = a ^ b (the two unique numbers, all pairs cancel)
    diff_bit = xor_all & (-xor_all)  # isolate the lowest set bit where a and b differ
    a, b = 0, 0
    for n in nums:
        if n & diff_bit:          # partition: numbers with that bit set vs not set
            a ^= n                # unique number in this partition cancels with its pairs
        else:
            b ^= n
    return [a, b]`,
      explanation: [
        { lines: [1, 2, 3, 4, 5], text: 'XOR properties: (1) a ^ a = 0 (self-cancellation), (2) a ^ 0 = a (identity), (3) XOR is commutative and associative. XOR-ing all elements lets paired duplicates cancel, leaving only the unique element.' },
        { lines: [7, 8, 9, 10], text: 'Missing Number: XOR indices 0..n with all array values. Each index i and its value nums[i] should cancel if present. The missing index has no matching value, so it survives.' },
        { lines: [13, 14, 15], text: 'Two unique numbers: their XOR is non-zero (they differ somewhere). The lowest set bit of xor_all identifies a bit where a and b differ — we use it to split all numbers into two groups, each containing exactly one unique number.' },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      tags: ['bit-manipulation', 'xor', 'single-number'],
      commonMistakes: [
        'Forgetting XOR is only valid here because every duplicate appears exactly twice — an odd number of duplicates breaks the cancellation.',
        'In Single Number III, using diff_bit = xor_all & ~(xor_all - 1) is equivalent but harder to read; xor_all & (-xor_all) is cleaner.',
        'Assuming XOR gives the missing number directly without seeding result with n — missing the initial XOR with len(nums).',
      ],
      quizzes: [
        { question: 'Why does XOR-ing all elements find the single non-duplicate in O(1) space?', answer: 'XOR is self-inverse (a ^ a = 0) and has identity 0 (a ^ 0 = a). Every duplicate pair cancels to 0. After processing all elements, only the unique element remains XOR-ed with 0, which equals itself.', type: 'recall' },
        { question: 'Trace single_number([4,1,2,1,2]). What is result after each XOR?', answer: 'Start 0 → 0^4=4 → 4^1=5 → 5^2=7 → 7^1=6 → 6^2=4. Result is 4.', type: 'predict-output' },
      ],
      variants: ['Single Number II (every element appears 3 times except one — use bit counting mod 3)'],
      prerequisites: ['bit-basics'],
      nextTemplate: 'bit-counting',
    },
    {
      id: 'bit-counting',
      title: 'Counting Bits',
      description: 'Count the number of 1-bits for every integer from 0 to n using DP and the right-shift recurrence. Also covers Brian Kernighan\'s algorithm for stripping the lowest set bit in O(set bits) time.',
      difficulty: 'beginner',
      estimatedMinutes: 15,
      code: `def count_bits(n):
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = dp[i >> 1] + (i & 1)
    return dp

def count_set_bits_kernighan(n):
    count = 0
    while n:
        n &= n - 1
        count += 1
    return count`,
      annotatedCode: `def count_bits(n):
    dp = [0] * (n + 1)             # dp[i] = number of 1-bits in i
    for i in range(1, n + 1):
        # i >> 1 drops the LSB of i (right shift = integer divide by 2)
        # dp[i >> 1] already computed (smaller index, same upper bits)
        # (i & 1) adds 1 if the LSB of i is set, 0 otherwise
        dp[i] = dp[i >> 1] + (i & 1)
    return dp

def count_set_bits_kernighan(n):
    count = 0
    while n:
        n &= n - 1   # clear the lowest set bit: n-1 flips all bits at and below LSB
        count += 1   # each iteration removes exactly one set bit
    return count`,
      explanation: [
        { lines: [3, 4, 5, 6], text: 'DP recurrence: every integer i is its right-shifted value (i >> 1) plus its lowest bit. i >> 1 is always less than i, so dp[i >> 1] is already solved. This makes the whole array O(n) instead of O(n log n) naive.' },
        { lines: [10, 11, 12], text: 'Brian Kernighan\'s trick: n & (n-1) clears the lowest set bit of n. For example 12 (1100) & 11 (1011) = 8 (1000) — the lowest 1-bit was cleared. The loop runs exactly as many times as there are set bits.' },
      ],
      timeComplexity: 'O(n) for count_bits; O(k) for Kernighan where k = number of set bits',
      spaceComplexity: 'O(n) for count_bits; O(1) for Kernighan',
      tags: ['bit-manipulation', 'dynamic-programming', 'counting-bits'],
      commonMistakes: [
        'Writing dp[i] = dp[i / 2] with integer division — use >> 1 to make the bit relationship explicit and avoid float division.',
        'Starting the DP loop at 0 — dp[0] = 0 is the base case and must not be overwritten.',
        'Confusing Kernighan\'s n &= n-1 (clears lowest set bit) with n &= ~n (clears all bits).',
      ],
      quizzes: [
        { question: 'Why does dp[i] = dp[i >> 1] + (i & 1) correctly compute the number of set bits in i?', answer: 'i >> 1 discards the least significant bit, giving the number with the same upper bits. Its set-bit count is already in dp. (i & 1) is 1 if the LSB is set, 0 otherwise. Together they account for all bits of i.', type: 'recall' },
      ],
      variants: ['Hamming weight (number of 1 bits in a single integer)', 'Bitwise DP for subset problems'],
      prerequisites: ['bit-basics'],
      nextTemplate: 'bit-masks',
    },
    {
      id: 'bit-masks',
      title: 'Bitmask for Subsets',
      description: 'Use an integer as a bitmask to represent subsets of an array. Enumerate all 2^n subsets by iterating from 0 to 2^n - 1 and checking individual bits. Essential for exponential-space DP.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      code: `def all_subsets(nums):
    n = len(nums)
    result = []
    for mask in range(1 << n):
        subset = []
        for i in range(n):
            if (mask >> i) & 1:
                subset.append(nums[i])
        result.append(subset)
    return result

def subset_sum_exists(nums, target):
    n = len(nums)
    for mask in range(1 << n):
        total = 0
        for i in range(n):
            if (mask >> i) & 1:
                total += nums[i]
        if total == target:
            return True
    return False`,
      annotatedCode: `def all_subsets(nums):
    n = len(nums)
    result = []
    for mask in range(1 << n):     # 1 << n = 2^n; iterate over all possible subsets
        subset = []
        for i in range(n):
            if (mask >> i) & 1:    # check if bit i of mask is set → include nums[i]
                subset.append(nums[i])
        result.append(subset)      # mask 0 = empty subset, mask (2^n - 1) = full set
    return result

def subset_sum_exists(nums, target):
    n = len(nums)
    for mask in range(1 << n):     # enumerate every subset
        total = 0
        for i in range(n):
            if (mask >> i) & 1:    # element i is in this subset
                total += nums[i]
        if total == target:
            return True
    return False`,
      explanation: [
        { lines: [4], text: '1 << n produces 2^n. Integers 0 through 2^n - 1 bijectively represent all subsets of an n-element set: bit i set means element i is included.' },
        { lines: [6, 7], text: 'Checking bit i of a mask: right-shift by i to move bit i to position 0, then AND with 1. This is O(1) per element per subset.' },
        { lines: [8], text: 'mask=0 produces an empty subset (no bits set). mask=2^n - 1 (all 1s) produces the full set.' },
      ],
      timeComplexity: 'O(2^n · n)',
      spaceComplexity: 'O(n) per subset (O(2^n · n) for all subsets stored)',
      tags: ['bit-manipulation', 'bitmask', 'subsets', 'combinatorics'],
      commonMistakes: [
        'Using range(n << 1) thinking it equals 2^n — it is 2n, not 2^n. Use range(1 << n).',
        'Iterating mask bits with range(32) on small arrays — always iterate range(n) to avoid spurious bits.',
        'Bitmask DP is only practical for n ≤ 20 or so; forgetting the exponential blowup leads to TLE.',
      ],
      quizzes: [
        { question: 'How many subsets does an n-element array have, and why?', answer: '2^n subsets. Each element is independently either included or excluded, giving 2 choices per element and 2 × 2 × ... × 2 (n times) = 2^n total combinations.', type: 'recall' },
      ],
      variants: ['Traveling Salesman with bitmask DP', 'Minimum XOR subset'],
      prerequisites: ['bit-basics', 'bit-counting'],
      nextTemplate: 'bit-reverse',
    },
    {
      id: 'bit-reverse',
      title: 'Reverse Bits',
      description: 'Reverse the 32 bits of an unsigned integer. Process one bit at a time: shift result left, OR in the LSB of n, then shift n right. Handle Python\'s arbitrary precision with a 32-bit mask.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      code: `def reverse_bits(n):
    result = 0
    for _ in range(32):
        result = (result << 1) | (n & 1)
        n >>= 1
    return result & 0xFFFFFFFF

def reverse_bits_pythonic(n):
    bits = bin(n)[2:].zfill(32)
    return int(bits[::-1], 2)`,
      annotatedCode: `def reverse_bits(n):
    result = 0
    for _ in range(32):                      # process all 32 bits, LSB to MSB
        result = (result << 1) | (n & 1)     # shift result left to make room, then place LSB of n
        n >>= 1                              # consume the LSB of n (move to next bit)
    # Python integers have arbitrary precision; mask to 32 bits to discard high bits
    return result & 0xFFFFFFFF

def reverse_bits_pythonic(n):
    bits = bin(n)[2:].zfill(32)   # bin() → '0b...' string; [2:] strips prefix; zfill pads to 32
    return int(bits[::-1], 2)     # reverse string, parse as binary — readable but interview-unsafe`,
      explanation: [
        { lines: [3, 4], text: 'Each iteration: make room in result by left-shifting, then OR in the current LSB of n. n >>= 1 discards that bit. After 32 iterations all bits have been reversed.' },
        { lines: [6], text: 'Python integers are unbounded signed. After 32 left shifts, bits above position 31 may be set (if n started with high bits). AND with 0xFFFFFFFF (32 ones) discards them, simulating unsigned 32-bit overflow.' },
        { lines: [9, 10], text: 'The pythonic version is readable but relies on string operations and is generally not expected in bit-manipulation interviews. Understand the bit-by-bit version first.' },
      ],
      timeComplexity: 'O(32) = O(1)',
      spaceComplexity: 'O(1)',
      tags: ['bit-manipulation', 'reverse-bits', '32-bit'],
      commonMistakes: [
        'Forgetting & 0xFFFFFFFF in Python — without it, reversing a number with high bits set produces a value larger than 32 bits.',
        'Running the loop for len(bin(n)) - 2 iterations instead of exactly 32 — leading zeros must be included in the reversal.',
        'Shifting n left instead of right — the algorithm extracts bits from LSB to MSB (right to left).',
      ],
      quizzes: [
        { question: 'Why must we AND with 0xFFFFFFFF at the end in Python but not in C/Java?', answer: 'C and Java use fixed-width 32-bit integers that naturally overflow. Python uses arbitrary-precision integers, so left-shifting never discards bits. Masking with 0xFFFFFFFF manually enforces the 32-bit boundary.', type: 'recall' },
      ],
      variants: ['Number of 1 Bits (Hamming weight)', 'Reverse integer (decimal digits, not bits)'],
      prerequisites: ['bit-basics'],
    },
  ],
}

export default bits
