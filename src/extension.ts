import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';



export function activate(context: vscode.ExtensionContext) {
	const rootPath = vscode.workspace.rootPath;

    if (!rootPath) {
        return;
    }

    const packageJsonPath = path.join(rootPath, 'package.json');
    const packageLockJsonPath = path.join(rootPath, 'package-lock.json');

    const watcher = vscode.workspace.createFileSystemWatcher('**/{package.json,package-lock.json}');

	watcher.onDidChange(() => {
		// 'npm ls' verifies that package-lock.json and package.json are in sync.
		// If they are not, npm ls will exit with an error code.
		child_process.exec('npm ls', { cwd: rootPath }, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showWarningMessage('Dependencies have changed. Please run npm install.', 'Run npm install').then(selection => {
					if (selection === 'Run npm install') {
						const terminal = vscode.window.createTerminal();
						terminal.sendText('npm install');
						terminal.show();

						// Use this to run it without showing the terminal

						// child_process.exec('npm install', (error, stdout, stderr) => {
						// 	if (error) {
						// 		vscode.window.showErrorMessage('Failed to run npm install');
						// 	} else {
						// 		vscode.window.showInformationMessage('npm install completed successfully');
						// 	}
						// });
					}
				});
			}
		});
	});

    context.subscriptions.push(watcher);
}

// This method is called when your extension is deactivated
export function deactivate() {}
