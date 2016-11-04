"use strict";
var fs = require('fs');
var path = require('path');
var readlineSync = require('readline-sync');
var NodeObject = (function () {
    function NodeObject() {
        this._data = null;
        this._nodeLeft = null;
        this._nodeRight = null;
    }
    Object.defineProperty(NodeObject.prototype, "Data", {
        get: function () {
            return this._data;
        },
        set: function (value) {
            this._data = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeObject.prototype, "LeftNode", {
        get: function () {
            return this._nodeLeft;
        },
        set: function (nodeValue) {
            this._nodeLeft = nodeValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeObject.prototype, "RightNode", {
        get: function () {
            return this._nodeRight;
        },
        set: function (nodeValue) {
            this._nodeRight = nodeValue;
        },
        enumerable: true,
        configurable: true
    });
    return NodeObject;
}());
var SortedSet = (function () {
    function SortedSet() {
        this._rootNodeObject = null;
    }
    SortedSet.prototype.getRootNode = function () {
        return this._rootNodeObject;
    };
    SortedSet.prototype.add = function (value) {
        try {
            var _newNode = new NodeObject();
            _newNode.Data = value;
            if (this._rootNodeObject === null)
                this._rootNodeObject = _newNode;
            else {
                var _currentNode = this._rootNodeObject;
                var _parentNode = null;
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
            console.error("error occurred in 'Add'. Error info: " + exception);
        }
    };
    SortedSet.prototype.IsEmpty = function () {
        var _bRtnVal = false;
        try {
            _bRtnVal = this._rootNodeObject === null;
        }
        catch (exception) {
            console.error("error occurred in 'IsEmpty'. Error info: " + exception);
        }
        return _bRtnVal;
    };
    SortedSet.prototype.Contains = function (value) {
        var _bRtnVal = false;
        try {
            var _current = this._rootNodeObject;
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
            console.error("error occurred in 'Contains'. Error info: " + exception);
        }
        return _bRtnVal;
    };
    SortedSet.prototype.Remove = function (value) {
        var _bRtnval = false;
        try {
            if (!this.IsEmpty()) {
                var _parentNode = this._rootNodeObject;
                var _currentNode = this._rootNodeObject;
                var _bValueFound = true;
                var _bInLeftNode = false;
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
                        var _nextNode = this.GetNextNode(_currentNode);
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
            console.error("error occurred in 'Delete'. Error info: " + exception);
        }
        return _bRtnval;
    };
    SortedSet.prototype.GetNextNode = function (currentNode) {
        var _rtnNode = null;
        try {
            var _parentNode = null;
            var _currentNode = currentNode.RightNode;
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
            console.error("error occurred in 'GetNextNode'. Error info: " + exception);
        }
        return _rtnNode;
    };
    SortedSet.prototype.Display = function (rootNode) {
        if (rootNode !== null) {
            this.Display(rootNode.LeftNode);
            process.stdout.write("" + rootNode.Data);
            if (rootNode.RightNode !== null)
                process.stdout.write(',');
            process.stdout.write(' ');
            this.Display(rootNode.RightNode);
        }
    };
    return SortedSet;
}());
var Program = (function () {
    function Program() {
        this._regularExpression = /[0-9]/;
        this._inputFileName = "infile.dat";
        this._sortedSet = null;
    }
    Program.prototype.Main = function () {
        var _this = this;
        var _selfProgramObject = this;
        var _filePath = path.join(__dirname, this._inputFileName);
        fs.open(_filePath, fs.R_OK, function (_err, _fd) {
            //in case of an error, handle it
            if (_err) {
                if (_err.code === 'ENOENT')
                    console.error("The file with name '" + _this._inputFileName + "' is not found in directory '" + __dirname + "'. Please check if filename is correct or not.");
                else
                    console.error(_err);
            }
            else {
                var _readable_1 = fs.createReadStream(_filePath, {
                    encoding: 'utf8',
                    fd: null,
                }).on('error', function (error) {
                    throw error;
                });
                //https://nodejs.org/api/stream.html#stream_readable_read_size
                _readable_1.on('readable', function () {
                    try {
                        var _chunk = '';
                        while (null !== (_chunk = _readable_1.read(1))) {
                            if (_selfProgramObject._regularExpression.test(_chunk)) {
                                //Add inside the binary tree
                                if (_selfProgramObject._sortedSet === null)
                                    _selfProgramObject._sortedSet = new SortedSet();
                                _selfProgramObject._sortedSet.add(+_chunk);
                            }
                            else if (_chunk !== ',')
                                console.log("An invalid character '" + _chunk + "' was found in " + _filePath + ". Please make sure it contains number only.");
                        }
                    }
                    catch (exception) {
                        console.log("An error occurred while reading data from file " + exception);
                    }
                });
                //once the file read operation is complete process start building graph.
                _readable_1.on('end', function () {
                    process.stdout.write("Sorted Set A Contains\u00A0");
                    _this._sortedSet.Display(_this._sortedSet.getRootNode());
                    console.log();
                    var _userResponse = readlineSync.question('', { limit: [/^\d+$/], limitMessage: "Enter numeric value only" });
                    console.log("User Input = " + +_userResponse);
                    console.log("Output");
                    console.log(_this._sortedSet.Contains(+_userResponse));
                });
            }
        });
    };
    return Program;
}());
new Program().Main();
//# sourceMappingURL=app.js.map