
// json-type-tool @ npm, json type tool.

//refer https://www.json.org/json-en.html

//return "string|number|boolean|object|array|null"+"undefined|unknown"
var typeName = function (json, strict) {
	var type = typeof json;

	switch (type) {
		case "number":
			if (strict && !isFinite(json)) return "unknown";
		case "string":
		case "boolean":
		case "undefined":
			return type;
		case "object":
			if (json === null) return "null";
			if (json instanceof Array) return "array";
			if (strict) {
				//check if an object is directly like '{...}'.
				if (Object.getPrototypeOf(json) === Object.prototype) return "object";		//strict object
			}
			else {
				var v = json.valueOf();
				return (v === json) ? "object" : typeName(v, true);
			}
		default:
			return "unknown";
	}
}

var isStrictObject = function (json) {
	return typeName(json, true) === "object";
}

//return true if json is 'object' or 'array' type
var isContainer = function (json, strict) {
	var type = typeName(json, strict);
	return type === "object" || type === "array";
}

var isContainerEmpty = function (json) {
	if (!json || typeof json !== "object") return true;

	//array
	if (json instanceof Array) return !(json.length > 0);

	//object
	for (var i in json) { if (typeof json[i] !== "undefined") return false; }
	return true;
}

var copyContainer = function (src, dest) {
	if (src && src.valueOf) src = src.valueOf();	//strip object
	if (!isContainer(src, true)) return src;

	if (!dest) dest = (src instanceof Array) ? [] : {};

	var i, v;
	for (i in src) {
		v = src[i];
		if (v && v.valueOf) v = v.valueOf();

		dest[i] = isContainer(v, true) ? copyContainer(v) : v;
	}
	return dest;
}

//simplify array and object
//return [json,type] if success; return empty if fail
var _simplyfiy = function (json, jsonType, first) {
	if (jsonType === "array") {
		if (json.length < 2 || first) json = json[0];
		else return;
	}
	else if (jsonType === "object") {
		if (first) {
			for (var i in json) {
				first = false;
				json = json[i];
				break;
			}
			if (first) return;	//empty, then return
		}
		else if ("value" in json) {
			json = json.value;
		}
		else return;
	}
	else return;	//return void

	if (json && json.valueOf) json = json.valueOf();

	jsonType = typeName(json, true);
	return [json, jsonType];
}

var convert = function (json, toType) {
	if (json && json.valueOf) json = json.valueOf();
	var jsonType = typeName(json, true);
	//if (jsonType === toType) return json;		//still convert to normal json value

	var i, toValue;

	if (toType === "string") {
		switch (jsonType) {
			case "string":
				return json;
			case "number":
			case "boolean":
				return json.toString();
			case "object":
				if (isContainerEmpty(json)) return "";
			case "array":
				sv = _simplyfiy(json, jsonType);
				if (sv) return convert(sv[0], toType);
				return JSON.stringify(json);
			case "null":
			case "undefined":
				return "";
			default:
				return json ? json.toString() : "";
		}
	}
	else if (toType === "number") {
		switch (jsonType) {
			case "string":
				if (json.match(/^(false|0|null|undefined)$/i)) return 0;
				json = parseFloat(json);
			case "number":
				return isFinite(json) ? json : 0;
			case "boolean":
				return json ? 1 : 0;
			case "object":
				if (isContainerEmpty(json)) return 0;
			case "array":
				sv = _simplyfiy(json, jsonType, jsonType === "array");
				if (sv) return convert(sv[0], toType);
				json = (new Number(json)).valueOf();
				return isFinite(json) ? json : 0;
			case "null":
			case "undefined":
				return 0;
			default:
				json = (new Number(json)).valueOf();
				return isFinite(json) ? json : 0;
		}
	}
	else if (toType === "boolean") {
		switch (jsonType) {
			case "string":
				if (json.match(/^(false|0|null|undefined)$/i)) return false;
			case "number":
				return (new Boolean(json)).valueOf();
			case "boolean":
				return json;
			case "object":
				if (isContainerEmpty(json)) return false;
			case "array":
				sv = _simplyfiy(json, jsonType, jsonType === "array");
				return sv ? convert(sv[0], toType) : (new Boolean(json)).valueOf();
			case "null":
			case "undefined":
				return false;
			default:
				return (new Boolean(json)).valueOf();
		}
	}
	else if (toType === "object") {
		switch (jsonType) {
			case "string":
			case "number":
			case "boolean":
				return json ? { value: json } : {};
			case "object":
				return json;
			case "array":
				toValue = {};
				for (i in json) toValue[i] = json[i];
				return toValue;
			//case "null":
			//case "undefined":
			default:
				return {};
		}
	}
	else if (toType === "array") {
		switch (jsonType) {
			case "string":
			case "number":
			case "boolean":
				return json ? [json] : [];
			case "object":
				if (isContainerEmpty(json)) return [];

				toValue = [];
				for (i in json) {
					if (i.match(/^\d+$/)) {
						i = parseInt();
						if (!(i in toValue)) toValue[i] = json[i];
					}
				}
				if (!toValue.length) {
					sv = _simplyfiy(json, jsonType);	//try .value
					if (!sv) sv = _simplyfiy(json, jsonType, true);	//try first value as [0]

					if (sv) return convert(sv[0], toType);
				}
				return toValue;
			case "array":
				return json;
			//case "null":
			//case "undefined":
			default:
				return [];
		}
	}
	/*
	else if (toType === "null") {
		return null;
	}
	*/
	else {
		return null;
	}
}

module.exports = exports = typeName;

exports.typeName = typeName;
exports.isStrictObject = isStrictObject;
exports.isContainer = isContainer;
exports.isContainerEmpty = isContainerEmpty;
exports.copyContainer = copyContainer;
exports.copy = copyContainer;

exports.convert = convert;

exports.toString = function (json) { return convert(json, "string"); }
exports.toNumber = function (json) { return convert(json, "number"); }
exports.toBoolean = function (json) { return convert(json, "boolean"); }
exports.toObject = function (json) { return convert(json, "object"); }
exports.toArray = function (json) { return convert(json, "array"); }
exports.toNull = function (json) { return convert(json, "null"); }
