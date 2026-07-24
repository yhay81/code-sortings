def sort(array):
    for end in range(len(array) - 1, 0, -1):
        for i in range(end):
            if array[i] > array[i + 1]:
                array[i], array[i + 1] = array[i + 1], array[i]
        array.mark_sorted(end)

    array.mark_sorted(0)
