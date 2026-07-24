from __future__ import annotations

import ast
import math
import sys
import traceback
import types
from collections import OrderedDict
from collections.abc import Iterable, MutableSequence
from typing import Any


TOOL_ID = 3


class TraceLimitExceeded(RuntimeError):
    pass


class InvalidSortOperation(RuntimeError):
    pass


def _operator_name(operator: ast.cmpop) -> str:
    names: dict[type[ast.cmpop], str] = {
        ast.Eq: "==",
        ast.NotEq: "!=",
        ast.Lt: "<",
        ast.LtE: "<=",
        ast.Gt: ">",
        ast.GtE: ">=",
        ast.Is: "is",
        ast.IsNot: "is not",
        ast.In: "in",
        ast.NotIn: "not in",
    }
    return names.get(type(operator), type(operator).__name__)


def _comparison_map(source: str) -> dict[int, list[str]]:
    tree = ast.parse(source, filename="<user-sort>", mode="exec")
    comparisons: dict[int, list[str]] = {}
    for node in ast.walk(tree):
        if isinstance(node, ast.Compare) and any(
            isinstance(child, ast.Subscript) for child in ast.walk(node)
        ):
            comparisons.setdefault(node.lineno, []).extend(
                _operator_name(operator) for operator in node.ops
            )
    return comparisons


def _code_objects(root: types.CodeType) -> list[types.CodeType]:
    result = [root]
    for constant in root.co_consts:
        if isinstance(constant, types.CodeType):
            result.extend(_code_objects(constant))
    return result


def _finite_number(value: Any) -> int | float:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise InvalidSortOperation("配列には有限の数値だけを代入できます")
    if not math.isfinite(value):
        raise InvalidSortOperation("配列には有限の数値だけを代入できます")
    return value


class TraceRecorder:
    def __init__(
        self,
        comparisons_by_line: dict[int, list[str]],
        max_steps: int,
    ) -> None:
        self.comparisons_by_line = comparisons_by_line
        self.max_steps = max_steps
        self.events: list[dict[str, Any]] = []
        self.operations: list[dict[str, Any]] = []
        self.notes: dict[str, str] = {}
        self.current_line: int | None = None
        self.current_function = "<module>"
        self.branch: str | None = None
        self.comparisons = 0
        self.enabled = False
        self.sorted_indices: set[int] = set()

    def on_line(self, code: types.CodeType, line: int) -> None:
        if not self.enabled:
            return
        self.flush()
        self.current_line = line
        self.current_function = code.co_name

    def on_start(self, code: types.CodeType, _offset: int) -> None:
        if not self.enabled:
            return
        self.flush()
        self.current_function = code.co_name

    def on_return(
        self,
        _code: types.CodeType,
        _offset: int,
        _value: Any,
    ) -> None:
        if not self.enabled:
            return
        self.flush()
        self.current_line = None

    def on_branch_left(
        self,
        _code: types.CodeType,
        _offset: int,
        _destination: int,
    ) -> None:
        if self.enabled:
            self.branch = "left"

    def on_branch_right(
        self,
        _code: types.CodeType,
        _offset: int,
        _destination: int,
    ) -> None:
        if self.enabled:
            self.branch = "right"

    def on_branch(
        self,
        _code: types.CodeType,
        _offset: int,
        _destination: int,
    ) -> None:
        if self.enabled:
            self.branch = "right"

    def read(self, index: int, value: int | float) -> None:
        if self.enabled:
            self.operations.append(
                {"type": "read", "index": index, "value": value}
            )

    def write(
        self,
        index: int,
        before: int | float,
        after: int | float,
    ) -> None:
        if self.enabled:
            self.operations.append(
                {
                    "type": "write",
                    "index": index,
                    "before": before,
                    "after": after,
                }
            )

    def mark(self, index: int, marked: bool) -> None:
        before = index in self.sorted_indices
        if before == marked:
            return
        if marked:
            self.sorted_indices.add(index)
        else:
            self.sorted_indices.discard(index)
        if self.enabled:
            self.operations.append(
                {
                    "type": "mark",
                    "index": index,
                    "before": before,
                    "after": marked,
                }
            )

    def note(self, name: str, value: Any) -> None:
        if self.enabled:
            self.notes[str(name)] = str(value)

    def flush(self) -> None:
        if not self.enabled:
            self.operations.clear()
            self.notes.clear()
            self.branch = None
            return
        if not self.operations and not self.notes:
            self.branch = None
            return
        if len(self.events) >= self.max_steps:
            raise TraceLimitExceeded(
                f"可視化ステップ数が上限の {self.max_steps:,} を超えました"
            )

        read_indices = [
            operation["index"]
            for operation in self.operations
            if operation["type"] == "read"
        ]
        compare_operators = self.comparisons_by_line.get(
            self.current_line or -1,
            [],
        )
        is_comparison = bool(compare_operators and read_indices)
        if is_comparison:
            self.comparisons += len(compare_operators)

        self.events.append(
            {
                "line": self.current_line or 0,
                "function": self.current_function,
                "operations": self.operations.copy(),
                "comparison": is_comparison,
                "operators": compare_operators,
                "comparisonCount": self.comparisons,
                "branch": self.branch,
                "notes": self.notes.copy(),
            }
        )
        self.operations.clear()
        self.notes.clear()
        self.branch = None


