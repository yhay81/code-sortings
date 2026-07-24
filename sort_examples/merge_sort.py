def sort(array):
    buffer = array[:]

    def merge(start, middle, end):
        left = start
        right = middle
        destination = start

        while left < middle and right < end:
            if buffer[left] <= buffer[right]:
                array[destination] = buffer[left]
                left += 1
            else:
                array[destination] = buffer[right]
                right += 1
            destination += 1

        while left < middle:
            array[destination] = buffer[left]
            left += 1
            destination += 1

        while right < end:
            array[destination] = buffer[right]
            right += 1
            destination += 1

        buffer[start:end] = array[start:end]

    def split(start, end):
        if end - start <= 1:
            return
        middle = (start + end) // 2
        split(start, middle)
        split(middle, end)
        merge(start, middle, end)

    split(0, len(array))
    array.mark_sorted(*range(len(array)))
