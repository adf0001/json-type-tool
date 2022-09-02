
//global variable, for html page, refer tpsvr @ npm.
json_type_tool = require("../json-type-tool.js");
assert = require("assert");

cmp_json = function (value, expect) {
	if (JSON.stringify(value) === JSON.stringify(expect)) return true;
	console.error("value string: " + JSON.stringify(value));
	console.error("the expected: " + JSON.stringify(expect));
	return false;
};

module.exports = {

	".typeName()": function (done) {
		done(!(
			//string
			json_type_tool("aaa") === "string" &&

			//number
			json_type_tool(123) === "number" &&
			json_type_tool.typeName(1.23) === "number" &&

			//boolean
			json_type_tool(true) === "boolean" &&
			json_type_tool(false) === "boolean" &&

			//object
			json_type_tool({}) === "object" &&
			json_type_tool({ a: 11 }) === "object" &&

			//array
			json_type_tool([]) === "array" &&
			json_type_tool([11]) === "array" &&

			//null
			json_type_tool(null) === "null" &&

			//others
			json_type_tool() === "undefined" &&
			json_type_tool(function () { }) === "unknown" &&
			json_type_tool(new Function("console.log('a')")) === "unknown" &&

			true
		));
	},

	".typeName()/strict": function (done) {
		done(!(
			//string
			typeof (new String("aaa")) === "object" &&
			json_type_tool(new String("aaa")) === "string" &&
			json_type_tool(new String("aaa"), true) === "unknown" &&

			//number
			typeof (new Number(123)) === "object" &&
			json_type_tool(new Number(123)) === "number" &&
			json_type_tool(new Number(123), true) === "unknown" &&

			//boolean
			typeof (new Boolean(true)) === "object" &&
			json_type_tool(new Boolean(true)) === "boolean" &&
			json_type_tool(new Boolean(true), true) === "unknown" &&

			//object, array, null
			json_type_tool({}, true) === "object" &&
			json_type_tool([], true) === "array" &&
			json_type_tool(null, true) === "null" &&

			//others
			json_type_tool(undefined, true) === "undefined" &&
			json_type_tool(function () { }, true) === "unknown" &&
			json_type_tool(new Function("console.log('a')"), true) === "unknown" &&

			true
		));
	},

	".isStrictObject()": function (done) {
		assert(json_type_tool.isStrictObject({}));		//true
		assert(json_type_tool.isStrictObject(new Object()));		//true

		assert(!json_type_tool.isStrictObject(Object.create(null)));		//false

		assert(!json_type_tool.isStrictObject(Object.create({})));		//false
		assert(!json_type_tool.isStrictObject(Object.create(new Object())));		//false

		assert(!json_type_tool.isStrictObject(Object.create(Object.create(null))));		//false
		assert(!json_type_tool.isStrictObject(Object.create(Object.create({}))));			//false
		assert(!json_type_tool.isStrictObject(Object.create(Object.create(new Object()))));		//false

		assert(!json_type_tool.isStrictObject(Object.create([])));		//false
		assert(!json_type_tool.isStrictObject(Object.create(new Array())));		//false
		assert(!json_type_tool.isStrictObject(Object.create(new Date())));		//false
		assert(!json_type_tool.isStrictObject(Object.create(/reg/)));		//false
		assert(!json_type_tool.isStrictObject(Object.create(Object.create([]))));		//false
		assert(!json_type_tool.isStrictObject(Object.create(Object.create(new Date()))));		//false

		assert(!json_type_tool.isStrictObject(null));		//false
		assert(!json_type_tool.isStrictObject(undefined));		//false
		assert(!json_type_tool.isStrictObject(123));		//false
		assert(!json_type_tool.isStrictObject("abc"));		//false
		assert(!json_type_tool.isStrictObject(true));		//false
		assert(!json_type_tool.isStrictObject(false));		//false
		assert(!json_type_tool.isStrictObject(new Date()));		//false
		assert(!json_type_tool.isStrictObject(123));		//false
		assert(!json_type_tool.isStrictObject(new Number(5)));		//false
		assert(!json_type_tool.isStrictObject([]));		//false
		assert(!json_type_tool.isStrictObject(new Array(1, 2)));		//false
		assert(!json_type_tool.isStrictObject(/reg/));		//false
		assert(!json_type_tool.isStrictObject(new RegExp("reg")));		//false
		assert(!json_type_tool.isStrictObject(function () { }));		//false

		var func1 = function () { };
		assert(!json_type_tool.isStrictObject(new func1()));		//false
		assert(!json_type_tool.isStrictObject(Object.create(new func1())));		//false

		func1.prototype = {};
		assert(!json_type_tool.isStrictObject(new func1()));		//false
		assert(!json_type_tool.isStrictObject(Object.create(new func1())));		//false

		func1.prototype = [];
		assert(!json_type_tool.isStrictObject(new func1()));		//false
		assert(!json_type_tool.isStrictObject(Object.create(new func1())));		//false

		func1.prototype.constructor = Object;
		assert(!json_type_tool.isStrictObject(new func1()));		//false
		assert(!json_type_tool.isStrictObject(Object.create(new func1())));		//false

		var o2 = [];
		o2.constructor = Object;
		assert(!json_type_tool.isStrictObject(o2));		//false
		assert(!json_type_tool.isStrictObject(Object.create(o2)));		//false

		done(false);
	},

	".isContainer()": function (done) {
		done(!(
			//object and array
			json_type_tool.isContainer({}) &&
			json_type_tool.isContainer({ a: 11 }) &&
			json_type_tool.isContainer([]) &&
			json_type_tool.isContainer([11]) &&

			//others
			!json_type_tool.isContainer("aaa") &&
			!json_type_tool.isContainer(123) &&
			!json_type_tool.isContainer(true) &&
			!json_type_tool.isContainer(null) &&
			!json_type_tool.isContainer() &&
			!json_type_tool.isContainer(function () { }) &&
			!json_type_tool.isContainer(new Function("console.log('a')")) &&

			//strict
			json_type_tool.isContainer(new RegExp("reg")) &&	//is object
			!json_type_tool.isContainer(new RegExp("reg"), true) &&		//is not like '{}'
			json_type_tool.isContainer(Object.create({})) &&
			json_type_tool.isContainer(/reg/) &&
			!json_type_tool.isContainer(/reg/, true) &&
			!json_type_tool.isContainer(Object.create({}), true) &&

			true
		));
	},

	".isContainerNotEmpty()": function (done) {
		done(!(
			//object and array

			json_type_tool.isContainerNotEmpty({ a: 11 }) &&
			json_type_tool.isContainerNotEmpty([11]) &&

			//all others return true

			!json_type_tool.isContainerNotEmpty({}) &&
			!json_type_tool.isContainerNotEmpty([]) &&

			//others
			!json_type_tool.isContainerNotEmpty("aaa") &&
			!json_type_tool.isContainerNotEmpty(123) &&
			!json_type_tool.isContainerNotEmpty(true) &&
			!json_type_tool.isContainerNotEmpty(null) &&
			!json_type_tool.isContainerNotEmpty() &&
			!json_type_tool.isContainerNotEmpty(function () { }) &&
			!json_type_tool.isContainerNotEmpty(new Function("console.log('a')")) &&

			//strict
			!json_type_tool.isContainerNotEmpty(new RegExp("reg")) &&
			!json_type_tool.isContainerNotEmpty(Object.create({})) &&
			!json_type_tool.isContainerNotEmpty(/reg/) &&
			!json_type_tool.isContainerNotEmpty(Object.create({})) &&

			true
		));
	},

	".isContainerEmpty()": function (done) {
		done(!(
			//object and array

			!json_type_tool.isContainerEmpty({ a: 11 }) &&
			!json_type_tool.isContainerEmpty([11]) &&

			//all others return true

			json_type_tool.isContainerEmpty({}) &&
			json_type_tool.isContainerEmpty([]) &&

			//others
			json_type_tool.isContainerEmpty("aaa") &&
			json_type_tool.isContainerEmpty(123) &&
			json_type_tool.isContainerEmpty(true) &&
			json_type_tool.isContainerEmpty(null) &&
			json_type_tool.isContainerEmpty() &&
			json_type_tool.isContainerEmpty(function () { }) &&
			json_type_tool.isContainerEmpty(new Function("console.log('a')")) &&

			//strict
			json_type_tool.isContainerEmpty(new RegExp("reg")) &&
			json_type_tool.isContainerEmpty(Object.create({})) &&
			json_type_tool.isContainerEmpty(/reg/) &&
			json_type_tool.isContainerEmpty(Object.create({})) &&

			true
		));
	},

	"container tool": function (done) {
		var a1 = { aa: 1, bb: [22, 33, { cc: 44, dd: 55 }] };
		var a2 = json_type_tool.copy(a1);
		var a3 = {};
		json_type_tool.copy(a1, a3);

		var a10 = { a: 1, b: 2 };
		var a11 = [1, 2, 3];

		done(!(
			json_type_tool.getContainerItemCount(a10) === 2 &&
			json_type_tool.getContainerItemCount(a11) === 3 &&

			cmp_json(json_type_tool.clearContainer(a10), {}) &&
			cmp_json(json_type_tool.clearContainer(a11), []) &&

			cmp_json(a1, a2) &&
			cmp_json(a1, a3) &&

			a1 !== a2 &&
			a1.bb !== a2.bb &&

			a1.bb[2] !== a2.bb[2] &&
			cmp_json(a1.bb[2], a2.bb[2]) &&
			cmp_json(a1.bb[2], { cc: 44, dd: 55 }) &&

			//string
			cmp_json(json_type_tool.copyContainer("12"), "12") &&

			cmp_json(json_type_tool.copy("12"), "12") &&
			cmp_json(json_type_tool.copy(""), "") &&

			//number
			cmp_json(json_type_tool.copy(0), 0) &&
			cmp_json(json_type_tool.copy(1.1), 1.1) &&

			//boolean
			cmp_json(json_type_tool.copy(true), true) &&
			cmp_json(json_type_tool.copy(false), false) &&
			cmp_json(json_type_tool.copy(new Boolean(true)), true) &&

			//object
			cmp_json(json_type_tool.copy({}), {}) &&
			cmp_json(json_type_tool.copy({ a: undefined }), { a: undefined }) &&
			cmp_json(json_type_tool.copy({ a: 0 }), { a: 0 }) &&
			cmp_json(json_type_tool.copy({ a: 1, value: 2 }), { a: 1, value: 2 }) &&
			cmp_json(json_type_tool.copy({ a: 1, value: "0" }), { a: 1, value: "0" }) &&

			//array
			cmp_json(json_type_tool.copy([]), []) &&
			cmp_json(json_type_tool.copy([0]), [0]) &&
			cmp_json(json_type_tool.copy([1]), [1]) &&
			cmp_json(json_type_tool.copy([1, 2]), [1, 2]) &&
			cmp_json(json_type_tool.copy([[0, 2], 3]), [[0, 2], 3]) &&
			cmp_json(json_type_tool.copy([["null", 2], 3]), [["null", 2], 3]) &&

			//null
			cmp_json(json_type_tool.copy(null), null) &&

			//others
			cmp_json(json_type_tool.copy(undefined), undefined) &&
			cmp_json(json_type_tool.copy(new Date(2000, 1, 1, 0, 0, 0)), 949334400000) &&
			cmp_json(json_type_tool.copy(function () { }), function () { }) &&
			cmp_json(json_type_tool.copy(/reg/i), /reg/i) &&

			true
		));
	},

	".convert() - string": function (done) {
		done(!(
			//string
			json_type_tool.toString("abc") === "abc" &&

			json_type_tool.convert("abc", "string") === "abc" &&
			json_type_tool.convert("", "string") === "" &&
			json_type_tool.convert(new String("abc"), "string") === "abc" &&

			//number
			json_type_tool.convert(1, "string") === "1" &&
			json_type_tool.convert(0, "string") === "0" &&
			json_type_tool.convert(1.1, "string") === "1.1" &&
			json_type_tool.convert(-1.1, "string") === "-1.1" &&
			json_type_tool.convert(parseInt("aaa"), "string") === "" &&
			json_type_tool.convert(1 / 0, "string") === "Infinity" &&
			json_type_tool.convert(-1 / 0, "string") === "-Infinity" &&

			//boolean
			json_type_tool.convert(true, "string") === "true" &&
			json_type_tool.convert(false, "string") === "false" &&
			json_type_tool.convert(new Boolean(true), "string") === "true" &&

			//object
			json_type_tool.convert({}, "string") === "" &&
			json_type_tool.convert({ a: undefined }, "string") === "" &&
			json_type_tool.convert({ a: 1 }, "string") === '{"a":1}' &&
			json_type_tool.convert({ a: 1, value: 2 }, "string") === '2' &&

			//array
			json_type_tool.convert([], "string") === '' &&
			json_type_tool.convert([0], "string") === '0' &&
			json_type_tool.convert([1], "string") === '1' &&
			json_type_tool.convert([1, 2], "string") === '[1,2]' &&

			//null
			json_type_tool.convert(null, "string") === '' &&

			//others
			json_type_tool.convert(undefined, "string") === '' &&

			json_type_tool.convert(new Date(2000, 1, 1, 0, 0, 0), "string") === '949334400000' &&
			json_type_tool.convert(/reg/i, "string") === '/reg/i' &&

			true
		));
	},

	".convert() - number": function (done) {
		done(!(
			//string
			json_type_tool.toNumber("12") === 12 &&

			json_type_tool.convert("12", "number") === 12 &&
			json_type_tool.convert("0", "number") === 0 &&
			json_type_tool.convert(new String("12"), "number") === 12 &&
			json_type_tool.convert("12ab", "number") === 12 &&
			json_type_tool.convert("12.3ab", "number") === 12.3 &&
			json_type_tool.convert("", "number") === 0 &&

			//number
			json_type_tool.convert(1, "number") === 1 &&
			json_type_tool.convert(0, "number") === 0 &&
			json_type_tool.convert(1.1, "number") === 1.1 &&
			json_type_tool.convert(-1.1, "number") === -1.1 &&
			json_type_tool.convert(parseInt("aaa"), "number") === 0 &&
			json_type_tool.convert(1 / 0, "number") === 0 &&
			json_type_tool.convert(-1 / 0, "number") === 0 &&

			//boolean
			json_type_tool.convert(true, "number") === 1 &&
			json_type_tool.convert(false, "number") === 0 &&
			json_type_tool.convert(new Boolean(true), "number") === 1 &&

			//object
			json_type_tool.convert({}, "number") === 0 &&
			json_type_tool.convert({ a: undefined }, "number") === 0 &&
			json_type_tool.convert({ a: 1 }, "number") === 0 &&
			json_type_tool.convert({ a: 1, value: 2 }, "number") === 2 &&
			json_type_tool.convert({ a: 1, value: "2.3abc" }, "number") === 2.3 &&

			//array
			json_type_tool.convert([], "number") === 0 &&
			json_type_tool.convert([0], "number") === 0 &&
			json_type_tool.convert([1], "number") === 1 &&
			json_type_tool.convert([1, 2], "number") === 1 &&
			json_type_tool.convert([[1, 2], 3], "number") === 1 &&

			//null
			json_type_tool.convert(null, "number") === 0 &&

			//others
			json_type_tool.convert(undefined, "number") === 0 &&
			json_type_tool.convert(new Date(2000, 1, 1, 0, 0, 0), "number") === 949334400000 &&
			json_type_tool.convert(function () { }, "number") === 0 &&
			json_type_tool.convert(/1/i, "number") === 0 &&

			true
		));
	},

	".convert() - boolean": function (done) {
		done(!(
			//string
			json_type_tool.toBoolean("12") === true &&

			json_type_tool.convert("12", "boolean") === true &&
			json_type_tool.convert("0", "boolean") === false &&
			json_type_tool.convert("false", "boolean") === false &&
			json_type_tool.convert("true", "boolean") === true &&
			json_type_tool.convert("null", "boolean") === false &&
			json_type_tool.convert("undefined", "boolean") === false &&
			json_type_tool.convert(new String("12"), "boolean") === true &&
			json_type_tool.convert("", "boolean") === false &&

			//number
			json_type_tool.convert(1, "boolean") === true &&
			json_type_tool.convert(0, "boolean") === false &&
			json_type_tool.convert(1.1, "boolean") === true &&
			json_type_tool.convert(parseInt("aaa"), "boolean") === false &&
			json_type_tool.convert(1 / 0, "boolean") === true &&
			json_type_tool.convert(-1 / 0, "boolean") === true &&

			//boolean
			json_type_tool.convert(true, "boolean") === true &&
			json_type_tool.convert(false, "boolean") === false &&
			json_type_tool.convert(new Boolean(true), "boolean") === true &&

			//object
			json_type_tool.convert({}, "boolean") === false &&
			json_type_tool.convert({ a: undefined }, "boolean") === false &&
			json_type_tool.convert({ a: 0 }, "boolean") === true &&
			json_type_tool.convert({ a: 1, value: 2 }, "boolean") === true &&
			json_type_tool.convert({ a: 1, value: "0" }, "boolean") === false &&

			//array
			json_type_tool.convert([], "boolean") === false &&
			json_type_tool.convert([0], "boolean") === false &&
			json_type_tool.convert([1], "boolean") === true &&
			json_type_tool.convert([1, 2], "boolean") === true &&
			json_type_tool.convert([[0, 2], 3], "boolean") === false &&
			json_type_tool.convert([["null", 2], 3], "boolean") === false &&

			//null
			json_type_tool.convert(null, "boolean") === false &&

			//others
			json_type_tool.convert(undefined, "boolean") === false &&
			json_type_tool.convert(new Date(2000, 1, 1, 0, 0, 0), "boolean") === true &&
			json_type_tool.convert(function () { }, "boolean") === true &&
			json_type_tool.convert(/0/i, "boolean") === true &&

			true
		));
	},

	".convert() - object": function (done) {
		done(!(
			//string
			cmp_json(json_type_tool.toObject("12"), { value: "12" }) &&

			cmp_json(json_type_tool.convert("12", "object"), { value: "12" }) &&
			cmp_json(json_type_tool.convert("", "object"), {}) &&

			//number
			cmp_json(json_type_tool.convert(1, "object"), { value: 1 }) &&
			cmp_json(json_type_tool.convert(0, "object"), {}) &&
			cmp_json(json_type_tool.convert(1.1, "object"), { value: 1.1 }) &&
			cmp_json(json_type_tool.convert(parseInt("aaa"), "object"), {}) &&
			cmp_json(json_type_tool.convert(1 / 0, "object"), {}) &&
			cmp_json(json_type_tool.convert(-1 / 0, "object"), {}) &&

			//boolean
			cmp_json(json_type_tool.convert(true, "object"), { value: true }) &&
			cmp_json(json_type_tool.convert(false, "object"), {}) &&
			cmp_json(json_type_tool.convert(new Boolean(true), "object"), { value: true }) &&

			//object
			cmp_json(json_type_tool.convert({}, "object"), {}) &&
			cmp_json(json_type_tool.convert({ a: undefined }, "object"), { a: undefined }) &&
			cmp_json(json_type_tool.convert({ a: 0 }, "object"), { a: 0 }) &&
			cmp_json(json_type_tool.convert({ a: 1, value: 2 }, "object"), { a: 1, value: 2 }) &&
			cmp_json(json_type_tool.convert({ a: 1, value: "0" }, "object"), { a: 1, value: "0" }) &&

			//array
			cmp_json(json_type_tool.convert([], "object"), {}) &&
			cmp_json(json_type_tool.convert([0], "object"), { "0": 0 }) &&
			cmp_json(json_type_tool.convert([1], "object"), { "0": 1 }) &&
			cmp_json(json_type_tool.convert([1, 2], "object"), { "0": 1, "1": 2 }) &&
			cmp_json(json_type_tool.convert([[0, 2], 3], "object"), { "0": [0, 2], "1": 3 }) &&
			cmp_json(json_type_tool.convert([["null", 2], 3], "object"), { "0": ["null", 2], "1": 3 }) &&

			//null
			cmp_json(json_type_tool.convert(null, "object"), {}) &&

			//others
			cmp_json(json_type_tool.convert(undefined, "object"), {}) &&
			cmp_json(json_type_tool.convert(new Date(2000, 1, 1, 0, 0, 0), "object"), { value: 949334400000 }) &&
			cmp_json(json_type_tool.convert(function () { }, "object"), {}) &&
			cmp_json(json_type_tool.convert(/reg/i, "object"), {}) &&

			true
		));
	},

	".convert() - array": function (done) {
		done(!(
			//string
			cmp_json(json_type_tool.toArray("12"), ["12"]) &&

			cmp_json(json_type_tool.convert("12", "array"), ["12"]) &&
			cmp_json(json_type_tool.convert("", "array"), []) &&

			//number
			cmp_json(json_type_tool.convert(1, "array"), [1]) &&
			cmp_json(json_type_tool.convert(0, "array"), []) &&
			cmp_json(json_type_tool.convert(1.1, "array"), [1.1]) &&
			cmp_json(json_type_tool.convert(parseInt("aaa"), "array"), []) &&
			cmp_json(json_type_tool.convert(1 / 0, "array"), []) &&
			cmp_json(json_type_tool.convert(-1 / 0, "array"), []) &&

			//boolean
			cmp_json(json_type_tool.convert(true, "array"), [true]) &&
			cmp_json(json_type_tool.convert(false, "array"), []) &&
			cmp_json(json_type_tool.convert(new Boolean(true), "array"), [true]) &&

			//object
			cmp_json(json_type_tool.convert({}, "array"), []) &&
			cmp_json(json_type_tool.convert({ a: undefined }, "array"), []) &&
			cmp_json(json_type_tool.convert({ a: 0 }, "array"), []) &&
			cmp_json(json_type_tool.convert({ a: 1, value: 2 }, "array"), [2]) &&
			cmp_json(json_type_tool.convert({ a: 1, value: "0" }, "array"), ["0"]) &&

			//array
			cmp_json(json_type_tool.convert([], "array"), []) &&
			cmp_json(json_type_tool.convert([0], "array"), [0]) &&
			cmp_json(json_type_tool.convert([1], "array"), [1]) &&
			cmp_json(json_type_tool.convert([1, 2], "array"), [1, 2]) &&
			cmp_json(json_type_tool.convert([[0, 2], 3], "array"), [[0, 2], 3]) &&
			cmp_json(json_type_tool.convert([["null", 2], 3], "array"), [["null", 2], 3]) &&

			//null
			cmp_json(json_type_tool.convert(null, "array"), []) &&

			//others
			cmp_json(json_type_tool.convert(undefined, "array"), []) &&
			cmp_json(json_type_tool.convert(new Date(2000, 1, 1, 0, 0, 0), "array"), [949334400000]) &&
			cmp_json(json_type_tool.convert(function () { }, "array"), []) &&
			cmp_json(json_type_tool.convert(/reg/i, "array"), []) &&

			true
		));
	},

	".convert() - null": function (done) {
		done(!(
			//string
			cmp_json(json_type_tool.toNull("12"), null) &&

			cmp_json(json_type_tool.convert("12", "null"), null) &&
			cmp_json(json_type_tool.convert("", "null"), null) &&

			//number
			cmp_json(json_type_tool.convert(1, "null"), null) &&
			cmp_json(json_type_tool.convert(0, "null"), null) &&

			//boolean
			cmp_json(json_type_tool.convert(true, "null"), null) &&

			//object
			cmp_json(json_type_tool.convert({}, "null"), null) &&

			//array
			cmp_json(json_type_tool.convert([], "null"), null) &&

			//null
			cmp_json(json_type_tool.convert(null, "null"), null) &&

			//others
			cmp_json(json_type_tool.convert(undefined, "null"), null) &&
			cmp_json(json_type_tool.convert(new Date(2000, 1, 1, 0, 0, 0), "null"), null) &&
			cmp_json(json_type_tool.convert(function () { }, "null"), null) &&

			true
		));
	},

	".convert() - others": function (done) {
		done(!(
			//string
			cmp_json(json_type_tool.convert("12", "any"), null) &&
			cmp_json(json_type_tool.convert("", "any"), null) &&

			//number
			cmp_json(json_type_tool.convert(1, "any"), null) &&
			cmp_json(json_type_tool.convert(0, "any"), null) &&

			//boolean
			cmp_json(json_type_tool.convert(true, "any"), null) &&

			//object
			cmp_json(json_type_tool.convert({}, "any"), null) &&

			//array
			cmp_json(json_type_tool.convert([], "any"), null) &&

			//null
			cmp_json(json_type_tool.convert(null, "any"), null) &&

			//others
			cmp_json(json_type_tool.convert(undefined, "any"), null) &&
			cmp_json(json_type_tool.convert(new Date(2000, 1, 1, 0, 0, 0), "any"), null) &&
			cmp_json(json_type_tool.convert(function () { }, "any"), null) &&

			true
		));
	},

	"check exports": function (done) {
		var m= json_type_tool;
		for (var i in m) {
			if (typeof m[i] === "undefined") { done("undefined: " + i); return; }
		}
		done(false);

		console.log(m);
		var list = "export list: " + Object.keys(m).join(", ");
		console.log(list);
		return list;
	},

};

// for html page
//if (typeof setHtmlPage === "function") setHtmlPage("title", "10em", 1);	//page setting
if (typeof showResult !== "function") showResult = function (text) { console.log(text); }

//for mocha
if (typeof describe === "function") describe('json_type_tool', function () { for (var i in module.exports) { it(i, module.exports[i]).timeout(5000); } });
