export class CvarLin {
    #min;
    #max;
    #step;
    #name;
    #currentValue;

    constructor(min, max, initial, step, name) {
        this.#min = min;
        this.#max = max;
        this.#step = step;
        this.#name = name;
        this.#currentValue = initial;
    }

    inc() {
        if (this.#currentValue + this.#step <= this.#max) {
            this.#currentValue += this.#step;
        }
    }

    dec() {
        if (this.#currentValue - this.#step >= this.#min) {
            this.#currentValue -= this.#step;
        }
    }

    value() {
        return this.#currentValue;
    }

    name() {
        return this.#name;
    }

    check() {
        if (this.#min > this.#max) {
            throw new Error("min cannot be greater than max");
        }
        if (this.#currentValue < this.#min || this.#currentValue > this.#max) {
          throw new Error('initial value must be between min and max');
        }
        if (this.#step <= 0) {
            throw new Error("step must be a positive number");
        }
    }
}

export class CvarLog {
  #min;
  #max;
  #factor;
  #name;
  #currentValue;

  constructor(min, max, initial, factor, name) {
    this.#min = min;
    this.#max = max;
    this.#factor = factor;
    this.#name = name;
    this.#currentValue = initial;
  }

  inc() {
    if (this.#currentValue * this.#factor <= this.#max) {
      this.#currentValue *= this.#factor;
    }
  }

  dec() {
    if (this.#currentValue / this.#factor >= this.#min) {
      this.#currentValue /= this.#factor;
    }
  }

  value() {
    return this.#currentValue;
  }

  name() {
    return this.#name;
  }

  check() {
    if (this.#min > this.#max) {
      throw new Error('min cannot be greater than max');
    }
    if (this.#currentValue < this.#min || this.#currentValue > this.#max) {
      throw new Error('initial value must be between min and max');
    }
    if (this.#factor <= 1) {
      throw new Error('factor must be greater than 1');
    }
  }
}
