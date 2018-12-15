def fetch_builtins():
    return {
        "StringValue" : {
        "returns" : "int",
        "args" : [
            {
                "value" : "std::string"
            }
        ]
    }, "TimeValue" : {
        "returns" : "AttributeValue",
        "args" : [
            {
                "value" : "Time"
            }
        ]
    }, "Seconds" : {
        "returns" : "Time",
        "args" : [
            {
                "value" : "double"
            }
        ]
    }}