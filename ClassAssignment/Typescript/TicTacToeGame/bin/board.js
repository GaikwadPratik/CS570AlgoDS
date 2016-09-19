"use strict";
///<reference path="./typings/node/node.d.ts"/>
const util_1 = require('./util');
class Board {
    constructor() {
        this.boardMatrix = [];
    }
    DrawBoard(tableSize) {
        try {
            this.PrintBoardLine('\x1B[2J\x1B[0f', true); //clearing the screen for the game.
            let threeSpacing = '   ';
            let twoSpacing = '  ';
            let singleSpacing = ' ';
            let verticalDivier = '|';
            let columnSpace = ' _ ';
            let horizontalDivider = '----';
            let firstLine = '';
            let secondLine = '';
            firstLine += threeSpacing;
            for (let index = 1; index <= tableSize; index++) {
                firstLine += index.toString();
                if (index.toString().length === 1)
                    firstLine += threeSpacing;
                else if (index.toString().length === 2)
                    firstLine += twoSpacing;
            }
            this.PrintBoardLine(firstLine, true);
            for (let index = 0; index < tableSize; index++) {
                secondLine = (index + 1).toString();
                if (secondLine.length === 1)
                    secondLine += twoSpacing;
                else if (secondLine.length === 2)
                    secondLine += singleSpacing;
                this.PrintBoardLine(secondLine);
                for (let innerIndex = 1; innerIndex <= tableSize; innerIndex++) {
                    if (innerIndex !== tableSize)
                        secondLine = columnSpace + verticalDivier;
                    else
                        secondLine = columnSpace;
                    this.PrintBoardLine(secondLine);
                }
                this.PrintBoardLine('', true);
            }
        }
        catch (exception) {
            console.log(exception);
        }
    }
    PrintBoardLine(stringToPrint, bAddNewLine = false) {
        process.stdout.write(stringToPrint);
        if (bAddNewLine)
            process.stdout.write('\n');
    }
    InitializeBoardMatrix(numberOfRows, numberOfColumns) {
        this.boardMatrix = util_1.default.InitalizeArray(numberOfRows, numberOfColumns, 0);
    }
}
exports.Board = Board;
//# sourceMappingURL=board.js.map