import {Enumerable} from 'typescript-dotnet-umd/System.Linq/Linq';
import {List} from 'typescript-dotnet-umd/System/Collections/List';
import {IBoardProcessor, BoardProcessor} from './boardProcessor';
import {UserInputProcessor} from './userInputProcessor';
import {PlayerProcessor} from './playerProcessor';
import {Utility} from './util';
import {IGameStatusProcessor, GameStatusProcessor} from './gameStatus';

//Entry point for Game
class Program {
    //global variable declaration for each external modules
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

        //Ask user if which game to start new or saved
        let _strGameStatus: string = this._userInputProcessorObject.ShowQuestionToUser(UserInputProcessor.loadOrNew);

        //If user types new game
        if (_strGameStatus !== ''
            && _strGameStatus.toUpperCase() === UserInputProcessor.newGame.toUpperCase()) {
            //New Game

            //Get number of players
            _strNumberofPlayers = this._userInputProcessorObject.ShowQuestionToUser(UserInputProcessor.playerSize);

            if (_strNumberofPlayers !== ''
                && _strNumberofPlayers.toUpperCase() !== UserInputProcessor.quit.toUpperCase()) {

                _nNumberofPlayers = parseInt(_strNumberofPlayers);
                //Initiate player markers and save the number
                this.ProcessUserInput(UserInputProcessor.playerSize, _strNumberofPlayers);

                if (typeof (this._playerProcessorObject) !== 'undefined'
                    && this._playerProcessorObject !== null)
                    console.log(`The characters assigned to each players from start to end are: ${this._playerProcessorObject.playerMarkers}`);

                //Get board size
                _strBoardSize = this._userInputProcessorObject.ShowQuestionToUser(UserInputProcessor.boardSize);

                if (_strBoardSize !== ''
                    && _strBoardSize.toUpperCase() !== UserInputProcessor.quit.toUpperCase()) {
                    _nBoardSize = parseInt(_strBoardSize);
                    //Initiate the board in row by column format and generate and interal string matrix for saving player location.
                    this.ProcessUserInput(UserInputProcessor.boardSize, _strBoardSize);

                    //Get winning sequence
                    _strWinningSequence = this._userInputProcessorObject.ShowQuestionToUser(UserInputProcessor.winningSequenceQuestion);

                    if (_strWinningSequence !== ''
                        && _strWinningSequence.toUpperCase() !== UserInputProcessor.quit.toUpperCase()) {
                        _nWinningSequqnce = parseInt(_strWinningSequence);
                        //store in each respective module for further processing.
                        this._gameStatusProcessorObject.WinningSequence = this._playerProcessorObject.WinningSequenceNumber = _nWinningSequqnce;

                        //Get winning count
                        _strWinningCount = this._userInputProcessorObject.ShowQuestionToUser(UserInputProcessor.winningSequenceCount);
                        if (_strWinningCount !== ''
                            && _strWinningCount.toUpperCase() !== UserInputProcessor.quit.toUpperCase()) {

                            _nWinningCount = parseInt(_strWinningCount);
                            //check if winning sequence is possible with the size of the board.
                            if (this._playerProcessorObject.CheckWinningSequencePossible(_nWinningCount)) {
                                this._gameStatusProcessorObject.WinningCount = this._playerProcessorObject.WinningSequenceCount = _nWinningCount;
                                //All the input conditions are met, show th board.
                                this.ProcessUserInput(UserInputProcessor.showBoard, _strBoardSize);
                            }
                            else {
                                //if winning sequence is not possible then show error and quit the game.
                                new Utility.Utils().PrintBoardLine(`Entered winning sequence ${_nWinningCount} is not possible. Quiting the game.`, true);
                                _bProceedWithGame = false;
                            }
                        }
                        else if (_strWinningCount !== ''
                            && _strWinningCount.toUpperCase() === UserInputProcessor.quit.toUpperCase())
                            //in case user types 'quit'
                            _bProceedWithGame = false;
                    }
                    else if (_strWinningSequence !== ''
                        && _strWinningSequence.toUpperCase() === UserInputProcessor.quit.toUpperCase())
                        //in case user types 'quit'
                        _bProceedWithGame = false;
                }
                else if (_strBoardSize !== ''
                    && _strBoardSize.toUpperCase() === UserInputProcessor.quit.toUpperCase())
                    //in case user types 'quit'
                    _bProceedWithGame = false;
            }
            else if (_strNumberofPlayers !== ''
                && _strNumberofPlayers.toUpperCase() === UserInputProcessor.quit.toUpperCase())
                //in case user types 'quit'
                _bProceedWithGame = false;
        }//If user types load
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
            else //any error such as file not found or file reading operation failed.
                _bProceedWithGame = false;
        }
        else {
            //quit 
            if (_strGameStatus !== ''
                && _strGameStatus.toUpperCase() === UserInputProcessor.quit.toUpperCase()) {
                //in case user types 'quit'
                _bProceedWithGame = false;
            }
        }

        //get the generated player markers 
        if (this._playerProcessorObject !== null
            && typeof (this._playerProcessorObject.playerMarkers) !== 'undefined'
            && this._playerProcessorObject.playerMarkers !== null
            && this._playerProcessorObject.playerMarkers.length > 0)
            lstPlayers = new List<string>(Enumerable.from(this._playerProcessorObject.playerMarkers));

        //everything is taken from user either to load or start a game, show the board and ask for movements.
        while (_bProceedWithGame && lstPlayers !== null && lstPlayers.count > 0) {
            //show next user for whom move is requested.
            let _nextUser: string = lstPlayers.get(0);
            if (typeof (_nextUser) !== 'undefined' && _nextUser !== null && _nextUser !== '') {
                new Utility.Utils().PrintBoardLine(`player '${_nextUser}', `);

                //ask for next location to be marked.
                let _strNextMove: string = this._userInputProcessorObject.ShowQuestionToUser(UserInputProcessor.nextLocation);

                if (_strNextMove !== ''
                    && _strNextMove.toUpperCase() !== UserInputProcessor.quit.toUpperCase()) {
                    _bProceedWithGame = true;

                    //display message with move made
                    new Utility.Utils().PrintBoardLine(`player "${_nextUser}" has decided to mark "${_strNextMove}" location`, true);

                    let _strNextMoveTemp: string = `${_strNextMove} ${_nextUser}`;

                    //Check if the position is valid meaning whether its empty or not, if not then show user message and ask for another position.
                    if (!this.ProcessUserInput(UserInputProcessor.nextLocation, _strNextMoveTemp))
                        new Utility.Utils().PrintBoardLine(`postion ${_strNextMove} is already filled. Please enter another position.`, true);
                    else {
                        //if position can be filled, then move the player to last of list of Markers so that Round Robin can be maintained.
                        lstPlayers.removeAt(0);
                        lstPlayers.add(_nextUser);

                        //Update playerMarkers in GameStatus.
                        this._gameStatusProcessorObject.PlayerMarker = lstPlayers.toArray();

                        //evaluate winning/losing of the game
                        let _strGameWonBy: string = this._playerProcessorObject.EvaluateWinningSequence();
                        if (_strGameWonBy === '') {
                            //if game is still not won by anybody, Check board if any position is left for playing.
                            if (!this._playerProcessorObject.IsNextMovePossible()) {
                                // in case no position to play, show message for tie and quit the game.
                                new Utility.Utils().PrintBoardLine(`No empty positions available, resulting in current game ended in tied status. Quiting the current game.`, true);
                                _bProceedWithGame = false;
                            }
                        }
                        else {
                            //if game is won then show the user who won it and quit the game.
                            new Utility.Utils().PrintBoardLine(`Game won by '${_strGameWonBy}'. Quiting the current game.`, true);
                            _bProceedWithGame = false;
                        }
                    }
                }
                else {
                    //In case user wants to quit, ask if save to be done.
                    _bProceedWithGame = false;
                    _bSaveAndQuit = true;
                }
            }
            else {
                new Utility.Utils().PrintBoardLine(`invalid player, hence quitting the game.`, true);
                _bProceedWithGame = false;
            }
        }

        if (!_bProceedWithGame)// in all the conditions where game has to be stopped call QuitGame.
            this.QuitGame(_bSaveAndQuit);
    }

    //This function will process the user's input for various processing such as initiate board, player markers, player matrix, show board.
    private ProcessUserInput(inputTypeTobProcessed: string, userInput: string): boolean {
        let _bRtnVal: boolean = false;
        try {
            switch (inputTypeTobProcessed) {

                //generate the board player matrix and set up initial variables for generating board on screen.
                case UserInputProcessor.boardSize:
                    this._boardProcessorObject = new BoardProcessor();
                    let _boardSize: number = parseInt(userInput);
                    this._boardProcessorObject.tableSize = this._gameStatusProcessorObject.BoardSize = _boardSize;
                    //this._boardProcessorObject.DrawBoard(false);
                    //this will make sure that of nummber of players !== boardSize then all the locations within player matrix are accessible.
                    this._playerProcessorObject.InitializePlayerMatrix(_boardSize);
                    _bRtnVal = true;
                    break;

                //Initiate player markers based on number of players entered by user.
                case UserInputProcessor.playerSize:
                    let _numberOfPlayers: number = parseInt(userInput);
                    this._playerProcessorObject = new PlayerProcessor();
                    this._playerProcessorObject.InitializePlayerMarkers(_numberOfPlayers);

                    break;

                //in case of load, show the board with already filled markers from player matrix.
                case UserInputProcessor.loadOrNew:
                    this._boardProcessorObject.DrawBoard(true);
                    _bRtnVal = true;
                    break;

                //Process location entered by user and mark it appropriately.
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

                //Show blank board without any markers
                case UserInputProcessor.showBoard:
                    this._boardProcessorObject.DrawBoard(false);
                    _bRtnVal = true;
                    break;

                //save the current game status in file name entered by user by appending json extension.
                case UserInputProcessor.save:
                    new Utility.Utils().WriteContentsToFile<IGameStatusProcessor>(`${userInput}.json`, this._gameStatusProcessorObject);
                    _bRtnVal = true;
                    break;

                //load the game from the file name entered by user by appending json extension.
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

    //Quit the game
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
