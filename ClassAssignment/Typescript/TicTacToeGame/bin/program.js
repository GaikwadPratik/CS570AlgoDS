"use strict";
const board_1 = require('./board');
class Program {
    static Main() {
        let boardObject = new board_1.Board();
        boardObject.DrawBoard(26);
    }
}
Program.Main();
//# sourceMappingURL=program.js.map