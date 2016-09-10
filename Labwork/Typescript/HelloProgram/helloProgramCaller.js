'use strict';
const helloProgram_1 = require('./helloProgram');
const helloProgram_2 = require('./helloProgram');
class Program {
    static main() {
        let helloClass = new helloProgram_1.default();
        helloClass.WriteMessage('Hi there! How are you?');
        let byeClass = new helloProgram_2.ByeClass();
        byeClass.ReadMessage();
    }
}
Program.main();
