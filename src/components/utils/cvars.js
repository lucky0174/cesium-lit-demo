/**
 * CvarLin - Represents a linear control variable.
 * This class manages a value that can be incremented or decremented linearly within a specified range.
 */
export class CvarLin {
  #min;
  #max;
  #step;
  #name;
  #currentValue;

  /**
   * @param {number} min - The minimum allowed value
   * @param {number} max - The maximum allowed value
   * @param {number} initial - The initial value
   * @param {number} step - The increment/decrement step
   * @param {string} name - The name of the variable
   */
  constructor(min, max, initial, step, name) {
    this.#min = min;
    this.#max = max;
    this.#step = step;
    this.#name = name;
    this.#currentValue = initial;
  }

  /** Increment the current value by the step amount, if within bounds */
  inc() {
    if (this.#currentValue + this.#step <= this.#max) {
      this.#currentValue += this.#step;
    }
  }

  /** Decrement the current value by the step amount, if within bounds */
  dec() {
    if (this.#currentValue - this.#step >= this.#min) {
      this.#currentValue -= this.#step;
    }
  }

  /** @returns {number} The current value */
  value() {
    return this.#currentValue;
  }

  /**
   * Set the current value
   * @param {number} value - The new value to set
   * @throws {Error} If the value is out of bounds
   */
  setValue(value) {
    if (value >= this.#min && value <= this.#max) {
      this.#currentValue = value;
    } else {
      throw new Error(
        `Value ${value} is out of bounds [${this.#min}, ${this.#max}]`
      );
    }
  }

  /** @returns {string} The name of the variable */
  name() {
    return this.#name;
  }

  /** Validate the initial state of the variable */
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

/**
 * CvarLinWrap - Represents a linear control variable with wrapping behavior.
 * This class manages a value that can be incremented or decremented linearly,
 * wrapping around to the other end of the range when boundaries are exceeded.
 */
export class CvarLinWrap {
  #min;
  #max;
  #step;
  #name;
  #currentValue;

  /**
   * @param {number} min - The minimum allowed value
   * @param {number} max - The maximum allowed value
   * @param {number} initial - The initial value
   * @param {number} step - The increment/decrement step
   * @param {string} name - The name of the variable
   */
  constructor(min, max, initial, step, name) {
    this.#min = min;
    this.#max = max;
    this.#step = step;
    this.#name = name;
    this.#currentValue = this.#wrapValue(initial);
  }

  /**
   * Wrap the value within the specified range
   * @param {number} value - The value to wrap
   * @returns {number} The wrapped value
   */
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

  /** Increment the current value by the step amount, wrapping if necessary */
  inc() {
    this.#currentValue = this.#wrapValue(this.#currentValue + this.#step);
  }

  /** Decrement the current value by the step amount, wrapping if necessary */
  dec() {
    this.#currentValue = this.#wrapValue(this.#currentValue - this.#step);
  }

  /** @returns {number} The current value */
  value() {
    return this.#currentValue;
  }

  /**
   * Set the current value, wrapping if necessary
   * @param {number} value - The new value to set
   */
  setValue(value) {
    this.#currentValue = this.#wrapValue(value);
  }

  /** @returns {string} The name of the variable */
  name() {
    return this.#name;
  }

  /** Validate the initial state of the variable */
  check() {
    if (this.#min >= this.#max) {
      throw new Error('min must be less than max');
    }
    if (this.#step <= 0) {
      throw new Error('step must be a positive number');
    }
  }
}

/**
 * CvarLog - Represents a logarithmic control variable.
 * This class manages a value that can be incremented or decremented logarithmically within a specified range.
 */
export class CvarLog {
  #min;
  #max;
  #factor;
  #name;
  #currentValue;

  /**
   * @param {number} min - The minimum allowed value
   * @param {number} max - The maximum allowed value
   * @param {number} initial - The initial value
   * @param {number} factor - The multiplication/division factor
   * @param {string} name - The name of the variable
   */
  constructor(min, max, initial, factor, name) {
    this.#min = min;
    this.#max = max;
    this.#factor = factor;
    this.#name = name;
    this.#currentValue = initial;
  }

  /** Increment the current value by multiplying with the factor, if within bounds */
  inc() {
    if (this.#currentValue * this.#factor <= this.#max) {
      this.#currentValue *= this.#factor;
    }
  }

  /** Decrement the current value by dividing with the factor, if within bounds */
  dec() {
    if (this.#currentValue / this.#factor >= this.#min) {
      this.#currentValue /= this.#factor;
    }
  }

  /** @returns {number} The current value */
  value() {
    return this.#currentValue;
  }

  /**
   * Set the current value
   * @param {number} value - The new value to set
   * @throws {Error} If the value is out of bounds
   */
  setValue(value) {
    if (value < this.#min || value > this.#max) {
      throw new Error('value must be between min and max');
    }
    this.#currentValue = value;
  }

  /** @returns {string} The name of the variable */
  name() {
    return this.#name;
  }

  /** Validate the initial state of the variable */
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
