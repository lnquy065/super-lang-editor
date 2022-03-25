const AutocompletePrompt = require('inquirer-autocomplete-prompt')
const Constants = require('./constants')



class InterruptedAutocompletePrompt extends AutocompletePrompt {
    constructor(
        questions /*: Array<any> */,
        rl /*: readline$Interface */,
        answers /*: Array<any> */
    ) {
        super(questions, rl, answers);
    }

    onKeypress(e /* : {key: { name: string, ctrl: boolean }, value: string } */) {
        super.onKeypress(e)
        if (e.key.name === 'escape') {
            this.opt.suggestOnly = true
            this.onSubmitAfterValidation(Constants.ESCAPE_KEY_MSG)
        }
    }
}


module.exports = InterruptedAutocompletePrompt;