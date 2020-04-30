/* eslint-disable @typescript-eslint/explicit-function-return-type */
export default (array, film) => {
  let compares = 0
  for (
    let k = 2, step = Math.floor(array.length / 2);
    step > 0;
    k *= 2, step = Math.floor(array.length / k)
  ) {
    for (let i = step; i < array.length; i++) {
      const tempNum = array[i]
      let j
      for (j = i; j >= step; j -= step) {
        film.rec({ array, compares, greenIndex: i, redIndex: j, tempNum })
        compares++
        if (array[j - step] > tempNum) {
          array[j] = array[j - step]
          film.rec({ array, compares, greenIndex: i, redIndex: j, tempNum })
        } else {
          break
        }
      }
      array[j] = tempNum
      film.rec({ array, compares, greenIndex: i, redIndex: j, tempNum })
    }
  }
}
