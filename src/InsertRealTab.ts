import * as vscode from 'vscode';

export function InsertRealTab(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerTextEditorCommand('Wholock-Utilities.insertRealTab', (editor, edit) => {
		const position = editor.selection.active;
		edit.insert(position, '\t');
	});
	context.subscriptions.push(disposable);
}
