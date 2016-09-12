"use strict";
class Board {
    constructor() {
        this.board = [['3'], ['3']];
    }
    DrawBoard(tableSize) {
        console.log('\x1B[2J\x1B[0f'); //clearing the screen for the game.
        let threeSpacing = '   ';
        let twoSpacing = '  ';
        let singleSpacing = ' ';
        let verticalDivier = '|';
        let columnSpace = ' _ ';
        let horizontalDivider = '----';
        let firstLine = '';
        let secondLine = '';
        firstLine += threeSpacing;
        for (let innerIndex = 1; innerIndex <= tableSize; innerIndex++) {
            firstLine += innerIndex.toString();
            if (innerIndex.toString().length === 1)
                firstLine += threeSpacing;
            else if (innerIndex.toString().length === 2)
                firstLine += twoSpacing;
        }
        console.log(firstLine);
        for (let index = 1; index <= tableSize; index++) {
            secondLine = '';
            secondLine += index.toString();
            if (secondLine.length === 1)
                secondLine += twoSpacing;
            else if (index.toString().length === 2)
                secondLine += singleSpacing;
            secondLine += (columnSpace + verticalDivier).repeat(tableSize - 1);
            secondLine += columnSpace;
            console.log(secondLine);
            if (index !== tableSize)
                console.log(threeSpacing.concat(horizontalDivider.repeat(tableSize)));
        }
    }
}
exports.Board = Board;
//# sourceMappingURL=board.js.map