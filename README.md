# json-type-tool
json type tool

refer https://www.json.org/json-en.html

# Install
```
npm install json-type-tool
```

# Usage & Api
```javascript

var json_type_tool = require("json-type-tool");

//.typeName(json, strict)		//return "string|number|boolean|object|array|null"+"undefined|unknown"
json_type_tool.typeName(1.23) === "number"
json_type_tool(123) === "number"
json_type_tool(new Number(123)) === "number"
json_type_tool(new Number(123), true) === "unknown"

//.isContainer(json, strict)	//return true if json is 'object' or 'array' type
json_type_tool.isContainer({})
json_type_tool.isContainer([])
!json_type_tool.isContainer("aaa")
!json_type_tool.isContainer(123)

json_type_tool.isContainer(new RegExp("reg")) &&	//is object
!json_type_tool.isContainer(new RegExp("reg"), true) &&		//is not like '{}'

//.convert(json, toType)
json_type_tool.convert("abc", "string") === "abc"
json_type_tool.toString("abc") === "abc"

```
