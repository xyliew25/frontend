(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Memory = exports.memory_size = exports.word_size = void 0;
var types_1 = require("../../common/types");
var utils_1 = require("../utils");
var goroutine_1 = require("../goroutine");
exports.word_size = 8;
var mega = Math.pow(2, 20);
exports.memory_size = 5000;
var size_offset = 5;
// TODO: No garbage collection yet
var Memory = /** @class */ (function () {
    function Memory(data) {
        var _this = this;
        this.create_new_environment = function () {
            var non_empty_env = _this.mem_allocate_Environment(0);
            return _this.mem_Environment_extend(_this.builtin_frame, non_empty_env);
        };
        this.allocate_builtin_frame = function () {
            _this.primitive_object = {};
            _this.builtin_array = [];
            {
                var i = 0;
                for (var key in _this.builtin_object) {
                    _this.primitive_object[key] = {
                        tag: 'BUILTIN',
                        id: i,
                        arity: 1
                    };
                    _this.builtin_array[i++] = _this.builtin_object[key];
                }
            }
            var primitive_values = Object.values(_this.primitive_object);
            var frame_address = _this.mem_allocate_Frame(primitive_values.length);
            for (var i = 0; i < primitive_values.length; i++) {
                var builtin = primitive_values[i];
                _this.mem_set_child(frame_address, i, _this.mem_allocate_Builtin(builtin.id));
            }
            _this.builtin_frame = frame_address;
        };
        this.mem_allocate = function (tag, size) {
            if (_this.free + size >= _this.dataView.byteLength / exports.word_size) {
                throw new Error('Out of memory');
            }
            var address = _this.free;
            _this.free += size;
            _this.setUint8(address * exports.word_size, tag);
            _this.setUint16(address * exports.word_size + size_offset, size);
            return address;
        };
        // get and set a word in mem at given address
        this.mem_get = function (address) { return _this.getFloat64(address * exports.word_size); };
        this.mem_set = function (address, x) { return _this.setFloat64(address * exports.word_size, x); };
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
        // followed by 1 boolean (locked), 1 owner (addr)
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
        // followed by 1 type, 1 number (buffer size), 1 buffer count
        // 1 offset, buffer size number of addresses
        // note: #children is 0
        this.mem_allocate_Buffered_Channel = function (size, type) {
            var ch_address = _this.mem_allocate(utils_1.Buffered_Channel_tag, 5 + Math.max(1, size)); // allocate one more for unbuffered channel
            _this.mem_set(ch_address + 1, type);
            _this.mem_set(ch_address + 2, size);
            _this.mem_set(ch_address + 3, 0);
            _this.mem_set(ch_address + 4, 0);
            return ch_address;
        };
        this.is_Buffered_Channel = function (address) { return _this.mem_get_tag(address) === utils_1.Buffered_Channel_tag; };
        // Unbuffered Channel
        // [1 byte tag, 4 bytes unused,
        //  2 bytes #children, 1 byte unused]
        // followed by 1 type, 1 hasData, 1 sender, 1 addrress
        // note: #children is 0
        this.mem_allocate_Unbuffered_Channel = function (type) {
            var ch_address = _this.mem_allocate(utils_1.Unbuffered_Channel_tag, 5);
            _this.mem_set(ch_address + 1, type);
            _this.mem_set(ch_address + 2, _this.False);
            _this.mem_set(ch_address + 3, 0); // sender cannot be 0
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
            '<-': function (x, state) {
                if (!_this.is_Channel(x)) {
                    throw new Error('unop: not a channel');
                }
                if (_this.is_Buffered_Channel(x)) {
                    var size = _this.mem_get(x + 2);
                    var count = _this.mem_get(x + 3);
                    if (count === 0) {
                        state.PC--;
                        state.state = goroutine_1.GoroutineState.BLOCKED;
                        return -1;
                    }
                    var offset = _this.mem_get(x + 4);
                    var pos = offset;
                    var addr = _this.mem_get_child(x, 4 + pos);
                    _this.mem_set(x + 2, count - 1);
                    _this.mem_set(x + 4, (pos + 1) % size);
                    return addr;
                }
                else {
                    var hasData = _this.mem_get_child(x, 1);
                    if (_this.is_False(hasData)) {
                        state.PC--;
                        state.state = goroutine_1.GoroutineState.BLOCKED;
                        return -1;
                    }
                    var addr = _this.mem_get_child(x, 3);
                    _this.mem_set_child(x, 1, _this.False);
                    return addr;
                }
            }
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
                ? _this.is_Undefined
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
            Lock: function (state) {
                var address = state.OS[state.OS.length - 2];
                if (!_this.is_Mutex(address)) {
                    console.error('not a mutex');
                }
                var locked = _this.mem_get(address + 1);
                if (locked === 1) {
                    // handle state where mutex is already locked
                    state.PC--;
                    state.state = goroutine_1.GoroutineState.BLOCKED;
                    return;
                }
                _this.mem_set(address + 1, 1);
                _this.mem_set(address + 2, state.currentThread);
                state.OS.pop(); // pop the fun; apply builtin will pop the method name
                return address;
            },
            Unlock: function (state) {
                // pop the second last element
                var address = state.OS[state.OS.length - 2];
                if (!_this.is_Mutex(address)) {
                    throw new Error('not a mutex');
                }
                var locked = _this.mem_get(address + 1);
                var owner = _this.mem_get(address + 2);
                if (locked === 0 || owner !== state.currentThread) {
                    throw new Error('sync: unlock of unlocked mutex');
                }
                _this.mem_set(address + 1, 0);
                state.OS.pop();
                return address;
            },
            Add: function (state) {
                var address = state.OS[state.OS.length - 3];
                if (!_this.is_WaitGroup(address)) {
                    throw new Error('not a WaitGroup');
                }
                var count = _this.mem_get(address + 1);
                var additional = _this.address_to_JS_value(state.OS.pop());
                _this.mem_set(address + 1, count + additional);
                state.OS.pop();
                return address;
            },
            Done: function (state) {
                var address = state.OS[state.OS.length - 2];
                if (!_this.is_WaitGroup(address)) {
                    throw new Error('not a WaitGroup');
                }
                var count = _this.mem_get(address + 1);
                _this.mem_set(address + 1, count - 1);
                state.OS.pop();
                return address;
            },
            Wait: function (state) {
                var address = state.OS[state.OS.length - 2];
                if (!_this.is_WaitGroup(address)) {
                    throw new Error('not a WaitGroup');
                }
                var count = _this.mem_get(address + 1);
                if (count !== 0) {
                    state.PC--;
                    state.state = goroutine_1.GoroutineState.BLOCKED;
                    return;
                }
                state.OS.pop();
                return address;
            }
        };
        data ? this.set_memory(data) : this.mem_make(exports.memory_size * exports.word_size);
        this.builtin_frame = 0;
        this.free = 0;
        this.allocate_literal_values();
        this.allocate_builtin_frame();
        // TODO: constants
    }
    return Memory;
}());
exports.Memory = Memory;

},{"../../common/types":1,"../goroutine":2,"../utils":6}],4:[function(require,module,exports){
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
exports.__esModule = true;
exports.SharedMemory = void 0;
var memory_1 = require("./memory");
var SharedMemory = /** @class */ (function (_super) {
    __extends(SharedMemory, _super);
    function SharedMemory(data) {
        return _super.call(this, data) || this;
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
    SharedMemory.prototype.setUint8 = function (address, value) {
        this.dataView.setUint8(address, value);
    };
    SharedMemory.prototype.setUint16 = function (address, value) {
        this.dataView.setUint16(address, value);
    };
    SharedMemory.prototype.setFloat64 = function (address, value) {
        this.dataView.setFloat64(address, value);
    };
    SharedMemory.prototype.getUint8 = function (address) {
        return this.dataView.getUint8(address);
    };
    SharedMemory.prototype.getUint16 = function (address) {
        return this.dataView.getUint16(address);
    };
    SharedMemory.prototype.getFloat64 = function (address) {
        return this.dataView.getFloat64(address);
    };
    return SharedMemory;
}(memory_1.Memory));
exports.SharedMemory = SharedMemory;

},{"./memory":3}],5:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.RunDone = exports.Run = exports.SetUpDone = exports.SetUp = void 0;
var sharedMemory_1 = require("../memory/sharedMemory");
var vm_1 = require("../vm");
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
var Run = /** @class */ (function () {
    function Run() {
    }
    return Run;
}());
exports.Run = Run;
var RunDone = /** @class */ (function () {
    function RunDone() {
    }
    return RunDone;
}());
exports.RunDone = RunDone;
var memory;
var vm;
var initialize_vm = function (data, instrs) {
    memory = new sharedMemory_1.SharedMemory(data);
    vm = new vm_1.GoVM(instrs, memory);
    run(vm.main());
};
var run = function (goroutine) {
    vm["switch"](goroutine);
    vm.run_all();
    vm.save(goroutine);
};
var handleMainMessage = function (e) {
    var type = e.data.type;
    if (!type) {
        console.log('Message data is missing type:', e.data);
        return;
    }
    switch (type) {
        case 'setup': {
            var _a = e.data, buffer = _a.buffer, instrs = _a.instrs;
            initialize_vm(buffer, instrs);
            postMessage({ type: 'setup_done', success: true });
            break;
        }
        case 'run': {
            var goroutine = e.data.goroutine;
            console.log('Running goroutine:', goroutine);
            run(goroutine);
            console.log('Done running goroutine:', goroutine);
            postMessage({ type: 'run_done', goroutine: goroutine });
            break;
        }
        default: {
            console.error('Unknown message type:', type);
            break;
        }
    }
};
onmessage = handleMainMessage;

},{"../memory/sharedMemory":4,"../vm":7}],6:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.tail = exports.head = exports.is_pair = exports.is_null = exports.is_undefined = exports.is_number = exports.is_boolean = exports.compile_time_environment_position = exports.Unbuffered_Channel_tag = exports.Buffered_Channel_tag = exports.WaitGroup_tag = exports.Mutex_tag = exports.Builtin_tag = exports.Pair_tag = exports.Environment_tag = exports.Frame_tag = exports.Closure_tag = exports.Callframe_tag = exports.Blockframe_tag = exports.Undefined_tag = exports.Unassigned_tag = exports.Null_tag = exports.Number_tag = exports.True_tag = exports.False_tag = void 0;
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

},{}],7:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.GoVM = void 0;
var goroutine_1 = require("./goroutine");
var GoVM = /** @class */ (function () {
    function GoVM(instrs, memory) {
        var _this = this;
        this.run = function (scheduler) {
            _this.scheduler = scheduler;
            var has_run = false;
            // console.log('running', this.state.currentThreadName)
            while (_this.should_continue()) {
                var instr = _this.instrs[_this.state.PC++];
                // console.log('running ', this.state.PC, instr.tag)
                _this.microcode[instr.tag](instr);
                _this.scheduler.postLoopUpdate();
                if (_this.state.state !== goroutine_1.GoroutineState.BLOCKED) {
                    has_run = true;
                }
            }
            return has_run;
        };
        this.run_all = function () {
            var has_run = false;
            while (_this.should_continue()) {
                var instr = _this.instrs[_this.state.PC++];
                console.log('running ', _this.state.PC, instr.tag);
                _this.microcode[instr.tag](instr);
                if (_this.state.state !== goroutine_1.GoroutineState.BLOCKED) {
                    has_run = true;
                }
            }
            return has_run;
        };
        this.should_continue = function () {
            return (_this.instrs[_this.state.PC].tag !== 'DONE' &&
                _this.instrs[_this.state.PC].tag !== 'GO_DONE' &&
                (!_this.scheduler || _this.scheduler.checkCondition()) &&
                _this.state.state !== goroutine_1.GoroutineState.BLOCKED);
        };
        this.microcode = {
            LDC: function (instr) { return _this.state.OS.push(_this.memory.JS_value_to_address(instr.val)); },
            UNOP: function (instr) { return _this.apply_unop(instr.sym); },
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
            CALL: function (instr) {
                var arity = instr.arity;
                var fun = _this.state.OS[_this.state.OS.length - 1 - arity];
                if (_this.memory.is_Builtin(fun)) {
                    return _this.apply_builtin(_this.memory.mem_get_Builtin_id(fun));
                }
                var frame_address = _this.memory.mem_allocate_Frame(arity);
                for (var i = arity - 1; i >= 0; i--) {
                    _this.memory.mem_set_child(frame_address, i, _this.state.OS.pop());
                }
                _this.state.OS.pop(); // pop fun
                _this.state.RTS.push(_this.memory.mem_allocate_Callframe(_this.state.E, _this.state.PC));
                _this.state.E = _this.memory.mem_Environment_extend(frame_address, _this.memory.mem_get_Closure_environment(fun));
                _this.state.PC = _this.memory.mem_get_Closure_pc(fun);
            },
            GO: function (instr) {
                var spawned = _this.spawn_goroutine();
                _this.scheduler.add(spawned);
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
            SEND: function (state) {
                var in_addr = _this.state.OS.pop();
                var chan_addr = _this.state.OS.pop();
                if (!_this.memory.is_Channel(chan_addr)) {
                    console.error('send: not a channel');
                    return;
                }
                if (_this.memory.is_Buffered_Channel(chan_addr)) {
                    var size = _this.memory.mem_get(chan_addr + 2);
                    var count = _this.memory.mem_get(chan_addr + 3);
                    if (count >= size) {
                        _this.state.PC--;
                        _this.state.state = goroutine_1.GoroutineState.BLOCKED;
                        _this.state.OS.push(chan_addr);
                        _this.state.OS.push(in_addr);
                        return;
                    }
                    var offset = _this.memory.mem_get(chan_addr + 4);
                    var index = (offset + count) % size;
                    _this.memory.mem_set_child(chan_addr, 4 + index, in_addr);
                    _this.memory.mem_set(chan_addr + 3, count + 1);
                    _this.state.OS.pop();
                }
                else {
                    // unbuffered channel
                    var hasData = _this.memory.mem_get_child(chan_addr, 1);
                    var sender = _this.memory.mem_get_child(chan_addr, 2);
                    if (sender == _this.state.currentThread && _this.memory.is_False(hasData)) {
                        _this.memory.mem_set_child(chan_addr, 2, 0);
                        return;
                    }
                    if (sender == 0) {
                        // no sender
                        _this.memory.mem_set_child(chan_addr, 1, _this.memory.True);
                        _this.memory.mem_set_child(chan_addr, 2, _this.state.currentThread);
                        _this.memory.mem_set_child(chan_addr, 3, in_addr);
                    }
                    _this.state.PC--;
                    _this.state.state = goroutine_1.GoroutineState.BLOCKED;
                    _this.state.OS.push(chan_addr);
                    _this.state.OS.push(in_addr);
                }
            }
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
        this.apply_unop = function (op) {
            var v = _this.state.OS.pop();
            var addr = _this.memory.unop_microcode[op](v, _this.state);
            if (_this.state.state === goroutine_1.GoroutineState.BLOCKED) {
                _this.state.OS.push(v);
                return;
            }
            _this.state.OS.push(addr);
        };
        this.apply_binop = function (op, v2, v1) {
            return _this.memory.JS_value_to_address(_this.memory.binop_microcode[op](_this.memory.address_to_JS_value(v1), _this.memory.address_to_JS_value(v2)));
        };
        this.apply_builtin = function (builtin_id) {
            var result = _this.memory.builtin_array[builtin_id](_this.state);
            if (_this.state.state === goroutine_1.GoroutineState.BLOCKED) {
                return;
            }
            _this.state.OS.pop(); // pop fun
            _this.state.OS.push(result);
        };
        this.threadCount = 1;
        this.instrs = instrs;
        this.memory = memory;
        this.state = {
            OS: [],
            RTS: [],
            E: memory.create_new_environment(),
            PC: 0,
            state: goroutine_1.GoroutineState.RUNNABLE,
            currentThread: -1
        };
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
        this.state.OS = go.context.OS;
        this.state.RTS = go.context.RTS;
        this.state.E = go.context.E;
        this.state.PC = go.context.PC;
        this.state.state = goroutine_1.GoroutineState.RUNNING; // always try to run it
        this.state.currentThread = go.id;
        this.state.currentThreadName = go.name;
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
    return GoVM;
}());
exports.GoVM = GoVM;

},{"./goroutine":2}]},{},[5]);
