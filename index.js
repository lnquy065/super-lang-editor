#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');
const ISO6391 = require('iso-639-1');
const Question = require('./questions');
const {table} = require('table');
const pkg = require('./package');
const _ = require('lodash');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const VERSION = pkg.version;
const AUTHOR = 'lnquy065';
let JSON_FORMAT = '';
let LANG_LIST = [];
let DEFAULT_LANG = '';


clear();

let changeLogs = [
    ['Action', 'Key', ...Question.JSONfiles]
];

renderMenu();



// functions
function addChangeLog(action, key, langs) {
    changeLogs = [...changeLogs, [action, key, ...langs]]
}

function modifyLangCol(langs) {
    changeLogs[0] = ['Action', 'Lang Key', ...langs]
}

function renameKey(content, currentName, newName) {
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

function sortJSON(json, order = 'asc') {
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

        console.log('sort array:', sortedKeys)

        let sortedObject = {};
        for (const key of sortedKeys) {
            sortedObject = {
                ...sortedObject,
                [key]: sortJSON(json[key], order)
            }
        }
        return sortedObject
    } else {
        return json;
    }
}

function renderConfig() {
    if (JSON_FORMAT) {
        console.log(chalk.magenta('  JSON Format: ' + JSON_FORMAT));
        console.log(chalk.magenta('  Language list: '));
        for (const [index, file] of LANG_LIST.entries()) {
            console.log(chalk.magenta(`    - ${index === DEFAULT_LANG? '['+file+']':file}`));
        }
    }
}

function renderLogo() {
    console.log(
        chalk.green(
            figlet.textSync('SuperLang', { horizontalLayout: 'full' })
        )
    );
    console.log(chalk.blue('  Version: '+ VERSION + ' by ' + AUTHOR));
    renderConfig();
    console.log(chalk.green('======================================================================'));
}

function renderChangeLogsTable() {
    if (changeLogs.length > 1) {
        console.log('Change logs: ');
        console.log(table(changeLogs));
        console.log(chalk.green('======================================================================'));
    }
}

function writeToFile(langObjects) {
    for (const obj of langObjects) {
        fs.writeFileSync(obj.path, JSON.stringify(obj.content, null, 2));
    }
    console.log(chalk.greenBright('--> UPDATED: ' + langObjects.map(obj => obj.path).join(', ')))
}

function formatLangKey(langKey) {
    if (JSON_FORMAT === 'nesting') {
        return langKey;
    }
    if (JSON_FORMAT === 'inline') {
        return langKey.replace(/[\.\[\]]/g, '#');
    }
}

function formatDefaultValue(obj, langKey) {
    if (JSON_FORMAT === 'nesting') {
        return _.get(obj, langKey);
    }
    if (JSON_FORMAT === 'inline') {
        return obj[langKey]
    }
}



function writeValue(obj, langKey, value) {
    if (JSON_FORMAT === 'nesting') {
        _.update(obj, langKey, function (n) {
            return value;
        });
    }
    if (JSON_FORMAT === 'inline') {
        obj[langKey] = value;
    }
}

function removeKey(obj, langKey) {
    if (JSON_FORMAT === 'nesting') {
        _.unset(obj, langKey);
    }
    if (JSON_FORMAT === 'inline') {
        delete obj[langKey];
    }
}

