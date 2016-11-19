"use strict";
const fs = require('fs');
const path = require('path');
class HuffmanNodeObject {
    constructor() {
        this._character = '';
        this._frequency = 0;
        this._binaryCode = '';
        this._totalBits = 0;
        this._leftNode = null;
        this._rightNode = null;
    }
    get Character() {
        return this._character;
    }
    set Character(value) {
        this._character = value;
    }
    get Frequency() {
        return this._frequency;
    }
    set Frequency(value) {
        this._frequency = value;
    }
    get BinaryCode() {
        return this._binaryCode;
    }
    set BinaryCode(value) {
        this._binaryCode = value;
    }
    get TotalBits() {
        return this._totalBits;
    }
    set TotaBits(value) {
        this._totalBits = value;
    }
    get LeftNode() {
        return this._leftNode;
    }
    set LeftNode(value) {
        this._leftNode = value;
    }
    get RightNode() {
        return this._rightNode;
    }
    set RightNode(value) {
        this._rightNode = value;
    }
}
class Program {
    constructor() {
        this._lstHuffmanNodeObjects = null;
        this._lstHuffmanNodeTree = null;
        this._nodeRootHuffmanObject = null;
        this._totalCharacterCount = 0;
        this._totalCodeLength = 0;
        //name of the file.
        this._inputFileName = "infile.dat";
        this._outputFileName = "outfile.dat";
        //Reg ex to allow only numbers and characters.
        this._regularExpression = /[a-zA-Z0-9]/;
        this._readable = null;
    }
    Main() {
        try {
            //A copy of program object for reference in call backs.
            let _selfProgramObject = this;
            //compelte file path till the folder
            let _inputFilePath = path.join(__dirname, this._inputFileName);
            let _outputFilePath = path.join(__dirname, this._outputFileName);
            //As per node documentation, instead of checking the existance first, we should directly perform operation and then handle the error within.
            //Open the file directly.
            fs.open(_inputFilePath, fs.R_OK, (_err, _fd) => {
                //in case of an error, handle it
                if (_err) {
                    if (_err.code === 'ENOENT')
                        console.error(`The file with name '${this._inputFileName}' is not found in directory '${__dirname}'. Please check if filename is correct or not.`);
                    else
                        console.error(_err);
                }
                else {
                    //instead of reading whole file, we will read it letter by letter.
                    //create the stream to read the input file.
                    this._readable = fs.createReadStream(_inputFilePath, {
                        encoding: 'utf8',
                        fd: null,
                    });
                    this._readable.on('error', function (error) {
                        throw error;
                    });
                    //https://nodejs.org/api/stream.html#stream_readable_read_size
                    this._readable.on('readable', () => {
                        try {
                            let _chunk = '';
                            while (null !== (_chunk = this._readable.read(1))) {
                                this.ProcessCharacter(_chunk); //can use this here because it's inside arrow function.
                            }
                        }
                        catch (exception) {
                            console.log(`An error occurred while reading data from file ${exception}`);
                        }
                    });
                    //once the file read operation is complete process start building graph.
                    this._readable.on('end', function () {
                        if (this._totalCharacterCount === 0)
                            console.log(`${this._inputFileName} has no data. Please enter some text`);
                        else {
                            console.log(`number of letters in the file are ${_selfProgramObject._totalCharacterCount}`);
                            //Sort the array by the frequency
                            _selfProgramObject._lstHuffmanNodeObjects = _selfProgramObject.SortCollectionInDescending(_selfProgramObject._lstHuffmanNodeObjects);
                            //Display the Character with their frequency
                            let _strOutData = _selfProgramObject.DisplayTable(); //have to use _selfProgramObject since it's inside anonymous function of event.
                            _strOutData = _strOutData.concat('\n');
                            //generation binary tree in the form of node list
                            _selfProgramObject._lstHuffmanNodeTree = _selfProgramObject._lstHuffmanNodeObjects;
                            _selfProgramObject._nodeRootHuffmanObject = _selfProgramObject.GenerateHuffMannTree();
                            //Generate binary codes of each letter
                            _selfProgramObject.CreateEncodings(_selfProgramObject._nodeRootHuffmanObject, '');
                            //Display the Character with their code
                            _selfProgramObject._lstHuffmanNodeTree = _selfProgramObject.SortCollectionInDescending(_selfProgramObject._lstHuffmanNodeTree);
                            _strOutData = _strOutData.concat(_selfProgramObject.DisplayBinaryCode());
                            _strOutData = _strOutData.concat('\n');
                            _strOutData = _strOutData.concat(`Total number of bits ${_selfProgramObject._totalCodeLength.toString()}`);
                            fs.writeFile(_outputFilePath, _strOutData, (err) => {
                                if (err) {
                                    console.error(err);
                                }
                            });
                        }
                    });
                }
            });
        }
        catch (exception) {
            console.error(exception);
        }
    }
    CreateEncodings(rootObject, binaryCode) {
        if (rootObject.LeftNode !== null) {
            this.CreateEncodings(rootObject.LeftNode, binaryCode + '0');
            this.CreateEncodings(rootObject.RightNode, binaryCode + '1');
        }
        else {
            rootObject.BinaryCode = binaryCode;
            this._lstHuffmanNodeTree.push(rootObject);
        }
    }
    SortCollectionInDescending(huffMannNodeCollection) {
        let _rtnVal = null;
        try {
            _rtnVal = huffMannNodeCollection.sort(function (firstNode, secondNode) {
                try {
                    if (firstNode.Frequency > secondNode.Frequency)
                        return -1;
                    if (firstNode.Frequency < secondNode.Frequency)
                        return 1;
                    if (firstNode.Frequency === secondNode.Frequency)
                        return 0;
                }
                catch (exception) {
                    console.log(`exception ${exception} for ${firstNode.Character} and ${secondNode.Character}`);
                }
            });
        }
        catch (exception) {
            console.error(`Error while sorting in descending order. Error Info ${exception}`);
        }
        return _rtnVal;
    }
    GenerateHuffMannTree() {
        let _rtnVal = null;
        let _leastFrequencyObject = null;
        let _secondLeastFrequencyObject = null;
        while (this._lstHuffmanNodeTree.length > 1) {
            try {
                _leastFrequencyObject = this._lstHuffmanNodeTree.pop();
                _secondLeastFrequencyObject = this._lstHuffmanNodeTree.pop();
                let _newCombinedHuffMannObject = new HuffmanNodeObject();
                _newCombinedHuffMannObject.LeftNode = _leastFrequencyObject;
                _newCombinedHuffMannObject.RightNode = _secondLeastFrequencyObject;
                _newCombinedHuffMannObject.Frequency = _leastFrequencyObject.Frequency + _secondLeastFrequencyObject.Frequency;
                this._lstHuffmanNodeTree.push(_newCombinedHuffMannObject);
                this._lstHuffmanNodeTree = this.SortCollectionInDescending(this._lstHuffmanNodeTree);
            }
            catch (exception) {
                console.log(`exception ${exception} for ${_leastFrequencyObject.Character} and ${_secondLeastFrequencyObject.Character}`);
            }
        }
        _rtnVal = this._lstHuffmanNodeTree.pop();
        return _rtnVal;
    }
    DisplayTable() {
        let _strRtnVal = '';
        let _strTableHeader = 'symbol\tfrequency ';
        let _strTableString = '\n';
        console.log(_strTableHeader);
        try {
            for (let _tempHuffmannObject of this._lstHuffmanNodeObjects) {
                let _fre = _tempHuffmannObject.Frequency;
                _fre = ((_fre / this._totalCharacterCount) * 100);
                console.log(`${_tempHuffmannObject.Character},\t${Number(Math.round(+(_fre + 'e2')) + 'e-2').toFixed(2)}%`);
                _strTableString = _strTableString.concat(' ' + _tempHuffmannObject.Character, ',\t', Number(Math.round(+(_fre + 'e2')) + 'e-2').toFixed(2)) + '%\n';
            }
            _strRtnVal = _strRtnVal.concat(_strTableHeader, _strTableString);
        }
        catch (exception) {
            console.error(`Error while generating frequency table. Error Info ${exception}`);
        }
        return _strRtnVal;
    }
    DisplayBinaryCode() {
        let _strRtnVal = '';
        let _strTableHeader = 'symbol\tHuffman code ';
        let _strTableString = '\n';
        try {
            for (let _tempHuffmannObject of this._lstHuffmanNodeTree) {
                console.log(`${_tempHuffmannObject.Character},\t${_tempHuffmannObject.BinaryCode} `);
                _strTableString = _strTableString.concat(' ' + _tempHuffmannObject.Character + ',\t' + _tempHuffmannObject.BinaryCode) + '\n';
                this._totalCodeLength += (_tempHuffmannObject.Frequency * _tempHuffmannObject.BinaryCode.length);
            }
            _strRtnVal = _strRtnVal.concat(_strTableHeader, _strTableString);
        }
        catch (exception) {
            console.error(`Error while generating frequency table. Error Info ${exception}`);
        }
        //console.log(`Total length of the message is ${this._totalCodeLength} bits`);
        return _strRtnVal;
    }
    ProcessCharacter(chunkData) {
        if (typeof (chunkData) !== 'undefined'
            && chunkData !== null
            && this._regularExpression.test(chunkData)) {
            //console.log(_chunk); // chunk is one symbol
            if (typeof (this._lstHuffmanNodeObjects) === 'undefined' || this._lstHuffmanNodeObjects === null)
                this._lstHuffmanNodeObjects = new Array();
            //look up if the character is already present in the array.
            let _existingObject = this._lstHuffmanNodeObjects.find(x => x.Character === chunkData);
            if (typeof (_existingObject) === 'undefined' || _existingObject === null) {
                //if not then add it up
                _existingObject = new HuffmanNodeObject();
                _existingObject.Character = chunkData;
                _existingObject.Frequency = 1;
                this._lstHuffmanNodeObjects.push(_existingObject);
            }
            else {
                //if present increment the frequency 
                let _position = this._lstHuffmanNodeObjects.findIndex(x => x === _existingObject);
                //get the original frequency
                let _originalFrequency = _existingObject.Frequency;
                //Increment the frequency
                _existingObject.Frequency = ++_originalFrequency;
                //Update the object in collection
                this._lstHuffmanNodeObjects[_position] = _existingObject;
            }
            this._totalCharacterCount += 1;
        }
    }
}
new Program().Main();
//# sourceMappingURL=app.js.map