import { debug } from 'console';
import * as vscode from 'vscode';

let isProcessing = false;

/*
    class này là chức năng xuống dòng khi mà người dùng nhấn enter
*/


export function SplitStringOnEnter(context: vscode.ExtensionContext){
    context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument(handleEnterKeyPress)
	);
}



async function handleEnterKeyPress(event: vscode.TextDocumentChangeEvent) {
    if (isProcessing){
		 return;
	}

    const editor = vscode.window.activeTextEditor;
    if (!editor || event.document !== editor.document){
		return;
	}
    if (!event.contentChanges || event.contentChanges.length === 0){
		return;
	}

    const change = event.contentChanges[0];
    if (!change || !change.text.includes('\n')){
		return;
	}

    const position = change.range.start;
    if (!position){
		return;
	}

    const line = editor.document.lineAt(position.line);
    const textBefore = line.text.slice(0, position.character);

    // Count both types of quotes
    const doubleQuoteCount = (textBefore.match(/"/g) || []).length;
    const singleQuoteCount = (textBefore.match(/'/g) || []).length;

    const isInsideDoubleQuote = doubleQuoteCount % 2 === 1;
    const isInsideSingleQuote = singleQuoteCount % 2 === 1;

    // Decide quote type if any
    const quoteType = isInsideDoubleQuote ? `"` : isInsideSingleQuote ? `'` : null;
    if (!quoteType){
		return;
	}

    try {
        isProcessing = true;

        let indent = '';
        let characterStartBefore = 0;
		let characterQuoteBefore = 0;

        await editor.edit(editBuilder => {
            editBuilder.delete(new vscode.Range(position, position.translate(0, 1)));

            const currentLineText = editor.document.lineAt(position.line).text;
			characterQuoteBefore = currentLineText.lastIndexOf(quoteType);
            for (let i = 0; i < currentLineText.length; i++) {
                if (currentLineText[i] !== ' ' && currentLineText[i] !== '\t'){
					 break;
				}
                characterStartBefore++;
            }
			for(let i = 0;i < characterQuoteBefore - characterStartBefore;i++){
				indent += ' ';
			}
			

            editBuilder.insert(position, `${quoteType} +`);
        });

        const afterPos = new vscode.Position(position.line + 1, characterStartBefore);
		const content = indent + quoteType;
        await editor.insertSnippet(new vscode.SnippetString(content), afterPos);
        const newPos = new vscode.Position(position.line + 1, characterQuoteBefore + 1);
        editor.selection = new vscode.Selection(newPos, newPos);

    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error("Error editing document:", err.message);
        }
    } finally {
        isProcessing = false;
    }
}