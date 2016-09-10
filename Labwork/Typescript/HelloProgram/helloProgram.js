'use strict';
class HelloClass {
    WriteMessage(message) {
        console.log('Message from linux console: ' + message);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HelloClass;
class ByeClass {
    ReadMessage() {
        console.log('Good night for now.');
    }
}
exports.ByeClass = ByeClass;
