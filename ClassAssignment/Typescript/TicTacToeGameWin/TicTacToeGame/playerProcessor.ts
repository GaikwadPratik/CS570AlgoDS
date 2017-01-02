import {Utility} from './util';
import {Enumerable} from 'typescript-dotnet-umd/System.Linq/Linq';
import {List} from 'typescript-dotnet-umd/System/Collections/List';

//Class for processing players move and game status
export class PlayerProcessor {
    private _playerMatrix: string[][] = [];//used for internal processing such as evaluation and current positions
    private _playerIndicators: string = 'XOABCDEFGHIJKLMNPQRSTUVWYZ';//Max number of players that can play
    public playerMarkers: Array<string> = [];
    public WinningSequenceNumber: number = 0;
    public WinningSequenceCount: number = 0;

    getPlayerMatrix() {
        return this._playerMatrix;
    }

    setPlayerMatrix(value: string[][]) {
        this._playerMatrix = value;
    }

    //take only n value out of 26 characters
    public InitializePlayerMarkers(numberOfPlayers): void {
        let tempPlayerIndicators: string = this._playerIndicators.substr(0, numberOfPlayers);
        this.playerMarkers = tempPlayerIndicators.split('');
    }

    //initiate the player matrix for internal purpose.
    public InitializePlayerMatrix(numberOfPlayers): void {
        this._playerMatrix = Utility.Utils.Initalize2DArray(numberOfPlayers, numberOfPlayers, '');
    }

    //Once the player has entered the move, update the internal matrix
    public UpdatePlayerMatrix(rowNumber: number, columnNumber: number, playerIndentifier: string): boolean {
        let _bRtnVal = false;
        try {
            this._playerMatrix[columnNumber - 1][rowNumber - 1] = playerIndentifier;
            //console.log(this._playerMatrix);
        }
        catch (exception) {
            console.log(exception);
        }
        return _bRtnVal;
    }

    //Check if the position is filled or not.
    public CheckAvilabilityPosition(rowNumber: number, colNumber: number): boolean {
        let _bRtnVal: boolean = false;
        try {
            let _tempVal: string = this._playerMatrix[colNumber - 1][rowNumber - 1];
            _bRtnVal = typeof (_tempVal) !== 'undefined' && _tempVal !== null && _tempVal !== '';
        } catch (exception) {
            console.log(exception);
        }
        return _bRtnVal;
    }

    //if all the positions are filled or not.
    public IsNextMovePossible(): boolean {
        let _bRtnVal: boolean = false;
        let _nMaxIteration: number = this._playerMatrix.length;
        for (let _index: number = 0; _index < _nMaxIteration; _index++) {
            let _lstTemp: Enumerable<string> = Enumerable.from(this._playerMatrix[_index]);
            if (_lstTemp.any(x => x === '')) {
                _bRtnVal = true;
                break;
            }
        }
        return _bRtnVal;
    }

    //Check if winning sequence is possible when entered by user at the beginning of the game.
    public CheckWinningSequencePossible(winningSequenceCount: number): boolean {
        let _bRtnVal: boolean = false;
        let _nTempSize: number = this._playerMatrix.length;
        if (this.WinningSequenceNumber === 1 || this.WinningSequenceNumber === 2) {
            _bRtnVal = winningSequenceCount <= _nTempSize;
        }
        else if (this.WinningSequenceNumber === 3 || this.WinningSequenceNumber === 4) {
            _bRtnVal = winningSequenceCount <= Math.pow(winningSequenceCount, 2);
        }

        return _bRtnVal;
    }

    //Check if game is won after every move. If won, then return the player who has won it.
    public EvaluateWinningSequence(): string {
        let _bRtnVal: string = '';
        let _currentValue: Array<string> = new Array<string>();
        switch (this.WinningSequenceNumber) {
            case 1: // by column
                for (let index: number = 0; index < this._playerMatrix.length; index++) {
                    _currentValue = this.GetColumnMatrix(index);
                    _bRtnVal = this.EvaluateArray(_currentValue);
                    if (_bRtnVal !== '')
                        break;
                }
                break;
            case 2: // by row
                for (let index: number = 0; index < this._playerMatrix.length; index++) {
                    _currentValue = this._playerMatrix[index];
                    _bRtnVal = this.EvaluateArray(_currentValue);
                    if (_bRtnVal !== '')
                        break;
                }
                break;
            case 3: // left to right diagonal
                for (let index: number = 0; index < this._playerMatrix.length; index++) {
                    _currentValue.push(this._playerMatrix[index][index]);
                }
                _bRtnVal = this.EvaluateArray(_currentValue);
                break;
            case 4: // right to left diagonal
                let _nTempSize: number = this._playerMatrix.length;
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

    //evaluate the array of sequence selected by user to check winning.
    private EvaluateArray(inputarray: Array<string>): string {
        let _bRtnVal: string = '';
        ////reduce can't be used since it can't be break when min condition is satisfied
        ////some can't be used since we need to return who has won.
        //for (let index: number = 0; index < inputarray.length; index++) {
        //    let currentCheckCount: number = 1;
        //    for (let innerIndex: number = index + 1; innerIndex < inputarray.length; innerIndex++) {
        //        if (inputarray[index] === inputarray[innerIndex])
        //            currentCheckCount += 1;
        //        else
        //            break;
        //        if (currentCheckCount === this.WinningSequenceCount) {
        //            _bRtnVal = inputarray[index];
        //            break;
        //        }
        //    }
        //    if (_bRtnVal)
        //        break;
        //}

        //using reduce approach(Note this is waste of resources since it can't be broken.
        let counter: number = 1;
        let winningCount: number = this.WinningSequenceCount;
        let result = inputarray.reduce(function (p, c, i, a) {            
            p === c ? counter += 1 : counter = 1;            
            if (_bRtnVal === '' && winningCount === counter)
                _bRtnVal = c;
            if (i === (a.length - 1))
                return _bRtnVal;
            return c;
        });
        return _bRtnVal;
    }

    //returns each column of the 2d matrix using higher order fn
    private GetColumnMatrix(index: number): Array<string> {
        let _rtnVal: Array<string> = new Array<string>();
        function reduction(previousValue, currentValue) {
            previousValue.push(currentValue[index]);
            return previousValue;
        }
        _rtnVal = this._playerMatrix.reduce(reduction, []);
        return _rtnVal;
    }
}