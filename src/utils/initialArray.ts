const shuffle = (array: number[]): number[] => {
  for (let index = array.length - 1; index > 0; index--) {
    const index_ = Math.floor(Math.random() * (index + 1))
    ;[array[index], array[index_]] = [array[index_], array[index]]
  }
  return array
}

const generators: { [key: string]: (count: number) => number[] } = {
  //ランダムの配列を生成
  random: (count: number): number[] =>
    shuffle(new Array(count).fill(null).map((_, index) => index + 1)),

  //逆順の配列を生成
  reversed: (count) =>
    new Array(count).fill(null).map((_, index) => count - index),

  //ほとんどソートされた配列を生成
  'nearly-sorted': (count) => {
    const answer = new Array(count).fill(null).map((_, index) => index + 1)
    const size = count > 10 ? 4 : 2
    return new Array(Math.ceil(count / size))
      .fill(null)
      .map((_, index) => answer.slice(index * size, (index + 1) * size))
      .map((each) => shuffle(each))
      .flat()
  },

  //重複のある配列を生成
  'few-unique': (count) =>
    shuffle(
      new Array(count)
        .fill(null)
        .map((_, index) => Math.ceil((5 * (index + 1)) / count))
    ),
}

export const createArray = (count: number, pattern: string): number[] =>
  generators[pattern](count)
