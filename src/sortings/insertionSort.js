/* eslint-disable @typescript-eslint/explicit-function-return-type */
export default (array, film) => {
  let compares = 0
  for (let i = 0; i < array.length; i++) {
    const temp = array[i]
    let j
    for (j = i; j >= 1; j -= 1) {
      film.rec({ array, compares, i, j, temp })
      compares++
      if (array[j - 1] > temp) {
        array[j] = array[j - 1]
        film.rec({ array, compares, i, j, temp })
      } else {
        break
      }
    }
    array[j] = temp
    film.rec({ array, compares, i, j, temp })
  }
}
