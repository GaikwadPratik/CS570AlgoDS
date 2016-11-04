import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

class HuffmanNodeObject {
    private _character: string = '';
    private _frequency: number = 0;
    private _binaryCode: string = '';
    private _totalBits: number = 0;
    private _leftNode: HuffmanNodeObject = null;
    private _rightNode: HuffmanNodeObject = null;

    public getCharacter(): string {
        return this._character;
    }

    public setCharacter(value: string): void {
        this._character = value;
    }

    public getFrequency(): number {
        return this._frequency;
    }

    public setFrequency(value: number): void {
        this._frequency = value;
    }

    public getBinaryCode(): string {
        return this._binaryCode;
    }

    public setBinaryCode(value: string): void {
        this._binaryCode = value;
    }

    public getTotalBits(): number {
        return this._totalBits;
    }

    public setTotaBits(value: number): void {
        this._totalBits = value;
    }

    public getLeftNode(): HuffmanNodeObject {
        return this._leftNode;
    }

    public setLeftNode(value: HuffmanNodeObject): void {
        this._leftNode = value;
    }

    public getRightNode(): HuffmanNodeObject {
        return this._rightNode;
    }

    public setRightNode(value: HuffmanNodeObject): void {
        this._rightNode = value;
    }
}

class Program {

    private _lstHuffmanNodeObjects: Array<HuffmanNodeObject> = null;
    private _lstHuffmanNodeTree: Array<HuffmanNodeObject> = null;

    private _nodeRootHuffmanObject: HuffmanNodeObject = null;

    private _totalCharacterCount = 0;
    private _totalCodeLength = 0;
    //name of the file.
    private _inputFileName: string = "infile.dat";
    private _outputFileName: string = "outfile.dat";
    //Reg ex to allow only numbers and characters.
    private _regularExpression: RegExp = /[a-zA-Z0-9]/;

    private _readable: fs.ReadStream = null;

