import { select } from 'd3-selection'
import { Film } from './film'

const sleep = (ms: number): Promise<void> =>
  new Promise((r) => setTimeout(r, ms))

export class Projector {
  public film: Film | null
  public playing: boolean

  constructor() {
    this.film = null
    this.playing = false
  }

  show(): void {
    if (this.film === null) return
    const { array, compares, i, j, temp, greens = [] } = this.film.picture
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const stepsNode = document.querySelector('#steps')!
    stepsNode.innerHTML = `${compares} / ${this.film.totalCompares}`
    const W = 480
    const H = 200
    const BAR_W = W / (array.length + 1) - 1
    const BAR_H = H / Math.max(...array)
    const arrayPlus = [...array, temp]

    select('#log').select('svg').remove()
    const svg = select('#log').append('svg').attr('width', W).attr('height', H)
    svg
      .selectAll('rect')
      .data(arrayPlus)
      .enter()
      .append('rect')
      .attr('x', (_, n: number) => n * (BAR_W + 1))
      .attr('y', (d: number) => H - d * BAR_H)
      .attr('width', BAR_W)
      .attr('height', (d: number) => d * BAR_H)
      .attr('fill', (_, n) => {
        if (n === arrayPlus.length - 1) {
          return 'DarkRed'
        } else if (n == j) {
          return 'red'
        } else if (n == i) {
          return 'green'
        } else if (greens.includes(n)) {
          return 'OliveDrab'
        } else {
          return 'turquoise'
        }
      })

    if (arrayPlus.length < 30) {
      svg
        .selectAll('text')
        .data(arrayPlus)
        .enter()
        .append('text')
        .text((d: number) => d)
        .attr('text-anchor', 'middle')
        .attr('x', (_, n) => n * (BAR_W + 1) + BAR_W / 2)
        .attr('y', (d: number) => H - d * BAR_H + BAR_W / 1.5)
        .attr('font-size', () => (BAR_W / 2).toString() + 'px')
        .attr('fill', 'white')
    }
  }

  async autoPlay(speedInputElement: HTMLInputElement): Promise<void> {
    if (this.film === null || this.playing) return
    this.playing = true
    for (; !this.film.isEnd && this.playing; this.film.forward()) {
      this.show()
      await sleep(
        2000 / Math.sqrt(Number.parseInt(speedInputElement.value) || 1)
      )
    }
    this.playing = false
  }

  stopPlay(): void {
    this.playing = false
  }

  back(): void {
    if (this.film === null || this.film.isStart) return
    this.film.back()
    this.show()
  }

  forward(): void {
    if (this.film === null || this.film.isEnd) return
    this.film.forward()
    this.show()
  }
}
