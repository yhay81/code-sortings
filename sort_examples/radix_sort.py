def sort(array):
    largest = max(array)
    place = 1

    while largest // place > 0:
        array.note("place", place)
        counts = [0] * 10
        output = [0] * len(array)

        for value in array:
            digit = (value // place) % 10
            counts[digit] += 1

        for digit in range(1, 10):
            counts[digit] += counts[digit - 1]

        for index in range(len(array) - 1, -1, -1):
            value = array[index]
            digit = (value // place) % 10
            counts[digit] -= 1
            output[counts[digit]] = value

        for index, value in enumerate(output):
            array[index] = value

        place *= 10

    array.mark_sorted(*range(len(array)))
