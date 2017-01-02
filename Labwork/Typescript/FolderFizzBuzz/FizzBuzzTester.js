"use strict";
const FizzBuzz_1 = require('./FizzBuzz');
class Program {
    static Main() {
        let numSequnce = [];
        for (let index = 10; index <= 250; index++)
            numSequnce.push(index);
        let fizzBuzzTester = new FizzBuzz_1.default();
        fizzBuzzTester.FizzBuzzer(numSequnce);
    }
}
Program.Main();
