/* eslint-disable @typescript-eslint/explicit-function-return-type */
// eslint-disable-next-line no-undef
sort = (array, film) => {
  let compares = 0
  for (
    let k = 2, step = Math.floor(array.length / 2);
    step > 0;
    k *= 2, step = Math.floor(array.length / k)
  ) {
    for (let i = step; i < array.length; i++) {
      const temp = array[i]
      let j
      for (j = i; j >= step; j -= step) {
        film.rec({ array, i, j, temp, compares })
        compares++
        if (array[j - step] > temp) {
          array[j] = array[j - step]
          film.rec({ array, i, j, temp, compares })
        } else {
          break
        }
      }
      array[j] = temp
      film.rec({ array, i, j, temp, compares })
    }
  }
}
