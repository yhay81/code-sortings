sort = (array, film) => {
  let compares = 0;
  const buffer = array.slice();

  const merge = (start, mid, end) => {
    let i = start;
    let j = mid;
    let k = start;
    while (i < mid && j < end) {
      film.rec({ array, i, j, temp: buffer[j], compares });
      compares++;
      if (buffer[i] <= buffer[j]) {
        array[k] = buffer[i];
        film.rec({ array, i, j, temp: buffer[i], compares });
        i++;
      } else {
        array[k] = buffer[j];
        film.rec({ array, i, j, temp: buffer[j], compares });
        j++;
      }
      k++;
    }
    while (i < mid) {
      array[k] = buffer[i];
      film.rec({ array, i, j: -1, temp: buffer[i], compares });
      i++;
      k++;
    }
    while (j < end) {
      array[k] = buffer[j];
      film.rec({ array, i: -1, j, temp: buffer[j], compares });
      j++;
      k++;
    }
    for (let n = start; n < end; n++) {
      buffer[n] = array[n];
    }
  };

  const split = (start, end) => {
    if (end - start <= 1) return;
    const mid = Math.floor((start + end) / 2);
    split(start, mid);
    split(mid, end);
    merge(start, mid, end);
  };

  split(0, array.length);
};
