/*******************************************************************************
 * Created on : 24/10/2019
 * Author: Quy Luong
 *******************************************************************************/
const find = require('find');
const path = require('path');
const fs = require('fs');
const ISO6391 = require('iso-639-1');
const _ = require('lodash');
const inquirer = require('inquirer');
const Constants = require('./utils/constants');


const directoryPath = path.join(process.cwd(), '/');

// find default folder
const iso931Files = find.fileSync(/\.json$/, directoryPath)
    .filter(path => !path.includes('node_modules'))
    .filter(file => ISO6391.getName(path.basename(file, '.json')))
    .map(path => path.replace(directoryPath, ''));

const otherJSONFiles = find.fileSync(/\.json$/, directoryPath)
    .filter(path => !path.includes('node_modules'))
    .filter(file => !ISO6391.getName(path.basename(file, '.json')))
    .map(path => path.replace(directoryPath, ''));

const JSONfiles = [...iso931Files, ...otherJSONFiles]


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
                    name: 'Nesting (The parent key and the child key are nested)',
                    value: 'nesting'
                },
                {
                    name: 'Inline (The parent key and the child key are separated by a ".")',
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
                            name: langName ? `${file} - (${langName})` : file,
                            value: file,
                            checked: !!langName,
                            short: path.basename(file, '.json')
                        }
                    })

            }
        },
        // {
        //     name: 'defaultLanguage',
        //     type: 'list',
        //     message: 'Select default language: ',
        //     choices: function (current) {
        //         return current.languageFiles.map(file => {
        //             const langName = ISO6391.getName(path.basename(file, '.json'))
        //             return {
        //                 name: langName? `${file} - (${langName})`:file,
        //                 value: file,
        //                 short: path.basename(file, '.json')
        //             }
        //         })
        //     }
        // }
    ],
    createActionQuestions: createActionQuestions,
    createLangObj: createLangObj,
    extractKeys: extractKeys,
    keyNameValidate: keyNameValidate,
    confirmQuestion: confirmQuestion,
    confirmQuestionWithPromise: confirmQuestionWithPromise
}

function confirmQuestion(question) {
    const questionConfig = [{
        name: 'confirm',
        type: 'confirm',
        message: question
    }];
    return inquirer.prompt(questionConfig);
}

function confirmQuestionWithPromise(question) {
    const questionConfig = [{
        name: 'confirm',
        type: 'confirm',
        message: question
    }];
    return new Promise((resolve, reject) => {
        inquirer.prompt(questionConfig)
            .then(result => {
                if (result.confirm) {
                    resolve();
                } else {
                    reject();
                }
            })
    });

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
function createSearchAutocompleteSource(current, input, keyList, jsonFormat) {
    return new Promise(resolve => {
        if (input) {
            const keywords = input.split(' ');
            resolve(keyList.filter(key => {
                for (const keyword of keywords) {
                    if (!key.toLowerCase().includes(keyword.toLowerCase())) {
                        return false;
                    }
                }
                return true;
            }))
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
                resultStr = [...resultStr, ...extractKeys(json[key], 'nesting', `${(prefix !== '' ? prefix + '.' : '')}` + key)]
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
    return 'Please input lang key name!'
}
function fileNameValidate(fileName) {
    if (fileName) {
        return true
    }
    return 'Please input file name!'
}
function createActionQuestions(keyList, jsonFormat, recent) {
    let choices = [
        {
            name: '[🔍] Search by key',
            value: 'search',
            short: `Search by key [Press 'ESC' to back to main menu]`
        },
        {
            name: '[➕] Add new key/values',
            value: 'add',
            short: `Add new key/values [Press 'ESC' to back to main menu]`
        },
        {
            name: '[🔧] Edit values',
            value: 'edit',
            short: `Edit values [Press 'ESC' to back to main menu]`
        },
        {
            name: '[🔨] Rename/move key',
            value: 'rename',
            short: `Rename/move key [Press 'ESC' to back to main menu]`
        },
        {
            name: '[💥] Remove key',
            value: 'remove',
            short: `Remove key [Press 'ESC' to back to main menu]`
        },
        {
            name: '[🔃] Sort by key',
            value: 'sort',
            short: `Sort by key`
        },
        {
            name: '[🔠] Key naming convention converter',
            value: 'namingConventionConverter',
            short: `Naming convention converter`
        },
        new inquirer.Separator(),
        {
            name: '[❌] Exit',
            value: 'exit',
            short: 'Exit'
        },
        {
            name: '[👀] About',
            value: 'about',
            short: 'About'
        }
    ]

    if (recent) {
        choices = choices.sort((a, b) => a === recent ? 1 : 0)
    }


    return [
        {
            name: 'action',
            type: 'list',
            message: 'Select action: ',
            choices: choices,
            loop: false
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
                },
                new inquirer.Separator(),
                {
                    name: 'Back to main menu',
                    value: Constants.ESCAPE_KEY_MSG
                }
            ]
        },
        {
            name: 'searchKeyName',
            type: 'autocomplete',
            message: 'Select language key name to view values: ',
            when: function (current) {
                return current.action === 'search'
            },
            suggestOnly: false,
            source: (current, input) => createSearchAutocompleteSource(current, input, keyList, jsonFormat),
            validate: keyNameValidate
        },
        {
            name: 'cloneToFile',
            type: 'input',
            message: 'Input new file name to clone (not include extension, file will be overwrote if existed): ',
            validate: fileNameValidate,
            when: function (current) {
                return current.action === 'cloneTo'
            },
        },
        {
            name: 'editKeyName',
            type: 'autocomplete',
            message: 'Select language key name to edit:',
            when: function (current) {
                return current.action === 'edit'
            },
            suggestOnly: false,
            source: (current, input) => createSearchAutocompleteSource(current, input, keyList, jsonFormat),
            validate: keyNameValidate
        },
        {
            name: 'renameKeyName',
            type: 'autocomplete',
            message: 'Input language key name to rename/move:',
            when: function (current) {
                return current.action === 'rename'
            },
            suggestOnly: true,
            source: (current, input) => createAutocompleteSource(current, input, keyList, jsonFormat),
            validate: keyNameValidate
        },
        {
            name: 'removeKeyName',
            type: 'autocomplete',
            message: 'Input language key name to remove:',
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
            message: 'Input language key name to add:',
            when: function (current) {
                return current.action === 'add'
            },
            suggestOnly: true,
            source: (current, input) => createAutocompleteSource(current, input, keyList, jsonFormat),
            validate: keyNameValidate,
            emptyText: '+ New key'
        },
        {
            name: 'namingConvention',
            type: 'list',
            message: 'Convert all language key name to:',
            when: function (current) {
                return current.action === 'namingConventionConverter'
            },
            choices: [
                {
                    name: 'Camel case',
                    value: 'camelCase'
                },
                {
                    name: 'Kebab case',
                    value: 'kebabCase'
                },
                {
                    name: 'Snake case',
                    value: 'snakeCase'
                },
                new inquirer.Separator(),
                {
                    name: 'Back to main menu',
                    value: Constants.ESCAPE_KEY_MSG
                }
            ]
        }
    ]
}

function createLangObj(file) {
    const contents = fs.readFileSync(file, 'utf8');
    return JSON.parse(contents);
}
