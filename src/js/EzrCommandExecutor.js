import { exec } from 'child_process';
import { ipcRenderer } from 'electron';

export default class EzrCommandExecutor {
    constructor() {
        this.commands = [
            {
                code: 'ezr:reload',
                execute: () => {
                    ipcRenderer.sendSync('reload-window');
                }
            },
            {
                code: 'exit',
                execute: () => {
                    ipcRenderer.sendSync('close-main-window');
                }
            },
            {
                code: 'ezr:config',
                execute: () => {
                    exec('start "" "config.json"', (error) => {
                        if (error)
                            throw error;
                    });
                }
            }
        ];
    }

    isValid(input) {
        for (let command of this.commands)
            if (command.code === input)
                return true;

        return false;
    }

    execute(input) {
        for (let command of this.commands)
            if (command.code === input) {
                command.execute();
                return;
            }
    }
}