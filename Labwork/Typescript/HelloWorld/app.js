//import * as fs from 'fs';
// export interface Serializable<T> {
//     deserialize(input: Object): T;
// }
// export interface IGameStatus {
//     PlayerMatrix: string[][];//Contains positions played so far.
//     PlayerMarker: Array<string>;//Contains order of the players. Last character should indicate last player.
//     WinningSequence: string; //Winning Sequence entered by user at the beginning.
//     BoardSize: number; //Board size(not needed could be extracted from PlayerMarker.length)
// }
// export class GameStatus implements Serializable<GameStatus>, IGameStatus {
//     public PlayerMatrix: string[][];//Contains positions played so far.
//     public PlayerMarker: Array<string>;//Contains order of the players. Last character should indicate last player.
//     public WinningSequence: string; //Winning Sequence entered by user at the beginning.
//     public BoardSize: number; //Board size(not needed could be extracted from PlayerMarker.length) 
//     deserialize(input) {
//         this.PlayerMarker = input.PlayerMarker;
//         this.PlayerMatrix = input.PlayerMatrix;
//         this.WinningSequence = input.WinningSequence;
//         this.BoardSize = input.BoardSize;
//         // this.firstMember = new GameStatus().deserialize(input.firstMember);
//         // this.secondMember = new GameStatus().deserialize(input.secondMember);
//         return this;
//     }
// }
// let _gameStatus: IGameStatus = new GameStatus();
// _gameStatus.BoardSize = 10;
// _gameStatus.WinningSequence = "Pratik is an idiot.";
// _gameStatus.PlayerMarker = 'XOABCDEFGHIJKLMNPQRSTUVWYZ'.split('');
// _gameStatus.PlayerMatrix = [['1', '2', '3', '4'], ['5', '6', '7', '8'], ['9', '10', '11', '12'], ['13', '14', '15', '16'], ['17', '18', '19', '20']];
// let _strSerialises: string = JSON.stringify(_gameStatus);
// fs.writeFileSync("serialized.json", _strSerialises);
// let _fileContents: Buffer = fs.readFileSync("serialized.json");
// console.log(_fileContents);
// console.log(_fileContents.toString());
// var _instance: IGameStatus = new GameStatus().deserialize(JSON.parse(_fileContents.toString()));
// console.log(_instance);
// let arr: Array<number> = [1, 2, 3, 4, 5, 5, 5, 5, 2, 6, 3, 3, 1];
// let wincount: number = 5;
// let winReached: boolean = false;
// for (let index: number = 0; index < arr.length; index++) {
//     let currentCheckCount: number = 1;
//     let curr: number = arr[index];
//     for (let innerIndex: number = index + 1; innerIndex < arr.length; innerIndex++) {
//         if (curr === arr[innerIndex])
//             currentCheckCount += 1;
//         else
//             break;
//         if (currentCheckCount === wincount) {
//             winReached = true;
//             break;
//         }
//     }
//     if (winReached)
//         break;
// }
// //console.log(winReached);
// var twoDimensionalArray = [
//     [1, 2, 3],
//     [4, 5, 6],
//     [7, 8, 9]
// ];
// // for (let index: number = 0; index < twoDimensionalArray.length; index++)
// //     console.log(twoDimensionalArray[index]);
// // for (let index: number = 0; index < twoDimensionalArray.length; index++)
// //     console.log(twoDimensionalArray.map(x => twoDimensionalArray[index]));
// function extractColumn(arr, column) {
//     function reduction(previousValue, currentValue) {
//         previousValue.push(currentValue[column]);
//         return previousValue;
//     }
//     return arr.reduce(reduction, []);
//     // arr.reduce((previousValue,currentValue,index,[])=>{
//     // },[])
// }
// for (let index = 0; index < twoDimensionalArray.length; index++)
//     console.log(extractColumn(twoDimensionalArray, index));
var arr = [1, 2, 3, 4, 5, 5, 5, 5, 2, 6, 3, 3, 1];
// var result = arr.reduce((p, c, i, a) => c !== a[i + 1] ? (p[p.length - 1][0] = c, p.concat([[0, 1]]))
//     : (p[p.length - 1][0] = c, p[p.length - 1][1]++ , p), [[true, 1]])
//     .slice(0, -1);
// console.log(result);
arr.reduce(function (p, c, i, a) {
    debugger;
    if (c !== a[i + 1])
        (p[p.length - 1][0] = c, p.concat([[0, 1]]));
    else
        (p[p.length - 1][0] = c, p[p.length - 1][1]++, p);
    return p;
}, [[1]]).slice(0, -1);
//console.log(twoDimensionalArray.reverse();
// for (var i = 0; i < twoDimensionalArray.length; i++) {
//     for (var j = 0; j < twoDimensionalArray.length; j++) {
//         if ((i + j) === (twoDimensionalArray.length - 1))
//             console.log(twoDimensionalArray[i][j]);
//     }
// } 
//# sourceMappingURL=app.js.map