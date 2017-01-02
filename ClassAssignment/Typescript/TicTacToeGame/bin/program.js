"use strict";
const Linq_1 = require('typescript-dotnet-umd/System.Linq/Linq');
const List_1 = require('typescript-dotnet-umd/System/Collections/List');
const boardProcessor_1 = require('./boardProcessor');
const userInputProcessor_1 = require('./userInputProcessor');
const playerProcessor_1 = require('./playerProcessor');
const util_1 = require('./util');
const gameStatus_1 = require('./gameStatus');
class Program {
    constructor() {
        this._boardProcessorObject = null;
        this._playerProcessorObject = null;
        this._gameStatusProcessorObject = new gameStatus_1.GameStatusProcessor();
        this._lastPlayerPlayed = 'X';
        this._userInputProcessorObject = new userInputProcessor_1.UserInputProcessor();
    }
    Main() {
        let _strBoardSize = '';
        let _strNumberofPlayers = '';
        let _nBoardSize = 0;
        let _nNumberofPlayers = 0;
        let _bProceedWithGame = true;
        let _strWinningSequence = '';
        let _nWinningSequqnce = 0;
        let _strWinningCount = '';
        let _nWinningCount = 0;
        let _bSaveAndQuit = false;
        let lstPlayers = null;
        let _strGameStatus = this._userInputProcessorObject.ShowQuestionToUser(userInputProcessor_1.UserInputProcessor.loadOrNew);
        if (_strGameStatus !== ''
            && _strGameStatus.toUpperCase() !== userInputProcessor_1.UserInputProcessor.quit.toUpperCase()
            && _strGameStatus.toUpperCase() === userInputProcessor_1.UserInputProcessor.newGame.toUpperCase()) {
            _strNumberofPlayers = this._userInputProcessorObject.ShowQuestionToUser(userInputProcessor_1.UserInputProcessor.playerSize);
            if (_strNumberofPlayers !== ''
                && _strNumberofPlayers.toUpperCase() !== userInputProcessor_1.UserInputProcessor.quit.toUpperCase()) {
                _nNumberofPlayers = parseInt(_strNumberofPlayers);
                this.ProcessUserInput(userInputProcessor_1.UserInputProcessor.playerSize, _strNumberofPlayers);
                if (typeof (this._playerProcessorObject) !== 'undefined'
                    && this._playerProcessorObject !== null)
                    console.log(`The characters assigned to each players from start to end are: ${this._playerProcessorObject.playerMarkers}`);
                _strBoardSize = this._userInputProcessorObject.ShowQuestionToUser(userInputProcessor_1.UserInputProcessor.boardSize);
                if (_strBoardSize !== ''
                    && _strBoardSize.toUpperCase() !== userInputProcessor_1.UserInputProcessor.quit.toUpperCase()) {
                    _nBoardSize = parseInt(_strBoardSize);
                    this.ProcessUserInput(userInputProcessor_1.UserInputProcessor.boardSize, _strBoardSize);
                    _strWinningSequence = this._userInputProcessorObject.ShowQuestionToUser(userInputProcessor_1.UserInputProcessor.winningSequenceQuestion);
                    if (_strWinningSequence !== ''
                        && _strWinningSequence.toUpperCase() !== userInputProcessor_1.UserInputProcessor.quit.toUpperCase()) {
                        _nWinningSequqnce = parseInt(_strWinningSequence);
                        this._gameStatusProcessorObject.WinningSequence = this._playerProcessorObject.WinningSequenceNumber = _nWinningSequqnce;
                        _strWinningCount = this._userInputProcessorObject.ShowQuestionToUser(userInputProcessor_1.UserInputProcessor.winningSequenceCount);
                        if (_strWinningCount !== ''
                            && _strWinningCount.toUpperCase() !== userInputProcessor_1.UserInputProcessor.quit.toUpperCase()) {
                            _nWinningCount = parseInt(_strWinningCount);
                            if (this._playerProcessorObject.CheckWinningSequencePossible(_nWinningCount)) {
                                this._gameStatusProcessorObject.WinningCount = this._playerProcessorObject.WinningSequenceCount = _nWinningCount;
                                this.ProcessUserInput(userInputProcessor_1.UserInputProcessor.showBoard, _strBoardSize);
                            }
                            else {
                                new util_1.Utility.Utils().PrintBoardLine(`Entered winning sequence ${_nWinningCount} is not possible. Quiting the game.`, true);
                                _bProceedWithGame = false;
                            }
                        }
                        else if (_strWinningCount !== ''
                            && _strWinningCount.toUpperCase() === userInputProcessor_1.UserInputProcessor.quit.toUpperCase())
                            _bProceedWithGame = false;
                    }
                    else if (_strWinningSequence !== ''
                        && _strWinningSequence.toUpperCase() === userInputProcessor_1.UserInputProcessor.quit.toUpperCase())
                        _bProceedWithGame = false;
                }
                else if (_strBoardSize !== ''
                    && _strBoardSize.toUpperCase() === userInputProcessor_1.UserInputProcessor.quit.toUpperCase())
                    _bProceedWithGame = false;
            }
            else if (_strNumberofPlayers !== ''
                && _strNumberofPlayers.toUpperCase() === userInputProcessor_1.UserInputProcessor.quit.toUpperCase())
                _bProceedWithGame = false;
        }
        else if (_strGameStatus !== ''
            && _strGameStatus.toUpperCase() !== userInputProcessor_1.UserInputProcessor.quit.toUpperCase()
            && _strGameStatus.toUpperCase() === userInputProcessor_1.UserInputProcessor.load.toUpperCase()) {
            let _filePath = this._userInputProcessorObject.ShowQuestionToUser(userInputProcessor_1.UserInputProcessor.loadPath);
            if (this.ProcessUserInput(userInputProcessor_1.UserInputProcessor.load, _filePath)) {
                this.ProcessUserInput(userInputProcessor_1.UserInputProcessor.playerSize, this._gameStatusProcessorObject.PlayerMarker.length.toString());
                this._playerProcessorObject.WinningSequenceCount = this._gameStatusProcessorObject.WinningCount;
                this._playerProcessorObject.WinningSequenceNumber = this._gameStatusProcessorObject.WinningSequence;
                this._playerProcessorObject.playerMarkers = this._gameStatusProcessorObject.PlayerMarker;
                this.ProcessUserInput(userInputProcessor_1.UserInputProcessor.boardSize, this._gameStatusProcessorObject.BoardSize.toString());
                this._playerProcessorObject.setPlayerMatrix(this._gameStatusProcessorObject.PlayerMatrix);
                this._boardProcessorObject.setPlayerMatrix(this._gameStatusProcessorObject.PlayerMatrix);
                this.ProcessUserInput(userInputProcessor_1.UserInputProcessor.loadOrNew, '');
            }
            else
                _bProceedWithGame = false;
        }
        else {
            if (_strGameStatus !== ''
                && _strGameStatus.toUpperCase() === userInputProcessor_1.UserInputProcessor.quit.toUpperCase()) {
                _bProceedWithGame = false;
            }
        }
        if (this._playerProcessorObject !== null
            && typeof (this._playerProcessorObject.playerMarkers) !== 'undefined'
            && this._playerProcessorObject.playerMarkers !== null
            && this._playerProcessorObject.playerMarkers.length > 0)
            lstPlayers = new List_1.List(Linq_1.Enumerable.from(this._playerProcessorObject.playerMarkers));
        while (_bProceedWithGame && lstPlayers !== null && lstPlayers.count > 0) {
            let _nextUser = lstPlayers.get(0);
            if (typeof (_nextUser) !== 'undefined' && _nextUser !== null && _nextUser !== '') {
                new util_1.Utility.Utils().PrintBoardLine(`player '${_nextUser}', `);
                let _strNextMove = this._userInputProcessorObject.ShowQuestionToUser(userInputProcessor_1.UserInputProcessor.nextLocation);
                if (_strNextMove !== ''
                    && _strNextMove.toUpperCase() !== userInputProcessor_1.UserInputProcessor.quit.toUpperCase()) {
                    _bProceedWithGame = true;
                    new util_1.Utility.Utils().PrintBoardLine(`player "${_nextUser}" has decided to mark "${_strNextMove}" location`, true);
                    let _strNextMoveTemp = `${_strNextMove} ${_nextUser}`;
                    if (!this.ProcessUserInput(userInputProcessor_1.UserInputProcessor.nextLocation, _strNextMoveTemp))
                        new util_1.Utility.Utils().PrintBoardLine(`postion ${_strNextMove} is already filled. Please enter another position.`, true);
                    else {
                        lstPlayers.removeAt(0);
                        lstPlayers.add(_nextUser);
                        this._gameStatusProcessorObject.PlayerMarker = lstPlayers.toArray();
                        let _strGameWonBy = this._playerProcessorObject.EvaluateWinningSequence();
                        if (_strGameWonBy === '') {
                            if (!this._playerProcessorObject.IsNextMovePossible()) {
                                new util_1.Utility.Utils().PrintBoardLine(`No empty positions available, resulting in current game ended in tied status. Quiting the current game.`, true);
                                _bProceedWithGame = false;
                            }
                        }
                        else {
                            new util_1.Utility.Utils().PrintBoardLine(`Game won by '${_strGameWonBy}'. Quiting the current game.`, true);
                            _bProceedWithGame = false;
                        }
                    }
                }
                else {
                    _bProceedWithGame = false;
                    _bSaveAndQuit = true;
                }
            }
            else {
                new util_1.Utility.Utils().PrintBoardLine(`invalid player, hence quitting the game.`, true);
                _bProceedWithGame = false;
            }
        }
        if (!_bProceedWithGame)
            this.QuitGame(_bSaveAndQuit);
    }
    ProcessUserInput(inputTypeTobProcessed, userInput) {
        let _bRtnVal = false;
        try {
            switch (inputTypeTobProcessed) {
                case userInputProcessor_1.UserInputProcessor.boardSize:
                    this._boardProcessorObject = new boardProcessor_1.BoardProcessor();
                    let _boardSize = parseInt(userInput);
                    this._boardProcessorObject.tableSize = this._gameStatusProcessorObject.BoardSize = _boardSize;
                    this._playerProcessorObject.InitializePlayerMatrix(_boardSize);
                    _bRtnVal = true;
                    break;
                case userInputProcessor_1.UserInputProcessor.playerSize:
                    let _numberOfPlayers = parseInt(userInput);
                    this._playerProcessorObject = new playerProcessor_1.PlayerProcessor();
                    this._playerProcessorObject.InitializePlayerMarkers(_numberOfPlayers);
                    break;
                case userInputProcessor_1.UserInputProcessor.loadOrNew:
                    this._boardProcessorObject.DrawBoard(true);
                    _bRtnVal = true;
                    break;
                case userInputProcessor_1.UserInputProcessor.nextLocation:
                    let _axesInfo = userInput.split(' ');
                    let _playerMarker = _axesInfo.pop();
                    let _axesEnumerable = Linq_1.Enumerable.from(_axesInfo);
                    let _strColumnNumber = _axesEnumerable.first();
                    let _strRowNumber = _axesEnumerable.last();
                    let _nRowNumber = parseInt(_strRowNumber);
                    let _nColumnNumber = parseInt(_strColumnNumber);
                    if (!this._playerProcessorObject.CheckAvilabilityPosition(_nRowNumber, _nColumnNumber)) {
                        this._playerProcessorObject.UpdatePlayerMatrix(_nRowNumber, _nColumnNumber, _playerMarker);
                        let _tempPlayerMatrix = this._playerProcessorObject.getPlayerMatrix();
                        this._gameStatusProcessorObject.PlayerMatrix = _tempPlayerMatrix;
                        if (_tempPlayerMatrix.length > 0)
                            this._boardProcessorObject.setPlayerMatrix(_tempPlayerMatrix);
                        this._boardProcessorObject.DrawBoard(true);
                        _bRtnVal = true;
                    }
                    else
                        _bRtnVal = false;
                    break;
                case userInputProcessor_1.UserInputProcessor.showBoard:
                    this._boardProcessorObject.DrawBoard(false);
                    _bRtnVal = true;
                    break;
                case userInputProcessor_1.UserInputProcessor.save:
                    new util_1.Utility.Utils().WriteContentsToFile(`${userInput}.json`, this._gameStatusProcessorObject);
                    _bRtnVal = true;
                    break;
                case userInputProcessor_1.UserInputProcessor.load:
                    let _strFileContents = new util_1.Utility.Utils().ReadFileContents(`${userInput}.json`);
                    if (_strFileContents !== '') {
                        let _jsonContents = JSON.parse(_strFileContents);
                        let _tempGameStatusProcessorObject = new gameStatus_1.GameStatusProcessor();
                        this._gameStatusProcessorObject = _tempGameStatusProcessorObject.Deserialize(_jsonContents);
                        _bRtnVal = true;
                    }
                    break;
            }
        }
        catch (exception) {
            console.log(exception);
            _bRtnVal = false;
        }
        return _bRtnVal;
    }
    QuitGame(toBeSaved) {
        if (toBeSaved) {
            let _strTobeSaved = this._userInputProcessorObject.ShowQuestionToUser(userInputProcessor_1.UserInputProcessor.save);
            if (_strTobeSaved === 'yes') {
                let _strFilePath = this._userInputProcessorObject.ShowQuestionToUser(userInputProcessor_1.UserInputProcessor.savePath);
                this.ProcessUserInput(userInputProcessor_1.UserInputProcessor.save, _strFilePath);
            }
            else
                new util_1.Utility.Utils().PrintBoardLine('Quiting the game without saving', true);
        }
        else
            new util_1.Utility.Utils().PrintBoardLine('Quiting the game without saving', true);
    }
}
new Program().Main();
//# sourceMappingURL=program.js.map