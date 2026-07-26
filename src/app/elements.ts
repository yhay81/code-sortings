const requiredElement = <T extends Element>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Required app element is missing: ${selector}`);
  return element;
};

export interface AppElements {
  activeLine: HTMLDivElement;
  backButton: HTMLButtonElement;
  complexityAverage: HTMLElement;
  complexityBest: HTMLElement;
  complexityWorst: HTMLElement;
  countInput: HTMLInputElement;
  editor: HTMLDivElement;
  exampleSelect: HTMLSelectElement;
  forwardButton: HTMLButtonElement;
  framePosition: HTMLElement;
  generateButton: HTMLButtonElement;
  lessonFocus: HTMLElement;
  lessonReference: HTMLAnchorElement;
  lessonReferenceLabel: HTMLSpanElement;
  lessonSummary: HTMLElement;
  lessonTitle: HTMLElement;
  lessonTrait: HTMLElement;
  lineNumbers: HTMLDivElement;
  localeSelect: HTMLSelectElement;
  log: HTMLDivElement;
  newSortButton: HTMLButtonElement;
  operationDetail: HTMLElement;
  operationKind: HTMLElement;
  operationTitle: HTMLElement;
  patternHint: HTMLParagraphElement;
  patternSelect: HTMLSelectElement;
  playIcon: HTMLElement;
  playLabel: HTMLElement;
  resetButton: HTMLButtonElement;
  sourcePosition: HTMLElement;
  speedSelect: HTMLSelectElement;
  startButton: HTMLButtonElement;
  status: HTMLDivElement;
  steps: HTMLElement;
  timelinePosition: HTMLElement;
  timelineRange: HTMLInputElement;
}

export const bindAppElements = (): AppElements => ({
  activeLine: requiredElement("#editor-active-line"),
  backButton: requiredElement("#back-button"),
  complexityAverage: requiredElement("#complexity-average"),
  complexityBest: requiredElement("#complexity-best"),
  complexityWorst: requiredElement("#complexity-worst"),
  countInput: requiredElement("#length"),
  editor: requiredElement("#editor-code"),
  exampleSelect: requiredElement("#example-select"),
  forwardButton: requiredElement("#forward-button"),
  framePosition: requiredElement("#frame-position"),
  generateButton: requiredElement("#generate-button"),
  lessonFocus: requiredElement("#lesson-focus"),
  lessonReference: requiredElement("#lesson-reference"),
  lessonReferenceLabel: requiredElement("#lesson-reference-label"),
  lessonSummary: requiredElement("#lesson-summary"),
  lessonTitle: requiredElement("#lesson-title"),
  lessonTrait: requiredElement("#lesson-trait"),
  lineNumbers: requiredElement("#editor-lines"),
  localeSelect: requiredElement("#locale-select"),
  log: requiredElement("#log"),
  newSortButton: requiredElement("#new-sort-button"),
  operationDetail: requiredElement("#operation-detail"),
  operationKind: requiredElement("#operation-kind"),
  operationTitle: requiredElement("#operation-explanation"),
  patternHint: requiredElement("#pattern-hint"),
  patternSelect: requiredElement("#pattern-select"),
  playIcon: requiredElement("#play-icon"),
  playLabel: requiredElement("#play-label"),
  resetButton: requiredElement("#reset-button"),
  sourcePosition: requiredElement("#editor-source-position"),
  speedSelect: requiredElement("#speed"),
  startButton: requiredElement("#start-button"),
  status: requiredElement("#error-log"),
  steps: requiredElement("#steps"),
  timelinePosition: requiredElement("#timeline-position"),
  timelineRange: requiredElement("#timeline-range"),
});
