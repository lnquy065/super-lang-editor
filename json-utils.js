const _ = require('lodash');


function renameKey(JSON_FORMAT, content, currentName, newName) {
    if (JSON_FORMAT === 'nesting') {
        const tempValue = _.get(content, currentName);
        _.unset(content, currentName);
        _.set(content, newName, tempValue);
    }
    if (JSON_FORMAT === 'inline') {
        content[newName] = content[currentName]
        delete content[currentName]
    }
}

function convertNamingAllKeyName(JSON_FORMAT, content, style) {
    if (typeof content === 'object') {
        const keyList = Object.keys(content);
        for(const key of keyList) {
            convertNamingAllKeyName(JSON_FORMAT, content[key], style);
            convertNamingKeyName(JSON_FORMAT, content, key, style);
        }
    }
}

function convertNamingKeyName(JSON_FORMAT, content, currentName, style) {
    function convert(convertFunc, str) {
        return str.split('.').map(s => convertFunc(s)).join('.');
    }

    let newName;
    switch (style) {
        case 'camelCase':
            newName = convert(_.camelCase, currentName);
            break;
        case 'kebabCase':
            newName = convert(_.kebabCase, currentName);
            break;
        case 'snakeCase':
            newName = convert(_.snakeCase, currentName);
            break;
        default:
            newName = currentName;
    }

    // check if equals then do nothing
    if (newName === currentName) {
        return;
    }

    if (JSON_FORMAT === 'nesting') {
        const tempValue = _.get(content, currentName);
        _.unset(content, currentName);
        _.set(content, newName, tempValue);
    }
    if (JSON_FORMAT === 'inline') {
        content[newName] = content[currentName]
        delete content[currentName]
    }
}

function sort(JSON_FORMAT, json, order = 'asc') {
    if (typeof json === 'object') {
        const keys = Object.keys(json);
        const sortedKeys = keys.sort((a, b) => {
            if (order === 'asc') {
                return a.localeCompare(b);
            }
            if (order === 'desc') {
                return b.localeCompare(a);
            }
        })

        let sortedObject = {};
        for (const key of sortedKeys) {
            sortedObject = {
                ...sortedObject,
                [key]: sort(JSON_FORMAT, json[key], order)
            }
        }
        return sortedObject
    } else {
        return json;
    }
}


function writeValue(JSON_FORMAT, obj, langKey, value) {
    if (JSON_FORMAT === 'nesting') {
        _.update(obj, langKey, function (n) {
            return value;
        });
    }
    if (JSON_FORMAT === 'inline') {
        obj[langKey] = value;
    }
}

function removeKey(JSON_FORMAT, obj, langKey) {
    if (JSON_FORMAT === 'nesting') {
        _.unset(obj, langKey);
    }
    if (JSON_FORMAT === 'inline') {
        delete obj[langKey];
    }
}


function formatDefaultValue(JSON_FORMAT, obj, langKey) {
    if (JSON_FORMAT === 'nesting') {
        return _.get(obj, langKey);
    }
    if (JSON_FORMAT === 'inline') {
        return obj[langKey]
    }
}



module.exports = JSONUtils = {
    writeValue,
    removeKey,
    sort: sort,
    convertNamingKeyName,
    renameKey,
    formatDefaultValue,
    convertNamingAllKeyName
}