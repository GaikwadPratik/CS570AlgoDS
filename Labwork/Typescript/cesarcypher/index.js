"use strict";
const fs = require('fs');
const readline = require('readline');
class Program {
    Main() {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        rl.question('Can you please enter the file name? ', (answer) => {
            rl.close();
            fs.readFile(answer, 'utf8', function (err, contents) {
                console.log('contents of the file are ' + contents);
                let ciphertext = contents;
                let decreptedText = "";
                let re = /[a-zA-Z]/;
                let key = 5;
                let charProcessed = 0;
                for (let currentCharIndex = 0; currentCharIndex < ciphertext.length; currentCharIndex++) {
                    if (re.test(ciphertext.charAt(currentCharIndex))) {
                        let newChar = "";
                        let currentChar = ciphertext.charAt(currentCharIndex);
                        let charCode = ciphertext.charCodeAt(currentCharIndex);
                        if ((charCode >= 65) && (charCode <= 90))
                            newChar = String.fromCharCode(((charCode - 65 - key + 26) % 26) + 65);
                        else if ((charCode >= 97) && (charCode <= 122))
                            newChar = String.fromCharCode(((charCode - 97 - key + 26) % 26) + 97);
                        charProcessed += 1;
                        if (charProcessed === 3) {
                            charProcessed = 0;
                            key += 2;
                            if (key >= 26)
                                key = (key % 26) + 1;
                        }
                        decreptedText += newChar;
                    }
                    else
                        decreptedText += ciphertext.charAt(currentCharIndex);
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
//# sourceMappingURL=index.js.map