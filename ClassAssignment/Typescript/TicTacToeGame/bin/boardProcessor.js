"use strict";
const util_1 = require('./util');
class BoardProcessor extends util_1.Utility.Utils {
    constructor(...args) {
        super(...args);
        this._playerMatrix = [];
        this.tableSize = 0;
    }
    getPlayerMatrix() {
        return this._playerMatrix;
    }
    setPlayerMatrix(value) {
        this._playerMatrix = value;
    }
    DrawBoard(showFromMatrix) {
        try {
            let _threeSpacing = '   ';
            let _twoSpacing = '  ';
            let _singleSpacing = ' ';
            let _verticalDivier = '|';
            let _columnSpace = ' _ ';
            let _horizontalDivider = '----';
            let _firstLine = '';
            let _secondLine = '';
            _firstLine += _threeSpacing;
            for (let index = 1; index <= this.tableSize; index++) {
                _firstLine += index.toString();
                if (index.toString().length === 1)
                    _firstLine += _threeSpacing;
                else if (index.toString().length === 2)
                    _firstLine += _twoSpacing;
            }
            this.PrintBoardLine(_firstLine, true);
            for (let index = 0; index < this.tableSize; index++) {
                _secondLine = (index + 1).toString();
                if (_secondLine.length === 1)
                    _secondLine += _twoSpacing;
                else if (_secondLine.length === 2)
                    _secondLine += _singleSpacing;
                this.PrintBoardLine(_secondLine);
                for (let innerIndex = 0; innerIndex < this.tableSize; innerIndex++) {
                    if (innerIndex !== this.tableSize)
                        _secondLine = _columnSpace + _verticalDivier;
                    else
                        _secondLine = _columnSpace;
                    if (showFromMatrix) {
                        let _tempNumCols = this._playerMatrix[index];
                        if (typeof (_tempNumCols) !== 'undefined' && _tempNumCols !== null && _tempNumCols.length > 0) {
                            let _tempPlayerMark = _tempNumCols[innerIndex];
                            if (typeof (_tempPlayerMark) !== 'undefined' && _tempPlayerMark !== null && _tempPlayerMark !== '')
                                _secondLine = _secondLine.replace('_', _tempPlayerMark);
                        }
                    }
                    this.PrintBoardLine(_secondLine);
                }
                this.PrintBoardLine('', true);
            }
        }
        catch (exception) {
            console.log(exception);
        }
    }
}
exports.BoardProcessor = BoardProcessor;
//# sourceMappingURL=boardProcessor.js.map