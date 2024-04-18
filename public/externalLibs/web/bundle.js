(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.GoTag = void 0;
var GoTag;
(function (GoTag) {
    GoTag["Mutex"] = "Mutex";
    GoTag["WaitGroup"] = "WaitGroup";
    GoTag["Channel"] = "Channel";
    GoTag["Int"] = "Int";
    GoTag["String"] = "String";
    GoTag["Boolean"] = "Boolean";
})(GoTag = exports.GoTag || (exports.GoTag = {}));

},{}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Goroutine = exports.GoroutineState = void 0;
var GoroutineState;
(function (GoroutineState) {
    GoroutineState[GoroutineState["RUNNING"] = 0] = "RUNNING";
    GoroutineState[GoroutineState["RUNNABLE"] = 1] = "RUNNABLE";
    GoroutineState[GoroutineState["BLOCKED"] = 2] = "BLOCKED";
})(GoroutineState = exports.GoroutineState || (exports.GoroutineState = {}));
var Goroutine = /** @class */ (function () {
    function Goroutine(id, name, context) {
        this.id = id;
        this.name = name;
        this.context = context;
        this.state = GoroutineState.RUNNABLE;
    }
    Goroutine.prototype.isComplete = function (vm) {
        // Updated type of 'vm' parameter
        var PC = this.context.PC;
        return vm.instrs[PC].tag === 'DONE' || vm.instrs[PC].tag === 'GO_DONE';
    };
    return Goroutine;
}());
exports.Goroutine = Goroutine;

},{}],4:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Memory = exports.memory_size = exports.word_size = void 0;
var types_1 = require("../../common/types");
var utils_1 = require("../utils");
exports.word_size = 8;
var mega = Math.pow(2, 20);
exports.memory_size = 5000;
// update the size offset to 6
//  [1 byte tag, 4 bytes payload (depending on node type),
//  1 byte unused, 2 bytes #children]
var size_offset = 6;
// TODO: No garbage collection yet
var Memory = /** @class */ (function () {
    function Memory(state) {
        var _this = this;
        this.replicate = function (state) {
            _this.dataView = new DataView(state.data);
            _this.builtin_frame = state.builtin_frame;
            _this.False = state.False;
            _this.True = state.True;
            _this.Undefined = state.Undefined;
            _this.Unassigned = state.Unassigned;
            _this.Null = state.Null;
        };
        this.create_new_environment = function () {
            var non_empty_env = _this.mem_allocate_Environment(0);
            return _this.mem_Environment_extend(_this.builtin_frame, non_empty_env);
        };
        this.allocate_builtin_frame = function () {
            var primitive_values = Object.values(_this.primitive_object);
            var frame_address = _this.mem_allocate_Frame(primitive_values.length);
            for (var i = 0; i < primitive_values.length; i++) {
                var builtin = primitive_values[i];
                _this.mem_set_child(frame_address, i, _this.mem_allocate_Builtin(builtin.id));
            }
            _this.builtin_frame = frame_address;
        };
        this.mem_allocate = function (tag, size) {
            // console.log('free:', this.free(), 'size:', size, 'dataView.byteLength:', this.dataView.byteLength, 'word_size:', word_size)
            var current_free = _this.increase_free(size);
            if (current_free + size >= _this.dataView.byteLength / exports.word_size) {
                throw new Error('Out of memory');
            }
            var address = current_free;
            _this.setUint8(address * exports.word_size, tag);
            _this.setUint16(address * exports.word_size + size_offset, size);
            return address;
        };
        // get and set a word in mem at given address
        this.mem_get = function (address) { return _this.getUint64(address * exports.word_size); };
        this.mem_set = function (address, x) { return _this.setUint64(address * exports.word_size, x); };
        // child index starts at 0
        this.mem_get_child = function (address, child_index) { return _this.mem_get(address + 1 + child_index); };
        this.mem_set_child = function (address, child_index, value) {
            return _this.mem_set(address + 1 + child_index, value);
        };
        this.mem_get_tag = function (address) { return _this.getUint8(address * exports.word_size); };
        this.mem_get_size = function (address) { return _this.getUint16(address * exports.word_size + size_offset); };
        // access byte in mem, using address and offset
        this.mem_set_byte_at_offset = function (address, offset, value) {
            return _this.setUint8(address * exports.word_size + offset, value);
        };
        this.mem_get_byte_at_offset = function (address, offset) {
            return _this.getUint8(address * exports.word_size + offset);
        };
        // access byte in mem, using address and offset
        this.mem_set_2_bytes_at_offset = function (address, offset, value) {
            return _this.setUint16(address * exports.word_size + offset, value);
        };
        this.mem_get_2_bytes_at_offset = function (address, offset) {
            return _this.getUint16(address * exports.word_size + offset);
        };
        // boolean values carry their value (0 for false, 1 for true)
        // in the byte following the tag
        this.is_False = function (address) { return _this.mem_get_tag(address) === utils_1.False_tag; };
        this.is_True = function (address) { return _this.mem_get_tag(address) === utils_1.True_tag; };
        this.is_Boolean = function (address) { return _this.is_True(address) || _this.is_False(address); };
        this.is_Null = function (address) { return _this.mem_get_tag(address) === utils_1.Null_tag; };
        this.is_Unassigned = function (address) { return _this.mem_get_tag(address) === utils_1.Unassigned_tag; };
        this.is_Undefined = function (address) { return _this.mem_get_tag(address) === utils_1.Undefined_tag; };
        this.allocate_literal_values = function () {
            _this.False = _this.mem_allocate(utils_1.False_tag, 1);
            _this.True = _this.mem_allocate(utils_1.True_tag, 1);
            _this.Null = _this.mem_allocate(utils_1.Null_tag, 1);
            _this.Unassigned = _this.mem_allocate(utils_1.Unassigned_tag, 1);
            _this.Undefined = _this.mem_allocate(utils_1.Undefined_tag, 1);
        };
        // builtins: builtin id is encoded in second byte
        // [1 byte tag, 1 byte id, 3 bytes unused,
        //  2 bytes #children, 1 byte unused]
        // Note: #children is 0
        this.is_Builtin = function (address) { return _this.mem_get_tag(address) === utils_1.Builtin_tag; };
        this.mem_allocate_Builtin = function (id) {
            var address = _this.mem_allocate(utils_1.Builtin_tag, 1);
            _this.mem_set_byte_at_offset(address, 1, id);
            return address;
        };
        this.mem_get_Builtin_id = function (address) { return _this.mem_get_byte_at_offset(address, 1); };
        // closure
        // [1 byte tag, 1 byte arity, 2 bytes pc, 1 byte unused,
        //  2 bytes #children, 1 byte unused]
        // followed by the address of env
        // note: currently bytes at offset 4 and 7 are not used;
        //   they could be used to increase pc and #children range
        this.mem_allocate_Closure = function (arity, pc, env) {
            var address = _this.mem_allocate(utils_1.Closure_tag, 2);
            _this.mem_set_byte_at_offset(address, 1, arity);
            _this.mem_set_2_bytes_at_offset(address, 2, pc);
            _this.mem_set(address + 1, env);
            return address;
        };
        this.mem_get_Closure_arity = function (address) { return _this.mem_get_byte_at_offset(address, 1); };
        this.mem_get_Closure_pc = function (address) { return _this.mem_get_2_bytes_at_offset(address, 2); };
        this.mem_get_Closure_environment = function (address) { return _this.mem_get_child(address, 0); };
        this.is_Closure = function (address) { return _this.mem_get_tag(address) === utils_1.Closure_tag; };
        // block frame
        // [1 byte tag, 4 bytes unused,
        //  2 bytes #children, 1 byte unused]
        this.mem_allocate_Blockframe = function (env) {
            var address = _this.mem_allocate(utils_1.Blockframe_tag, 2);
            _this.mem_set(address + 1, env);
            return address;
        };
        this.mem_get_Blockframe_environment = function (address) { return _this.mem_get_child(address, 0); };
        this.is_Blockframe = function (address) { return _this.mem_get_tag(address) === utils_1.Blockframe_tag; };
        // call frame
        // [1 byte tag, 1 byte unused, 2 bytes pc,
        //  1 byte unused, 2 bytes #children, 1 byte unused]
        // followed by the address of env
        this.mem_allocate_Callframe = function (env, pc) {
            var address = _this.mem_allocate(utils_1.Callframe_tag, 2);
            _this.mem_set_2_bytes_at_offset(address, 2, pc);
            _this.mem_set(address + 1, env);
            return address;
        };
        this.mem_get_Callframe_environment = function (address) { return _this.mem_get_child(address, 0); };
        this.mem_get_Callframe_pc = function (address) { return _this.mem_get_2_bytes_at_offset(address, 2); };
        this.is_Callframe = function (address) { return _this.mem_get_tag(address) === utils_1.Callframe_tag; };
        // environment frame
        // [1 byte tag, 4 bytes unused,
        //  2 bytes #children, 1 byte unused]
        // followed by the addresses of its values
        this.mem_allocate_Frame = function (number_of_values) {
            return _this.mem_allocate(utils_1.Frame_tag, number_of_values + 1);
        };
        // environment
        // [1 byte tag, 4 bytes unused,
        //  2 bytes #children, 1 byte unused]
        // followed by the addresses of its frames
        this.mem_allocate_Environment = function (number_of_frames) {
            return _this.mem_allocate(utils_1.Environment_tag, number_of_frames + 1);
        };
        // access environment given by address
        // using a "position", i.e. a pair of
        // frame index and value index
        this.mem_get_Environment_value = function (env_address, position) {
            var frame_index = position[0], value_index = position[1];
            var frame_address = _this.mem_get_child(env_address, frame_index);
            return _this.mem_get_child(frame_address, value_index);
        };
        this.mem_set_Environment_value = function (env_address, position, value) {
            //display(env_address, "env_address:")
            var frame_index = position[0], value_index = position[1];
            var frame_address = _this.mem_get_child(env_address, frame_index);
            _this.mem_set_child(frame_address, value_index, value);
        };
        // extend a given environment by a new frame:
        // create a new environment that is bigger by 1
        // frame slot than the given environment.
        // copy the frame Addresses of the given
        // environment to the new environment.
        // enter the address of the new frame to end
        // of the new environment
        this.mem_Environment_extend = function (frame_address, env_address) {
            var old_size = _this.mem_get_size(env_address);
            var new_env_address = _this.mem_allocate_Environment(old_size);
            var i;
            for (i = 0; i < old_size - 1; i++) {
                _this.mem_set_child(new_env_address, i, _this.mem_get_child(env_address, i));
            }
            _this.mem_set_child(new_env_address, i, frame_address);
            return new_env_address;
        };
        // pair
        // [1 byte tag, 4 bytes unused,
        //  2 bytes #children, 1 byte unused]
        // followed by head and tail addresses, one word each
        this.mem_allocate_Pair = function (hd, tl) {
            var pair_address = _this.mem_allocate(utils_1.Pair_tag, 3);
            _this.mem_set_child(pair_address, 0, hd);
            _this.mem_set_child(pair_address, 1, tl);
            return pair_address;
        };
        this.is_Pair = function (address) { return _this.mem_get_tag(address) === utils_1.Pair_tag; };
        // number
        // [1 byte tag, 4 bytes unused,
        //  2 bytes #children, 1 byte unused]
        // followed by the number, one word
        // note: #children is 0
        this.mem_allocate_Number = function (n) {
            var number_address = _this.mem_allocate(utils_1.Number_tag, 2);
            _this.mem_set(number_address + 1, n);
            return number_address;
        };
        this.is_Number = function (address) { return _this.mem_get_tag(address) === utils_1.Number_tag; };
        // Mutex
        // [1 byte tag, 4 bytes unused,
        //  2 bytes #children, 1 byte unused]
        // followed by 1 boolean (locked), 1 owner
        // note: #children is 0
        this.mem_allocate_Mutex = function () {
            var mutex_address = _this.mem_allocate(utils_1.Mutex_tag, 3);
            _this.mem_set(mutex_address + 1, 0);
            _this.mem_set(mutex_address + 2, 0);
            return mutex_address;
        };
        this.is_Mutex = function (address) { return _this.mem_get_tag(address) === utils_1.Mutex_tag; };
        // WaitGroup
        // [1 byte tag, 4 bytes unused,
        //  2 bytes #children, 1 byte unused]
        // followed by 1 number (wait count)
        // note: #children is 0
        this.mem_allocate_WaitGroup = function () {
            var wg_address = _this.mem_allocate(utils_1.WaitGroup_tag, 2);
            _this.mem_set(wg_address + 1, 0);
            return wg_address;
        };
        this.is_WaitGroup = function (address) { return _this.mem_get_tag(address) === utils_1.WaitGroup_tag; };
        // Buffered Channel
        // [1 byte tag, 4 bytes unused,
        //  2 bytes #children, 1 byte unused]
        // followed by 1 type, 1 buffer count (number), 1 slot-out, 1 lock
        // buffer size number of addresses
        // note: #children is 0
        this.mem_allocate_Buffered_Channel = function (size, type) {
            var ch_address = _this.mem_allocate(utils_1.Buffered_Channel_tag, 5 + Math.max(1, size));
            _this.mem_set(ch_address + 1, type);
            _this.mem_set(ch_address + 2, 0);
            _this.mem_set(ch_address + 3, 0);
            _this.mem_set(ch_address + 4, 0);
            return ch_address;
        };
        this.is_Buffered_Channel = function (address) { return _this.mem_get_tag(address) === utils_1.Buffered_Channel_tag; };
        // Unbuffered Channel
        // [1 byte tag, 4 bytes unused,
        //  2 bytes #children, 1 byte unused]
        // followed by 1 type
        // note: #children is 0
        this.mem_allocate_Unbuffered_Channel = function (type) {
            var ch_address = _this.mem_allocate(utils_1.Unbuffered_Channel_tag, 2);
            _this.mem_set(ch_address + 1, type);
            return ch_address;
        };
        this.is_Unbuffered_Channel = function (address) { return _this.mem_get_tag(address) === utils_1.Unbuffered_Channel_tag; };
        // Channel
        this.mem_allocate_Channel = function (size, type) {
            return size === 0
                ? _this.mem_allocate_Unbuffered_Channel(type)
                : _this.mem_allocate_Buffered_Channel(size, type);
        };
        this.is_Channel = function (address) {
            return _this.is_Buffered_Channel(address) || _this.is_Unbuffered_Channel(address);
        };
        this.unop_microcode = {
            '<-': function (chan_addr, state, goBlockBehavior) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.is_Channel(chan_addr)) {
                                throw new Error('unop: not a channel');
                            }
                            return [4 /*yield*/, this.channel_receive(chan_addr, state, goBlockBehavior)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); }
        };
        this.binop_microcode = {
            '+': function (x, y) { return ({ tag: types_1.GoTag.Int, val: x + y }); },
            '*': function (x, y) { return ({ tag: types_1.GoTag.Int, val: x * y }); },
            '-': function (x, y) { return ({ tag: types_1.GoTag.Int, val: x - y }); },
            '/': function (x, y) { return ({ tag: types_1.GoTag.Int, val: x / y }); },
            '%': function (x, y) { return ({ tag: types_1.GoTag.Int, val: x % y }); },
            '<': function (x, y) { return ({ tag: types_1.GoTag.Boolean, val: x < y }); },
            '<=': function (x, y) { return ({ tag: types_1.GoTag.Boolean, val: x <= y }); },
            '>=': function (x, y) { return ({ tag: types_1.GoTag.Boolean, val: x >= y }); },
            '>': function (x, y) { return ({ tag: types_1.GoTag.Boolean, val: x > y }); },
            '===': function (x, y) { return ({ tag: types_1.GoTag.Boolean, val: x === y }); },
            '!==': function (x, y) { return ({ tag: types_1.GoTag.Boolean, val: x !== y }); }
        };
        // conversions between addresses and JS_value
        this.address_to_JS_value = function (x) {
            return _this.is_Boolean(x)
                ? _this.is_True(x)
                    ? true
                    : false
                : _this.is_Number(x)
                    ? _this.mem_get(x + 1)
                    : _this.is_Undefined(x)
                        ? undefined
                        : _this.is_Unassigned(x)
                            ? '<unassigned>'
                            : _this.is_Null(x)
                                ? null
                                : _this.is_Pair(x)
                                    ? [
                                        _this.address_to_JS_value(_this.mem_get_child(x, 0)),
                                        _this.address_to_JS_value(_this.mem_get_child(x, 1))
                                    ]
                                    : _this.is_Closure(x)
                                        ? '<closure>'
                                        : _this.is_Builtin(x)
                                            ? '<builtin>'
                                            : console.error('unknown word tag during address to JS value conversion:' + x);
        };
        this.JS_value_to_address = function (x) {
            return x === undefined
                ? _this.Undefined
                : x.tag === types_1.GoTag.Boolean
                    ? x.val
                        ? _this.True
                        : _this.False
                    : x.tag === types_1.GoTag.Int
                        ? _this.mem_allocate_Number(x.val ? x.val : 0)
                        : x.tag == types_1.GoTag.Mutex
                            ? _this.mem_allocate_Mutex()
                            : x.tag == types_1.GoTag.WaitGroup
                                ? _this.mem_allocate_WaitGroup()
                                : x.tag == types_1.GoTag.Channel
                                    ? _this.mem_allocate_Channel(0, x.type === types_1.GoTag.Int
                                        ? utils_1.Number_tag
                                        : x.type === types_1.GoTag.Boolean
                                            ? utils_1.True_tag
                                            : utils_1.Null_tag)
                                    : console.error('unknown JS value during JS value to address conversion:' + x);
        };
        /**
         * Builtins
         */
        // in this machine, the builtins take their
        // arguments directly from the operand stack,
        // to save the creation of an intermediate
        // argument array
        this.builtin_object = {
            make: function (state) {
                var addr = state.OS.pop();
                if (_this.is_Channel(addr)) {
                    // unbuffered channel
                    return _this.mem_allocate_Channel(0, _this.mem_get(addr + 3));
                }
                var size = _this.address_to_JS_value(addr);
                var addr2 = state.OS.pop();
                if (!_this.is_Channel(addr2) || size < 0) {
                    throw new Error('make: not a channel');
                }
                return _this.mem_allocate_Channel(size, _this.mem_get(addr + 3));
            },
            Println: function (state) {
                var address = state.OS.pop();
                console.log(_this.address_to_JS_value(address));
                return address;
            },
            Lock: function (state, goBlockBehavior) {
                return _this.lock(state, goBlockBehavior);
            },
            Unlock: function (state, goBlockBehavior) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.unlock(state, goBlockBehavior)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); },
            Add: function (state, goBlockBehavior) {
                return _this.wg_add(state, goBlockBehavior);
            },
            Done: function (state, goBlockBehavior) {
                return _this.wg_done(state, goBlockBehavior);
            },
            Wait: function (state, goBlockBehavior) {
                return _this.wg_wait(state, goBlockBehavior);
            }
        };
        if (state) {
            this.replicate(state);
        }
        this.primitive_object = {};
        this.builtin_array = [];
        {
            var i = 0;
            for (var key in this.builtin_object) {
                this.primitive_object[key] = {
                    tag: 'BUILTIN',
                    id: i,
                    arity: 1
                };
                this.builtin_array[i++] = this.builtin_object[key];
            }
        }
    }
    Memory.prototype.initialize = function () {
        this.mem_make(exports.memory_size * exports.word_size);
        this.builtin_frame = 0;
        this.allocate_literal_values();
        this.allocate_builtin_frame();
        // TODO: constants
    };
    Memory.prototype.base_state = function () {
        return {
            data: this.dataView.buffer,
            builtin_frame: this.builtin_frame,
            False: this.False,
            True: this.True,
            Undefined: this.Undefined,
            Unassigned: this.Unassigned,
            Null: this.Null
        };
    };
    return Memory;
}());
exports.Memory = Memory;

},{"../../common/types":2,"../utils":8}],5:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.SharedMemory = void 0;
var types_1 = require("../../common/types");
var goroutine_1 = require("../goroutine");
var utils_1 = require("../utils");
var memory_1 = require("./memory");
var SharedMemory = /** @class */ (function (_super) {
    __extends(SharedMemory, _super);
    function SharedMemory(state) {
        var _this = _super.call(this, state) || this;
        _this.memory_state = function () {
            var super_state = _super.prototype.base_state.call(_this);
            super_state.free_data = _this.free_data;
            return super_state;
        };
        _this.handle_lock = function (state, addr, goBlockBehavior) {
            var goroutine = new goroutine_1.Goroutine(state.currentThread, state.currentThreadName, state);
            var goPark = { type: 'go_park', hash: addr, goroutine: goroutine };
            postMessage(goPark);
        };
        _this.handle_chan_lock = function (state, addr, valueAddr, goBlockBehavior) {
            var goroutine = new goroutine_1.Goroutine(state.currentThread, state.currentThreadName, state);
            var goPark = { type: 'go_park', hash: addr, goroutine: goroutine, val_addr: valueAddr };
            postMessage(goPark);
        };
        if (state) {
            _this.data = state.data;
            if (state.free_data) {
                _this.free_data = state.free_data;
            }
        }
        else {
            _this.free_data = new SharedArrayBuffer(4);
            Atomics.store(new Uint32Array(_this.free_data), 0, 0);
        }
        if (!state) {
            _this.initialize();
        }
        return _this;
    }
    SharedMemory.prototype.mem_make = function (bytes) {
        if (bytes % 8 !== 0) {
            console.error('mem bytes must be divisible by 8');
        }
        var data = new SharedArrayBuffer(bytes);
        var view = new DataView(data);
        this.data = data;
        this.dataView = view;
    };
    SharedMemory.prototype.set_memory = function (data) {
        if (data.byteLength % 8 !== 0) {
            console.error('mem bytes must be divisible by 8');
        }
        this.data = data;
        this.dataView = new DataView(data);
    };
    SharedMemory.prototype.free = function () {
        return Atomics.load(new Uint32Array(this.free_data), 0);
    };
    SharedMemory.prototype.increase_free = function (size) {
        return Atomics.add(new Uint32Array(this.free_data), 0, size);
    };
    SharedMemory.prototype.setUint8 = function (address, value) {
        Atomics.store(new Uint8Array(this.data, address, 1), 0, value);
    };
    SharedMemory.prototype.setUint16 = function (address, value) {
        Atomics.store(new Uint16Array(this.data, address, 1), 0, value);
    };
    SharedMemory.prototype.setUint64 = function (address, value) {
        Atomics.store(new BigUint64Array(this.data, address, 1), 0, BigInt(value));
    };
    SharedMemory.prototype.getUint8 = function (address) {
        return Atomics.load(new Uint8Array(this.data, address, 1), 0);
    };
    SharedMemory.prototype.getUint16 = function (address) {
        return Atomics.load(new Uint16Array(this.data, address, 1), 0);
    };
    SharedMemory.prototype.getUint64 = function (address) {
        return Number(Atomics.load(new BigUint64Array(this.data, address, 1), 0));
    };
    SharedMemory.prototype.lock = function (state, goBlockBehavior) {
        var address = state.OS[state.OS.length - 2];
        if (!this.is_Mutex(address)) {
            console.error('not a mutex');
        }
        state.OS.pop(); // pop the fun; apply builtin will pop the method name
        var locked = this.atomic_compare_exchange_mem_64(address + 1, 0, 1);
        if (locked === 1) {
            // handle state where mutex is already locked
            state.state = goroutine_1.GoroutineState.BLOCKED;
            this.handle_lock(state, address, goBlockBehavior);
        }
        else {
            this.mem_set(address + 2, state.currentThread);
        }
        return address;
    };
    SharedMemory.prototype.unlock = function (state, goBlockBehavior) {
        return __awaiter(this, void 0, void 0, function () {
            var address, locked, owner, waiting;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        address = state.OS[state.OS.length - 2];
                        if (!this.is_Mutex(address)) {
                            throw new Error('not a mutex');
                        }
                        locked = this.mem_get(address + 1);
                        owner = this.mem_get(address + 2);
                        if (locked === 0 || owner !== state.currentThread) {
                            throw new Error('sync: unlock of unlocked mutex');
                        }
                        return [4 /*yield*/, this.handle_unlock(address, goBlockBehavior)];
                    case 1:
                        waiting = _a.sent();
                        if (waiting) {
                            this.mem_set(address + 2, waiting.id);
                        }
                        else {
                            this.mem_set(address + 1, 0);
                        }
                        state.OS.pop();
                        return [2 /*return*/, address];
                }
            });
        });
    };
    SharedMemory.prototype.wg_add = function (state, goBlockBehavior) {
        var address = state.OS[state.OS.length - 3];
        if (!this.is_WaitGroup(address)) {
            throw new Error('not a WaitGroup');
        }
        var additional = this.address_to_JS_value(state.OS.pop());
        this.atomic_add_mem_64(address + 1, additional);
        state.OS.pop();
        return address;
    };
    SharedMemory.prototype.wg_wait = function (state, goBlockBehavior) {
        var address = state.OS[state.OS.length - 2];
        if (!this.is_WaitGroup(address)) {
            throw new Error('not a WaitGroup');
        }
        state.OS.pop();
        var count = this.mem_get(address + 1);
        if (count !== 0) {
            state.state = goroutine_1.GoroutineState.BLOCKED;
            this.handle_lock(state, address, goBlockBehavior);
        }
        return address;
    };
    SharedMemory.prototype.wg_done = function (state, goBlockBehavior) {
        var address = state.OS[state.OS.length - 2];
        if (!this.is_WaitGroup(address)) {
            throw new Error('not a WaitGroup');
        }
        this.atomic_sub_mem_64(address + 1, 1);
        if (this.mem_get(address + 1) === 0) {
            this.handle_unlock_all(address, goBlockBehavior);
        }
        state.OS.pop();
        return address;
    };
    SharedMemory.prototype.channel_send = function (state, goBlockBehavior) {
        return __awaiter(this, void 0, void 0, function () {
            var in_addr, chan_addr, val, val_addr, buffer_size, lockAddr, old_count, new_count, hash, receiver, addr, slotOut, slotIn, receiver, addr, hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        in_addr = state.OS.pop();
                        chan_addr = state.OS.pop();
                        if (!this.is_Channel(chan_addr)) {
                            console.error('send: not a channel');
                            return [2 /*return*/, chan_addr];
                        }
                        state.OS.pop();
                        val = this.address_to_JS_value(in_addr);
                        val_addr = this.JS_value_to_address({ tag: types_1.GoTag.Int, val: val });
                        if (!this.is_Buffered_Channel(chan_addr)) return [3 /*break*/, 2];
                        buffer_size = this.mem_get_size(chan_addr) - 5 // 5 config values
                        ;
                        lockAddr = chan_addr + 4;
                        // busy waiting here: should get the lock relatively fast
                        while (this.atomic_compare_exchange_mem_64(lockAddr, 0, 1) === 1) { }
                        old_count = this.mem_get(chan_addr + 2);
                        new_count = old_count + 1;
                        if (old_count >= buffer_size) {
                            state.state = goroutine_1.GoroutineState.BLOCKED;
                            hash = chan_addr + utils_1.sendq;
                            this.handle_chan_lock(state, hash, val_addr, goBlockBehavior);
                            this.atomic_sub_mem_64(lockAddr, 1);
                            return [2 /*return*/, chan_addr];
                        }
                        return [4 /*yield*/, this.peek_chan_recv(chan_addr, goBlockBehavior)];
                    case 1:
                        receiver = _a.sent();
                        if (receiver && receiver.goroutine) {
                            if (old_count !== 0) {
                                console.log('should not happen');
                            }
                            else {
                                addr = receiver.addr;
                                this.mem_set(addr + 1, this.mem_get(val_addr + 1));
                                this.put_to_global_run_queue(receiver.goroutine);
                            }
                        }
                        else {
                            slotOut = this.mem_get(chan_addr + 3);
                            slotIn = (slotOut + old_count) % buffer_size;
                            this.mem_set(chan_addr + 2, new_count);
                            this.mem_set_child(chan_addr, 4 + slotIn, val_addr);
                        }
                        // release the lock
                        this.atomic_sub_mem_64(lockAddr, 1);
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.peek_chan_recv(chan_addr, goBlockBehavior)];
                    case 3:
                        receiver = _a.sent();
                        if (receiver && receiver.goroutine) {
                            addr = receiver.addr;
                            this.mem_set(addr + 1, this.mem_get(val_addr + 1));
                            this.put_to_global_run_queue(receiver.goroutine);
                        }
                        else {
                            hash = chan_addr + utils_1.sendq;
                            this.handle_chan_lock(state, hash, val_addr, goBlockBehavior);
                            state.state = goroutine_1.GoroutineState.BLOCKED;
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/, chan_addr];
                }
            });
        });
    };
    SharedMemory.prototype.channel_receive = function (chan_addr, state, goBlockBehavior) {
        return __awaiter(this, void 0, void 0, function () {
            var val_addr, buffer_size, lockAddr, old_count, new_count, hash, slotOut, addr, sender, saddr, sender, addr, hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        val_addr = this.JS_value_to_address({ tag: types_1.GoTag.Int, val: 0 });
                        if (!this.is_Buffered_Channel(chan_addr)) return [3 /*break*/, 2];
                        buffer_size = this.mem_get_size(chan_addr) - 5 // 5 config values
                        ;
                        lockAddr = chan_addr + 4;
                        while (this.atomic_compare_exchange_mem_64(lockAddr, 0, 1) === 1) { }
                        old_count = this.mem_get(chan_addr + 2);
                        new_count = old_count - 1;
                        if (old_count === 0) {
                            hash = chan_addr + utils_1.recvq;
                            state.state = goroutine_1.GoroutineState.BLOCKED;
                            // TODO: wrapper because of inefficient communication
                            state.OS.push(val_addr);
                            this.handle_chan_lock(state, hash, val_addr, goBlockBehavior);
                            state.OS.pop();
                            this.atomic_sub_mem_64(lockAddr, 1);
                            return [2 /*return*/, val_addr];
                        }
                        slotOut = this.mem_get(chan_addr + 3);
                        addr = this.mem_get_child(chan_addr, 4 + slotOut);
                        // copy the value
                        this.mem_set(val_addr + 1, this.mem_get(addr + 1));
                        return [4 /*yield*/, this.peek_chan_send(chan_addr, goBlockBehavior)];
                    case 1:
                        sender = _a.sent();
                        if (old_count === buffer_size && sender && sender.goroutine) {
                            saddr = sender.addr;
                            this.mem_set(chan_addr + 4 + slotOut, this.mem_get(saddr + 1));
                            this.put_to_global_run_queue(sender.goroutine);
                        }
                        else {
                            this.mem_set(chan_addr + 2, new_count);
                        }
                        this.mem_set(chan_addr + 3, (slotOut + 1) % buffer_size);
                        // release the lock
                        this.atomic_sub_mem_64(lockAddr, 1);
                        return [2 /*return*/, val_addr];
                    case 2: return [4 /*yield*/, this.peek_chan_send(chan_addr, goBlockBehavior)];
                    case 3:
                        sender = _a.sent();
                        if (sender && sender.goroutine) {
                            addr = sender.addr;
                            this.mem_set(val_addr + 1, this.mem_get(addr + 1));
                            this.put_to_global_run_queue(sender.goroutine);
                        }
                        else {
                            hash = chan_addr + utils_1.recvq;
                            state.state = goroutine_1.GoroutineState.BLOCKED;
                            // TODO: wrapper because of inefficient communication
                            state.OS.push(val_addr);
                            this.handle_chan_lock(state, hash, val_addr, goBlockBehavior);
                            state.OS.pop();
                        }
                        return [2 /*return*/, val_addr];
                }
            });
        });
    };
    SharedMemory.prototype.atomic_compare_exchange_mem_64 = function (address, expected, desired) {
        address = address * memory_1.word_size;
        return Number(Atomics.compareExchange(new BigUint64Array(this.data, address, 1), 0, BigInt(expected), BigInt(desired)));
    };
    SharedMemory.prototype.atomic_add_mem_64 = function (address, value) {
        address = address * memory_1.word_size;
        return Number(Atomics.add(new BigUint64Array(this.data, address, 1), 0, BigInt(value)));
    };
    SharedMemory.prototype.atomic_sub_mem_64 = function (address, value) {
        address = address * memory_1.word_size;
        return Number(Atomics.sub(new BigUint64Array(this.data, address, 1), 0, BigInt(value)));
    };
    SharedMemory.prototype.handle_unlock = function (addr, goBlockBehavior) {
        return __awaiter(this, void 0, void 0, function () {
            var goReady;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        goReady = { type: 'go_ready', hash: addr };
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                var handler = function (e) {
                                    if (e.data.type === 'go_ready_reply') {
                                        var _a = e.data, goroutine = _a.goroutine, hash = _a.hash, success = _a.success;
                                        if (hash === addr) {
                                            var go = success ? goroutine : undefined;
                                            removeEventListener('message', handler);
                                            resolve(go);
                                        }
                                    }
                                };
                                addEventListener('message', handler);
                                /// post message and wait for reply
                                postMessage(goReady);
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SharedMemory.prototype.handle_unlock_all = function (addr, goBlockBehavior) {
        return __awaiter(this, void 0, void 0, function () {
            var goReady;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        goReady = { type: 'go_ready', hash: addr };
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                var handler = function (e) {
                                    if (e.data.type === 'go_ready_reply') {
                                        var _a = e.data, hash = _a.hash, success = _a.success;
                                        if (hash === addr) {
                                            removeEventListener('message', handler);
                                            resolve(success);
                                        }
                                    }
                                };
                                addEventListener('message', handler);
                                /// post message and wait for reply
                                postMessage(goReady);
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SharedMemory.prototype.handle_chan_unlock = function (fhash, goBlockBehavior) {
        return __awaiter(this, void 0, void 0, function () {
            var goReady;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        goReady = { type: 'go_ready', hash: fhash, is_chan: true };
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                var handler = function (e) {
                                    if (e.data.type === 'go_ready_reply') {
                                        var _a = e.data, goroutine = _a.goroutine, hash = _a.hash, val_addr = _a.val_addr, success = _a.success;
                                        if (fhash === hash) {
                                            var go = success ? goroutine : undefined;
                                            removeEventListener('message', handler);
                                            resolve({ goroutine: go, addr: val_addr });
                                        }
                                    }
                                };
                                addEventListener('message', handler);
                                /// post message and wait for reply
                                postMessage(goReady);
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SharedMemory.prototype.peek_chan_send = function (chan_addr, goBlockBehavior) {
        return __awaiter(this, void 0, void 0, function () {
            var hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hash = chan_addr + utils_1.sendq;
                        return [4 /*yield*/, this.handle_chan_unlock(hash, goBlockBehavior)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SharedMemory.prototype.peek_chan_recv = function (chan_addr, goBlockBehavior) {
        return __awaiter(this, void 0, void 0, function () {
            var hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hash = chan_addr + utils_1.recvq;
                        return [4 /*yield*/, this.handle_chan_unlock(hash, goBlockBehavior)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SharedMemory.prototype.put_to_global_run_queue = function (goroutine) {
        // use this interface for now
        var goSpawn = { type: 'go_spawn', goroutine: goroutine };
        postMessage(goSpawn);
    };
    return SharedMemory;
}(memory_1.Memory));
exports.SharedMemory = SharedMemory;

},{"../../common/types":2,"../goroutine":3,"../utils":8,"./memory":4}],6:[function(require,module,exports){
(function (process){(function (){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ParallelScheduler = exports.WorkerState = exports.isNode = void 0;
var goroutine_1 = require("../goroutine");
var sharedMemory_1 = require("../memory/sharedMemory");
var vm_1 = require("../vm");
exports.isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
var worker_path = '/externalLibs/web/bundle.js';
var WorkerState;
(function (WorkerState) {
    WorkerState[WorkerState["IDLE"] = 0] = "IDLE";
    WorkerState[WorkerState["RUNNING"] = 1] = "RUNNING";
})(WorkerState = exports.WorkerState || (exports.WorkerState = {}));
var ParallelScheduler = /** @class */ (function () {
    function ParallelScheduler(maxWorker, instrs) {
        this.maxWorker = maxWorker;
        this.workers = [];
        this.workerState = [];
        this.globalRunQueue = [];
        this.memory = new sharedMemory_1.SharedMemory();
        this.instructions = instrs;
        this.dummyVM = new vm_1.GoVM(instrs, this.memory);
        this.blocked = {};
        this.channelBlocked = {};
        this.create_worker();
    }
    ParallelScheduler.prototype.create_worker = function () {
        try {
            var worker = new Worker(worker_path, { type: 'module' });
            this.workerState.push(WorkerState.IDLE);
            this.workers.push(worker);
            worker.onmessage = this.handleLog;
            var done = this.initializeVM(worker);
        }
        catch (e) {
            console.log(e.message);
        }
    };
    ParallelScheduler.prototype.initializeVM = function (worker) {
        return __awaiter(this, void 0, void 0, function () {
            var setUp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setUp = {
                            type: 'setup',
                            state: this.memory.memory_state(),
                            instrs: this.instructions
                        };
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var setUpHandler = function (event) {
                                    if (event.data.type === 'setup_done') {
                                        worker.removeEventListener('message', setUpHandler);
                                        resolve(event.data);
                                    }
                                };
                                worker.addEventListener('message', setUpHandler);
                                worker.postMessage(setUp);
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ParallelScheduler.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var main, all_done;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        main = this.dummyVM.main();
                        this.globalRunQueue.push(main);
                        return [4 /*yield*/, this.wait()];
                    case 1:
                        all_done = _a.sent();
                        if (!all_done) {
                            throw new Error('All goroutines are asleep - deadlock!');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ParallelScheduler.prototype.wait = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var main_listener = function (event) {
                if (event.data.type === 'main_done') {
                    _this.teardown();
                    resolve(true);
                }
                else if (event.data.type === 'go_spawn') {
                    _this.handleGoSpawn(event, main_listener);
                }
                else if (event.data.type === 'go_park') {
                    _this.handlePark(event);
                }
                else if (event.data.type === 'go_ready') {
                    _this.handleReady(event);
                }
                else if (event.data.type === 'go_request') {
                    _this.handleRequest(event);
                    if (_this.workerState.every(function (state) { return state === WorkerState.IDLE; })) {
                        _this.teardown();
                        resolve(false);
                    }
                }
            };
            _this.workers.forEach(function (worker) {
                worker.addEventListener('message', main_listener);
            });
        });
    };
    ParallelScheduler.prototype.handleGoSpawn = function (event, mainHandler) {
        var spawnNew = event.data;
        var newGo = spawnNew.goroutine;
        this.add(newGo);
        var workerIdx = this.findIdleWorker();
        if (workerIdx !== -1) {
            return;
        }
        if (this.workers.length < this.maxWorker) {
            this.create_worker();
            this.workers[this.workers.length - 1].addEventListener('message', mainHandler);
        }
    };
    ParallelScheduler.prototype.handlePark = function (event) {
        var park = event.data;
        var goroutine = park.goroutine;
        var hash = park.hash;
        if (park.val_addr) {
            this.add_channel_blocked(hash, goroutine, park.val_addr);
        }
        else {
            this.add_blocked(hash, goroutine);
        }
    };
    ParallelScheduler.prototype.handleReady = function (event) {
        var worker = event.target;
        var ready = event.data;
        var hash = ready.hash;
        if (ready.is_chan) {
            var chan = this.remove_channel_blocked(hash);
            var message = chan
                ? {
                    type: 'go_ready_reply',
                    hash: hash,
                    goroutine: chan.goroutine,
                    val_addr: chan.addr,
                    success: true
                }
                : { type: 'go_ready_reply', hash: hash, success: false };
            worker.postMessage(message);
        }
        else if (ready.all) {
            var remove = this.remove_blocked_all(hash);
            var message = { type: 'go_ready_reply', hash: hash, success: remove };
            worker.postMessage(message);
        }
        else {
            var go = this.remove_blocked(hash);
            var message = go
                ? { type: 'go_ready_reply', hash: hash, goroutine: go, success: true }
                : { type: 'go_ready_reply', hash: hash, success: false };
            worker.postMessage(message);
        }
    };
    ParallelScheduler.prototype.add_blocked = function (addr, task) {
        if (!this.blocked[addr]) {
            this.blocked[addr] = new Set();
        }
        this.blocked[addr].add(task);
    };
    ParallelScheduler.prototype.remove_blocked = function (addr) {
        if (!this.blocked[addr] || this.blocked[addr].size === 0) {
            return undefined;
        }
        var goroutine = this.blocked[addr].values().next().value;
        goroutine.state = goroutine_1.GoroutineState.RUNNABLE;
        this.globalRunQueue.push(goroutine);
        this.blocked[addr]["delete"](goroutine);
        return goroutine;
    };
    ParallelScheduler.prototype.remove_blocked_all = function (addr) {
        var _this = this;
        if (!this.blocked[addr]) {
            return false;
        }
        this.blocked[addr].forEach(function (goroutine) {
            goroutine.state = goroutine_1.GoroutineState.RUNNABLE;
            _this.globalRunQueue.push(goroutine);
        });
        delete this.blocked[addr];
        return true;
    };
    ParallelScheduler.prototype.add_channel_blocked = function (addr, task, value) {
        if (!this.channelBlocked[addr]) {
            this.channelBlocked[addr] = new Set();
        }
        var buffer = { goroutine: task, addr: value };
        this.channelBlocked[addr].add(buffer);
    };
    ParallelScheduler.prototype.remove_channel_blocked = function (addr) {
        if (!this.channelBlocked[addr] || this.channelBlocked[addr].size === 0) {
            return undefined;
        }
        var buffer = this.channelBlocked[addr].values().next().value;
        buffer.goroutine.state = goroutine_1.GoroutineState.RUNNABLE;
        this.channelBlocked[addr]["delete"](buffer);
        return buffer;
    };
    /**
     * If the global run queue is not empty, schedule the goroutines to the worker
     */
    ParallelScheduler.prototype.handleRequest = function (event) {
        var worker = event.target;
        var workerIndex = this.workers.indexOf(worker);
        var state = event.data.state;
        this.workerState[workerIndex] = state;
        if (this.globalRunQueue.length > 0) {
            var goroutines = this.globalRunQueue.splice(0, 1);
            this.schedule_to_worker(workerIndex, goroutines);
        }
    };
    ParallelScheduler.prototype.findIdleWorker = function () {
        return this.workerState.indexOf(WorkerState.IDLE);
    };
    ParallelScheduler.prototype.schedule_to_worker = function (workerIndex, goroutines) {
        var run = { type: 'go_allocate', goroutines: goroutines };
        this.workers[workerIndex].postMessage(run);
        this.workerState[workerIndex] = WorkerState.RUNNING;
    };
    ParallelScheduler.prototype.add = function (task) {
        this.globalRunQueue.push(task);
    };
    ParallelScheduler.prototype.handleLog = function (event) {
        if (event.data.type === 'log') {
            var data = event.data;
            console.log.apply(console, data.args);
        }
    };
    ParallelScheduler.prototype.teardown = function () {
        this.workers.forEach(function (worker) {
            worker.terminate();
        });
    };
    return ParallelScheduler;
}());
exports.ParallelScheduler = ParallelScheduler;

}).call(this)}).call(this,require('_process'))
},{"../goroutine":3,"../memory/sharedMemory":5,"../vm":9,"_process":1}],7:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.MainDone = exports.GoReadyReply = exports.GoReady = exports.GoPark = exports.GoSpawn = exports.GoRequest = exports.GoAllocate = exports.SetUpDone = exports.SetUp = exports.Log = void 0;
var goroutine_1 = require("../goroutine");
var sharedMemory_1 = require("../memory/sharedMemory");
var utils_1 = require("../utils");
var vm_1 = require("../vm");
var parallelScheduler_1 = require("./parallelScheduler");
var Log = /** @class */ (function () {
    function Log() {
    }
    return Log;
}());
exports.Log = Log;
var SetUp = /** @class */ (function () {
    function SetUp() {
    }
    return SetUp;
}());
exports.SetUp = SetUp;
var SetUpDone = /** @class */ (function () {
    function SetUpDone() {
    }
    return SetUpDone;
}());
exports.SetUpDone = SetUpDone;
var GoAllocate = /** @class */ (function () {
    function GoAllocate() {
    }
    return GoAllocate;
}());
exports.GoAllocate = GoAllocate;
var GoRequest = /** @class */ (function () {
    function GoRequest() {
    }
    return GoRequest;
}());
exports.GoRequest = GoRequest;
var GoSpawn = /** @class */ (function () {
    function GoSpawn() {
    }
    return GoSpawn;
}());
exports.GoSpawn = GoSpawn;
var GoPark = /** @class */ (function () {
    function GoPark() {
    }
    return GoPark;
}());
exports.GoPark = GoPark;
var GoReady = /** @class */ (function () {
    function GoReady() {
    }
    return GoReady;
}());
exports.GoReady = GoReady;
var GoReadyReply = /** @class */ (function () {
    function GoReadyReply() {
    }
    return GoReadyReply;
}());
exports.GoReadyReply = GoReadyReply;
var MainDone = /** @class */ (function () {
    function MainDone() {
    }
    return MainDone;
}());
exports.MainDone = MainDone;
var memory;
var vm;
var local_run_queue = [];
var initialize_vm = function (state, instrs) {
    memory = new sharedMemory_1.SharedMemory(state);
    vm = new vm_1.GoVM(instrs, memory);
    local_run_queue = [];
};
function run(goroutine) {
    return __awaiter(this, void 0, void 0, function () {
        var controlInstruction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vm["switch"](goroutine);
                    controlInstruction = prepare_control_instruction();
                    return [4 /*yield*/, vm.run(controlInstruction)];
                case 1:
                    _a.sent();
                    vm.save(goroutine);
                    return [2 /*return*/];
            }
        });
    });
}
var prepare_control_instruction = function () {
    var lease = { type: 'InstructionBatch', instructionCount: 5 };
    var spawnBehavior = { type: 'AsyncCommunication' };
    var goBlockBehavior = { type: 'GoBlockMulti' };
    return { spawnBehavior: spawnBehavior, lease: lease, goBlockBehavior: goBlockBehavior };
};
var handle_main_message = function (e) {
    var type = e.data.type;
    if (!type) {
        console.log('Message data is missing type:', e.data);
        return;
    }
    switch (type) {
        case 'setup': {
            var _a = e.data, state = _a.state, instrs = _a.instrs;
            initialize_vm(state, instrs);
            postMessage({ type: 'setup_done', success: true });
            break;
        }
        case 'go_allocate': {
            var goroutines = e.data.goroutines;
            // rehydrate all goroutines
            goroutines.forEach(function (goroutine) {
                local_run_queue.push(new goroutine_1.Goroutine(goroutine.id, goroutine.name, goroutine.context));
            });
            break;
        }
        default: {
            break;
        }
    }
};
var post_run = function (goroutine) {
    var isComplete = goroutine.isComplete(vm);
    if (goroutine.name == 'main' && goroutine.isComplete(vm)) {
        return true;
    }
    if (isComplete || goroutine.state == goroutine_1.GoroutineState.BLOCKED) {
        return false;
    }
    if ((0, utils_1.exceed_lease)(vm.lease)) {
        // post to main
        var goSpawn = { type: 'go_spawn', goroutine: goroutine };
        postMessage(goSpawn);
    }
    else {
        local_run_queue.push(goroutine);
    }
    return false;
};
onmessage = handle_main_message;
var originalConsoleLog = console.log;
console.log = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    postMessage({ type: 'log', args: args });
    originalConsoleLog.apply(console, args);
};
/**
 * Poll 1/61 time from the global queue
 * to ensure fairness
 */
var GRQ_POLL_INTERVAL = 61;
var nextTick = 0;
function main(resolve) {
    return __awaiter(this, void 0, void 0, function () {
        var goroutine, state, goRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    goroutine = local_run_queue === null || local_run_queue === void 0 ? void 0 : local_run_queue.shift();
                    if (!goroutine || nextTick % GRQ_POLL_INTERVAL === 0) {
                        state = goroutine ? parallelScheduler_1.WorkerState.RUNNING : parallelScheduler_1.WorkerState.IDLE;
                        goRequest = { type: 'go_request', state: state };
                        postMessage(goRequest);
                    }
                    if (!goroutine) return [3 /*break*/, 2];
                    return [4 /*yield*/, run(goroutine)];
                case 1:
                    _a.sent();
                    if (post_run(goroutine)) {
                        postMessage({ type: 'main_done' });
                    }
                    _a.label = 2;
                case 2:
                    setTimeout(function () { return main(resolve); }, local_run_queue.length ? 0 : 10);
                    return [2 /*return*/];
            }
        });
    });
}
function main_event() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(main)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main_event();

},{"../goroutine":3,"../memory/sharedMemory":5,"../utils":8,"../vm":9,"./parallelScheduler":6}],8:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.exceed_lease = exports.lease_per_loop_update = exports.check_lease = exports.start_lease = exports.recvq = exports.sendq = exports.tail = exports.head = exports.is_pair = exports.is_null = exports.is_undefined = exports.is_number = exports.is_boolean = exports.compile_time_environment_position = exports.Unbuffered_Channel_tag = exports.Buffered_Channel_tag = exports.WaitGroup_tag = exports.Mutex_tag = exports.Builtin_tag = exports.Pair_tag = exports.Environment_tag = exports.Frame_tag = exports.Closure_tag = exports.Callframe_tag = exports.Blockframe_tag = exports.Undefined_tag = exports.Unassigned_tag = exports.Null_tag = exports.Number_tag = exports.True_tag = exports.False_tag = void 0;
exports.False_tag = 0;
exports.True_tag = 1;
exports.Number_tag = 2;
exports.Null_tag = 3;
exports.Unassigned_tag = 4;
exports.Undefined_tag = 5;
exports.Blockframe_tag = 6;
exports.Callframe_tag = 7;
exports.Closure_tag = 8;
exports.Frame_tag = 9;
exports.Environment_tag = 10;
exports.Pair_tag = 11;
exports.Builtin_tag = 12;
exports.Mutex_tag = 13;
exports.WaitGroup_tag = 14;
exports.Buffered_Channel_tag = 15;
exports.Unbuffered_Channel_tag = 16;
/* ************************
 * compile-time environment
 * ************************/
// a compile-time environment is an array of
// compile-time frames, and a compile-time frame
// is an array of symbols
// find the position [frame-index, value-index]
// of a given symbol x
// TODO: Change the type of x to string
var compile_time_environment_position = function (env, x) {
    var frame_index = env.length;
    while (value_index(env[--frame_index], x) === -1) { }
    return [frame_index, value_index(env[frame_index], x)];
};
exports.compile_time_environment_position = compile_time_environment_position;
var value_index = function (frame, x) {
    for (var i = 0; i < frame.length; i++) {
        if (frame[i] === x)
            return i;
    }
    return -1;
};
/* **********************
 * operators and builtins
 * **********************/
var is_boolean = function (x) { return typeof x === 'boolean'; };
exports.is_boolean = is_boolean;
var is_number = function (x) { return typeof x === 'number'; };
exports.is_number = is_number;
var is_undefined = function (x) { return x === undefined; };
exports.is_undefined = is_undefined;
var is_null = function (x) { return x === null; };
exports.is_null = is_null;
var is_pair = function (x) { return Array.isArray(x) && x.length === 2; };
exports.is_pair = is_pair;
var head = function (x) { return x[0]; };
exports.head = head;
var tail = function (x) { return x[1]; };
exports.tail = tail;
/*
 * Go Channel Hashing
 */
exports.sendq = 0;
exports.recvq = 1;
/**
 * Lease Util
 */
var start_lease = function (lease) {
    if (lease.type === 'InstructionBatch') {
        // DO NOTHING
    }
    else if (lease.type === 'TimeAllocation') {
        var timeAllocation = lease;
        timeAllocation.start = Date.now();
    }
    else {
        console.log('other lease type is not supported');
    }
};
exports.start_lease = start_lease;
var check_lease = function (lease) {
    if (lease.type === 'InstructionBatch') {
        var instructionBatch = lease;
        return instructionBatch.instructionCount > 0;
    }
    else if (lease.type === 'TimeAllocation') {
        var timeAllocation = lease;
        var elapsedTime = Date.now() - timeAllocation.start;
        return elapsedTime < timeAllocation.duration;
    }
    else {
        console.log('other lease type is not supported');
        return true;
    }
};
exports.check_lease = check_lease;
var lease_per_loop_update = function (lease) {
    if (lease.type === 'InstructionBatch') {
        var instructionBatch = lease;
        instructionBatch.instructionCount--;
    }
    else if (lease.type === 'TimeAllocation') {
        var timeAllocation = lease;
        // DO NOTHING
    }
    else {
        console.log('other lease type is not supported');
    }
};
exports.lease_per_loop_update = lease_per_loop_update;
var exceed_lease = function (lease) {
    if (lease.type === 'InstructionBatch') {
        var instructionBatch = lease;
        return instructionBatch.instructionCount <= 0;
    }
    else if (lease.type === 'TimeAllocation') {
        var timeAllocation = lease;
        var buffer = 100;
        var elapsedTime = Date.now() - timeAllocation.start;
        return elapsedTime > timeAllocation.duration + buffer;
    }
    else {
        console.log('other lease type is not supported');
        return true;
    }
};
exports.exceed_lease = exceed_lease;

},{}],9:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.GoVM = void 0;
var goroutine_1 = require("./goroutine");
var utils_1 = require("./utils");
var GoVM = /** @class */ (function () {
    function GoVM(instrs, memory) {
        var _this = this;
        this.should_continue = function () {
            return (_this.instrs[_this.state.PC].tag !== 'DONE' &&
                _this.instrs[_this.state.PC].tag !== 'GO_DONE' &&
                (0, utils_1.check_lease)(_this.lease) &&
                _this.state.state !== goroutine_1.GoroutineState.BLOCKED);
        };
        this.microcode = {
            LDC: function (instr) { return _this.state.OS.push(_this.memory.JS_value_to_address(instr.val)); },
            UNOP: function (instr) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.apply_unop(instr.sym)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            }); }); },
            BINOP: function (instr) {
                return _this.state.OS.push(_this.apply_binop(instr.sym, _this.state.OS.pop(), _this.state.OS.pop()));
            },
            POP: function (instr) { return _this.state.OS.pop(); },
            GOTO: function (instr) { return (_this.state.PC = instr.addr); },
            ENTER_SCOPE: function (instr) {
                _this.state.RTS.push(_this.memory.mem_allocate_Blockframe(_this.state.E));
                var frame_address = _this.memory.mem_allocate_Frame(instr.syms.length);
                _this.state.E = _this.memory.mem_Environment_extend(frame_address, _this.state.E);
                var locals = instr.syms;
                for (var i = 0; i < locals.length; i++) {
                    _this.memory.mem_set_child(frame_address, i, _this.memory.Unassigned);
                }
            },
            EXIT_SCOPE: function (instr) {
                return (_this.state.E = _this.memory.mem_get_Blockframe_environment(_this.state.RTS.pop()));
            },
            LD: function (instr) {
                var load = function (position) {
                    var val = _this.memory.mem_get_Environment_value(_this.state.E, position);
                    if (_this.memory.is_Unassigned(val))
                        console.error('access of unassigned variable');
                    _this.state.OS.push(val);
                };
                if (instr.sel) {
                    load(instr.sel);
                }
                load(instr.pos);
            },
            ASSIGN: function (instr) {
                return _this.memory.mem_set_Environment_value(_this.state.E, instr.pos, _this.state.OS[_this.state.OS.length - 1]);
            },
            LDF: function (instr) {
                var arity = instr.prms.length;
                var closure_address = _this.memory.mem_allocate_Closure(arity, instr.addr, _this.state.E);
                _this.state.OS.push(closure_address);
            },
            CALL: function (instr) { return __awaiter(_this, void 0, void 0, function () {
                var arity, fun, frame_address, i;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            arity = instr.arity;
                            fun = this.state.OS[this.state.OS.length - 1 - arity];
                            if (!this.memory.is_Builtin(fun)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.apply_builtin(this.memory.mem_get_Builtin_id(fun))];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            frame_address = this.memory.mem_allocate_Frame(arity);
                            for (i = arity - 1; i >= 0; i--) {
                                this.memory.mem_set_child(frame_address, i, this.state.OS.pop());
                            }
                            this.state.OS.pop(); // pop fun
                            this.state.RTS.push(this.memory.mem_allocate_Callframe(this.state.E, this.state.PC));
                            this.state.E = this.memory.mem_Environment_extend(frame_address, this.memory.mem_get_Closure_environment(fun));
                            this.state.PC = this.memory.mem_get_Closure_pc(fun);
                            return [2 /*return*/];
                    }
                });
            }); },
            GO: function (instr) {
                var spawned = _this.spawn_goroutine();
                if (_this.spawnBehavior.type === 'ManualAdd') {
                    var scheduler = _this.spawnBehavior.scheduler;
                    scheduler.add(spawned);
                }
                else if (_this.spawnBehavior.type === 'AsyncCommunication') {
                    postMessage({ type: 'go_spawn', goroutine: spawned });
                }
                else {
                    console.log('Spawn Behavior', _this.spawnBehavior.type, 'not supported');
                }
            },
            RESET: function (instr) {
                // keep popping...
                var top_frame = _this.state.RTS.pop();
                if (_this.memory.is_Callframe(top_frame)) {
                    // ...until top frame is a call frame
                    _this.state.PC = _this.memory.mem_get_Callframe_pc(top_frame);
                    _this.state.E = _this.memory.mem_get_Callframe_environment(top_frame);
                }
                else {
                    _this.state.PC--;
                }
            },
            SEND: function (instr) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.memory.channel_send(this.state, this.goBlockBehavior)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }
        };
        this.spawn_goroutine = function () {
            var threadId = _this.threadCount++;
            return new goroutine_1.Goroutine(threadId, 'worker ' + String(threadId), {
                OS: [],
                RTS: [],
                E: _this.state.E,
                PC: _this.state.PC + 1 // + 1 to skip the GOTO instruction
            });
        };
        this.apply_binop = function (op, v2, v1) {
            return _this.memory.JS_value_to_address(_this.memory.binop_microcode[op](_this.memory.address_to_JS_value(v1), _this.memory.address_to_JS_value(v2)));
        };
        this.threadCount = 1;
        this.instrs = instrs;
        this.memory = memory;
    }
    GoVM.prototype.main = function () {
        var threadId = this.threadCount++;
        var context = {
            OS: [],
            RTS: [],
            E: this.memory.create_new_environment(),
            PC: 0
        };
        return new goroutine_1.Goroutine(threadId, 'main', context);
    };
    GoVM.prototype["switch"] = function (task) {
        var go = task;
        this.state = {
            OS: go.context.OS,
            RTS: go.context.RTS,
            E: go.context.E,
            PC: go.context.PC,
            state: go.state,
            currentThread: go.id,
            currentThreadName: go.name
        };
    };
    GoVM.prototype.save = function (go) {
        go.context.OS = this.state.OS;
        go.context.RTS = this.state.RTS;
        go.context.E = this.state.E;
        go.context.PC = this.state.PC;
        if (this.state.state === goroutine_1.GoroutineState.BLOCKED) {
            go.state = goroutine_1.GoroutineState.BLOCKED;
        }
        else {
            go.state = goroutine_1.GoroutineState.RUNNABLE;
        }
    };
    GoVM.prototype.run = function (control) {
        return __awaiter(this, void 0, void 0, function () {
            var instr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.lease = control.lease;
                        this.spawnBehavior = control.spawnBehavior;
                        this.goBlockBehavior = control.goBlockBehavior;
                        (0, utils_1.start_lease)(this.lease);
                        _a.label = 1;
                    case 1:
                        if (!this.should_continue()) return [3 /*break*/, 3];
                        this.state.state = goroutine_1.GoroutineState.RUNNING;
                        instr = this.instrs[this.state.PC++];
                        // console.log(this.state.currentThreadName, 'running ', this.state.PC, instr.tag)
                        return [4 /*yield*/, this.microcode[instr.tag](instr)];
                    case 2:
                        // console.log(this.state.currentThreadName, 'running ', this.state.PC, instr.tag)
                        _a.sent();
                        (0, utils_1.lease_per_loop_update)(this.lease);
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GoVM.prototype.apply_unop = function (op) {
        return __awaiter(this, void 0, void 0, function () {
            var v, addr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        v = this.state.OS.pop();
                        return [4 /*yield*/, this.memory.unop_microcode[op](v, this.state, this.goBlockBehavior)];
                    case 1:
                        addr = _a.sent();
                        this.state.OS.push(addr);
                        return [2 /*return*/];
                }
            });
        });
    };
    GoVM.prototype.apply_builtin = function (builtin_id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.memory.builtin_array[builtin_id](this.state, this.goBlockBehavior)];
                    case 1:
                        result = _a.sent();
                        this.state.OS.pop(); // pop fun
                        this.state.OS.push(result);
                        return [2 /*return*/];
                }
            });
        });
    };
    return GoVM;
}());
exports.GoVM = GoVM;

},{"./goroutine":3,"./utils":8}]},{},[7]);
