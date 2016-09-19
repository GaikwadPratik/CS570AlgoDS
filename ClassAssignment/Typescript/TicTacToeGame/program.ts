import {Enumerable} from 'typescript-dotnet-umd/System.Linq/Linq';
import {List} from 'typescript-dotnet-umd/System/Collections/List';
import {IBoardProcessor, BoardProcessor} from './boardProcessor';
import {UserInputProcessor} from './userInputProcessor';
import {PlayerProcessor} from './playerProcessor';
import {Utility} from './util';
import {IGameStatusProcessor, GameStatusProcessor} from './gameStatus';

class Program {
    private _boardProcessorObject: IBoardProcessor = null;
    private _playerProcessorObject: PlayerProcessor = null;
    private _gameStatusProcessorObject: IGameStatusProcessor = new GameStatusProcessor();
    private _lastPlayerPlayed: string = 'X';
    private _userInputProcessorObject: UserInputProcessor = new UserInputProcessor();

    public Main(): void {
        let _strBoardSize: string = '';
        let _strNumberofPlayers: string = '';
        let _nBoardSize: number = 0;
        let _nNumberofPlayers: number = 0;
        let _bProceedWithGame: boolean = true;
        let _strWinningSequence: string = '';
        let _nWinningSequqnce: number = 0;
        let _strWinningCount: string = '';
        let _nWinningCount: number = 0;
        let _bSaveAndQuit: boolean = false;
        let lstPlayers: List<string> = null;

        let _strGameStatus: string = this._userInputProcessorObject.ShowQuestionToUser(UserInputProcessor.loadOrNew);

        if (_strGameStatus !== ''
            && _strGameStatus.toUpperCase() !== UserInputProcessor.quit.toUpperCase()
            && _strGameStatus.toUpperCase() === UserInputProcessor.newGame.toUpperCase()) {

            //Get number of players
            _strNumberofPlayers = this._userInputProcessorObject.ShowQuestionToUser(UserInputProcessor.playerSize);

            if (_strNumberofPlayers !== ''
                && _strNumberofPlayers.toUpperCase() !== UserInputProcessor.quit.toUpperCase()) {

                _nNumberofPlayers = parseInt(_strNumberofPlayers);
                this.ProcessUserInput(UserInputProcessor.playerSize, _strNumberofPlayers);

                if (typeof (this._playerProcessorObject) !== 'undefined'
                    && this._playerProcessorObject !== null)
                    console.log(`The characters assigned to each players from start to end are: ${this._playerProcessorObject.playerMarkers}`);

                //Get board size
                _strBoardSize = this._userInputProcessorObject.ShowQuestionToUser(UserInputProcessor.boardSize);

                if (_strBoardSize !== ''
                    && _strBoardSize.toUpperCase() !== UserInputProcessor.quit.toUpperCase()) {
                    _nBoardSize = parseInt(_strBoardSize);
                    this.ProcessUserInput(UserInputProcessor.boardSize, _strBoardSize);

                    //Get winning sequence
                    _strWinningSequence = this._userInputProcessorObject.ShowQuestionToUser(UserInputProcessor.winningSequenceQuestion);

                    if (_strWinningSequence !== ''
                        && _strWinningSequence.toUpperCase() !== UserInputProcessor.quit.toUpperCase()) {
                        _nWinningSequqnce = parseInt(_strWinningSequence);

                        this._gameStatusProcessorObject.WinningSequence = this._playerProcessorObject.WinningSequenceNumber = _nWinningSequqnce;

                        //Get winning count
                        _strWinningCount = this._userInputProcessorObject.ShowQuestionToUser(UserInputProcessor.winningSequenceCount);
                        if (_strWinningCount !== ''
                            && _strWinningCount.toUpperCase() !== UserInputProcessor.quit.toUpperCase()) {

                            _nWinningCount = parseInt(_strWinningCount);
                            if (this._playerProcessorObject.CheckWinningSequencePossible(_nWinningCount)) {
                                this._gameStatusProcessorObject.WinningCount = this._playerProcessorObject.WinningSequenceCount = _nWinningCount;
                                //All the input conditions are met, show th board.
                                this.ProcessUserInput(UserInputProcessor.showBoard, _strBoardSize);
                            }
                            else {
                                new Utility.Utils().PrintBoardLine(`Entered winning sequence ${_nWinningCount} is not possible. Quiting the game.`, true);
                                _bProceedWithGame = false;
                            }
                        }
                        else if (_strWinningCount !== ''
                            && _strWinningCount.toUpperCase() === UserInputProcessor.quit.toUpperCase())
                            _bProceedWithGame = false;
                    }
                    else if (_strWinningSequence !== ''
                        && _strWinningSequence.toUpperCase() === UserInputProcessor.quit.toUpperCase())
                        _bProceedWithGame = false;
                }
                else if (_strBoardSize !== ''
                    && _strBoardSize.toUpperCase() === UserInputProcessor.quit.toUpperCase())
                    _bProceedWithGame = false;
            }
            else if (_strNumberofPlayers !== ''
                && _strNumberofPlayers.toUpperCase() === UserInputProcessor.quit.toUpperCase())
                _bProceedWithGame = false;
        }
        else if (_strGameStatus !== ''
            && _strGameStatus.toUpperCase() !== UserInputProcessor.quit.toUpperCase()
            && _strGameStatus.toUpperCase() === UserInputProcessor.load.toUpperCase()) {
            //load from the file
            let _filePath: string = this._userInputProcessorObject.ShowQuestionToUser(UserInputProcessor.loadPath);
            if (this.ProcessUserInput(UserInputProcessor.load, _filePath)) {
                this.ProcessUserInput(UserInputProcessor.playerSize, this._gameStatusProcessorObject.PlayerMarker.length.toString());
                this._playerProcessorObject.WinningSequenceCount = this._gameStatusProcessorObject.WinningCount;
                this._playerProcessorObject.WinningSequenceNumber = this._gameStatusProcessorObject.WinningSequence;
                this._playerProcessorObject.playerMarkers = this._gameStatusProcessorObject.PlayerMarker;
                this.ProcessUserInput(UserInputProcessor.boardSize, this._gameStatusProcessorObject.BoardSize.toString());
                this._playerProcessorObject.setPlayerMatrix(this._gameStatusProcessorObject.PlayerMatrix);
                this._boardProcessorObject.setPlayerMatrix(this._gameStatusProcessorObject.PlayerMatrix);
                this.ProcessUserInput(UserInputProcessor.loadOrNew, '');
            }
            else
                _bProceedWithGame = false;
        }
        else {
            //quit 
            if (_strGameStatus !== ''
                && _strGameStatus.toUpperCase() === UserInputProcessor.quit.toUpperCase()) {
                _bProceedWithGame = false;
            }
        }

        if (this._playerProcessorObject !== null
            && typeof (this._playerProcessorObject.playerMarkers) !== 'undefined' 
            && this._playerProcessorObject.playerMarkers !== null 
            && this._playerProcessorObject.playerMarkers.length > 0)
            lstPlayers = new List<string>(Enumerable.from(this._playerProcessorObject.playerMarkers));

        while (_bProceedWithGame && lstPlayers !== null && lstPlayers.count > 0) {
            //show user for whom move is requested.
            let _nextUser: string = lstPlayers.get(0);
            if (typeof (_nextUser) !== 'undefined' && _nextUser !== null && _nextUser !== '') {
                new Utility.Utils().PrintBoardLine(`player '${_nextUser}', `);

                let _strNextMove: string = this._userInputProcessorObject.ShowQuestionToUser(UserInputProcessor.nextLocation);

                if (_strNextMove !== ''
                    && _strNextMove.toUpperCase() !== UserInputProcessor.quit.toUpperCase()) {
                    _bProceedWithGame = true;

                    new Utility.Utils().PrintBoardLine(`player "${_nextUser}" has decided to mark "${_strNextMove}" location`, true);

                    let _strNextMoveTemp: string = `${_strNextMove} ${_nextUser}`;

                    if (!this.ProcessUserInput(UserInputProcessor.nextLocation, _strNextMoveTemp))
                        new Utility.Utils().PrintBoardLine(`postion ${_strNextMove} is already filled. Please enter another position.`, true);
                    else {
                        lstPlayers.removeAt(0);
                        lstPlayers.add(_nextUser);

                        //Update playerMarkers in GameStatus.
                        this._gameStatusProcessorObject.PlayerMarker = lstPlayers.toArray();

                        //evaluate winning/losing
                        let _strGameWonBy: string = this._playerProcessorObject.EvaluateWinningSequence();
                        if (_strGameWonBy === '') {
                            //Check board if any position is left for playing.
                            if (!this._playerProcessorObject.IsNextMovePossible()) {
                                new Utility.Utils().PrintBoardLine(`No empty positions available, resulting in current game ended in tied status. Quiting the current game.`, true);
                                _bProceedWithGame = false;
                            }
                        }
                        else {
                            new Utility.Utils().PrintBoardLine(`Game won by '${_strGameWonBy}'. Quiting the current game.`, true);
                            _bProceedWithGame = false;
                        }
                    }
                }
                else {
                    //quit
                    _bProceedWithGame = false;
                    _bSaveAndQuit = true;
                }
            }
            else {
                new Utility.Utils().PrintBoardLine(`invalid player, hence quitting the game.`, true);
                _bProceedWithGame = false;
            }
        }

        if (!_bProceedWithGame)
            this.QuitGame(_bSaveAndQuit);
    }

