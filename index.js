class SizedArray {
  constructor({ array, size }) {

    if (array) {
      this.buffer = new Uint8Array(array)
      this.length = size
    }
    else {
      this.buffer = new Uint8Array(size)
      this.length = 0
    }
  }

  addData(arr) {
    
    const spaceRemaining = this.buffer.length - this.length

    if (spaceRemaining > 0) {
      const copySize = arr.length <= spaceRemaining ? arr.length : spaceRemaining
      const subdata = new Uint8Array(arr.buffer.buffer, 0, copySize)
      this.buffer.set(subdata, this.length)
      this.length += copySize
      const newData = new Uint8Array(arr.buffer.buffer, copySize)
      const newArr = new SizedArray({ array: newData, size: arr.length - copySize })
      return newArr
    }
    else {
      return arr
    }
  }
}


class Queue {
  constructor({ elementSize, maxElements }) {
    this._elements = []
    this._elementSize = elementSize
    this._currElementLength = 0
    this._maxElements = maxElements
    this._remainder = new Uint8Array(elementSize)
  }

  full() {
    return this._elements.length >= this._maxElements
  }

  enqueue(data) {

    let arr = new SizedArray({ array: data, size: data.length })

    if (!this.full()) {

      let lastElement = this._elements[this._elements.length - 1]

      if (!lastElement) {
        lastElement = new SizedArray({ size: this._elementSize })
      }

      arr = lastElement.addData(arr)

      while (arr.length > 0) {
        const newElement = new SizedArray({ size: this._elementSize })
        this._elements.push(newElement)

        arr = newElement.addData(arr)
      }

      return this.full()
    }
    else {
      throw "Attempt to enqueue full queue"
    }
  }

  dequeue() {
    const elem = this._elements.shift()
    return elem
  }

  writeDataToElement(data, element) {
  }
}
