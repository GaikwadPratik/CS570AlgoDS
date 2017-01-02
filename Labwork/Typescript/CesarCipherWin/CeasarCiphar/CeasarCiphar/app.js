"use strict";
const fs = require('fs');
const readline = require('readline');
class Program {
    Main() {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        rl.question('Can you please enter the file name? ', (answer) => {
            rl.close();
            fs.readFile(answer, 'utf8', function (err, contents) {
                if (err)
                    if (err.code === 'ENOENT')
                        console.error(err.message);
                    else
                        console.error(err);
                console.log('contents of the file are ' + contents);
                let ciphertext = contents;
                let decreptedText = "";
                let re = /[a-zA-Z]/;
                let key = 5;
                let charProcessed = 0;
                for (let currentChar of ciphertext) {
                    if (re.test(currentChar)) {
                        let charCode = currentChar.charCodeAt(0);
                        let newChar = '';
                        if ((charCode >= 65) && (charCode <= 90)) {
                            let shiftedCharCode = charCode - key;
                            if (shiftedCharCode < 65)
                                shiftedCharCode = shiftedCharCode + 26;
                            newChar = String.fromCharCode(shiftedCharCode);
                        }
                        else if ((charCode >= 97) && (charCode <= 122)) {
                            let shiftedCharCode = charCode - key;
                            if (shiftedCharCode < 97)
                                shiftedCharCode = shiftedCharCode + 26;
                            newChar = String.fromCharCode(shiftedCharCode);
                        }
                        decreptedText += newChar;
                    }
                    else
                        decreptedText += currentChar;
                    charProcessed += 1;
                    if (charProcessed === 3) {
                        charProcessed = 0;
                        key += 2;
                        if (key > 26)
                            key = (key % 26);
                    }
                }
                console.log(decreptedText);
                fs.writeFile("solution.txt", decreptedText, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The file is saved!");
                });
            });
        });
    }
}
new Program().Main();
//# sourceMappingURL=app.js.map