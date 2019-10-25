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
        fs.writeFileSync(obj.key, JSON.stringify(obj.obj, null, 2));
    }
    console.log(chalk.greenBright('--> UPDATED: ' + langObjects.map(obj => obj.key).join(', ')))
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

    let keyList = [];
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
                        name: ( obj.key + '_' + langKey).replace(/[\.\[\]]/g, '#'),
                        message: `[${obj.name} - ${obj.key}] ${langKey}:`,
                        type: 'input',
                        default: formatDefaultValue(obj.obj, langKey)
                    })
                }

                inquirer.prompt(questions)
                    .then(result => {
                        const key = langKey;
                        let langValues = []
                        for (let obj of langObjects) {
                            const value = result[ ( obj.key + '_' + langKey).replace(/[\.\[\]]/g, '#')];
                            langValues.push(value);
                            writeValue(obj.obj, langKey, value)
                            // obj.obj[key] = value;
                        }

                        writeToFile(langObjects)
                        addChangeLog(chalk.yellow('Edit'), key, langValues)
                        renderActionMenu(defaultLanguage, langObjects)
                    })
            }

            // remove case
            if (actionAnswers.removeKeyName) {
                const langKey = actionAnswers.removeKeyName

                return inquirer.prompt([{
                    name: 'confirmRemove',
                    message: 'Do you want to remove this key?',
                    type: 'confirm'
                }])
                    .then( result => {
                        if (result.confirmRemove) {
                            let langValues = []
                            for (let obj of langObjects) {
                                langValues.push(obj.obj[langKey]);
                                removeKey(obj.obj, langKey);
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
                        name:( obj.key + '_' + langKey).replace(/[\.\[\]]/g, '#'),
                        message: `[${obj.name} - ${obj.key}] ${langKey}:`,
                        type: 'input'
                    })
                }

                inquirer.prompt(questions)
                    .then(result => {
                        const key = langKey;
                        let langValues = []
                        for (let obj of langObjects) {
                            const value = result[( obj.key + '_' + langKey).replace(/[\.\[\]]/g, '#')];
                            langValues.push(value);
                            // obj.obj = {...obj.obj, [key]: value}
                            writeValue(obj.obj, langKey, value)
                        }

                        writeToFile(langObjects)
                        addChangeLog(chalk.green('Add'), langKey, langValues)
                        renderActionMenu(defaultLanguage, langObjects)

                    })
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
                    key: file,
                    name: ISO6391.getName(path.basename(file, '.json')),
                    obj: Question.createLangObj(file)
                }
            })

            JSON_FORMAT = languageConfigAnswers.jsonType;
            LANG_LIST = langList;
            DEFAULT_LANG = langList.indexOf(languageConfigAnswers.defaultLanguage);

            modifyLangCol(langList);
            renderActionMenu(languageConfigAnswers.defaultLanguage, langObjects);
        })

}


