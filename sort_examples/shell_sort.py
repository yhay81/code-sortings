def sort(array):
    gap = len(array) // 2
    while gap > 0:
        array.note("gap", gap)
        for i in range(gap, len(array)):
            temp = array[i]
            j = i
            while j >= gap and array[j - gap] > temp:
                array[j] = array[j - gap]
                j -= gap
            array[j] = temp
        gap //= 2

    array.mark_sorted(*range(len(array)))
