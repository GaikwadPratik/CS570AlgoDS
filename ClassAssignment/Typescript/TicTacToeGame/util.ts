import * as fs from 'fs';

//utility module
export module Utility {
    //Interface to be implemented by classes which needs to be deserialized from JSON string.
    export interface Serializable<T> {
        Deserialize(input: Object): T;
    }

    //utility class
    export class Utils {
        //Need to check if below functino can be made.
        // public InitalizeArray<T>(rows: number, columns: number, initialValue: any): Array<T> {
        //     let rtnArr: Array<T> = new Array<T>();
        //     try {
        //         //let type = typeof(T);//Need to find if its possible
        //         for(let rowIndex:number = 0;rowIndex<rows;rowIndex++){
        //             let columnsArr = new Array<T>();
        //             for(let columnIndex:number = 0;columnIndex<columns;columnIndex++){
        //                 columnsArr[columnIndex] = initialValue;
        //             }
        //             rtnArr[rowIndex] = columnsArr;
        //         }
        //     }
        //     catch (exception) {
        //         console.log(exception);
        //     }
        //     return rtnArr;
        // }

        //Initialize 2d array with default value
        public static Initalize2DArray<T>(numrows, numcols, initial) {
            type t = T;
            var _arr = new Array(numcols);
            for (var i = 0; i < numcols; ++i) {
                var _columns = new Array(numrows);
                for (var j = 0; j < numrows; ++j) {
                    _columns[j] = initial;
                }
                _arr[i] = _columns;
            }
            //_arr = Array(numrows).fill(initial).map(function () { return Array(numcols); });
            return _arr;
        }

        //user node internal process to display message on console.
        public PrintBoardLine(stringToPrint: string, bAddNewLine: boolean = false): void {
            process.stdout.write(stringToPrint);
            if (bAddNewLine)
                process.stdout.write('\n');
        }

        //Save contents to file synchronously.
        public WriteContentsToFile<T>(fileName: string, contents: T): void {
            try {
                let _strSerialises: string = JSON.stringify(contents);
                fs.writeFileSync(fileName, _strSerialises);
            }
            catch (exception) {
                console.log(exception);
            }
        }

        //Read the contents of file synchronously.
        public ReadFileContents(fileName: string): string {
            let _strRtnVal: string = '';
            try {

                //TODO:: check if file exists.
                let _fileContents: Buffer = fs.readFileSync(fileName);
                if (typeof (_fileContents) !== 'undefined' && _fileContents !== null)
                    _strRtnVal = _fileContents.toString();
            }
            catch (exception) {
                console.log(exception);
            }
            return _strRtnVal;
        }
    }
}