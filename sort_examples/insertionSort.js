/* eslint-disable @typescript-eslint/explicit-function-return-type */
// eslint-disable-next-line no-undef
sort = (array, film) => {
  let compares = 0
  for (let i = 0; i < array.length; i++) {
    const temp = array[i]
    let j
    for (j = i; j >= 1; j -= 1) {
      film.rec({ array, i, j, temp, compares })
      compares++
      if (array[j - 1] > temp) {
        array[j] = array[j - 1]
        film.rec({ array, i, j, temp, compares })
      } else {
        break
      }
    }
    array[j] = temp
    film.rec({ array, i, j, temp, compares })
  }
}
