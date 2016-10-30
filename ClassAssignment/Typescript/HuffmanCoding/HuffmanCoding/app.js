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
    getCharacter() {
        return this._character;
    }
    setCharacter(value) {
        this._character = value;
    }
    getFrequency() {
        return this._frequency;
    }
    setFrequency(value) {
        this._frequency = value;
    }
    getBinaryCode() {
        return this._binaryCode;
    }
    setBinaryCode(value) {
        this._binaryCode = value;
    }
    getTotalBits() {
        return this._totalBits;
    }
    setTotaBits(value) {
        this._totalBits = value;
    }
    getLeftNode() {
        return this._leftNode;
    }
    setLeftNode(value) {
        this._leftNode = value;
    }
    getRightNode() {
        return this._rightNode;
    }
    setRightNode(value) {
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
        //Reg ex to allow only numbers and characters.
        this._regularExpression = /[a-zA-Z0-9]/;
    }
    Main() {
        try {
            //A copy of program object for reference in call backs.
            let _selfProgramObject = this;
            //compelte file path till the folder
            let _filePath = path.join(__dirname, this._inputFileName);
            //As per node documentation, instead of checking the existance first, we should directly perform operation and then handle the error within.
            //Open the file directly.
            fs.open(_filePath, fs.R_OK, (_err, _fd) => {
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
                    let _readable = fs.createReadStream(_filePath, {
                        encoding: 'utf8',
                        fd: null,
                    }).on('error', function (error) {
                        throw error;
                    });
                    //https://nodejs.org/api/stream.html#stream_readable_read_size
                    _readable.on('readable', () => {
                        try {
                            let _chunk = '';
                            while (null !== (_chunk = _readable.read(1))) {
                                this.ProcessCharacter(_chunk); //can use this here because it's inside arrow function.
                            }
                        }
                        catch (exception) {
                            console.log(`An error occurred while reading data from file ${exception}`);
                        }
                    });
                    //once the file read operation is complete process start building graph.
                    _readable.on('end', function () {
                        if (this._totalCharacterCount === 0)
                            console.log(`${this._inputFileName} has no data. Please enter some data`);
                        else {
                            console.log(`number of letters in the file are ${this._totalCharacterCount}`);
                            //Sort the array by the frequency
                            _selfProgramObject._lstHuffmanNodeObjects = _selfProgramObject.SortCollectionInDescending(_selfProgramObject._lstHuffmanNodeObjects);
                            //Display the Character with their frequency
                            _selfProgramObject.DisplayTable(); //have to use _selfProgramObject since it's inside anonymous function of event.
                            //generation binary tree in the form of node list
                            _selfProgramObject._lstHuffmanNodeTree = _selfProgramObject._lstHuffmanNodeObjects;
                            _selfProgramObject._nodeRootHuffmanObject = _selfProgramObject.GenerateHuffMannTree();
                            //Generate binary codes of each letter
                            _selfProgramObject.CreateEncodings(_selfProgramObject._nodeRootHuffmanObject, '');
                            //Display the Character with their code
                            _selfProgramObject._lstHuffmanNodeTree = _selfProgramObject.SortCollectionInDescending(_selfProgramObject._lstHuffmanNodeTree);
                            _selfProgramObject.DisplayBinaryCode();
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
        if (rootObject.getLeftNode() !== null) {
            this.CreateEncodings(rootObject.getLeftNode(), binaryCode + '0');
            this.CreateEncodings(rootObject.getRightNode(), binaryCode + '1');
        }
        else {
            rootObject.setBinaryCode(binaryCode);
            this._lstHuffmanNodeTree.push(rootObject);
        }
    }
    SortCollectionInDescending(huffMannNodeCollection) {
        let _rtnVal = null;
        try {
            _rtnVal = huffMannNodeCollection.sort(function (firstNode, secondNode) {
                try {
                    if (firstNode.getFrequency() > secondNode.getFrequency())
                        return -1;
                    if (firstNode.getFrequency() < secondNode.getFrequency())
                        return 1;
                    if (firstNode.getFrequency() === secondNode.getFrequency())
                        return 0;
                }
                catch (exception) {
                    console.log(`exception ${exception} for ${firstNode.getCharacter()} and ${secondNode.getCharacter()}`);
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
                _newCombinedHuffMannObject.setLeftNode(_leastFrequencyObject);
                _newCombinedHuffMannObject.setRightNode(_secondLeastFrequencyObject);
                _newCombinedHuffMannObject.setFrequency(_leastFrequencyObject.getFrequency() + _secondLeastFrequencyObject.getFrequency());
                this._lstHuffmanNodeTree.push(_newCombinedHuffMannObject);
                this._lstHuffmanNodeTree = this.SortCollectionInDescending(this._lstHuffmanNodeTree);
            }
            catch (exception) {
                console.log(`exception ${exception} for ${_leastFrequencyObject.getCharacter()} and ${_secondLeastFrequencyObject.getCharacter()}`);
            }
        }
        _rtnVal = this._lstHuffmanNodeTree.pop();
        return _rtnVal;
    }
    DisplayTable() {
        console.log('symbol\tfrequency');
        for (let _tempHuffmannObject of this._lstHuffmanNodeObjects) {
            let _fre = _tempHuffmannObject.getFrequency();
            _fre = ((_fre / this._totalCharacterCount) * 100);
            console.log(`${_tempHuffmannObject.getCharacter()},\t${Number(Math.round(+(_fre + 'e2')) + 'e-2').toFixed(2)}%`);
        }
    }
    DisplayBinaryCode() {
        for (let _tempHuffmannObject of this._lstHuffmanNodeTree) {
            console.log(`${_tempHuffmannObject.getCharacter()},\t${_tempHuffmannObject.getFrequency()},\t${_tempHuffmannObject.getBinaryCode()} `);
            this._totalCodeLength += this._totalCodeLength + (_tempHuffmannObject.getFrequency() * _tempHuffmannObject.getBinaryCode().length);
        }
        console.log(`Total length of the message is ${this._totalCodeLength} bits`);
    }
    ProcessCharacter(chunkData) {
        if (typeof (chunkData) !== 'undefined'
            && chunkData !== null
            && this._regularExpression.test(chunkData)) {
            //console.log(_chunk); // chunk is one symbol
            if (typeof (this._lstHuffmanNodeObjects) === 'undefined' || this._lstHuffmanNodeObjects === null)
                this._lstHuffmanNodeObjects = new Array();
            //look up if the character is already present in the array.
            let _existingObject = this._lstHuffmanNodeObjects.find(x => x.getCharacter() === chunkData);
            if (typeof (_existingObject) === 'undefined' || _existingObject === null) {
                //if not then add it up
                _existingObject = new HuffmanNodeObject();
                _existingObject.setCharacter(chunkData);
                _existingObject.setFrequency(1);
                this._lstHuffmanNodeObjects.push(_existingObject);
            }
            else {
                //if present increment the frequency 
                let _position = this._lstHuffmanNodeObjects.findIndex(x => x === _existingObject);
                //get the original frequency
                let _originalFrequency = _existingObject.getFrequency();
                //Increment the frequency
                _existingObject.setFrequency(++_originalFrequency);
                //Update the object in collection
                this._lstHuffmanNodeObjects[_position] = _existingObject;
            }
            this._totalCharacterCount += 1;
        }
    }
}
new Program().Main();
//# sourceMappingURL=app.js.map