def sort(array):
    start = 0
    end = len(array) - 1
    swapped = True

    while swapped:
        swapped = False
        for index in range(start, end):
            if array[index] > array[index + 1]:
                array.swap(index, index + 1)
                swapped = True

        array.mark_sorted(end)
        end -= 1
        if not swapped:
            break

        swapped = False
        for index in range(end, start, -1):
            if array[index - 1] > array[index]:
                array.swap(index - 1, index)
                swapped = True

        array.mark_sorted(start)
        start += 1
