"use strict";
class GameStatusProcessor {
    constructor() {
        this.PlayerMatrix = new Array();
        this.PlayerMarker = new Array();
        this.WinningSequence = 0;
        this.WinningCount = 0;
        this.BoardSize = 0;
    }
    Deserialize(input) {
        this.PlayerMarker = input.PlayerMarker;
        this.PlayerMatrix = input.PlayerMatrix;
        this.WinningSequence = input.WinningSequence;
        this.WinningCount = input.WinningCount;
        this.BoardSize = input.BoardSize;
        return this;
    }
    CheckGameCondition() {
    }
}
exports.GameStatusProcessor = GameStatusProcessor;
//# sourceMappingURL=gameStatus.js.map