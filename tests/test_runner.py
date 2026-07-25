from __future__ import annotations

import random
import unittest
from pathlib import Path

from src.python.runner import run_sort


EXAMPLES = Path(__file__).parents[1] / "sort_examples"


class PythonRunnerTest(unittest.TestCase):
    def test_all_examples_sort_multiple_inputs(self) -> None:
        random_values = list(range(1, 41))
        random.Random(42).shuffle(random_values)
        inputs = [
            list(range(40, 0, -1)),
            random_values,
            [index % 5 for index in range(40)],
        ]

        for example in sorted(EXAMPLES.glob("*.py")):
            source = example.read_text()
            for values in inputs:
                with self.subTest(example=example.name, values=values[:5]):
                    result = run_sort(source, values)
                    self.assertTrue(result["ok"], result.get("message"))
                    self.assertTrue(result["isSorted"])
                    self.assertTrue(result["preservesValues"])
                    self.assertEqual(result["final"], sorted(values))
                    self.assertLessEqual(len(result["events"]), 5_000)

    def test_plain_python_swap_creates_compare_and_write_events(self) -> None:
        result = run_sort(
            """def sort(array):
    if array[0] > array[1]:
        array[0], array[1] = array[1], array[0]
""",
            [2, 1, 3],
        )

        self.assertTrue(result["ok"])
        self.assertEqual(result["final"], [1, 2, 3])
        self.assertEqual(result["comparisons"], 1)
        operation_types = [
            operation["type"]
            for event in result["events"]
            for operation in event["operations"]
        ]
        self.assertIn("read", operation_types)
        self.assertIn("write", operation_types)

    def test_returning_a_new_sequence_is_supported(self) -> None:
        result = run_sort(
            """def sort(array):
    return sorted(array)
""",
            [3, 1, 2],
        )

        self.assertTrue(result["ok"])
        self.assertEqual(result["final"], [1, 2, 3])

    def test_length_changes_are_rejected(self) -> None:
        result = run_sort(
            """def sort(array):
    array.append(4)
""",
            [3, 2, 1],
        )

        self.assertFalse(result["ok"])
        self.assertEqual(result["errorType"], "InvalidSortOperation")

    def test_trace_limit_stops_excessive_recording(self) -> None:
        result = run_sort(
            (EXAMPLES / "bubble_sort.py").read_text(),
            list(range(30, 0, -1)),
            max_steps=10,
        )

        self.assertFalse(result["ok"])
        self.assertEqual(result["errorType"], "TraceLimitExceeded")

    def test_large_trace_is_compacted_without_losing_the_result(self) -> None:
        result = run_sort(
            (EXAMPLES / "bubble_sort.py").read_text(),
            list(range(300, 0, -1)),
        )

        self.assertTrue(result["ok"])
        self.assertTrue(result["isSorted"])
        self.assertEqual(result["rawSteps"], 90_000)
        self.assertLessEqual(len(result["events"]), 5_000)
        self.assertTrue(result["sampled"])
        replayed = list(result["initial"])
        for event in result["events"]:
            for operation in event["operations"]:
                if operation["type"] == "write":
                    replayed[operation["index"]] = operation["after"]
        self.assertEqual(replayed, result["final"])

    def test_gnome_sort_supports_the_maximum_array_size(self) -> None:
        result = run_sort(
            (EXAMPLES / "gnome_sort.py").read_text(),
            list(range(300, 0, -1)),
        )

        self.assertTrue(result["ok"])
        self.assertTrue(result["isSorted"])
        self.assertGreater(result["rawSteps"], 100_000)
        self.assertLessEqual(len(result["events"]), 5_000)
        self.assertTrue(result["sampled"])

    def test_syntax_errors_are_returned_to_the_ui(self) -> None:
        result = run_sort("def sort(array):\\n    if", [3, 2, 1])

        self.assertFalse(result["ok"])
        self.assertEqual(result["errorType"], "SyntaxError")


if __name__ == "__main__":
    unittest.main()
