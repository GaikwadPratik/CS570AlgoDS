//Enum for direction to run in current pass
var Direction;
(function (Direction) {
    Direction[Direction["forward"] = 0] = "forward";
    Direction[Direction["reverse"] = 1] = "reverse";
})(Direction || (Direction = {}));
class BubblySort {
    static bouncingSort(arr) {
        //Temporary variable for sorting.
        let _temp = null;
        //for switching between the direction of swapping
        let _direction = Direction.forward;
        //To check if any changes are necessary.
        let _changes = false;
        //To reduce the iterations over the array as it goes sorting. Due to this the array sorting will start from endpoints and travels towards the middle
        let _counter = 0;
        do {
            _changes = false;
            switch (_direction) {
                case Direction.forward:
                    let _nextChange = new Array();
                    for (let index1 = _counter, len = arr.length; index1 < len - 1; index1++) {
                        if (arr[index1 + 1] < arr[index1]) {
                            _nextChange.push(true);
                            _temp = arr[index1];
                            arr[index1] = arr[index1 + 1];
                            arr[index1 + 1] = _temp;
                        }
                        else
                            _nextChange.push(false);
                    }
                    for (let flag of _nextChange)
                        if (flag) {
                            _changes = true;
                            break;
                        }
                    _counter++;
                    _direction = Direction.reverse;
                    break;
                case Direction.reverse:
                    let _previousChange = new Array();
                    for (let index = arr.length - _counter; index >= 0; index--) {
                        if (arr[index - 1] > arr[index]) {
                            _previousChange.push(true);
                            _temp = arr[index];
                            arr[index] = arr[index - 1];
                            arr[index - 1] = _temp;
                        }
                        else
                            _previousChange.push(false);
                    }
                    for (let flag of _previousChange)
                        if (flag) {
                            _changes = true;
                            break;
                        }
                    _counter++;
                    _direction = Direction.forward;
                    break;
            }
        } while (_changes);
        return arr;
    }
}
let _arr = [1, 5, 9, 3, 7, 2, 1, 12, 0, 100];
//let _arr = [15, 5, 25, 1, 10, 4];
BubblySort.bouncingSort(_arr);
console.log(_arr);
//# sourceMappingURL=app.js.map