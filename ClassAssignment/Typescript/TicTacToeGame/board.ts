export class Board {
    private board: string[][] = [['3'], ['3']];

    public DrawBoard(tableSize: number): void {
        console.log('\x1B[2J\x1B[0f');//clearing the screen for the game.
        let threeSpacing: string = '   ';
        let twoSpacing: string = '  ';
        let singleSpacing: string = ' ';
        let verticalDivier:string = '|';
        let columnSpace: string = ' _ ';
        let horizontalDivider: string = '----';
        let firstLine: string = '';
        let secondLine: string = '';

        firstLine += threeSpacing;
        for (let innerIndex: number = 1; innerIndex <= tableSize; innerIndex++) {
            firstLine += innerIndex.toString();
            if (innerIndex.toString().length === 1)
                firstLine += threeSpacing;
            else if (innerIndex.toString().length === 2)
                firstLine += twoSpacing;
        }
        console.log(firstLine);

        for (let index: number = 1; index <= tableSize; index++) {
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
