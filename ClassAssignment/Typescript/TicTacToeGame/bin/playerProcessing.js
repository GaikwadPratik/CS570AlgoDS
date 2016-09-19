"use strict";
const Linq_1 = require('typescript-dotnet-umd/System.Linq/Linq');
let readlineSync = require('readline-sync');
const board_1 = require('./board');
class PlayerProcessing {
    constructor() {
        this.questionList = [{ key: "boardSize", value: "Can you please enter size of the Board?" },
            { key: "playerSize", value: "Can you please enter number of players?" },
            { key: "nextLocation", value: "Can you please enter next position to be marked?" }];
    }
    ShowQuestionsToUser(questionsInOrder) {
        let s = readlineSync.question('hi');
        console.log(s);
    }
    ShowQuestionToUser(questionToAsk) {
        let questionListEnumerable = Linq_1.default.from(this.questionList);
        console.log(questionListEnumerable.where(x => x.key === questionToAsk).firstOrDefault().value);
    }
    ProcessUserInput(inputTypeTobProcessed, userInput) {
        try {
            switch (inputTypeTobProcessed.toUpperCase()) {
                case 'BOARDSIZE':
                    let boardObject = new board_1.Board();
                    let boardSize = parseInt(userInput);
                    boardObject.DrawBoard(boardSize);
                    break;
                case 'NUMBEROFPLAYERS':
                    break;
            }
        }
        catch (exception) {
            console.log(exception);
        }
    }
}
exports.PlayerProcessing = PlayerProcessing;
//# sourceMappingURL=playerProcessing.js.map