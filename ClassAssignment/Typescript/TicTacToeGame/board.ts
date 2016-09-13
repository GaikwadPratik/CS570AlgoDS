///<reference path="./typings/node/node.d.ts"/>

export class Board {
    private board: number[][] = [[3], [3]];

    public DrawBoard(tableSize: number): void {
        console.log('\x1B[2J\x1B[0f');//clearing the screen for the game.
        let threeSpacing: string = '   ';
        let twoSpacing: string = '  ';
        let singleSpacing: string = ' ';
        let verticalDivier: string = '|';
        let columnSpace: string = ' _ ';
        let horizontalDivider: string = '----';
        let firstLine: string = '';
        let secondLine: string = '';

        firstLine += threeSpacing;
        for (let index: number = 1; index <= tableSize; index++) {
            firstLine += index.toString();
            if (index.toString().length === 1)
                firstLine += threeSpacing;
            else if (index.toString().length === 2)
                firstLine += twoSpacing;
        }
        this.PrintBoardLine(firstLine, true);

        for (let index: number = 0; index < tableSize; index++) {
            secondLine = (index + 1).toString();
            if (secondLine.length === 1)
                secondLine += twoSpacing;
            else if (secondLine.length === 2)
                secondLine += singleSpacing;
            this.PrintBoardLine(secondLine);

            for (let innerIndex: number = 1; innerIndex <= tableSize; innerIndex++) {
                if (innerIndex !== tableSize)
                    secondLine = columnSpace + verticalDivier;
                else
                    secondLine = columnSpace;
                this.PrintBoardLine(secondLine);
            }
            this.PrintBoardLine('', true);
        }
    }

    private PrintBoardLine(stringToPrint: string, bAddNewLine: boolean = false): void {
        process.stdout.write(stringToPrint);
        if (bAddNewLine)
            process.stdout.write('\n');
    }
}
