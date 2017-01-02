"use strict";
const fs = require('fs');
var Utility;
(function (Utility) {
    class Utils {
        static Initalize2DArray(numrows, numcols, initial) {
            var _arr = new Array(numcols);
            for (var i = 0; i < numcols; ++i) {
                var _columns = new Array(numrows);
                for (var j = 0; j < numrows; ++j) {
                    _columns[j] = initial;
                }
                _arr[i] = _columns;
            }
            return _arr;
        }
        PrintBoardLine(stringToPrint, bAddNewLine = false) {
            process.stdout.write(stringToPrint);
            if (bAddNewLine)
                process.stdout.write('\n');
        }
        WriteContentsToFile(fileName, contents) {
            try {
                let _strSerialises = JSON.stringify(contents);
                fs.writeFileSync(fileName, _strSerialises);
            }
            catch (exception) {
                console.log(exception);
            }
        }
        ReadFileContents(fileName) {
            let _strRtnVal = '';
            try {
                let _fileContents = fs.readFileSync(fileName);
                if (typeof (_fileContents) !== 'undefined' && _fileContents !== null)
                    _strRtnVal = _fileContents.toString();
            }
            catch (exception) {
                console.log(exception);
            }
            return _strRtnVal;
        }
    }
    Utility.Utils = Utils;
})(Utility = exports.Utility || (exports.Utility = {}));
//# sourceMappingURL=util.js.map