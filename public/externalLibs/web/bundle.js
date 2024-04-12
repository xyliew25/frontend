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
        // followed by 1 type, 1 buffer count (number)
        // 1 slot-out, 1 lock, buffer size number of addresses
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
            '<-': function (chan_addr, state) {
                if (!_this.is_Channel(chan_addr)) {
                    throw new Error('unop: not a channel');
                }
                return _this.channel_receive(chan_addr, state);
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
            Lock: function (state) {
                return _this.lock(state);
            },
            Unlock: function (state) {
                return _this.unlock(state);
            },
            Add: function (state) {
                return _this.wg_add(state);
            },
            Done: function (state) {
                return _this.wg_done(state);
            },
            Wait: function (state) {
                return _this.wg_wait(state);
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

},{"../../common/types":1,"../utils":6}],4:[function(require,module,exports){
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
var goroutine_1 = require("../goroutine");
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
    SharedMemory.prototype.lock = function (state) {
        var address = state.OS[state.OS.length - 2];
        if (!this.is_Mutex(address)) {
            console.error('not a mutex');
        }
        var locked = this.atomic_compare_exchange_mem_64(address + 1, 0, 1);
        if (locked === 1) {
            // handle state where mutex is already locked
            state.PC--;
            state.state = goroutine_1.GoroutineState.BLOCKED;
            return -1;
        }
        this.mem_set(address + 2, state.currentThread);
        state.OS.pop(); // pop the fun; apply builtin will pop the method name
        return address;
    };
    SharedMemory.prototype.unlock = function (state) {
        // pop the second last element
        var address = state.OS[state.OS.length - 2];
        if (!this.is_Mutex(address)) {
            throw new Error('not a mutex');
        }
        var locked = this.atomic_compare_exchange_mem_64(address + 1, 1, 0);
        var owner = this.mem_get(address + 2);
        if (locked === 0 || owner !== state.currentThread) {
            throw new Error('sync: unlock of unlocked mutex');
        }
        state.OS.pop();
        return address;
    };
    SharedMemory.prototype.wg_add = function (state) {
        var address = state.OS[state.OS.length - 3];
        if (!this.is_WaitGroup(address)) {
            throw new Error('not a WaitGroup');
        }
        var additional = this.address_to_JS_value(state.OS.pop());
        this.atomic_add_mem_64(address + 1, additional);
        state.OS.pop();
        return address;
    };
    SharedMemory.prototype.wg_wait = function (state) {
        var address = state.OS[state.OS.length - 2];
        if (!this.is_WaitGroup(address)) {
            throw new Error('not a WaitGroup');
        }
        var count = this.mem_get(address + 1);
        if (count !== 0) {
            state.PC--;
            state.state = goroutine_1.GoroutineState.BLOCKED;
            return -1;
        }
        state.OS.pop();
        return address;
    };
    SharedMemory.prototype.wg_done = function (state) {
        var address = state.OS[state.OS.length - 2];
        if (!this.is_WaitGroup(address)) {
            throw new Error('not a WaitGroup');
        }
        this.atomic_sub_mem_64(address + 1, 1);
        state.OS.pop();
        return address;
    };
    SharedMemory.prototype.channel_send = function (state) {
        var in_addr = state.OS.pop();
        var chan_addr = state.OS.pop();
        if (!this.is_Channel(chan_addr)) {
            console.error('send: not a channel');
            return;
        }
        if (this.is_Buffered_Channel(chan_addr)) {
            var buffer_size = this.mem_get_size(chan_addr) - 5; // 5 config values
            var old_count = this.mem_get(chan_addr + 2);
            var new_count = old_count + 1;
            while (true) {
                if (old_count >= buffer_size) {
                    state.PC--;
                    state.state = goroutine_1.GoroutineState.BLOCKED;
                    state.OS.push(chan_addr);
                    state.OS.push(in_addr);
                    return;
                }
                var count = this.atomic_compare_exchange_mem_64(chan_addr + 2, old_count, new_count);
                if (count === old_count) {
                    break;
                }
                old_count = count;
                new_count = old_count + 1;
            }
            // attmempting to acquire the lock on the channel
            var lockAddr = chan_addr + 4;
            while (this.atomic_compare_exchange_mem_64(lockAddr, 0, 1) === 1) { }
            var slotOut = this.mem_get(chan_addr + 3);
            var slotIn = (slotOut + old_count) % buffer_size;
            this.mem_set_child(chan_addr, 4 + slotIn, in_addr);
            // release the lock
            this.atomic_sub_mem_64(lockAddr, 1);
            state.OS.pop();
        }
        else {
            // unbuffered channel
            var sender = this.mem_get_child(chan_addr, 2);
            var hasData = this.mem_get_child(chan_addr, 1);
            if (sender === state.currentThread && this.is_False(hasData)) {
                this.mem_set_child(chan_addr, 2, 0);
                return;
            }
            sender = this.atomic_compare_exchange_mem_64(chan_addr + 3, 0, state.currentThread);
            if (sender === 0) {
                // no sender
                this.mem_set_child(chan_addr, 1, this.True);
                this.mem_set_child(chan_addr, 2, state.currentThread);
                this.mem_set_child(chan_addr, 3, in_addr);
            }
            state.PC--;
            state.state = goroutine_1.GoroutineState.BLOCKED;
            state.OS.push(chan_addr);
            state.OS.push(in_addr);
        }
    };
    SharedMemory.prototype.channel_receive = function (chan_addr, state) {
        if (this.is_Buffered_Channel(chan_addr)) {
            var buffer_size = this.mem_get_size(chan_addr) - 5; // 5 config values
            var old_count = this.mem_get(chan_addr + 2);
            var new_count = old_count - 1;
            while (true) {
                if (old_count === 0) {
                    state.PC--;
                    state.state = goroutine_1.GoroutineState.BLOCKED;
                    return -1;
                }
                var count = this.atomic_compare_exchange_mem_64(chan_addr + 2, old_count, new_count);
                if (count === old_count) {
                    break;
                }
                old_count = count;
                new_count = old_count + 1;
            }
            // attmempting to acquire the lock on the channel
            var lockAddr = chan_addr + 4;
            while (this.atomic_compare_exchange_mem_64(lockAddr, 0, 1) === 1) { }
            var slotOut = this.mem_get(chan_addr + 3);
            var addr = this.mem_get_child(chan_addr, 4 + slotOut);
            this.mem_set(chan_addr + 3, (slotOut + 1) % buffer_size);
            // release the lock
            this.atomic_sub_mem_64(lockAddr, 1);
            return addr;
        }
        else {
            var addr = this.mem_get_child(chan_addr, 3);
            var stillHasData = this.atomic_compare_exchange_mem_64(chan_addr + 2, this.True, this.False);
            if (this.is_False(stillHasData)) {
                state.PC--;
                state.state = goroutine_1.GoroutineState.BLOCKED;
                return -1;
            }
            return addr;
        }
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
    return SharedMemory;
}(memory_1.Memory));
exports.SharedMemory = SharedMemory;

},{"../goroutine":2,"./memory":3}],5:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.SpawnNew = exports.RunDone = exports.Run = exports.SetUpDone = exports.SetUp = exports.Log = void 0;
var sharedMemory_1 = require("../memory/sharedMemory");
var vm_1 = require("../vm");
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
var SpawnNew = /** @class */ (function () {
    function SpawnNew() {
    }
    return SpawnNew;
}());
exports.SpawnNew = SpawnNew;
var memory;
var vm;
var initialize_vm = function (state, instrs) {
    memory = new sharedMemory_1.SharedMemory(state);
    vm = new vm_1.GoVM(instrs, memory);
};
var run = function (goroutine, lease) {
    vm["switch"](goroutine);
    var controlInstruction = prepare_control_instruction(lease);
    var has_run = vm.run(controlInstruction);
    vm.save(goroutine);
    return has_run;
};
var prepare_control_instruction = function (lease) {
    var spawnBehavior = { type: 'AsyncCommunication' };
    return { spawnBehavior: spawnBehavior, lease: lease };
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
        case 'run': {
            var _b = e.data, goroutine = _b.goroutine, lease = _b.lease;
            var has_run = run(goroutine, lease);
            postMessage({ type: 'run_done', goroutine: goroutine, has_run: has_run });
            break;
        }
        default: {
            console.error('Unknown message type:', type);
            break;
        }
    }
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
        this.run = function (control) {
            _this.lease = control.lease;
            _this.spawnBehavior = control.spawnBehavior;
            var has_run = false;
            _this.start_lease();
            // console.log('running', this.state.currentThreadName)
            while (_this.should_continue()) {
                var instr = _this.instrs[_this.state.PC++];
                // console.log('running ', this.state.PC, instr.tag)
                _this.microcode[instr.tag](instr);
                _this.post_loop_update();
                if (_this.state.state !== goroutine_1.GoroutineState.BLOCKED) {
                    has_run = true;
                }
            }
            return has_run;
        };
        this.should_continue = function () {
            return (_this.instrs[_this.state.PC].tag !== 'DONE' &&
                _this.instrs[_this.state.PC].tag !== 'GO_DONE' &&
                _this.check_lease() &&
                _this.state.state !== goroutine_1.GoroutineState.BLOCKED);
        };
        this.start_lease = function () {
            if (!_this.lease) {
                return;
            }
            if (_this.lease.type === 'InstructionBatch') {
                // DO NOTHING
            }
            else if (_this.lease.type === 'TimeAllocation') {
                var timeAllocation = _this.lease;
                timeAllocation.start = Date.now();
            }
            else {
                console.log('other lease type is not supported');
            }
        };
        this.check_lease = function () {
            if (!_this.lease) {
                return true;
            }
            if (_this.lease.type === 'InstructionBatch') {
                var instructionBatch = _this.lease;
                return instructionBatch.instructionCount > 0;
            }
            else if (_this.lease.type === 'TimeAllocation') {
                var timeAllocation = _this.lease;
                var elapsedTime = Date.now() - timeAllocation.start;
                return elapsedTime < timeAllocation.duration;
            }
            else {
                console.log('other lease type is not supported');
                return true;
            }
        };
        this.post_loop_update = function () {
            if (!_this.lease) {
                return;
            }
            if (_this.lease.type === 'InstructionBatch') {
                var instructionBatch = _this.lease;
                instructionBatch.instructionCount--;
            }
            else if (_this.lease.type === 'TimeAllocation') {
                var timeAllocation = _this.lease;
                // TODO
            }
            else {
                console.log('other lease type is not supported');
            }
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
                if (_this.spawnBehavior.type === 'ManualAdd') {
                    var scheduler = _this.spawnBehavior.scheduler;
                    scheduler.add(spawned);
                }
                else if (_this.spawnBehavior.type === 'AsyncCommunication') {
                    postMessage({ type: 'spawn_new', goroutine: spawned });
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
            SEND: function (instr) {
                _this.memory.channel_send(_this.state);
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
