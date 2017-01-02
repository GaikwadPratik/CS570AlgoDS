import * as fs from 'fs';
import * as path from 'path';
let readlineSync = require('readline-sync');

class NodeObject<T>{
    private _data: T = null;
    private _nodeLeft: NodeObject<T> = null;
    private _nodeRight: NodeObject<T> = null;

    public get Data(): T {
        return this._data;
    }
    public set Data(value: T) {
        this._data = value;
    }

    public get LeftNode(): NodeObject<T> {
        return this._nodeLeft;
    }

    public set LeftNode(nodeValue: NodeObject<T>) {
        this._nodeLeft = nodeValue;
    }

    public get RightNode(): NodeObject<T> {
        return this._nodeRight;
    }

    public set RightNode(nodeValue: NodeObject<T>) {
        this._nodeRight = nodeValue;
    }
}

class SortedSet<T> {
    private _rootNodeObject: NodeObject<T> = null;

    public getRootNode(): NodeObject<T> {
        return this._rootNodeObject;
    }

    public add(value: T): void {
        try {
            let _newNode: NodeObject<T> = new NodeObject<T>();
            _newNode.Data = value;

            if (this._rootNodeObject === null)
                this._rootNodeObject = _newNode;
            else {
                let _currentNode: NodeObject<T> = this._rootNodeObject;
                let _parentNode: NodeObject<T> = null;

                while (true) {
                    _parentNode = _currentNode;
                    if (_currentNode.Data > value) {
                        _currentNode = _currentNode.LeftNode;
                        if (_currentNode === null) {
                            _parentNode.LeftNode = _newNode;
                            break;
                        }
                    }
                    else {
                        _currentNode = _currentNode.RightNode;
                        if (_currentNode === null) {
                            _parentNode.RightNode = _newNode;
                            break;
                        }
                    }
                }
            }
        }
        catch (exception) {
            console.error(`error occurred in 'Add'. Error info: ${exception}`);
        }
    }

    public IsEmpty(): boolean {
        let _bRtnVal = false;
        try {
            _bRtnVal = this._rootNodeObject === null;
        }
        catch (exception) {
            console.error(`error occurred in 'IsEmpty'. Error info: ${exception}`);
        }
        return _bRtnVal;
    }

    public Contains(value: T): boolean {
        let _bRtnVal = false;
        try {
            let _current: NodeObject<T> = this._rootNodeObject;
            while (_current !== null) {
                if (_current.Data === value) {
                    _bRtnVal = true;
                    break;
                }
                else if (_current.Data > value)
                    _current = _current.LeftNode;
                else
                    _current = _current.RightNode;
            }
        }
        catch (exception) {
            console.error(`error occurred in 'Contains'. Error info: ${exception}`);
        }
        return _bRtnVal;
    }

    public Remove(value: T): boolean {
        let _bRtnval = false;
        try {

            if (!this.IsEmpty()) {
                let _parentNode: NodeObject<T> = this._rootNodeObject;
                let _currentNode: NodeObject<T> = this._rootNodeObject;

                let _bValueFound: boolean = true;
                let _bInLeftNode: boolean = false;


                while (_currentNode.Data !== value) {
                    _parentNode = _currentNode;

                    if (_currentNode === null) {
                        _bValueFound = false;
                        break;
                    }
                    else if (_currentNode.Data > value) {
                        _bInLeftNode = true;
                        _currentNode = _currentNode.LeftNode;
                    }
                    else {
                        _bInLeftNode = false;
                        _currentNode = _currentNode.RightNode;
                    }
                }


                if (_bValueFound) {
                    if (_currentNode.LeftNode === null && _currentNode.RightNode === null) {
                        if (_currentNode === this._rootNodeObject)
                            this._rootNodeObject = null;
                        if (_bInLeftNode)
                            _parentNode.LeftNode = null;
                        else
                            _parentNode.RightNode = null;
                    }
                    else if (_currentNode.RightNode === null) {
                        if (_currentNode === this._rootNodeObject)
                            this._rootNodeObject = _currentNode.LeftNode;
                        else if (_bInLeftNode)
                            _parentNode.LeftNode = _currentNode.LeftNode;
                        else
                            _parentNode.RightNode = _currentNode.LeftNode;
                    }
                    else if (_currentNode.LeftNode === null) {
                        if (_currentNode === this._rootNodeObject)
                            this._rootNodeObject = _currentNode.RightNode;
                        else if (_bInLeftNode)
                            _parentNode.LeftNode = _currentNode.RightNode;
                        else
                            _parentNode.RightNode = _currentNode.RightNode;
                    }
                    else if (_currentNode.LeftNode !== null && _currentNode.RightNode !== null) {
                        let _nextNode: NodeObject<T> = this.GetNextNode(_currentNode);
                        if (_currentNode === this._rootNodeObject)
                            this._rootNodeObject = _nextNode;
                        else if (_bInLeftNode)
                            _parentNode.LeftNode = _nextNode;
                        else
                            _parentNode.RightNode = _nextNode;

                        _nextNode.LeftNode = _currentNode.LeftNode;
                    }
                    _bRtnval = true;
                }
                else
                    _bRtnval = false;
            }
            else
                _bRtnval = false;
        }
        catch (exception) {
            console.error(`error occurred in 'Delete'. Error info: ${exception}`);
        }
        return _bRtnval;
    }

