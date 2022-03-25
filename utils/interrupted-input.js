
const Constants = require('./constants')
const InputPrompt = require('inquirer/lib/prompts/input')



class InterruptedInput extends InputPrompt {
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
            this.onEnd({
                value: Constants.ESCAPE_KEY_MSG
            })
        }
    }
}


module.exports = InterruptedInput;

