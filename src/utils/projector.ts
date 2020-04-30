import * as d3 from 'd3'

const sleep = (ms: number): Promise<void> =>
  new Promise((r) => setTimeout(r, ms))

export class Projector {
  film: any
  running: boolean
  stop: boolean

  show(): void {
    const { array, compares, i, j, temp, greens = [] } = this.film.picture
    const stepsNode = document.getElementById('steps')
    stepsNode.innerHTML = `How Many Comparing: ${compares} / ${
      this.film.tape[this.film.length - 1].compares
    }`
    const W = 480
    const H = 200
    const BAR_W = W / (array.length + 1) - 1
    const BAR_H = H / Math.max(...array)
    const arrayPlus = [...array, temp]

    d3.select('#log').select('svg').remove()

    const svg = d3
      .select('#log')
      .append('svg')
      .attr('width', W)
      .attr('height', H)

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
        } else if (greens.includes(i)) {
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
        .attr('font-size', () => BAR_W / 2 + 'px')
        .attr('fill', 'white')
    }
  }

  async autoPlay(speed = 100): Promise<void> {
    if (this.running) return
    this.stop = false
    this.running = true
    for (; !this.film.isEnd && !this.stop; this.film.forward()) {
      this.show()
      await sleep(speed)
    }
    this.stop = true
    this.running = false
  }

  stopPlay(): void {
    this.stop = true
  }

  back(): void {
    if (this.film.isStart) return
    this.film.back()
    this.show()
  }

  forward(): void {
    if (this.film.isEnd) return
    this.film.forward()
    this.show()
  }
}
