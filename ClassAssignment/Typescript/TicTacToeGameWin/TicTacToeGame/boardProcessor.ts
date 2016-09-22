import {Utility} from './util';

export interface IBoardProcessor {
    tableSize: number;
    DrawBoard(showFromMatrix: boolean): void;
    getPlayerMatrix();
    setPlayerMatrix(value: string[][]);
}

//Class for console display processing of board
export class BoardProcessor extends Utility.Utils implements IBoardProcessor {
    private _playerMatrix: string[][] = [];
    public tableSize: number = 0;

    public getPlayerMatrix() {
        return this._playerMatrix;
    }

    public setPlayerMatrix(value: string[][]) {
        this._playerMatrix = value;
    }

    public DrawBoard(showFromMatrix: boolean): void {
        try {
            //this.PrintBoardLine('\x1B[2J\x1B[0f', true);//clearing the screen for the game.
            let _threeSpacing: string = '   ';
            let _twoSpacing: string = '  ';
            let _singleSpacing: string = ' ';
            let _verticalDivier: string = '|';
            let _columnSpace: string = ' _ ';
            let _horizontalDivider: string = '----';
            let _firstLine: string = '';
            let _secondLine: string = '';
            let _horizontalLine: string = '';

            _firstLine += _threeSpacing;
            _horizontalLine += _threeSpacing;
            for (let index: number = 1; index <= this.tableSize; index++) {
                _firstLine += index.toString();
                if (index.toString().length === 1)
                    _firstLine += _threeSpacing;
                else if (index.toString().length === 2)
                    _firstLine += _twoSpacing;
                _horizontalLine += _horizontalDivider;
            }
            this.PrintBoardLine(_firstLine, true);

            for (let index: number = 0; index < this.tableSize; index++) {
                _secondLine = (index + 1).toString();
                if (_secondLine.length === 1)
                    _secondLine += _twoSpacing;
                else if (_secondLine.length === 2)
                    _secondLine += _singleSpacing;
                this.PrintBoardLine(_secondLine);

                for (let innerIndex: number = 0; innerIndex < this.tableSize; innerIndex++) {
                    if (innerIndex !== this.tableSize)
                        _secondLine = _columnSpace + _verticalDivier;
                    else
                        _secondLine = _columnSpace;

                    //use player matrix and replace _ with correct user marker.
                    if (showFromMatrix) {
                        let _tempNumCols: Array<string> = this._playerMatrix[index];
                        if (typeof (_tempNumCols) !== 'undefined' && _tempNumCols !== null && _tempNumCols.length > 0) {
                            let _tempPlayerMark: string = _tempNumCols[innerIndex];
                            if (typeof (_tempPlayerMark) !== 'undefined' && _tempPlayerMark !== null && _tempPlayerMark !== '')
                                _secondLine = _secondLine.replace('_', _tempPlayerMark);
                        }
                    }

                    this.PrintBoardLine(_secondLine);
                }
                this.PrintBoardLine('', true);
                this.PrintBoardLine(_horizontalLine, true);
            }
        }
        catch (exception) {
            console.log(exception);
        }
    }
}
