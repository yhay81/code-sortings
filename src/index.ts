import { createArray } from "./utils/initialArray";
import { Projector } from "./utils/projector";
import { Film } from "./utils/film";
import "./style.styl";
import ace from "brace";
import "brace/mode/javascript";
import "brace/theme/monokai";
import "brace/ext/language_tools";

window.addEventListener("load", () => {
  const projector = new Projector();
  let sort: (array: number[], film: Film) => void; // sortは事前に一度行う（撮影）

  const countInput = document.querySelector<HTMLInputElement>("#length")!;
  const speedInputElement = document.querySelector<HTMLInputElement>("#speed")!;

  ace.acequire("ace/ext/language_tools");
  const editor = ace.edit("editor");
  editor.$blockScrolling = Infinity;
  editor.setOptions({
    highlightActiveLine: true,
    highlightSelectedWord: true,
    showPrintMargin: true,
    fontSize: "14px",
    tabSize: 2,
    theme: "ace/theme/monokai",
    mode: "ace/mode/javascript",
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
  });
  editor.session.setValue(`sort = (array, film) => {
  let compares = 0
  for (let i = 0; i < array.length; i++) {
    const temp = array[i]
    let j
    for (j = i; j >= 1; j -= 1) {
      film.rec({ array, i, j, temp, compares })
      compares++
      if (array[j - 1] > temp) {
        array[j] = array[j - 1]
        film.rec({ array, i, j, temp, compares })
      } else {
        break;
      }
    }
    array[j] = temp
    film.rec({ array, i, j, temp, compares })
  }
}
`);

  const reset = (): void => {
    eval(editor.getValue());
    const pattern = document.querySelector<HTMLInputElement>(
      'input[name="array-pattern"]:checked'
    )!.value;
    const count = Number.parseInt(countInput.value ? countInput.value : "20");
    if (count > 300) {
      countInput.value = ">300 is not allowed";
      return;
    }
    const film = new Film();
    const array = createArray(count, pattern);
    sort(array, film);
    projector.film = film;
    projector.show();
  };

  window.addEventListener("keydown", (event): void => {
    const [SPACE, LEFT, RIGHT] = [" ", "ArrowLeft", "ArrowRight"];
    switch (event.key) {
      case SPACE:
        if (projector.playing) projector.stopPlay();
        else void projector.autoPlay(speedInputElement);
        break;
      case LEFT:
        projector.back();
        break;
      case RIGHT:
        projector.forward();
        break;
    }
  });

  const startButton = document.querySelector("#start-button")!;
  startButton.addEventListener("click", () => {
    void projector.autoPlay(speedInputElement);
  });

  const stopButton = document.querySelector("#stop-button")!;
  stopButton.addEventListener("click", () => {
    projector.stopPlay();
  });

  const backButton = document.querySelector("#back-button")!;
  backButton.addEventListener("click", () => {
    projector.back();
  });

  const forwardButton = document.querySelector("#forward-button")!;
  forwardButton.addEventListener("click", () => {
    projector.forward();
  });

  const resetButton = document.querySelector("#reset-button")!;
  resetButton.addEventListener("click", () => {
    projector.stopPlay();
    if (projector.film) projector.film.reset();
    projector.show();
  });

  const generateButton = document.querySelector("#generate-button")!;
  generateButton.addEventListener("click", () => {
    projector.stopPlay();
    reset();
  });

  reset();
});
