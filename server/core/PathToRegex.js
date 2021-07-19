class PathToRegex {
    static lexer(str) {
        var tokens = [];
        var i = 0;
        while (i < str.length) {
            var char = str[i];
            if (char === "*" || char === "+" || char === "?") {
                tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
                continue;
            }
            if (char === "\\") {
                tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
                continue;
            }
            if (char === "{") {
                tokens.push({ type: "OPEN", index: i, value: str[i++] });
                continue;
            }
            if (char === "}") {
                tokens.push({ type: "CLOSE", index: i, value: str[i++] });
                continue;
            }
            if (char === ":") {
                var name = "";
                var j = i + 1;
                while (j < str.length) {
                    var code = str.charCodeAt(j);
                    if (code >= 48 && code <= 57 || code >= 65 && code <= 90 || code >= 97 && code <= 122 || code === 95) {
                        name += str[j++];
                        continue;
                    }
                    break;
                }
                if (!name) throw new TypeError("Missing parameter name at " + i);
                tokens.push({ type: "NAME", index: i, value: name });
                i = j;
                continue;
            }
            if (char === "(") {
                var count = 1;
                var pattern = "";
                var _j = i + 1;
                if (str[_j] === "?") {
                    throw new TypeError("Pattern cannot start with \"?\" at " + _j);
                }
                while (_j < str.length) {
                    if (str[_j] === "\\") {
                        pattern += str[_j++] + str[_j++];
                        continue;
                    }
                    if (str[_j] === ")") {
                        count--;
                        if (count === 0) {
                            _j++;
                            break;
                        }
                    } else if (str[_j] === "(") {
                        count++;
                        if (str[_j + 1] !== "?") {
                            throw new TypeError("Capturing groups are not allowed at " + _j);
                        }
                    }
                    pattern += str[_j++];
                }
                if (count) throw new TypeError("Unbalanced pattern at " + i);
                if (!pattern) throw new TypeError("Missing pattern at " + i);
                tokens.push({ type: "PATTERN", index: i, value: pattern });
                i = _j;
                continue;
            }
            tokens.push({ type: "CHAR", index: i, value: str[i++] });
        }
        tokens.push({ type: "END", index: i, value: "" });
        return tokens;
    }

    static parse(str) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var tokens = PathToRegex.lexer(str);
        var _options$prefixes = options.prefixes;
        var prefixes = _options$prefixes === undefined ? "./" : _options$prefixes;

        var defaultPattern = "[^" + PathToRegex.escapeString(options.delimiter || "/#?") + "]+?";
        var result = [];
        var key = 0;
        var i = 0;
        var path = "";
        var tryConsume = function tryConsume(type) {
            if (i < tokens.length && tokens[i].type === type) return tokens[i++].value;
        };
        var mustConsume = function mustConsume(type) {
            var value = tryConsume(type);
            if (value !== undefined) return value;
            var _tokens$i = tokens[i];
            var nextType = _tokens$i.type;
            var index = _tokens$i.index;

            throw new TypeError("Unexpected " + nextType + " at " + index + ", expected " + type);
        };
        var consumeText = function consumeText() {
            var result = "";
            var value = void 0;
            while (value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
                result += value;
            }
            return result;
        };
        while (i < tokens.length) {
            var char = tryConsume("CHAR");
            var name = tryConsume("NAME");
            var pattern = tryConsume("PATTERN");
            if (name || pattern) {
                var prefix = char || "";
                if (prefixes.indexOf(prefix) === -1) {
                    path += prefix;
                    prefix = "";
                }
                if (path) {
                    result.push(path);
                    path = "";
                }
                result.push({
                    name: name || key++,
                    prefix: prefix,
                    suffix: "",
                    pattern: pattern || defaultPattern,
                    modifier: tryConsume("MODIFIER") || ""
                });
                continue;
            }
            var value = char || tryConsume("ESCAPED_CHAR");
            if (value) {
                path += value;
                continue;
            }
            if (path) {
                result.push(path);
                path = "";
            }
            var open = tryConsume("OPEN");
            if (open) {
                var _prefix = consumeText();
                var _name = tryConsume("NAME") || "";
                var _pattern = tryConsume("PATTERN") || "";
                var suffix = consumeText();
                mustConsume("CLOSE");
                result.push({
                    name: _name || (_pattern ? key++ : ""),
                    pattern: _name && !_pattern ? defaultPattern : _pattern,
                    prefix: _prefix,
                    suffix: suffix,
                    modifier: tryConsume("MODIFIER") || ""
                });
                continue;
            }
            mustConsume("END");
        }
        return result;
    }

    static compile(str, options) {
        return PathToRegex.tokensToFunction(PathToRegex.parse(str, options), options);
    }

    static tokensToFunction(tokens) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var reFlags = PathToRegex.flags(options);
        var _options$encode = options.encode;
        var encode = _options$encode === undefined ? function (x) {
            return x;
        } : _options$encode;
        var _options$validate = options.validate;
        var validate = _options$validate === undefined ? true : _options$validate;

        var matches = tokens.map(function (token) {
            if ((typeof token === "undefined" ? "undefined" : typeof(token)) === "object") {
                return new RegExp("^(?:" + token.pattern + ")$", reFlags);
            }
        });
        return function (data) {
            var path = "";
            for (var i = 0; i < tokens.length; i++) {
                var token = tokens[i];
                if (typeof token === "string") {
                    path += token;
                    continue;
                }
                var value = data ? data[token.name] : undefined;
                var optional = token.modifier === "?" || token.modifier === "*";
                var repeat = token.modifier === "*" || token.modifier === "+";
                if (Array.isArray(value)) {
                    if (!repeat) {
                        throw new TypeError("Expected \"" + token.name + "\" to not repeat, but got an array");
                    }
                    if (value.length === 0) {
                        if (optional) continue;
                        throw new TypeError("Expected \"" + token.name + "\" to not be empty");
                    }
                    for (var j = 0; j < value.length; j++) {
                        var segment = encode(value[j], token);
                        if (validate && !matches[i].test(segment)) {
                            throw new TypeError("Expected all \"" + token.name + "\" to match \"" + token.pattern + "\", but got \"" + segment + "\"");
                        }
                        path += token.prefix + segment + token.suffix;
                    }
                    continue;
                }
                if (typeof value === "string" || typeof value === "number") {
                    var _segment = encode(String(value), token);
                    if (validate && !matches[i].test(_segment)) {
                        throw new TypeError("Expected \"" + token.name + "\" to match \"" + token.pattern + "\", but got \"" + _segment + "\"");
                    }
                    path += token.prefix + _segment + token.suffix;
                    continue;
                }
                if (optional) continue;
                var typeOfMessage = repeat ? "an array" : "a string";
                throw new TypeError("Expected \"" + token.name + "\" to be " + typeOfMessage);
            }
            return path;
        };
    }

    static match(str, options) {
        var keys = [];
        var re = PathToRegex.pathToRegexp(str, keys, options);
        return PathToRegex.regexpToFunction(re, keys, options);
    }
    static regexpToFunction(re, keys) {
        var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
        var _options$decode = options.decode;
        var decode = _options$decode === undefined ? function (x) {
            return x;
        } : _options$decode;

        return function (pathname) {
            var m = re.exec(pathname);
            if (!m) return false;
            var path = m[0];
            var index = m.index;

            var params = Object.create(null);

            var _loop = function _loop(i) {
                if (m[i] === undefined) return "continue";
                var key = keys[i - 1];
                if (key.modifier === "*" || key.modifier === "+") {
                    params[key.name] = m[i].split(key.prefix + key.suffix).map(function (value) {
                        return decode(value, key);
                    });
                } else {
                    params[key.name] = decode(m[i], key);
                }
            };

            for (var i = 1; i < m.length; i++) {
                var _ret = _loop(i);

                if (_ret === "continue") continue;
            }
            return { path: path, index: index, params: params };
        };
    }

    static escapeString(str) {
        return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
    }

    static flags(options) {
        return options && options.sensitive ? "" : "i";
    }

    static regexpToRegexp(path, keys) {
        if (!keys) return path;
        var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
        var index = 0;
        var execResult = groupsRegex.exec(path.source);
        while (execResult) {
            keys.push({
                name: execResult[1] || index++,
                prefix: "",
                suffix: "",
                modifier: "",
                pattern: ""
            });
            execResult = groupsRegex.exec(path.source);
        }
        return path;
    }

    static arrayToRegexp(paths, keys, options) {
        var parts = paths.map(function (path) {
            return PathToRegex.pathToRegexp(path, keys, options).source;
        });
        return new RegExp("(?:" + parts.join("|") + ")", PathToRegex.flags(options));
    }

    static stringToRegexp(path, keys, options) {
        return PathToRegex.tokensToRegexp(PathToRegex.parse(path, options), keys, options);
    }

    static tokensToRegexp(tokens, keys) {
        var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
        var _options$strict = options.strict;
        var strict = _options$strict === undefined ? false : _options$strict;
        var _options$start = options.start;
        var start = _options$start === undefined ? true : _options$start;
        var _options$end = options.end;
        var end = _options$end === undefined ? true : _options$end;
        var _options$encode2 = options.encode;
        var encode = _options$encode2 === undefined ? function (x) {
            return x;
        } : _options$encode2;

        var endsWith = "[" + PathToRegex.escapeString(options.endsWith || "") + "]|$";
        var delimiter = "[" + PathToRegex.escapeString(options.delimiter || "/#?") + "]";
        var route = start ? "^" : "";
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = tokens[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var token = _step.value;

                if (typeof token === "string") {
                    route += PathToRegex.escapeString(encode(token));
                } else {
                    var prefix = PathToRegex.escapeString(encode(token.prefix));
                    var suffix = PathToRegex.escapeString(encode(token.suffix));
                    if (token.pattern) {
                        if (keys) keys.push(token);
                        if (prefix || suffix) {
                            if (token.modifier === "+" || token.modifier === "*") {
                                var mod = token.modifier === "*" ? "?" : "";
                                route += "(?:" + prefix + "((?:" + token.pattern + ")(?:" + suffix + prefix + "(?:" + token.pattern + "))*)" + suffix + ")" + mod;
                            } else {
                                route += "(?:" + prefix + "(" + token.pattern + ")" + suffix + ")" + token.modifier;
                            }
                        } else {
                            route += "(" + token.pattern + ")" + token.modifier;
                        }
                    } else {
                        route += "(?:" + prefix + suffix + ")" + token.modifier;
                    }
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        if (end) {
            if (!strict) route += delimiter + "?";
            route += !options.endsWith ? "$" : "(?=" + endsWith + ")";
        } else {
            var endToken = tokens[tokens.length - 1];
            var isEndDelimited = typeof endToken === "string" ? delimiter.indexOf(endToken[endToken.length - 1]) > -1 : // tslint:disable-next-line
                endToken === undefined;
            if (!strict) {
                route += "(?:" + delimiter + "(?=" + endsWith + "))?";
            }
            if (!isEndDelimited) {
                route += "(?=" + delimiter + "|" + endsWith + ")";
            }
        }
        return new RegExp(route, PathToRegex.flags(options));
    }

    static pathToRegexp(path, keys, options) {
        if (path instanceof RegExp) return PathToRegex.regexpToRegexp(path, keys);
        if (Array.isArray(path)) return PathToRegex.arrayToRegexp(path, keys, options);
        return PathToRegex.stringToRegexp(path, keys, options);
    }
}

module.exports = PathToRegex;
