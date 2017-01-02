class FakeVector {
    constructor() {
        this._objArray = null;
        this._nextPointer = 0;
        this._previostPointer = this.getLength();
        this.length = (typeof (this._objArray) !== 'undefined' && this._objArray !== null) ? this._objArray.length : -1;
        this._objArray = new Array();
    }
    hasPrevious() {
        let _bRtnVal = false;
        try {
            _bRtnVal = this._previostPointer > 0;
        }
        catch (exception) {
            console.error(exception);
        }
        return _bRtnVal;
    }
    preivous() {
        try {
            if (this._previostPointer > 0) {
                return {
                    done: false,
                    value: this._objArray[this._previostPointer--]
                };
            }
            else {
                return {
                    done: true
                };
            }
        }
        catch (exception) {
            console.error(exception);
        }
    }
    hasNext() {
        let _bRtnVal = false;
        try {
            _bRtnVal = this._nextPointer < this._objArray.length;
        }
        catch (exception) {
            console.error(exception);
        }
        return _bRtnVal;
    }
    next() {
        try {
            if (this._nextPointer < this._objArray.length) {
                return {
                    done: false,
                    value: this._objArray[this._nextPointer++]
                };
            }
            else {
                return {
                    done: true
                };
            }
        }
        catch (exception) {
            console.error(exception);
        }
    }
    [Symbol.iterator]() {
        return this;
    }
    get(index) {
        let rtnVal = this._objArray[index];
        return rtnVal;
    }
    set(index, value) {
        try {
            if (typeof (this._objArray) !== 'undefined' && this._objArray !== null && this._objArray.length !== -1) {
                if (index <= (this._objArray.length - 1)) {
                    this._objArray[index] = value;
                }
                else
                    throw new RangeError(`Given index ${index} is outside bounds of current array`);
            }
            else {
                console.warn('The array object is empty.');
            }
        }
        catch (exception) {
            console.error(exception);
        }
    }
    getLength() {
        let _rtnVal = -1;
        try {
            _rtnVal = (typeof (this._objArray) !== 'undefined' && this._objArray !== null) ? this._objArray.length : -1;
        }
        catch (exception) {
            console.error(exception);
        }
        return _rtnVal;
    }
    push(value) {
        let _newLen = -1;
        try {
            _newLen = this._objArray.push(value);
        }
        catch (exception) {
            console.error(exception);
        }
        return _newLen;
    }
    pop() {
        let _rtnVal = null;
        try {
            if (typeof (this._objArray) !== 'undefined' && this._objArray !== null && this._objArray.length !== -1) {
                _rtnVal = this._objArray[this._objArray.length - 1];
            }
        }
        catch (exception) {
            console.error(exception);
        }
        return _rtnVal;
    }
    insert(index, value) {
        try {
            if (typeof (this._objArray) !== 'undefined' && this._objArray !== null && this._objArray.length !== -1) {
                if (index <= (this._objArray.length - 1))
                    this._objArray.splice(index, 0, value);
                else
                    throw new RangeError(`Given index ${index} is outside bounds of current array`);
            }
            else {
                console.warn('The array object is empty.');
            }
        }
        catch (exception) {
            console.error(exception);
        }
    }
}
let _fakeVector = new FakeVector();
console.log(`Initial length of the array is ${_fakeVector.getLength()}`);
console.log('Inserting elements by using "push"');
console.log(`New Array length after insertion ${_fakeVector.push("a")}`);
console.log(`New Array length after insertion ${_fakeVector.push('c')}`);
console.log(`New Array length after insertion ${_fakeVector.push('d')}`);
console.log(`New Array length after insertion ${_fakeVector.push('e')}`);
console.log('Getting last elements by using "poping"');
console.log(`last element in the array is "${_fakeVector.pop()}"`);
console.log('Inserting an element at position 2');
_fakeVector.insert(1, 'b');
console.log(`New length of the array is ${_fakeVector.getLength()}`);
console.log(`Element at 2 is ${_fakeVector.get(2)}`);
console.log(`Setting the element at 4`);
_fakeVector.set(4, 'f');
console.log('printing array using forward iterator');
while (_fakeVector.hasNext())
    console.log(`${_fakeVector.next().value}`);
console.log('printing array using reverse iterator');
while (_fakeVector.hasPrevious())
    console.log(`${_fakeVector.preivous().value}`);
//# sourceMappingURL=app.js.map