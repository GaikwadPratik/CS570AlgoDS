interface Vector<T> extends Iterable<T> {
    get(index: number): T;
    set(index: number, value: T): void;
    length: number;
    push(value: T): number;
    pop(): T;
    insert(index: number, value: T): void;
    next(): IteratorResult<T>;//iterator functionality
    // remember to implement the iterable functionality
}

class FakeVector<T> implements Vector<T>{

    //private inbuilt array on which wrapper is to be built
    private _objArray: Array<T> = null;
    //pointer to be used in next function
    private _nextPointer: number = 0;
    private _previostPointer: number = this.getLength();

    //Constructor of the class
    constructor() {
        this._objArray = new Array<T>();
    }

    public hasPrevious(): boolean {
        let _bRtnVal = false;
        try {
            _bRtnVal = this._previostPointer > 0;
        }
        catch (exception) {
            console.error(exception);
        }
        return _bRtnVal;
    }

    //Function to impletment iterator.
    public preivous(): IteratorResult<T> {

        try {
            if (this._previostPointer > 0) {//check if the pointer is with in the range of the internal array.
                return {
                    done: false,
                    value: this._objArray[this._previostPointer--]
                }
            } else {//check if the pointer is at last object then stop iteration.
                return {
                    done: true
                }
            }
        }
        catch (exception) {
            console.error(exception);
        }
    }

    public hasNext(): boolean {
        let _bRtnVal = false;
        try {
            _bRtnVal = this._nextPointer < this._objArray.length;
        }
        catch (exception) {
            console.error(exception);
        }
        return _bRtnVal;
    }

    //Function to impletment iterator.
    public next(): IteratorResult<T> {

        try {
            if (this._nextPointer < this._objArray.length) {//check if the pointer is with in the range of the internal array.
                return {
                    done: false,
                    value: this._objArray[this._nextPointer++]
                }
            } else {//check if the pointer is at last object then stop iteration.
                return {
                    done: true
                }
            }
        }
        catch (exception) {
            console.error(exception);
        }
    }

    [Symbol.iterator]() {
        return this;
    }

    //function to get an element at a particular index
    public get(index: number): T {
        let rtnVal: T = this._objArray[index];
        return rtnVal;
    }

    //function to modify an element at a particular index
    public set(index: number, value: T): void {
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

    //Length of the inbuilt array. returns -1 incase array is not initialized
    length: number = (typeof (this._objArray) !== 'undefined' && this._objArray !== null) ? this._objArray.length : -1;

    public getLength(): number {
        let _rtnVal: number = -1;
        try {
            _rtnVal = (typeof (this._objArray) !== 'undefined' && this._objArray !== null) ? this._objArray.length : -1;
        }
        catch (exception) {
            console.error(exception);
        }
        return _rtnVal;
    }

    //function to insert an element in the array
    public push(value: T): number {
        let _newLen: number = -1;
        try {
            _newLen = this._objArray.push(value);
        }
        catch (exception) {
            console.error(exception);
        }
        return _newLen;
    }

    //function to return the last element of the array
    public pop(): T {
        let _rtnVal: T = null;
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

    //function to insert an element at a particular index
    public insert(index: number, value: T): void {
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

    //with inbuilt next function
    //[Symbol.iterator]() {
    //    let pointer = 0;
    //    let _tempArray = this._objArray;

    //    return {
    //        next(): IteratorResult<T> {
    //            if (pointer < _tempArray.length) {
    //                return {
    //                    done: false,
    //                    value: _tempArray[pointer++]
    //                }
    //            } else {
    //                return {
    //                    done: true
    //                }
    //            }
    //        }
    //    }
    //}
}

//Testing
let _fakeVector: FakeVector<string> = new FakeVector<string>();
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
