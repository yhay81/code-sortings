import { t } from "../i18n";
import type { TracePicture } from "./traceTimeline";

export interface OperationExplanation {
  kind: string;
  title: string;
  detail: string;
}

const sourceLabel = (picture: TracePicture): string =>
  picture.line > 0
    ? t("source.line", {
        function: picture.functionName,
        line: picture.line,
      })
    : "";

const notesLabel = (picture: TracePicture): string =>
  Object.entries(picture.notes)
    .map(([name, value]) => `${name} = ${value}`)
    .join(" · ");

export const explainOperation = (
  picture: TracePicture,
): OperationExplanation => {
  const source = sourceLabel(picture);
  const notes = notesLabel(picture);
  const detail = [source, notes].filter(Boolean).join(" · ");
  const newlyMarked = picture.markOperations.filter(
    (operation) => operation.after,
  );

  if (newlyMarked.length > 0) {
    const indices = newlyMarked
      .slice(0, 4)
      .map((operation) => `array[${operation.index}]`)
      .join(", ");
    const suffix =
      newlyMarked.length > 4
        ? t("operation.mark.more", { count: newlyMarked.length - 4 })
        : "";
    return {
      kind: t("operation.mark.kind"),
      title: t("operation.mark.title", { indices, suffix }),
      detail,
    };
  }

  const [firstWrite, secondWrite] = picture.writeOperations;
  const isSwap =
    picture.writeOperations.length === 2 &&
    firstWrite.before === secondWrite.after &&
    firstWrite.after === secondWrite.before;
  if (isSwap) {
    return {
      kind: t("operation.swap.kind"),
      title: t("operation.swap.title", {
        left: firstWrite.index,
        right: secondWrite.index,
      }),
      detail: `${firstWrite.before} ↔ ${secondWrite.before}${detail ? ` · ${detail}` : ""}`,
    };
  }
  if (picture.writeOperations.length > 0) {
    const changes = picture.writeOperations
      .slice(0, 3)
      .map(
        (operation) =>
          `array[${operation.index}]: ${operation.before} → ${operation.after}`,
      )
      .join(" · ");
    return {
      kind: t("operation.write.kind"),
      title:
        picture.writeOperations.length === 1
          ? t("operation.write.one", { index: firstWrite.index })
          : t("operation.write.many", {
              count: picture.writeOperations.length,
            }),
      detail: [changes, detail].filter(Boolean).join(" · "),
    };
  }

  if (picture.comparison && picture.readOperations.length >= 2) {
    const uniqueReads = [
      ...new Map(
        picture.readOperations.map((operation) => [operation.index, operation]),
      ).values(),
    ];
    const [left, right] = uniqueReads.slice(-2);
    if (left && right) {
      const operator =
        picture.operators.at(-1) ?? t("operation.compare.fallback");
      return {
        kind: t("operation.compare.kind"),
        title: t("operation.compare.title", {
          left: left.index,
          right: right.index,
          operator,
        }),
        detail: `${left.value} ${operator} ${right.value}${detail ? ` · ${detail}` : ""}`,
      };
    }
  }

  const lastRead = picture.readOperations.at(-1);
  if (lastRead) {
    return {
      kind: t("operation.read.kind"),
      title: t("operation.read.title", {
        index: lastRead.index,
        value: lastRead.value,
      }),
      detail,
    };
  }

  if (picture.line > 0) {
    return {
      kind: t("operation.advance.kind"),
      title: t("operation.advance.title", {
        function: picture.functionName,
        line: picture.line,
      }),
      detail: notes || t("operation.advance.noChange"),
    };
  }

  return {
    kind: t("operation.start.kind"),
    title: t("operation.start.title"),
    detail: t("operation.start.detail"),
  };
};