    public Main(): void {
        try {

            //A copy of program object for reference in call backs.
            let _selfProgramObject: Program = this;

            //compelte file path till the folder
            let _inputFilePath: string = path.join(__dirname, this._inputFileName);
            let _outputFilePath: string = path.join(__dirname, this._outputFileName);

            //As per node documentation, instead of checking the existance first, we should directly perform operation and then handle the error within.
            //Open the file directly.
            fs.open(_inputFilePath, fs.R_OK, (_err: NodeJS.ErrnoException, _fd: number) => {
                //in case of an error, handle it
                if (_err) {
                    if (_err.code === 'ENOENT')
                        console.error(`The file with name '${this._inputFileName}' is not found in directory '${__dirname}'. Please check if filename is correct or not.`);
                    else
                        console.error(_err);
                }
                //else process data with in the file.
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
                            let _chunk: string = '';
                            while (null !== (_chunk = this._readable.read(1))) {
                                this.ProcessCharacter(_chunk);//can use this here because it's inside arrow function.
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
                            let _strOutData: string = _selfProgramObject.DisplayTable();//have to use _selfProgramObject since it's inside anonymous function of event.
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
                            _strOutData = _strOutData.concat(_selfProgramObject._totalCodeLength.toString());

                            fs.writeFile(_outputFilePath, _strOutData, (err: NodeJS.ErrnoException) => {
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

    private CreateEncodings(rootObject: HuffmanNodeObject, binaryCode: string): void {
        if (rootObject.getLeftNode() !== null) {
            this.CreateEncodings(rootObject.getLeftNode(), binaryCode + '0');
            this.CreateEncodings(rootObject.getRightNode(), binaryCode + '1');
        }
        else {
            rootObject.setBinaryCode(binaryCode);
            this._lstHuffmanNodeTree.push(rootObject);
        }
    }

    private SortCollectionInDescending(huffMannNodeCollection: Array<HuffmanNodeObject>): Array<HuffmanNodeObject> {
        let _rtnVal: Array<HuffmanNodeObject> = null;
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

    private GenerateHuffMannTree(): HuffmanNodeObject {
        let _rtnVal: HuffmanNodeObject = null;
        let _leastFrequencyObject: HuffmanNodeObject = null;
        let _secondLeastFrequencyObject: HuffmanNodeObject = null;
        while (this._lstHuffmanNodeTree.length > 1) {
            try {
                _leastFrequencyObject = this._lstHuffmanNodeTree.pop();
                _secondLeastFrequencyObject = this._lstHuffmanNodeTree.pop();
                let _newCombinedHuffMannObject: HuffmanNodeObject = new HuffmanNodeObject();
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

    private DisplayTable(): string {
        let _strRtnVal: string = '';
        let _strTableHeader: string = 'symbol\tfrequency ';
        let _strTableString: string = '';
        console.log(_strTableHeader);
        try {
            for (let _tempHuffmannObject of this._lstHuffmanNodeObjects) {
                let _fre: number = _tempHuffmannObject.getFrequency();
                _fre = ((_fre / this._totalCharacterCount) * 100);
                console.log(`${_tempHuffmannObject.getCharacter()},\t${Number(Math.round(+(_fre + 'e2')) + 'e-2').toFixed(2)}%`);
                _strTableString = _strTableString.concat(' ' + _tempHuffmannObject.getCharacter(), ',\t', Number(Math.round(+(_fre + 'e2')) + 'e-2').toFixed(2));
            }
            _strRtnVal = _strRtnVal.concat(_strTableHeader, _strTableString);
        }
        catch (exception) {
            console.error(`Error while generating frequency table. Error Info ${exception}`);
        }
        return _strRtnVal;
    }

    private DisplayBinaryCode(): string {
        let _strRtnVal: string = '';
        let _strTableHeader: string = 'symbol\tHuffman code ';
        let _strTableString: string = '';
        try {
            for (let _tempHuffmannObject of this._lstHuffmanNodeTree) {
                console.log(`${_tempHuffmannObject.getCharacter()},\t${_tempHuffmannObject.getBinaryCode()} `);
                _strTableString = _strTableString.concat(' ' + _tempHuffmannObject.getCharacter() + ',\t' + _tempHuffmannObject.getBinaryCode());
                this._totalCodeLength += (_tempHuffmannObject.getFrequency() * _tempHuffmannObject.getBinaryCode().length);
            }
            _strRtnVal = _strRtnVal.concat(_strTableHeader, _strTableString);
        }
        catch (exception) {
            console.error(`Error while generating frequency table. Error Info ${exception}`);
        }
        //console.log(`Total length of the message is ${this._totalCodeLength} bits`);
        return _strRtnVal;
    }

    private ProcessCharacter(chunkData: string): void {
        if (typeof (chunkData) !== 'undefined'
            && chunkData !== null
            && this._regularExpression.test(chunkData)) {
            //console.log(_chunk); // chunk is one symbol
            if (typeof (this._lstHuffmanNodeObjects) === 'undefined' || this._lstHuffmanNodeObjects === null)
                this._lstHuffmanNodeObjects = new Array<HuffmanNodeObject>();
            //look up if the character is already present in the array.
            let _existingObject: HuffmanNodeObject = this._lstHuffmanNodeObjects.find(x => x.getCharacter() === chunkData);
            if (typeof (_existingObject) === 'undefined' || _existingObject === null) {
                //if not then add it up
                _existingObject = new HuffmanNodeObject();
                _existingObject.setCharacter(chunkData);
                _existingObject.setFrequency(1);
                this._lstHuffmanNodeObjects.push(_existingObject);
            }
            else {
                //if present increment the frequency 
                let _position: number = this._lstHuffmanNodeObjects.findIndex(x => x === _existingObject);
                //get the original frequency
                let _originalFrequency: number = _existingObject.getFrequency();
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