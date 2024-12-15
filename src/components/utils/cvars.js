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

  setValue(value) {
    if (value >= this.#min && value <= this.#max) {
      this.#currentValue = value;
    } else {
      throw new Error(
        `Value ${value} is out of bounds [${this.#min}, ${this.#max}]`
      );
    }
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
    if (this.#step <= 0) {
      throw new Error('step must be a positive number');
    }
  }
}

export class CvarLinWrap {
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
    this.#currentValue = this.#wrapValue(initial);
  }

  #wrapValue(value) {
    const range = this.#max - this.#min;
    while (value < this.#min) {
      value += range;
    }
    while (value > this.#max) {
      value -= range;
    }
    return value;
  }

  inc() {
    this.#currentValue = this.#wrapValue(this.#currentValue + this.#step);
  }

  dec() {
    this.#currentValue = this.#wrapValue(this.#currentValue - this.#step);
  }

  value() {
    return this.#currentValue;
  }

  setValue(value) {
    this.#currentValue = this.#wrapValue(value);
  }

  name() {
    return this.#name;
  }

  check() {
    if (this.#min >= this.#max) {
      throw new Error('min must be less than max');
    }
    if (this.#step <= 0) {
      throw new Error('step must be a positive number');
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

  setValue(value) {
    if (value < this.#min || value > this.#max) {
      throw new Error('value must be between min and max');
    }
    this.#currentValue = value;
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
