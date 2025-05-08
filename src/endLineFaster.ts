import * as vscode from 'vscode';

export function EndLineFaster(context: vscode.ExtensionContext){
    const disposable = vscode.commands.registerTextEditorCommand('Wholock-Utilities.endLineFaster', async (editor, edit) =>{
        const position = editor.selection.active;
        const lineText = editor.document.lineAt(position.line).text;
        const isNotEndLine = !lineText.trimEnd().endsWith(';');

        const textBefore = lineText.slice(0, position.character);
	    const quoteCount = (textBefore.match(/"/g) || []).length;
	    const isInsideString = quoteCount % 2 === 1;

        if(isNotEndLine && !isInsideString){
            const newPos = new vscode.Position(position.line, lineText.length);
            editor.selection = new vscode.Selection(newPos,newPos);
            await editor.insertSnippet(new vscode.SnippetString(';'), newPos);
        }else{
            await vscode.commands.executeCommand('type', { text: ';' });
        }
    });
    context.subscriptions.push(disposable);
}