    private GetNextNode(currentNode: NodeObject<T>): NodeObject<T> {
        let _rtnNode: NodeObject<T> = null;
        try {
            let _parentNode: NodeObject<T> = null;
            let _currentNode: NodeObject<T> = currentNode.RightNode;
            while (_currentNode !== null) {
                _parentNode = _rtnNode;
                _rtnNode = _currentNode;
                _currentNode = _currentNode.LeftNode;
            }

            if (_rtnNode !== currentNode.RightNode) {
                _parentNode.LeftNode = _rtnNode.RightNode;
                _rtnNode.RightNode = currentNode.RightNode;
            }
        }
        catch (exception) {
            console.error(`error occurred in 'GetNextNode'. Error info: ${exception}`);
        }
        return _rtnNode;
    }

    public Display(rootNode: NodeObject<T>): void {
        if (rootNode !== null) {
            this.Display(rootNode.LeftNode);
            process.stdout.write(`${rootNode.Data}`);
            if (rootNode.RightNode !== null)
                process.stdout.write(',');
            process.stdout.write(' ');
            this.Display(rootNode.RightNode);
        }
    }
}

class Program {
    private _regularExpression: RegExp = /[0-9]/;
    private _inputFileName: string = "infile.dat";
    private _sortedSet: SortedSet<number> = null;
    public Main(): void {
        let _selfProgramObject: Program = this;

        let _filePath: string = path.join(__dirname, this._inputFileName);
        fs.open(_filePath, fs.R_OK, (_err: NodeJS.ErrnoException, _fd: number) => {
            //in case of an error, handle it
            if (_err) {
                if (_err.code === 'ENOENT')
                    console.error(`The file with name '${this._inputFileName}' is not found in directory '${__dirname}'. Please check if filename is correct or not.`);
                else
                    console.error(_err);
            }
            else {
                let _readable: fs.ReadStream = fs.createReadStream(_filePath, {
                    encoding: 'utf8',
                    fd: null,
                }).on('error', function (error) {
                    throw error;
                });

                //https://nodejs.org/api/stream.html#stream_readable_read_size
                _readable.on('readable', function () {
                    try {
                        let _chunk: string = '';
                        while (null !== (_chunk = _readable.read(1))) {
                            if (_selfProgramObject._regularExpression.test(_chunk)) {
                                //Add inside the binary tree
                                if (_selfProgramObject._sortedSet === null)
                                    _selfProgramObject._sortedSet = new SortedSet<number>();
                                _selfProgramObject._sortedSet.add(+_chunk);
                            }
                            else if (_chunk !== ',')
                                console.log(`An invalid character '${_chunk}' was found in ${_filePath}. Please make sure it contains number only.`);
                        }
                    }
                    catch (exception) {
                        console.log(`An error occurred while reading data from file ${exception}`);
                    }
                });

                //once the file read operation is complete process start building graph.
                _readable.on('end', () => {
                    process.stdout.write(`Sorted Set A Contains `);
                    this._sortedSet.Display(this._sortedSet.getRootNode());
                    console.log();
                    let _userResponse: string = readlineSync.question('', { limit: [/^\d+$/], limitMessage: "Enter numeric value only" });

                    console.log(`User Input = ${+_userResponse}`);
                    console.log(`Output`);
                    console.log(this._sortedSet.Contains(+_userResponse));
                });
            }
        });
    }
}

new Program().Main();