function renderActionMenu(defaultLanguage, langObjects) {
    clear();
    renderLogo();
    renderChangeLogsTable();

    let keyList;
    const json = JSON.parse(fs.readFileSync(defaultLanguage, 'utf8'));
    keyList = Question.extractKeys(json, JSON_FORMAT);


    inquirer.prompt(Question.createActionQuestions(keyList, JSON_FORMAT))
        .then( actionAnswers => {

            // exit
            if (actionAnswers.exit) {
                clear();
                renderChangeLogsTable();
                process.exit()
            }

            // edit case
            if (actionAnswers.editKeyName) {
                const langKey = actionAnswers.editKeyName
                let questions = []
                for (const obj of  langObjects) {
                    questions.push({
                        name: ( obj.path + '_' + langKey).replace(/[\.\[\]]/g, '#'),
                        message: `[${obj.name} - ${obj.path}] ${langKey}:`,
                        type: 'input',
                        default: formatDefaultValue(obj.content, langKey)
                    })
                }

                inquirer.prompt(questions)
                    .then(result => {
                        const key = langKey;
                        let langValues = []
                        for (let obj of langObjects) {
                            const value = result[ ( obj.path + '_' + langKey).replace(/[\.\[\]]/g, '#')];
                            langValues.push(value);
                            writeValue(obj.content, langKey, value)
                            // content.content[path] = value;
                        }

                        writeToFile(langObjects)
                        addChangeLog(chalk.yellow('Edit'), key, langValues)
                        renderActionMenu(defaultLanguage, langObjects)
                    })
            }

            // rename key
            if (actionAnswers.renameKeyName) {
                const langKey = actionAnswers.renameKeyName

                return inquirer.prompt([{
                    name: 'keyName',
                    message: 'Input new language key name: ',
                    type: 'input',
                    validate: Question.keyNameValidate
                }])
                    .then( result => {
                        if (result.keyName) {
                            const newKeyName = result.keyName;
                            let langValues = []
                            for (let obj of langObjects) {
                                renameKey(obj.content, langKey, newKeyName);
                                langValues.push(newKeyName);
                            }

                            writeToFile(langObjects)
                            addChangeLog(chalk.yellow('Rename'), langKey, langValues)
                            renderActionMenu(defaultLanguage, langObjects)

                        }
                    })
            }

            // remove case
            if (actionAnswers.removeKeyName) {
                const langKey = actionAnswers.removeKeyName

                return inquirer.prompt([{
                    name: 'confirmRemove',
                    message: 'Do you want to remove this path?',
                    type: 'confirm'
                }])
                    .then( result => {
                        if (result.confirmRemove) {
                            let langValues = []
                            for (let obj of langObjects) {
                                langValues.push(obj.content[langKey]);
                                removeKey(obj.content, langKey);
                            }

                            writeToFile(langObjects)
                            addChangeLog(chalk.red('Remove'), langKey, langValues)
                            renderActionMenu(defaultLanguage, langObjects)

                        }
                    })
            }

            // add new
            if (actionAnswers.addKeyName) {
                const langKey = actionAnswers.addKeyName;
                let questions = [];
                for (const obj of  langObjects) {
                    questions.push({
                        name:( obj.path + '_' + langKey).replace(/[\.\[\]]/g, '#'),
                        message: `[${obj.name} - ${obj.path}] ${langKey}:`,
                        type: 'input'
                    })
                }

                inquirer.prompt(questions)
                    .then(result => {
                        let langValues = []
                        for (let obj of langObjects) {
                            const value = result[( obj.path + '_' + langKey).replace(/[\.\[\]]/g, '#')];
                            langValues.push(value);
                            // content.content = {...content.content, [path]: value}
                            writeValue(obj.content, langKey, value)
                        }

                        writeToFile(langObjects)
                        addChangeLog(chalk.green('Add'), langKey, langValues)
                        renderActionMenu(defaultLanguage, langObjects)

                    })
            }

            if (actionAnswers.sort) {
                const order = actionAnswers.sort;
                let langValues = []
                for (let language of langObjects) {
                    language.content = sortJSON(language.content, order)
                    langValues.push('Sorted')
                }

                writeToFile(langObjects);
                addChangeLog(chalk.cyan('Sort'), order === 'asc'? 'A-Z':'Z-A', langValues);
                renderActionMenu(defaultLanguage, langObjects);
            }
        })
}


function renderMenu() {
    renderLogo();
    inquirer.prompt(Question.languageConfigQuestions)
        .then(languageConfigAnswers => {
            const langList = languageConfigAnswers.languageFiles
            const langObjects = langList.map(file => {
                return {
                    path: file,
                    name: ISO6391.getName(path.basename(file, '.json')),
                    content: Question.createLangObj(file)
                }
            })

            JSON_FORMAT = languageConfigAnswers.jsonType;
            LANG_LIST = langList;
            DEFAULT_LANG = langList.indexOf(languageConfigAnswers.defaultLanguage);

            modifyLangCol(langList);
            renderActionMenu(languageConfigAnswers.defaultLanguage, langObjects);
        })

}


