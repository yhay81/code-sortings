import { CodeJar } from "codejar";
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
import { t } from "../i18n";

hljs.registerLanguage("python", python);

export const DEFAULT_SOURCE = `def sort(array):
    for i in range(1, len(array)):
        temp = array[i]
        j = i
        while j >= 1 and array[j - 1] > temp:
            array[j] = array[j - 1]
            j -= 1
        array[j] = temp
`;

export const CUSTOM_STARTER = `def sort(array):
    pass
`;

export class SortingCodeEditor {
  private readonly editor: HTMLDivElement;

  private readonly lineNumbers: HTMLDivElement;

  private readonly activeLine: HTMLDivElement;

  private readonly jar: ReturnType<typeof CodeJar>;

  public constructor(
    editor: HTMLDivElement,
    lineNumbers: HTMLDivElement,
    activeLine: HTMLDivElement,
  ) {
    this.editor = editor;
    this.lineNumbers = lineNumbers;
    this.activeLine = activeLine;
    this.updateAccessibility();
    this.jar = CodeJar(editor, (element) => this.highlight(element), {
      tab: "    ",
    });
    this.editor.addEventListener("scroll", () => {
      this.lineNumbers.scrollTop = this.editor.scrollTop;
      this.activeLine.style.setProperty(
        "--editor-scroll",
        `${this.editor.scrollTop}px`,
      );
    });
  }

  public get code(): string {
    return this.jar.toString();
  }

  public focus(): void {
    this.editor.focus();
  }

  public resetScroll(): void {
    this.editor.scrollTop = 0;
    this.lineNumbers.scrollTop = 0;
  }

  public setCode(code: string): void {
    this.jar.updateCode(code);
    this.updateLineNumbers(code);
    this.resetScroll();
  }

  public updateAccessibility(): void {
    this.editor.setAttribute("role", "textbox");
    this.editor.setAttribute("aria-multiline", "true");
    this.editor.setAttribute("aria-label", t("editor.label"));
    this.editor.setAttribute("spellcheck", "false");
  }

  private highlight(element: HTMLElement): void {
    const code = element.textContent ?? "";
    element.innerHTML = code.length
      ? hljs.highlight(code, { language: "python" }).value
      : "";
    this.updateLineNumbers(code);
  }

  private updateLineNumbers(code: string): void {
    const lines = code.split("\n").length;
    this.lineNumbers.textContent = Array.from(
      { length: lines },
      (_, index) => index + 1,
    ).join("\n");
  }
}
