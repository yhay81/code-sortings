def sort(array):
    position = 1

    while position < len(array):
        if position == 0 or array[position - 1] <= array[position]:
            position += 1
        else:
            array.swap(position - 1, position)
            position -= 1

    array.mark_sorted(*range(len(array)))
