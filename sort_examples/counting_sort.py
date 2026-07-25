def sort(array):
    largest = max(array)
    counts = [0] * (largest + 1)

    for value in array:
        counts[value] += 1

    destination = 0
    for value, count in enumerate(counts):
        for _ in range(count):
            array[destination] = value
            destination += 1

    array.mark_sorted(*range(len(array)))
