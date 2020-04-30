export class Film {
  private tape: any[]
  private current: number

  constructor() {
    this.tape = []
    this.current = 0
  }

  public rec({ array, i, j, temp, compares }): void {
    const l = this.tape[-1] || { i: 0, j: 0, temp: 0, compares: 0 }
    this.tape.push({
      array: [...array],
      i: i ?? l.j,
      j: j ?? l.j,
      temp: temp ?? l.temp,
      compares: compares ?? l.compares,
    })
  }

  public get picture(): any {
    return this.tape[this.current]
  }

  public get length(): number {
    return this.tape.length
  }

  public back(): void {
    if (!this.isStart) this.current--
  }

  public forward(): void {
    if (!this.isEnd) this.current++
  }

  public reset(): void {
    this.current = 0
  }

  public get isEnd(): boolean {
    return this.current === this.length
  }
  public get isStart(): boolean {
    return this.current === 0
  }
}
