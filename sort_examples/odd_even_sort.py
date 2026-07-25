def sort(array):
    swapped = True

    while swapped:
        swapped = False

        for left in range(1, len(array) - 1, 2):
            if array[left] > array[left + 1]:
                array.swap(left, left + 1)
                swapped = True

        for left in range(0, len(array) - 1, 2):
            if array[left] > array[left + 1]:
                array.swap(left, left + 1)
                swapped = True

    array.mark_sorted(*range(len(array)))
