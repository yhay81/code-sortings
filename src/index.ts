import insertionSort from './sortings/insertionSort'
import { createArray } from './utils/initialArray'
import { Projector } from './utils/projector'
import { Film } from './utils/film'
import './style.styl'
import ace from 'ace-builds/src-min-noconflict/ace'

const projector = new Projector()
// eslint-disable-next-line prefer-const
let sort: any = insertionSort // sortは事前に一度行う（撮影）
const countInput = document.getElementById('length') as HTMLInputElement
const editor = ace.edit('editor')

const reset = (): void => {
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
reset()

const DOWN = 38
const UP = 40
window.addEventListener('keydown', (e: any): void => {
  switch (e.keyCode) {
    case DOWN:
      projector.back()
      break
    case UP:
      projector.forward()
      break
  }
})

const startButton = document.getElementById('start-button')
const speed = document.getElementById('speed') as HTMLInputElement
startButton.addEventListener('click', () => {
  projector.autoPlay(parseInt(speed.value))
})

const stopButton = document.getElementById('stop-button')
stopButton.addEventListener('click', () => {
  projector.stopPlay()
})

const backButton = document.getElementById('back-button')
backButton.addEventListener('click', () => {
  projector.back()
})

const forwardButton = document.getElementById('forward-button')
forwardButton.addEventListener('click', () => {
  projector.forward()
})

const resetButton = document.getElementById('reset-button')
resetButton.addEventListener('click', () => {
  projector.stopPlay()
  projector.film.reset()
  projector.show()
})

const generateButton = document.getElementById('generate-button')
generateButton.addEventListener('click', () => {
  projector.stopPlay()
  eval(editor.getValue())
  reset()
})

ace.config.set('basePath', '/ace-builds/src-min-noconflict')
editor.setOptions({
  highlightActiveLine: true,
  highlightSelectedWord: true,
  hScrollBarAlwaysVisible: true,
  showPrintMargin: true,
  fontSize: '14px',
  theme: 'ace/theme/monokai',
  mode: 'ace/mode/javascript',
})
editor.session.setValue(`sort = (array, film) => {
  let compares = 0
  for (let i = 0; i < array.length; i++) {
    const temp = array[i]
    let j
    for (j = i; j >= 1; j -= 1) {
      film.rec({ array, compares, i, j, temp })
      compares++
      if (array[j - 1] > temp) {
        array[j] = array[j - 1]
        film.rec({ array, compares, i, j, temp })
      } else {
        break
      }
    }
    array[j] = temp
    film.rec({ array, compares, i, j, temp })
  }
}

`)