    private ProcessUserInput(inputTypeTobProcessed: string, userInput: string): boolean {
        let _bRtnVal: boolean = false;
        try {
            switch (inputTypeTobProcessed) {
                case UserInputProcessor.boardSize:
                    this._boardProcessorObject = new BoardProcessor();
                    let _boardSize: number = parseInt(userInput);
                    this._boardProcessorObject.tableSize = this._gameStatusProcessorObject.BoardSize = _boardSize;
                    //this._boardProcessorObject.DrawBoard(false);
                    //this will make sure that of nummber of players !== boardSize then all the locations within player matrix are accessible.
                    this._playerProcessorObject.InitializePlayerMatrix(_boardSize);
                    _bRtnVal = true;
                    break;

                case UserInputProcessor.playerSize:
                    let _numberOfPlayers: number = parseInt(userInput);
                    this._playerProcessorObject = new PlayerProcessor();
                    this._playerProcessorObject.InitializePlayerMarkers(_numberOfPlayers);

                    break;

                case UserInputProcessor.loadOrNew:
                    this._boardProcessorObject.DrawBoard(true);
                    _bRtnVal = true;
                    break;

                case UserInputProcessor.nextLocation:
                    let _axesInfo: Array<string> = userInput.split(' ');
                    let _playerMarker: string = _axesInfo.pop();
                    let _axesEnumerable: Enumerable<string> = Enumerable.from(_axesInfo);
                    let _strColumnNumber: string = _axesEnumerable.first();
                    let _strRowNumber: string = _axesEnumerable.last();
                    let _nRowNumber: number = parseInt(_strRowNumber);
                    let _nColumnNumber: number = parseInt(_strColumnNumber);

                    //check if the position is already filled or not, if filled warn user
                    if (!this._playerProcessorObject.CheckAvilabilityPosition(_nRowNumber, _nColumnNumber)) {
                        //Update player matrix with correct marker.
                        this._playerProcessorObject.UpdatePlayerMatrix(_nRowNumber, _nColumnNumber, _playerMarker);

                        //call update matrix from PlayerProcessor
                        let _tempPlayerMatrix: string[][] = this._playerProcessorObject.getPlayerMatrix();

                        //Update playerMatrix from GameStatus
                        this._gameStatusProcessorObject.PlayerMatrix = _tempPlayerMatrix;

                        //passing playerProcessor.playerMatrix to maintain previous records
                        if (_tempPlayerMatrix.length > 0)
                            this._boardProcessorObject.setPlayerMatrix(_tempPlayerMatrix);
                        this._boardProcessorObject.DrawBoard(true);
                        _bRtnVal = true;
                    }
                    else
                        _bRtnVal = false;
                    break;

                case UserInputProcessor.showBoard:
                    this._boardProcessorObject.DrawBoard(false);
                    _bRtnVal = true;
                    break;

                case UserInputProcessor.save:
                    new Utility.Utils().WriteContentsToFile<IGameStatusProcessor>(`${userInput}.json`, this._gameStatusProcessorObject);
                    _bRtnVal = true;
                    break;

                case UserInputProcessor.load:
                    let _strFileContents: string = new Utility.Utils().ReadFileContents(`${userInput}.json`);
                    if (_strFileContents !== '') {
                        let _jsonContents = JSON.parse(_strFileContents);
                        let _tempGameStatusProcessorObject: GameStatusProcessor = new GameStatusProcessor();
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

    private QuitGame(toBeSaved: boolean): void {
        //Ask user if to be saved.
        if (toBeSaved) {
            let _strTobeSaved: string = this._userInputProcessorObject.ShowQuestionToUser(UserInputProcessor.save);
            if (_strTobeSaved === 'yes') {
                let _strFilePath: string = this._userInputProcessorObject.ShowQuestionToUser(UserInputProcessor.savePath);
                this.ProcessUserInput(UserInputProcessor.save, _strFilePath);
            }
            else
                new Utility.Utils().PrintBoardLine('Quiting the game without saving', true);
        }
        else
            new Utility.Utils().PrintBoardLine('Quiting the game without saving', true);
    }

}

new Program().Main();
