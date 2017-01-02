"use strict";
const Linq_1 = require('typescript-dotnet-umd/System.Linq/Linq');
let readlineSync = require('readline-sync');
class UserInputProcessor {
    constructor() {
        this.questionList = [
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
    }
    ShowQuestionToUser(questionToAsk) {
        let _strRtnVal = '';
        try {
            let _questionListEnumerable = Linq_1.default.from(this.questionList);
            let _filteredQuestions = _questionListEnumerable.where(x => x.key === questionToAsk);
            if (typeof (_filteredQuestions) !== 'undefined' && _filteredQuestions !== null) {
                let _filteredQuestion = _filteredQuestions.firstOrDefault();
                if (typeof (_filteredQuestion) !== 'undefined' && _filteredQuestion !== null) {
                    let _questionToUser = _filteredQuestion.value;
                    let _limit = _filteredQuestion.limit;
                    let _limitMessage = _filteredQuestion.limitMessage;
                    if (_questionToUser !== '') {
                        let _userResponse = readlineSync.question(_questionToUser, { limit: _limit, limitMessage: _limitMessage });
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
UserInputProcessor.boardSize = "boardSize";
UserInputProcessor.playerSize = "playerSize";
UserInputProcessor.nextLocation = "nextLocation";
UserInputProcessor.loadOrNew = "loadOrNew";
UserInputProcessor.winningSequenceQuestion = "winningSequenceQuestion";
UserInputProcessor.winningSequenceCount = "winningSequenceCount";
UserInputProcessor.newGame = "new";
UserInputProcessor.load = "load";
UserInputProcessor.save = "save";
UserInputProcessor.quit = "quit";
UserInputProcessor.savePath = "savePath";
UserInputProcessor.loadPath = "loadPath";
UserInputProcessor.showBoard = "showBoard";
exports.UserInputProcessor = UserInputProcessor;
//# sourceMappingURL=userInputProcessor.js.map