const shuffle = (a: number[]): number[] => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const generators = {
  reversed: (count: number): number[] =>
    [...Array(count)].map((_, i) => count - i),
  'nearly-sorted': (count: number): number[] => {
    const answer = [...Array(count)].map((_, i) => i + 1)
    const size = count > 10 ? 4 : 2
    return [...Array(Math.ceil(count / size))]
      .map((_, i) => answer.slice(i * size, (i + 1) * size))
      .map((each) => shuffle(each))
      .flat()
  },
  'few-unique': (count: number): number[] =>
    shuffle([...Array(count)].map((_, i) => Math.ceil((5 * (i + 1)) / count))),
  random: (count: number): number[] =>
    shuffle([...Array(count)].map((_, i) => i + 1)),
}

export const createArray = (count: number, pattern: string): number[] =>
  generators[pattern](count)
