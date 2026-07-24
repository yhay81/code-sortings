def sort(array):
    def partition(left, right):
        pivot = array[right]
        array.note("pivot", pivot)
        destination = left

        for index in range(left, right):
            if array[index] < pivot:
                array.swap(destination, index)
                destination += 1

        array.swap(destination, right)
        array.mark_sorted(destination)
        return destination

    def quick_sort(left, right):
        if left > right:
            return
        if left == right:
            array.mark_sorted(left)
            return

        pivot_index = partition(left, right)
        quick_sort(left, pivot_index - 1)
        quick_sort(pivot_index + 1, right)

    quick_sort(0, len(array) - 1)
