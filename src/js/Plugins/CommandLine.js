import { spawn } from 'child_process'
import StringHelpers from './../Helpers/StringHelpers'

let stringHelpers = new StringHelpers()
let commandLinePrefix = '>'

export default class CommandLine {
    constructor() {
        this.icon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
                        <g id="surface1">
                            <path style=" " d="M 4 5 L 4 27 L 28 27 L 28 5 Z M 6 7 L 26 7 L 26 9 L 6 9 Z M 6 11 L 26 11 L 26 25 L 6 25 Z M 11.21875 13.78125 L 9.78125 15.21875 L 12.5625 18 L 9.78125 20.78125 L 11.21875 22.21875 L 14.71875 18.71875 L 15.40625 18 L 14.71875 17.28125 Z M 16 20 L 16 22 L 22 22 L 22 20 Z "></path>
                        </g>
                    </svg>`

        this.name = 'Command Line'
    }

    getName() {
        return this.name
    }

    isValid(userInput) {
        return userInput.startsWith(commandLinePrefix)
            && !stringIsEmptyOrWhitespaces(userInput)
    }

    execute(execArg, callback, kill) {
        let items = stringHelpers.splitStringToArray(execArg)
        let programName = items[0]
        if (programName.startsWith(commandLinePrefix))
            programName = programName.replace(commandLinePrefix, '')

        let options = []

        for (let i = 0; i < items.length; i++) {
            if (i === 0)
                continue
            else
                options.push(items[i])
        }

        try {
            let command = spawn(programName, options)

            command.on('error', (err) => {
                callback(err)
                command.kill('SIGINT')
            })

            command.stderr.on('data', (data) => {
                callback(data.toString())
            })

            command.stdout.on('data', (data) => {
                callback(data.toString())
            })

            command.on('exit', (code) => {
                callback(`Exit ${code}`)
            })

            document.addEventListener('keyup', (e) => {
                if (e.ctrlKey && e.key === 'c')
                    command.kill('SIGINT')
            })
        }
        catch (ex) {
            callback('There was an error')
        }
    }

    getSearchResult(userInput) {
        let command = userInput.replace(commandLinePrefix, '')

        return [{
            name: `Execute ${command}`,
            execArg: userInput,
            icon: this.icon
        }]
    }
}

function stringIsEmptyOrWhitespaces(string) {
    return string === undefined || string.replace(/\s/g, '').length === 0
}