sort = (array, film) => {
  let compares = 0;
  const greens = [];
  let start = 0;
  let end = array.length - 1;
  let swapped = true;

  while (start < end && swapped) {
    swapped = false;
    for (let i = start; i < end; i++) {
      const j = i + 1;
      const temp = array[j];
      film.rec({ array, i, j, temp, compares, greens });
      compares++;
      if (array[i] > array[j]) {
        array[j] = array[i];
        array[i] = temp;
        film.rec({ array, i, j, temp, compares, greens });
        swapped = true;
      }
    }
    greens.push(end);
    film.rec({ array, i: -1, j: -1, temp: array[end], compares, greens });
    end--;
    if (!swapped || start >= end) break;

    swapped = false;
    for (let i = end; i > start; i--) {
      const j = i - 1;
      const temp = array[j];
      film.rec({ array, i, j, temp, compares, greens });
      compares++;
      if (array[j] > array[i]) {
        array[j] = array[i];
        array[i] = temp;
        film.rec({ array, i, j, temp, compares, greens });
        swapped = true;
      }
    }
    greens.push(start);
    film.rec({ array, i: -1, j: -1, temp: array[start], compares, greens });
    start++;
  }

  if (array.length > 0) {
    for (let i = start; i <= end; i++) {
      greens.push(i);
    }
    const finalIndex = Math.min(start, array.length - 1);
    film.rec({
      array,
      i: -1,
      j: -1,
      temp: array[finalIndex],
      compares,
      greens,
    });
  }
};