class TrackedBuffer(MutableSequence[int | float]):
    def __init__(
        self,
        values: Iterable[int | float],
        recorder: TraceRecorder,
        origins: Iterable[int] | None = None,
    ) -> None:
        self._values = [_finite_number(value) for value in values]
        self._recorder = recorder
        self._origins = (
            list(origins) if origins is not None else [-1] * len(self._values)
        )

    def __len__(self) -> int:
        return len(self._values)

    def _index(self, index: int) -> int:
        normalized = index + len(self) if index < 0 else index
        if normalized < 0 or normalized >= len(self):
            raise IndexError("TrackedBuffer index out of range")
        return normalized

    def __getitem__(
        self,
        index: int | slice,
    ) -> int | float | TrackedBuffer:
        if isinstance(index, slice):
            return TrackedBuffer(
                self._values[index],
                self._recorder,
                self._origins[index],
            )
        position = self._index(index)
        value = self._values[position]
        origin = self._origins[position]
        if origin >= 0:
            self._recorder.read(origin, value)
        return value

    def __setitem__(
        self,
        index: int | slice,
        value: int | float | Iterable[int | float],
    ) -> None:
        if isinstance(index, slice):
            if isinstance(value, (int, float)):
                raise TypeError("slice assignment requires an iterable")
            values = [_finite_number(item) for item in value]
            self._values[index] = values
            replacement_size = len(range(*index.indices(len(self._origins))))
            if replacement_size == len(values):
                return
            self._origins[index] = [-1] * len(values)
            return
        self._values[self._index(index)] = _finite_number(value)

    def __delitem__(self, index: int | slice) -> None:
        del self._values[index]
        del self._origins[index]

    def insert(self, index: int, value: int | float) -> None:
        self._values.insert(index, _finite_number(value))
        self._origins.insert(index, -1)


