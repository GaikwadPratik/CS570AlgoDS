"use strict";
class FizzBuzzerClass {
    FizzBuzzer(numberSequence) {
        for (let num of numberSequence) {
            if ((num % 3 === 0) && (num % 5 === 0))
                console.log('BuzzFizz');
            else if (num % 5 === 0)
                console.log('Fizz');
            else if (num % 3 === 0)
                console.log('Buzz');
            else
                console.log(num);
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FizzBuzzerClass;
