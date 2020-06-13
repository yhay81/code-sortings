const shuffle = (array: number[]): number[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const generators: { [key: string]: (count: number) => number[] } = {
  //ランダムの配列を生成
  random: (count: number): number[] =>
    shuffle(
      Array(count)
        .fill(null)
        .map((_, i) => i + 1)
    ),

  //逆順の配列を生成
  reversed: (count) =>
    Array(count)
      .fill(null)
      .map((_, i) => count - i),

  //ほとんどソートされた配列を生成
  'nearly-sorted': (count) => {
    const answer = Array(count)
      .fill(null)
      .map((_, i) => i + 1)
    const size = count > 10 ? 4 : 2
    return Array(Math.ceil(count / size))
      .fill(null)
      .map((_, i) => answer.slice(i * size, (i + 1) * size))
      .map((each) => shuffle(each))
      .flat()
  },

  //重複のある配列を生成
  'few-unique': (count) =>
    shuffle(
      Array(count)
        .fill(null)
        .map((_, i) => Math.ceil((5 * (i + 1)) / count))
    ),
}

export const createArray = (count: number, pattern: string): number[] =>
  generators[pattern](count)