class SortArray(MutableSequence[int | float]):
    def __init__(
        self,
        values: Iterable[int | float],
        recorder: TraceRecorder,
    ) -> None:
        self._values = [_finite_number(value) for value in values]
        self._recorder = recorder

    def __len__(self) -> int:
        return len(self._values)

    def _index(self, index: int) -> int:
        normalized = index + len(self) if index < 0 else index
        if normalized < 0 or normalized >= len(self):
            raise IndexError("SortArray index out of range")
        return normalized

    def __getitem__(
        self,
        index: int | slice,
    ) -> int | float | TrackedBuffer:
        if isinstance(index, slice):
            indices = list(range(*index.indices(len(self))))
            values = [self._values[position] for position in indices]
            for position, value in zip(indices, values, strict=True):
                self._recorder.read(position, value)
            return TrackedBuffer(values, self._recorder, indices)
        position = self._index(index)
        value = self._values[position]
        self._recorder.read(position, value)
        return value

    def __setitem__(
        self,
        index: int | slice,
        value: int | float | Iterable[int | float],
    ) -> None:
        if isinstance(index, slice):
            if isinstance(value, (int, float)):
                raise TypeError("slice assignment requires an iterable")
            positions = list(range(*index.indices(len(self))))
            values = [_finite_number(item) for item in value]
            if len(positions) != len(values):
                raise InvalidSortOperation(
                    "ソート中に配列の長さを変更することはできません"
                )
            for position, item in zip(positions, values, strict=True):
                before = self._values[position]
                self._values[position] = item
                self._recorder.write(position, before, item)
            return

        position = self._index(index)
        item = _finite_number(value)
        before = self._values[position]
        self._values[position] = item
        self._recorder.write(position, before, item)

    def __delitem__(self, _index: int | slice) -> None:
        raise InvalidSortOperation("ソート中に配列の長さを変更することはできません")

    def insert(self, _index: int, _value: int | float) -> None:
        raise InvalidSortOperation("ソート中に配列の長さを変更することはできません")

    def swap(self, left: int, right: int) -> None:
        self[left], self[right] = self[right], self[left]

    def mark_sorted(self, *indices: int) -> None:
        for index in indices:
            self._recorder.mark(self._index(index), True)

    def unmark_sorted(self, *indices: int) -> None:
        for index in indices:
            self._recorder.mark(self._index(index), False)

    def note(self, name: str, value: Any) -> None:
        self._recorder.note(name, value)

    def snapshot(self) -> list[int | float]:
        return self._values.copy()


def _install_monitoring(
    recorder: TraceRecorder,
    code_objects: list[types.CodeType],
) -> None:
    monitoring = sys.monitoring
    events = monitoring.events
    if monitoring.get_tool(TOOL_ID) is not None:
        monitoring.free_tool_id(TOOL_ID)
    monitoring.use_tool_id(TOOL_ID, "code-sortings")
    monitoring.register_callback(
        TOOL_ID,
        events.LINE,
        recorder.on_line,
    )
    monitoring.register_callback(
        TOOL_ID,
        events.PY_START,
        recorder.on_start,
    )
    monitoring.register_callback(
        TOOL_ID,
        events.PY_RETURN,
        recorder.on_return,
    )
    branch_events = 0
    if hasattr(events, "BRANCH_LEFT"):
        monitoring.register_callback(
            TOOL_ID,
            events.BRANCH_LEFT,
            recorder.on_branch_left,
        )
        monitoring.register_callback(
            TOOL_ID,
            events.BRANCH_RIGHT,
            recorder.on_branch_right,
        )
        branch_events = events.BRANCH_LEFT | events.BRANCH_RIGHT
    elif hasattr(events, "BRANCH"):
        monitoring.register_callback(
            TOOL_ID,
            events.BRANCH,
            recorder.on_branch,
        )
        branch_events = events.BRANCH

    event_set = events.LINE | events.PY_START | events.PY_RETURN | branch_events
    for code_object in code_objects:
        monitoring.set_local_events(TOOL_ID, code_object, event_set)


def _remove_monitoring() -> None:
    monitoring = sys.monitoring
    if monitoring.get_tool(TOOL_ID) is not None:
        monitoring.free_tool_id(TOOL_ID)


