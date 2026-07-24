def sort(array):
    def heapify(size, root):
        largest = root
        left = root * 2 + 1
        right = left + 1

        if left < size and array[left] > array[largest]:
            largest = left
        if right < size and array[right] > array[largest]:
            largest = right
        if largest != root:
            array.swap(root, largest)
            heapify(size, largest)

    for index in range(len(array) // 2 - 1, -1, -1):
        heapify(len(array), index)

    for end in range(len(array) - 1, 0, -1):
        array.swap(0, end)
        array.mark_sorted(end)
        heapify(end, 0)

    array.mark_sorted(0)
