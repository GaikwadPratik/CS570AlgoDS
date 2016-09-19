import {Utility} from './util';

export interface IGameStatusProcessor {
    PlayerMatrix: Array<Array<string>>;//Contains positions played so far.
    PlayerMarker: Array<string>;//Contains order of the players. Last character should indicate last player.
    WinningSequence: number; //Winning Sequence directiion entered by user at the beginning.
    WinningCount: number;//Winning count entered by user at the beginning;
    BoardSize: number; //Board size(not needed could be extracted from PlayerMarker.length)
}

export class GameStatusProcessor implements Utility.Serializable<GameStatusProcessor>, IGameStatusProcessor {

    public PlayerMatrix: string[][] = new Array<Array<string>>();//Contains positions played so far.
    public PlayerMarker: Array<string> = new Array<string>();//Contains order of the players. Last character should indicate last player.
    public WinningSequence: number = 0; //Winning Sequence directiion entered by user at the beginning.
    public WinningCount: number = 0;//Winning count entered by user at the beginning;
    public BoardSize: number = 0; //Board size(not needed could be extracted from PlayerMarker.length) 

    //Deserialize JSON string to JS object 
    public Deserialize(input): GameStatusProcessor {
        this.PlayerMarker = input.PlayerMarker;
        this.PlayerMatrix = input.PlayerMatrix;
        this.WinningSequence = input.WinningSequence;
        this.WinningCount = input.WinningCount;
        this.BoardSize = input.BoardSize;

        return this;
    }

    public CheckGameCondition() {

    }
}