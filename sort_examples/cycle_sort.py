def sort(array):
    for cycle_start in range(len(array) - 1):
        item = array[cycle_start]
        destination = cycle_start

        for index in range(cycle_start + 1, len(array)):
            if array[index] < item:
                destination += 1

        if destination == cycle_start:
            array.mark_sorted(cycle_start)
            continue

        while item == array[destination]:
            destination += 1
        item, array[destination] = array[destination], item

        while destination != cycle_start:
            destination = cycle_start
            for index in range(cycle_start + 1, len(array)):
                if array[index] < item:
                    destination += 1

            while item == array[destination]:
                destination += 1
            item, array[destination] = array[destination], item

        array.mark_sorted(cycle_start)

    array.mark_sorted(*range(len(array)))