def _compact_events(
    events: list[dict[str, Any]],
    max_frames: int,
) -> list[dict[str, Any]]:
    if len(events) <= max_frames:
        return events

    chunk_size = math.ceil(len(events) / max_frames)
    compacted: list[dict[str, Any]] = []
    for start in range(0, len(events), chunk_size):
        chunk = events[start : start + chunk_size]
        reads: OrderedDict[int, dict[str, Any]] = OrderedDict()
        writes: OrderedDict[int, dict[str, Any]] = OrderedDict()
        marks: OrderedDict[int, dict[str, Any]] = OrderedDict()
        operators: list[str] = []
        notes: dict[str, str] = {}
        comparison = False
        branch: str | None = None

        for event in chunk:
            comparison = comparison or event["comparison"]
            for operator in event["operators"]:
                if operator not in operators:
                    operators.append(operator)
            notes.update(event["notes"])
            if event["branch"] is not None:
                branch = event["branch"]
            for operation in event["operations"]:
                index = operation["index"]
                if operation["type"] == "read":
                    reads.setdefault(index, operation)
                elif operation["type"] == "write":
                    existing = writes.get(index)
                    if existing is None:
                        writes[index] = operation.copy()
                    else:
                        existing["after"] = operation["after"]
                elif operation["type"] == "mark":
                    existing = marks.get(index)
                    if existing is None:
                        marks[index] = operation.copy()
                    else:
                        existing["after"] = operation["after"]

        final_event = chunk[-1]
        compacted.append(
            {
                "line": final_event["line"],
                "function": final_event["function"],
                "operations": [
                    *reads.values(),
                    *writes.values(),
                    *marks.values(),
                ],
                "comparison": comparison,
                "operators": operators,
                "comparisonCount": final_event["comparisonCount"],
                "branch": branch,
                "notes": notes,
            }
        )
    return compacted


def run_sort(
    source: str,
    input_values: Iterable[int | float],
    max_steps: int = 100_000,
    max_frames: int = 5_000,
) -> dict[str, Any]:
    initial = [_finite_number(value) for value in input_values]
    if not 3 <= len(initial) <= 300:
        return {
            "ok": False,
            "errorType": "InvalidInput",
            "message": "配列の長さは3〜300にしてください",
        }

    try:
        comparisons_by_line = _comparison_map(source)
        compiled = compile(source, "<user-sort>", "exec")
    except BaseException as error:
        return {
            "ok": False,
            "errorType": type(error).__name__,
            "message": str(error),
            "traceback": traceback.format_exc(),
        }

    recorder = TraceRecorder(comparisons_by_line, max_steps=max_steps)
    tracked = SortArray(initial, recorder)
    namespace: dict[str, Any] = {
        "__builtins__": __builtins__,
        "__name__": "__user_sort__",
        "SortArray": SortArray,
    }

    try:
        _install_monitoring(recorder, _code_objects(compiled))
        exec(compiled, namespace, namespace)
        sort_function = namespace.get("sort")
        if not callable(sort_function):
            raise InvalidSortOperation("def sort(array): を定義してください")

        recorder.enabled = True
        result = sort_function(tracked)
        recorder.flush()

        if result is not None and result is not tracked:
            recorder.current_line = 0
            recorder.current_function = "<return>"
            tracked[:] = list(result)
            recorder.flush()

        recorder.enabled = False
        final = tracked.snapshot()
        compacted_events = _compact_events(recorder.events, max_frames)
        return {
            "ok": True,
            "initial": initial,
            "final": final,
            "events": compacted_events,
            "comparisons": recorder.comparisons,
            "rawSteps": len(recorder.events),
            "sampled": len(compacted_events) < len(recorder.events),
            "isSorted": final == sorted(initial),
            "preservesValues": sorted(final) == sorted(initial),
        }
    except BaseException as error:
        recorder.enabled = False
        return {
            "ok": False,
            "errorType": type(error).__name__,
            "message": str(error),
            "traceback": traceback.format_exc(),
            "events": recorder.events,
        }
    finally:
        recorder.enabled = False
        _remove_monitoring()
