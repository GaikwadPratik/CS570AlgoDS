import fs = require('fs');
import readline =  require('readline');

class Program {
    public Main(): void {
        //creating the readline interface.
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

        //ask user for file name.
        rl.question('Can you please enter the file name? ', (answer) => {
            rl.close();

            //read the contents of the file
            fs.readFile(answer, 'utf8', function (err, contents) {
                console.log('contents of the file are ' + contents);

                let ciphertext: string = contents;
                let decreptedText: string = "";
                let re: RegExp = /[a-zA-Z]/;
                let key: number = 5;
                let charProcessed: number = 0;
                for (let currentCharIndex: number = 0; currentCharIndex < ciphertext.length; currentCharIndex++) {
                    //proceed for decryption only if character is between a-z or A-Z
                    if (re.test(ciphertext.charAt(currentCharIndex))) {
                        let newChar: string = "";
                        let currentChar: string = ciphertext.charAt(currentCharIndex);//read next char
                        let charCode: number = ciphertext.charCodeAt(currentCharIndex);//extract its char code.

                        if ((charCode >= 65) && (charCode <= 90)) //if current character is capital letter
                            newChar = String.fromCharCode(((charCode - 65 - key + 26) % 26) + 65);
                        else if ((charCode >= 97) && (charCode <= 122)) // if current character is small letter
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
                    else //append the character as is.
                        decreptedText += ciphertext.charAt(currentCharIndex);
                }

                console.log(decreptedText);

                //write to the file
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