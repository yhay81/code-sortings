/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createArray } from './utils/initialArray'
import { Projector } from './utils/projector'
import { Film } from './utils/film'
import './style.styl'
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import ace from 'ace-builds/src-min-noconflict/ace'
import 'ace-builds/src-min-noconflict/ext-language_tools'

window.onload = (): void => {
  const projector = new Projector()
  // eslint-disable-next-line prefer-const
  let sort: any // sortは事前に一度行う（撮影）

  const countInput = document.getElementById('length') as HTMLInputElement
  const speedInputEl = document.getElementById('speed') as HTMLInputElement

  ace.require('ace/ext/language_tools')
  const editor = ace.edit('editor')
  ace.config.set('basePath', '/ace-builds/src-min-noconflict')
  editor.setOptions({
    highlightActiveLine: true,
    highlightSelectedWord: true,
    showPrintMargin: true,
    fontSize: '14px',
    tabSize: 2,
    theme: 'ace/theme/monokai',
    mode: 'ace/mode/javascript',
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
  })
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
`)

  const reset = (): void => {
    eval(editor.getValue())
    const pattern = (document.querySelector(
      'input[name="array-pattern"]:checked'
    ) as HTMLInputElement).value
    const count = parseInt(countInput.value ? countInput.value : '20')
    if (count > 300) {
      countInput.value == '>300 is not allowed'
      return
    }
    const film = new Film()
    const array = createArray(count, pattern)
    sort(array, film)
    projector.film = film
    projector.show()
  }

  window.addEventListener('keydown', (e: any): void => {
    const [SPACE, LEFT, RIGHT] = [32, 37, 39]
    switch (e.keyCode) {
      case SPACE:
        if (projector.playing) projector.stopPlay()
        else projector.autoPlay(speedInputEl)
        break
      case LEFT:
        projector.back()
        break
      case RIGHT:
        projector.forward()
        break
    }
  })

  const startButton = document.getElementById('start-button')!
  startButton.addEventListener('click', () => {
    projector.autoPlay(speedInputEl)
  })

  const stopButton = document.getElementById('stop-button')!
  stopButton.addEventListener('click', () => {
    projector.stopPlay()
  })

  const backButton = document.getElementById('back-button')!
  backButton.addEventListener('click', () => {
    projector.back()
  })

  const forwardButton = document.getElementById('forward-button')!
  forwardButton.addEventListener('click', () => {
    projector.forward()
  })

  const resetButton = document.getElementById('reset-button')!
  resetButton.addEventListener('click', () => {
    projector.stopPlay()
    if (projector.film) projector.film.reset()
    projector.show()
  })

  const generateButton = document.getElementById('generate-button')!
  generateButton.addEventListener('click', () => {
    projector.stopPlay()
    reset()
  })

  reset()
}
