import { getExampleGuide } from "../guides";
import { t, type Locale } from "../i18n";
import type { AppElements } from "./elements";

export const renderLesson = (
  elements: AppElements,
  path: string,
  locale: Locale,
): void => {
  const guide = getExampleGuide(path, locale);
  elements.lessonTitle.textContent = guide.title;
  elements.lessonSummary.textContent = guide.summary;
  elements.lessonFocus.textContent = guide.focus;
  elements.complexityBest.textContent = guide.best;
  elements.complexityAverage.textContent = guide.average;
  elements.complexityWorst.textContent = guide.worst;
  elements.lessonTrait.textContent = guide.trait;
  elements.lessonReferenceLabel.textContent = t("lesson.learnMore");

  if (guide.referenceUrl) {
    elements.lessonReference.href = guide.referenceUrl;
    elements.lessonReference.setAttribute(
      "aria-label",
      t("lesson.learnMoreAria", { algorithm: guide.title }),
    );
    elements.lessonReference.hidden = false;
    return;
  }

  elements.lessonReference.removeAttribute("href");
  elements.lessonReference.removeAttribute("aria-label");
  elements.lessonReference.hidden = true;
};
