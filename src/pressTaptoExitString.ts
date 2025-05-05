import * as vscode from 'vscode';


export function PressTabToExitString(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerTextEditorCommand('Wholock-Utilities.smartTab', async (editor, edit) => {
        
		const position = editor.selection.active;
		const lineText = editor.document.lineAt(position.line).text;

		const quoteStart = lineText.lastIndexOf('"', position.character - 1);
		const quoteEnd = lineText.indexOf('"', position.character);

		const before = lineText.substring(0, position.character);
		const quoteCount = (before.match(/"/g) || []).length;
		const isInsideString = quoteCount % 2 === 1 && quoteStart !== -1 && quoteEnd !== -1;

		if (isInsideString) {
			const newPos = new vscode.Position(position.line, quoteEnd + 1);
			editor.selection = new vscode.Selection(newPos, newPos);
		} else {
			await vscode.commands.executeCommand('tab');
		}
	});

	context.subscriptions.push(disposable);
}
