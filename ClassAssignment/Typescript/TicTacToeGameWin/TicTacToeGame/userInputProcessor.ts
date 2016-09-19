import Enumerable from 'typescript-dotnet-umd/System.Linq/Linq';
let readlineSync = require('readline-sync');

//class for showing user various questions and limits for answer
export class UserInputProcessor {

    public static boardSize: string = "boardSize";
    public static playerSize: string = "playerSize";
    public static nextLocation: string = "nextLocation";
    public static loadOrNew: string = "loadOrNew";
    public static winningSequenceQuestion: string = "winningSequenceQuestion";
    public static winningSequenceCount: string = "winningSequenceCount";
    public static newGame: string = "new";
    public static load: string = "load";
    public static save: string = "save";
    public static quit: string = "quit";
    public static savePath: string = "savePath";
    public static loadPath: string = "loadPath";
    public static showBoard: string = "showBoard";

    private questionList: { key: string, value: string, limit: any, limitMessage: string }[] =
    [
        { key: UserInputProcessor.boardSize, value: "Can you please enter size of the Board? ", limit: [/^([1-9][0-9]{0,2}|999)$/, 'quit'], limitMessage: "Please enter numric value only which is less than or equal to '999' or 'quit' to quit the game." },
        { key: UserInputProcessor.playerSize, value: "Can you please enter number of players? ", limit: [/^[0-9]$|^[1]\d$|^2[0-6]$/, 'quit'], limitMessage: "Please enter numeric value only between '1' and '26' or 'quit' to quit the game." },
        { key: UserInputProcessor.nextLocation, value: "Can you please enter next position to be played? ", limit: [/^\d \d$/, 'quit'], limitMessage: "Plase enter move in 'row column' format or 'quit' to quit the game." },
        { key: UserInputProcessor.loadOrNew, value: "Do you want to load a previously saved game or a new game? ", limit: ['new', 'load', 'quit'], limitMessage: "Please type either 'new' or 'load' or 'quit'." },
        { key: UserInputProcessor.winningSequenceQuestion, value: "Can you please select winning sequence direction from list?\n 1)column\n 2)row\n 3)left to right diagonal\n 4)right to left diagonal.\n ", limit: [/^[1-4]$/, 'quit'], limitMessage: "Please type number between 1 to 4 or 'quit'." },
        { key: UserInputProcessor.winningSequenceCount, value: "Can you please enter count for winning? ", limit: [/^\d+$/, 'quit'], limitMessage: "Please type number or 'quit'." },
        { key: UserInputProcessor.save, value: "Would you like to save the current game?", limit: ['yes', 'no'], limitMessage: "Only possible answers can be 'yes' or 'no'." },
        { key: UserInputProcessor.savePath, value: "Can you please enter the name of the file to save game into?(.json as file extension will be appended automatically)", limit: [/^(?!\s*$).+/], limitMessage: "Please enter a valid file name." },
        { key: UserInputProcessor.loadPath, value: "Can you please enter the name of the file to load game from?(.json as file extension will be appended automatically)", limit: [/^(?!\s*$).+/], limitMessage: null },
    ];

    public ShowQuestionToUser(questionToAsk: string): string {
        let _strRtnVal: string = '';
        try {
            let _questionListEnumerable = Enumerable.from(this.questionList);

            let _filteredQuestions: Enumerable<{ key: string, value: string, limit: any, limitMessage: string }> = _questionListEnumerable.where(x => x.key === questionToAsk);

            if (typeof (_filteredQuestions) !== 'undefined' && _filteredQuestions !== null) {

                let _filteredQuestion: { key: string, value: string, limit: any, limitMessage: string } = _filteredQuestions.firstOrDefault();

                if (typeof (_filteredQuestion) !== 'undefined' && _filteredQuestion !== null) {

                    let _questionToUser: string = _filteredQuestion.value;//Question to be shown to user
                    let _limit: any = _filteredQuestion.limit;// Acceptable answer check by regex or string
                    let _limitMessage: string = _filteredQuestion.limitMessage;// incase answer is not within the limit, show the message to user.

                    if (_questionToUser !== '') {

                        let _userResponse: string = readlineSync.question(_questionToUser, { limit: _limit, limitMessage: _limitMessage });

                        if (typeof (_userResponse) !== 'undefined' && _userResponse !== null && _userResponse !== '') {
                            _strRtnVal = _userResponse;
                        }
                    }
                }
            }
        }
        catch (exception) {
            console.log(exception);
            _strRtnVal = '';
        }
        return _strRtnVal;
    }
}