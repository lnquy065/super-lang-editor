/*******************************************************************************
 * Created on : 24/10/2019
 * Author: Quy Luong
 *******************************************************************************/
const find = require('find');
const path = require('path');
const fs = require('fs');
const ISO6391 = require('iso-639-1');
const _ = require('lodash');

const directoryPath = path.join(process.cwd(), '/');

// find default folder
const JSONfiles = find.fileSync(/\.json$/, directoryPath)
    .filter(path => !path.includes('node_modules'))
    .filter(file => ISO6391.getName(path.basename(file, '.json')))
    .map(path => path.replace(directoryPath, ''));

module.exports = {
    directoryPath: directoryPath,
    JSONfiles: JSONfiles,
    languageConfigQuestions: [
        {
            name: 'jsonType',
            type: 'list',
            message: 'Select JSON format: ',
            choices: [
                {
                    name: 'Nesting',
                    value: 'nesting'
                },
                {
                    name: 'Inline',
                    value: 'inline'
                },
                ]
        },
        {
            name: 'languageFiles',
            type: 'checkbox',
            message: 'Select language files: ',
            choices: function (current) {
                return JSONfiles
                    .filter(file => path.extname(file).toLowerCase() === '.json')
                    .map(file => {
                        const langName = ISO6391.getName(path.basename(file, '.json'))
                        return {
                            name: langName? `${file} - (${langName})`:file,
                            value: file,
                            checked: !!langName,
                            short: path.basename(file, '.json')
                        }
                    })

            }
        },
        {
            name: 'defaultLanguage',
            type: 'list',
            message: 'Select default language: ',
            choices: function (current) {
                return current.languageFiles.map(file => {
                    const langName = ISO6391.getName(path.basename(file, '.json'))
                    return {
                        name: langName? `${file} - (${langName})`:file,
                        value: file,
                        short: path.basename(file, '.json')
                    }
                })
            }
        }
    ],
    createActionQuestions: createActionQuestions,
    createLangObj: createLangObj,
    extractKeys: extractKeys
}

function createAutocompleteSource(current, input, keyList, jsonFormat) {
    return new Promise(resolve => {
        if (input) {
            resolve(keyList.filter(key => key.toLowerCase().includes(input.toLowerCase())));
        } else {
            resolve(keyList)
        }
    })
}

function extractKeys(json, jsonFormat = 'nesting', prefix = '') {
    if (jsonFormat === 'nesting') {
        if (typeof json === 'object' && !_.isEmpty(json)) {
            const keyList = Object.keys(json);
            let resultStr = [];
            for (const key of keyList) {
                resultStr = [...resultStr, ...extractKeys(json[key], 'nesting', `${(prefix !== ''? prefix + '.':'')}` + key)]
            }
            return resultStr;
        }
        return [prefix];
    } else {
        return Object.keys(json)
    }
}
function keyNameValidate(keyName) {
    if (keyName) {
        return true
    }
    return 'Please input path name!'
}
function createActionQuestions(keyList, jsonFormat) {
    return [
        {
            name: 'action',
            type: 'list',
            message: 'Select action: ',
            choices: [
                {
                    name: 'Edit',
                    value: 'edit',
                    short: 'Edit'
                },
                {
                    name: 'Remove',
                    value: 'remove',
                    short: 'Remove'
                },
                {
                    name: 'Add New',
                    value: 'add',
                    short: 'Add New'
                },
                {
                    name: 'Sort',
                    value: 'sort',
                    short: 'Sort'
                },
                {
                    name: 'Exit',
                    value: 'exit',
                    short: 'Exit'
                }
            ]
        },
        {
            name: 'sort',
            type: 'list',
            message: 'Sort all language keys:',
            when: function (current) {
                return current.action === 'sort'
            },
            choices: [
                {
                    name: 'A-Z',
                    value: 'asc'
                },
                {
                    name: 'Z-A',
                    value: 'desc'
                }
            ]
        },
        {
            name: 'editKeyName',
            type: 'autocomplete',
            message: 'Input path name to edit:',
            when: function (current) {
                return current.action === 'edit'
            },
            suggestOnly: true,
            source: (current, input) => createAutocompleteSource(current, input, keyList, jsonFormat),
            validate: keyNameValidate
        },
        {
            name: 'removeKeyName',
            type: 'autocomplete',
            message: 'Input path name to remove:',
            when: function (current) {
                return current.action === 'remove'
            },
            suggestOnly: true,
            source: (current, input) => createAutocompleteSource(current, input, keyList, jsonFormat),
            validate: keyNameValidate
        },
        {
            name: 'addKeyName',
            type: 'autocomplete',
            message: 'Input path name to add:',
            when: function (current) {
                return current.action === 'add'
            },
            suggestOnly: true,
            source: (current, input) => createAutocompleteSource(current, input, keyList, jsonFormat),
            validate: keyNameValidate
        }
    ]
}

function createLangObj(file) {
    const contents = fs.readFileSync(file, 'utf8');
    return JSON.parse(contents);
}
