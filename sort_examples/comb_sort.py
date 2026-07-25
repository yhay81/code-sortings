def sort(array):
    gap = len(array)
    shrink = 1.3
    swapped = True

    while gap > 1 or swapped:
        gap = max(1, int(gap / shrink))
        array.note("gap", gap)
        swapped = False

        for left in range(len(array) - gap):
            right = left + gap
            if array[left] > array[right]:
                array.swap(left, right)
                swapped = True

    array.mark_sorted(*range(len(array)))
