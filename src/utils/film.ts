interface Picture {
  array: number[];
  i?: number;
  j?: number;
  temp?: number;
  compares?: number;
  greens?: number[];
}

interface Tape {
  array: number[];
  i: number;
  j: number;
  temp: number;
  compares: number;
  greens: number[];
}

export class Film {
  private readonly tape: Tape[];

  private current: number;

  constructor() {
    this.tape = [];
    this.current = 0;
  }

  public rec({ array, i, j, temp, compares, greens }: Picture): void {
    const last: Tape = this.tape[this.tape.length - 1] ?? {
      array: [],
      i: 0,
      j: 0,
      temp: 0,
      compares: 0,
      greens: [],
    };
    this.tape.push({
      array: [...array],
      i: i ?? last.i,
      j: j ?? last.j,
      temp: temp ?? last.temp,
      compares: compares ?? last.compares,
      greens: [...(greens ?? last.greens)],
    });
  }

  public get picture(): Tape {
    return this.tape[this.current];
  }

  public get length(): number {
    return this.tape.length;
  }

  public back(): void {
    if (!this.isStart) this.current--;
  }

  public forward(): void {
    if (!this.isEnd) this.current++;
  }

  public reset(): void {
    this.current = 0;
  }

  public get isEnd(): boolean {
    return this.length === 0 ? true : this.current >= this.length - 1;
  }

  public get isStart(): boolean {
    return this.current === 0;
  }

  public get totalCompares(): number {
    if (this.length === 0) return 0;
    return this.tape[this.length - 1].compares;
  }
}
