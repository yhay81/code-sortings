sort = (array, film) => {
  let compares = 0;

  const partition = (left, right) => {
    const pivot = array[right];
    let i = left;
    for (let j = left; j < right; j++) {
      film.rec({ array, i, j, temp: pivot, compares });
      compares++;
      if (array[j] < pivot) {
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
        film.rec({ array, i, j, temp: pivot, compares });
        i++;
      }
    }
    const temp = array[i];
    array[i] = array[right];
    array[right] = temp;
    film.rec({ array, i, j: right, temp: pivot, compares });
    return i;
  };

  const quickSort = (left, right) => {
    if (left >= right) return;
    const pivotIndex = partition(left, right);
    quickSort(left, pivotIndex - 1);
    quickSort(pivotIndex + 1, right);
  };

  quickSort(0, array.length - 1);
};
