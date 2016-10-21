"use strict";
let readlineSync = require('readline-sync');
class BinaryHeap {
    constructor() {
        this._treeCollection = new Array();
    }
    Push(element) {
        this._treeCollection.push(element);
        this.SortTreeCollection(this._treeCollection.length - 1);
    }
    Pop() {
        let _rtnVal = this._treeCollection[0];
        let _lastElement = this._treeCollection.pop();
        if (this._treeCollection.length > 0) {
            this._treeCollection[0] = _lastElement;
            this.ArrangeAfterDeletion(0);
        }
        return _rtnVal;
    }
    getLength() {
        return (typeof (this._treeCollection) !== 'undefined' && this._treeCollection !== null) ? this._treeCollection.length : 0;
    }
    SortTreeCollection(nodeNumber) {
        let _element = this._treeCollection[nodeNumber];
        while (nodeNumber > 0) {
            let _parentLeaf = Math.floor((nodeNumber + 1) / 2) - 1;
            let _parent = this._treeCollection[_parentLeaf];
            if (_element < _parent)
                break;
            this._treeCollection[_parentLeaf] = _element;
            this._treeCollection[nodeNumber] = _parent;
            nodeNumber = _parentLeaf;
        }
    }
    ArrangeAfterDeletion(nodeNumber) {
        let _length = this.getLength();
        let _element = this._treeCollection[nodeNumber];
        let _bSortingDone = false;
        while (!_bSortingDone) {
            let _rightLeaf = (nodeNumber + 1) * 2;
            let _leftLeaf = _rightLeaf - 1;
            let _swap = -1;
            if (_leftLeaf < _length) {
                let _leftLeafValue = this._treeCollection[_leftLeaf];
                if (_leftLeafValue > _element)
                    _swap = _leftLeaf;
            }
            if (_rightLeaf < _length) {
                let _leftLeafValue = this._treeCollection[_leftLeaf];
                let _rightLeafValue = this._treeCollection[_rightLeaf];
                if (_rightLeafValue > (_swap === -1 ? _element : _leftLeafValue))
                    _swap = _rightLeaf;
            }
            if (_swap === -1)
                _bSortingDone = true;
            else {
                this._treeCollection[nodeNumber] = this._treeCollection[_swap];
                this._treeCollection[_swap] = _element;
                nodeNumber = _swap;
            }
        }
    }
}
exports.BinaryHeap = BinaryHeap;
let _heap = new BinaryHeap();
let _postion = 1;
do {
    let _questionToUser = `can you please enter the number to be entered at ${_postion} ?`;
    let _userResponse = readlineSync.question(_questionToUser, { limit: [/^\d+$/], limitMessage: "Enter numeric value only" });
    if (typeof (_userResponse) !== 'undefined' && _userResponse !== null && _userResponse !== '') {
        _heap.Push(+_userResponse);
    }
    _postion += 1;
} while (_postion <= 10);
while (_heap.getLength() > 0)
    console.log(_heap.Pop().toString());
//# sourceMappingURL=app.js.map