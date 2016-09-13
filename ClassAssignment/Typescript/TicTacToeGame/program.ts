import {Board} from './board';

class Program {
    public static Main(): void {
        let boardObject: Board = new Board();
        boardObject.DrawBoard(26);        
    }
}

Program.Main();
