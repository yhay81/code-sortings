sort = (array, film) => {
  let compares = 0;
  const greens = [];

  const heapify = (size, root) => {
    let largest = root;
    const left = root * 2 + 1;
    const right = left + 1;

    if (left < size) {
      film.rec({ array, i: root, j: left, temp: array[root], compares, greens });
      compares++;
      if (array[left] > array[largest]) {
        largest = left;
      }
    }
    if (right < size) {
      film.rec({ array, i: root, j: right, temp: array[root], compares, greens });
      compares++;
      if (array[right] > array[largest]) {
        largest = right;
      }
    }
    if (largest !== root) {
      const temp = array[root];
      array[root] = array[largest];
      array[largest] = temp;
      film.rec({ array, i: root, j: largest, temp, compares, greens });
      heapify(size, largest);
    }
  };

  for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
    heapify(array.length, i);
  }

  for (let end = array.length - 1; end > 0; end--) {
    const temp = array[0];
    array[0] = array[end];
    array[end] = temp;
    film.rec({ array, i: 0, j: end, temp, compares, greens });
    greens.push(end);
    film.rec({ array, i: -1, j: -1, temp: array[end], compares, greens });
    heapify(end, 0);
  }

  if (array.length > 0) {
    greens.push(0);
    film.rec({ array, i: -1, j: -1, temp: array[0], compares, greens });
  }
};
