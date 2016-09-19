"use strict";
const util_1 = require('./util');
const Linq_1 = require('typescript-dotnet-umd/System.Linq/Linq');
class PlayerProcessor {
    constructor() {
        this._playerMatrix = [];
        this._playerIndicators = 'XOABCDEFGHIJKLMNPQRSTUVWYZ';
        this.playerMarkers = [];
        this.WinningSequenceNumber = 0;
        this.WinningSequenceCount = 0;
    }
    getPlayerMatrix() {
        return this._playerMatrix;
    }
    setPlayerMatrix(value) {
        this._playerMatrix = value;
    }
    InitializePlayerMarkers(numberOfPlayers) {
        let tempPlayerIndicators = this._playerIndicators.substr(0, numberOfPlayers);
        this.playerMarkers = tempPlayerIndicators.split('');
    }
    InitializePlayerMatrix(numberOfPlayers) {
        this._playerMatrix = util_1.Utility.Utils.Initalize2DArray(numberOfPlayers, numberOfPlayers, '');
    }
    UpdatePlayerMatrix(rowNumber, columnNumber, playerIndentifier) {
        let _bRtnVal = false;
        try {
            this._playerMatrix[columnNumber - 1][rowNumber - 1] = playerIndentifier;
        }
        catch (exception) {
            console.log(exception);
        }
        return _bRtnVal;
    }
    CheckAvilabilityPosition(rowNumber, colNumber) {
        let _bRtnVal = false;
        try {
            let _tempVal = this._playerMatrix[colNumber - 1][rowNumber - 1];
            _bRtnVal = typeof (_tempVal) !== 'undefined' && _tempVal !== null && _tempVal !== '';
        }
        catch (exception) {
            console.log(exception);
        }
        return _bRtnVal;
    }
    IsNextMovePossible() {
        let _bRtnVal = false;
        let _nMaxIteration = this._playerMatrix.length;
        for (let _index = 0; _index < _nMaxIteration; _index++) {
            let _lstTemp = Linq_1.Enumerable.from(this._playerMatrix[_index]);
            if (_lstTemp.any(x => x === '')) {
                _bRtnVal = true;
                break;
            }
        }
        return _bRtnVal;
    }
    CheckWinningSequencePossible(winningSequenceCount) {
        let _bRtnVal = false;
        let _nTempSize = this._playerMatrix.length;
        if (this.WinningSequenceNumber === 1 || this.WinningSequenceNumber === 2) {
            _bRtnVal = winningSequenceCount <= _nTempSize;
        }
        else if (this.WinningSequenceNumber === 3 || this.WinningSequenceNumber === 4) {
            _bRtnVal = winningSequenceCount <= Math.pow(winningSequenceCount, 2);
        }
        return _bRtnVal;
    }
    EvaluateWinningSequence() {
        let _bRtnVal = '';
        let _currentValue = new Array();
        switch (this.WinningSequenceNumber) {
            case 1:
                for (let index = 0; index < this._playerMatrix.length; index++) {
                    _currentValue = this.GetColumnMatrix(index);
                    _bRtnVal = this.EvaluateArray(_currentValue);
                    if (_bRtnVal !== '')
                        break;
                }
                break;
            case 2:
                for (let index = 0; index < this._playerMatrix.length; index++) {
                    _currentValue = this._playerMatrix[index];
                    _bRtnVal = this.EvaluateArray(_currentValue);
                    if (_bRtnVal !== '')
                        break;
                }
                break;
            case 3:
                for (let index = 0; index < this._playerMatrix.length; index++) {
                    _currentValue.push(this._playerMatrix[index][index]);
                }
                _bRtnVal = this.EvaluateArray(_currentValue);
                break;
            case 4:
                let _nTempSize = this._playerMatrix.length;
                for (var index = 0; index < _nTempSize; index++) {
                    for (var innerIndex = 0; innerIndex < _nTempSize; innerIndex++) {
                        if ((index + innerIndex) === (_nTempSize - 1))
                            _currentValue.push(this._playerMatrix[index][innerIndex]);
                    }
                }
                _bRtnVal = this.EvaluateArray(_currentValue);
                break;
        }
        return _bRtnVal;
    }
    EvaluateArray(inputarray) {
        let _bRtnVal = '';
        for (let index = 0; index < inputarray.length; index++) {
            let currentCheckCount = 1;
            for (let innerIndex = index + 1; innerIndex < inputarray.length; innerIndex++) {
                if (inputarray[index] === inputarray[innerIndex])
                    currentCheckCount += 1;
                else
                    break;
                if (currentCheckCount === this.WinningSequenceCount) {
                    _bRtnVal = inputarray[index];
                    break;
                }
            }
            if (_bRtnVal)
                break;
        }
        return _bRtnVal;
    }
    GetColumnMatrix(index) {
        let _rtnVal = new Array();
        function reduction(previousValue, currentValue) {
            previousValue.push(currentValue[index]);
            return previousValue;
        }
        _rtnVal = this._playerMatrix.reduce(reduction, []);
        return _rtnVal;
    }
}
exports.PlayerProcessor = PlayerProcessor;
//# sourceMappingURL=playerProcessor.js.map