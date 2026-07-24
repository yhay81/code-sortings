def sort(array):
    for i in range(1, len(array)):
        temp = array[i]
        j = i
        while j >= 1 and array[j - 1] > temp:
            array[j] = array[j - 1]
            j -= 1
        array[j] = temp

    array.mark_sorted(*range(len(array)))
