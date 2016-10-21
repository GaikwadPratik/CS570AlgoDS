// Original JavaScript Code from  Marijn Haverbeke (http://eloquentjavascript.net/1st_edition/appendix2.html)

let readlineSync = require('readline-sync');

export class BinaryHeap<T> {

    private _treeCollection: Array<T>;

    constructor() {
        this._treeCollection = new Array<T>();
    }

    public Push(element: T): void {
        this._treeCollection.push(element);
        this.SortTreeCollection(this._treeCollection.length - 1);
    }

    public Pop(): T {

        let _rtnVal: T = this._treeCollection[0];
        let _lastElement: T = this._treeCollection.pop();

        if (this._treeCollection.length > 0) {
            this._treeCollection[0] = _lastElement;
            this.ArrangeAfterDeletion(0);
        }

        return _rtnVal;
    }

    public getLength(): number {
        return (typeof (this._treeCollection) !== 'undefined' && this._treeCollection !== null) ? this._treeCollection.length : 0;
    }

    private SortTreeCollection(nodeNumber: number): void {

        // Fetch the element that has to be moved.
        let _element: T = this._treeCollection[nodeNumber];

        // When at 0, an element can not go up any further.
        while (nodeNumber > 0) {
            // Compute the parent element's index, and fetch it.
            let _parentLeaf: number = Math.floor((nodeNumber + 1) / 2) - 1;//since JS array starts from 0
            let _parent: T = this._treeCollection[_parentLeaf];

            // If the parent has a lesser score, things are in order and we are done.
            if (_element < _parent)
                break;

            // Otherwise, swap the parent with the current element and continue.
            this._treeCollection[_parentLeaf] = _element;
            this._treeCollection[nodeNumber] = _parent;
            nodeNumber = _parentLeaf;
        }
    }


    //this function puts and element at the root position and then pushes it down to appropriate position
    private ArrangeAfterDeletion(nodeNumber: number) {

        let _length: number = this.getLength();
        // Look up the target leaf's value.
        let _element: T = this._treeCollection[nodeNumber];

        let _bSortingDone: boolean = false;

        while (!_bSortingDone) {
            // Compute the indices of the left and right leafs.
            let _rightLeaf: number = (nodeNumber + 1) * 2;
            let _leftLeaf: number = _rightLeaf - 1;

            // hold new position of the leaf in case exchange is needed.
            let _swap: number = -1;

            // If the left leaf exists is inside the array...
            if (_leftLeaf < _length) {

                let _leftLeafValue: T = this._treeCollection[_leftLeaf];

                // If the value is less than current leaf, we need to swap.
                if (_leftLeafValue > _element)
                    _swap = _leftLeaf;
            }

            // right leaf inside array.
            if (_rightLeaf < _length) {
                let _leftLeafValue: T = this._treeCollection[_leftLeaf];
                let _rightLeafValue: T = this._treeCollection[_rightLeaf];

                if (_rightLeafValue > (_swap === -1 ? _element : _leftLeafValue))
                    _swap = _rightLeaf;
            }

            // No need to swap further, we are done.
            if (_swap === -1)
                _bSortingDone = true;
            else {
                // Otherwise, swap and continue.
                this._treeCollection[nodeNumber] = this._treeCollection[_swap];
                this._treeCollection[_swap] = _element;
                nodeNumber = _swap;
            }
        }
    }
}

let _heap = new BinaryHeap<number>();
//let _numberArr = [10, 3, 4, 8, 9, 7, 1, 2, 6, 5];
//for (let _tempNum of _numberArr)
//    _heap.Push(_tempNum);

let _postion: number = 1;


do {
    let _questionToUser: string = `can you please enter the number to be entered at ${_postion} ?`;
    let _userResponse: string = readlineSync.question(_questionToUser, { limit: [/^\d+$/], limitMessage: "Enter numeric value only" });
    if (typeof (_userResponse) !== 'undefined' && _userResponse !== null && _userResponse !== '') {
        _heap.Push(+_userResponse);
    }
    _postion += 1;
} while (_postion <= 10);

while (_heap.getLength() > 0)
    console.log(_heap.Pop().toString());


