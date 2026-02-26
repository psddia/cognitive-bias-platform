export type Option = {
  id: string
  text: string
}

export type Question = {
  id: string
  bias: string
  stem: string
  options: Option[]
  correctId: string
  explanation: string
}

export const round1Questions: Question[] = [
  {
    id: 'q1',
    bias: 'Anchoring',
    stem: 'You are asked to estimate the population of Chicago. Before answering, you are told that the population of Los Angeles is 4 million. What is your estimate likely to be, compared to someone who was first told LA has 400,000 people?',
    options: [
      { id: 'a', text: 'Higher — the LA figure pulls estimates upward' },
      { id: 'b', text: 'Lower — knowing LA is large makes Chicago seem smaller by comparison' },
      { id: 'c', text: 'The same — the LA number is irrelevant to Chicago' },
    ],
    correctId: 'a',
    explanation: 'Anchoring: an irrelevant initial number systematically biases numerical estimates in its direction. Participants given a high anchor estimate higher than those given a low one, even when they know the anchor is arbitrary.',
  },
  {
    id: 'q2',
    bias: 'Conjunction Fallacy',
    stem: 'Linda is 31, single, outspoken, and concerned with social justice. She studied philosophy in college. Which is more probable?',
    options: [
      { id: 'a', text: 'Linda is a bank teller' },
      { id: 'b', text: 'Linda is a bank teller who is active in the feminist movement' },
    ],
    correctId: 'a',
    explanation: 'A conjunction (A and B) cannot be more probable than either constituent alone. The details about Linda make option B feel more representative, but probability theory requires it to be less likely than A alone.',
  },
  {
    id: 'q3',
    bias: 'Base Rate Neglect',
    stem: 'A disease affects 1 in 1,000 people. A test for it is 99% accurate. You test positive. What is the approximate probability you actually have the disease?',
    options: [
      { id: 'a', text: 'About 99%' },
      { id: 'b', text: 'About 50%' },
      { id: 'c', text: 'About 9%' },
    ],
    correctId: 'c',
    explanation: 'In 100,000 people: ~100 have the disease (99 test positive). ~99,900 don\'t, but ~999 test falsely positive. So roughly 99 ÷ 1,098 ≈ 9%. Neglecting the low base rate makes 99% feel intuitively correct.',
  },
  {
    id: 'q4',
    bias: 'Availability Heuristic',
    stem: 'Which cause of death is more common in the United States?',
    options: [
      { id: 'a', text: 'Shark attacks' },
      { id: 'b', text: 'Falling out of bed' },
    ],
    correctId: 'b',
    explanation: 'Falling out of bed kills far more Americans per year than shark attacks, which are extremely rare. Dramatic media coverage of shark attacks inflates their perceived frequency — a textbook availability effect.',
  },
  {
    id: 'q5',
    bias: 'Sunk Cost Fallacy',
    stem: 'You bought a $120 concert ticket. The day of the show, you feel sick and know you\'ll have a miserable time. What should you do?',
    options: [
      { id: 'a', text: 'Go — you already paid for it' },
      { id: 'b', text: 'Stay home — the $120 is gone either way, and going will make you feel worse' },
    ],
    correctId: 'b',
    explanation: 'Sunk costs are unrecoverable regardless of future choices. The rational decision considers only future costs and benefits. Staying home is better — but the sunk cost fallacy compels most people to go.',
  },
  {
    id: 'q6',
    bias: 'Overconfidence',
    stem: 'Without looking it up: In what year was the Eiffel Tower completed?',
    options: [
      { id: 'a', text: '1872' },
      { id: 'b', text: '1889' },
      { id: 'c', text: '1901' },
      { id: 'd', text: '1912' },
    ],
    correctId: 'b',
    explanation: 'The Eiffel Tower was completed in 1889. This item is designed to pair with your confidence rating: research consistently shows people are overconfident on trivia recall — high confidence, imperfect accuracy.',
  },
]