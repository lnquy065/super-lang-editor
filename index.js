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
const JSONUtils = require('./json-utils');
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

// ========== FUNCTIONS =============

function shortedLang(lang) {
    if (lang.length > 20) {
        return lang.substring(0, 20) + '...'
    }
    return lang
}

// functions
function addChangeLog(action, key, langs) {
    const shortedLangs = langs.map(shortedLang);
    changeLogs = [...changeLogs, [action, key, ...shortedLangs]]
}

function modifyLangCol(langs) {
    const shortedLangs = langs.map(shortedLang);
    changeLogs[0] = ['Action', 'Lang Key', ...shortedLangs]
}


function renderConfig() {
    if (JSON_FORMAT) {
        console.log(chalk.magenta('  JSON Format: ' + JSON_FORMAT));
        // console.log(chalk.magenta('  Language list: '));
        // for (const [index, file] of LANG_LIST.entries()) {
        //     console.log(chalk.magenta(`    - ${index === DEFAULT_LANG? '['+file+']':file}`));
        // }
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
}

async function renderActionMenu(defaultLanguage, langObjects) {

    while (true) {
        // reset UI
        clear();
        renderLogo();
        renderChangeLogsTable();

        // reload keylist
        const json = JSON.parse(fs.readFileSync(defaultLanguage, 'utf8'));
        const keyList = Question.extractKeys(json, JSON_FORMAT);

        const actionAnswers = await inquirer.prompt(Question.createActionQuestions(keyList, JSON_FORMAT))
        let result

        // EXIT
        if (actionAnswers.action && actionAnswers.action === 'exit') {
            result = await Question.confirmQuestion('Do you want to exit?')
            if (result.confirm) {
                clear();
                renderChangeLogsTable();
                process.exit()
            }
        }

        // SEARCH
        if (actionAnswers.searchKeyName) {
            const langKey = actionAnswers.searchKeyName;
            for (const obj of  langObjects) {
                console.log(`[${obj.name} - ${obj.path}] ${langKey}: ${JSONUtils.formatDefaultValue(JSON_FORMAT, obj.content, langKey)}`)
            }
            result = await inquirer.prompt({
                name: 'Enter to back!',
                type: 'input'
            })
            continue
        }

        // EDIT
        if (actionAnswers.editKeyName) {
            const langKey = actionAnswers.editKeyName;
            let questions = []
            for (const obj of  langObjects) {
                questions.push({
                    name: ( obj.path + '_' + langKey).replace(/[\.\[\]]/g, '#'),
                    message: `[${obj.name} - ${obj.path}] ${langKey}:`,
                    type: 'input',
                    default: JSONUtils.formatDefaultValue(JSON_FORMAT, obj.content, langKey)
                })
            }

            result = await inquirer.prompt(questions)
            const key = langKey;
            let langValues = []
            for (let obj of langObjects) {
                const value = result[ ( obj.path + '_' + langKey).replace(/[\.\[\]]/g, '#')];
                langValues.push(value);
                JSONUtils.writeValue(JSON_FORMAT, obj.content, langKey, value)
                // content.content[path] = value;
            }

            writeToFile(langObjects);
            addChangeLog(chalk.yellow('Edit'), key, langValues);
            continue
        }

        // RENAME
        if (actionAnswers.renameKeyName) {
            const langKey = actionAnswers.renameKeyName

            result = await inquirer.prompt([{
                name: 'keyName',
                message: 'Input new language key name: ',
                type: 'input',
                validate: Question.keyNameValidate
            }])
            if (result.keyName) {
                const newKeyName = result.keyName;
                let langValues = []
                for (let obj of langObjects) {
                    JSONUtils.renameKey(JSON_FORMAT, obj.content, langKey, newKeyName);
                    langValues.push(newKeyName);
                }

                writeToFile(langObjects)
                addChangeLog(chalk.yellow('Rename'), langKey, langValues)
            }
            continue
        }

        // REMOVE
        if (actionAnswers.removeKeyName) {
            const langKey = actionAnswers.removeKeyName

            result = await inquirer.prompt([{
                name: 'confirmRemove',
                message: 'Do you want to remove this path?',
                type: 'confirm'
            }])
            if (result.confirmRemove) {
                let langValues = []
                for (let obj of langObjects) {
                    langValues.push(obj.content[langKey]);
                    JSONUtils.removeKey(JSON_FORMAT, obj.content, langKey);
                }

                writeToFile(langObjects)
                addChangeLog(chalk.red('Remove'), langKey, langValues)
            }
            continue
        }


        // NAMING CONVENTION
        if (actionAnswers.namingConvention) {
            const namingConvention = actionAnswers.namingConvention;
            result = await Question.confirmQuestionWithPromise(`Do you want to format all key names to ${namingConvention}?`)
            let langValues = [];
            for (let obj of langObjects) {
                langValues.push(namingConvention);
                JSONUtils.convertNamingAllKeyName(JSON_FORMAT, obj.content, namingConvention);
            }

            writeToFile(langObjects);
            addChangeLog(chalk.blue('Naming convention convert'), 'All keys', langValues);
            continue
        }

        // ADD NEW
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

            result = await inquirer.prompt(questions)
            let langValues = []
            for (let obj of langObjects) {
                const value = result[( obj.path + '_' + langKey).replace(/[\.\[\]]/g, '#')];
                langValues.push(value);
                // content.content = {...content.content, [path]: value}
                JSONUtils.writeValue(JSON_FORMAT, obj.content, langKey, value)
            }

            writeToFile(langObjects)
            addChangeLog(chalk.green('Add'), langKey, langValues)
            continue
        }

        // SORT
        if (actionAnswers.sort) {
            const order = actionAnswers.sort;
            result = await Question.confirmQuestionWithPromise(`Do you want to sort by ${order}?`)
            let langValues = []
            for (let language of langObjects) {
                language.content = JSONUtils.sort(JSON_FORMAT, language.content, order)
                langValues.push('Sorted')
            }

            writeToFile(langObjects);
            addChangeLog(chalk.cyan('Sort'), order === 'asc'? 'A-Z':'Z-A', langValues);
            continue
        }
    }
}


function renderMenu() {
    renderLogo();
    inquirer.prompt(Question.languageConfigQuestions)
        .then(languageConfigAnswers => {
            const langList = languageConfigAnswers.languageFiles
            try {
                const langObjects = langList.map(file => {
                    return {
                        path: file,
                        name: ISO6391.getName(path.basename(file, '.json')),
                        content: Question.createLangObj(file)
                    }
                })
                
                JSON_FORMAT = languageConfigAnswers.jsonType;
                LANG_LIST = langList;
                DEFAULT_LANG = langList[0];

                modifyLangCol(langList);
                renderActionMenu(DEFAULT_LANG, langObjects);
            
            } catch (e) {
                console.error(e.message)
            }
        })

}


