sort = (array, film) => {
  let compares = 0;
  const greens = [];
  for (let i = 0; i < array.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      film.rec({ array, i, j, temp: array[minIndex], compares, greens });
      compares++;
      if (array[j] < array[minIndex]) {
        minIndex = j;
        film.rec({
          array,
          i,
          j: minIndex,
          temp: array[minIndex],
          compares,
          greens,
        });
      }
    }
    const temp = array[i];
    array[i] = array[minIndex];
    array[minIndex] = temp;
    film.rec({ array, i, j: minIndex, temp: array[i], compares, greens });
    greens.push(i);
    film.rec({ array, i: -1, j: -1, temp: array[i], compares, greens });
  }
};
