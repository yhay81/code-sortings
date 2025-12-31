sort = (array, film) => {
  let compares = 0;
  const greens = [];
  for (let end = array.length - 1; end > 0; end--) {
    for (let i = 0; i < end; i++) {
      const j = i + 1;
      const temp = array[j];
      film.rec({ array, i, j, temp, compares, greens });
      compares++;
      if (array[i] > array[j]) {
        array[j] = array[i];
        array[i] = temp;
        film.rec({ array, i, j, temp, compares, greens });
      }
    }
    greens.push(end);
    film.rec({ array, i: -1, j: -1, temp: array[end], compares, greens });
  }
  if (array.length > 0) {
    greens.push(0);
    film.rec({ array, i: -1, j: -1, temp: array[0], compares, greens });
  }
};
