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
	const quoteCount = (textBefore.match(/"/g) || []).length;
	const isInsideString = quoteCount % 2 === 1;
	if (isInsideString) {
		try {
			isProcessing = true;
			let indent = '';
            let characterStartBefore = 0;

			await editor.edit(editBuilder => {
                editBuilder.delete(new vscode.Range(position, position.translate(0,position.character + 1)));

				const currentLineText = editor.document.lineAt(position.line).text;
				for (let i = 0; i < currentLineText.length; i++) {
					if (currentLineText[i] !== ' ' && currentLineText[i] !== '\t') {
						break;
					}
                    characterStartBefore++;
					indent += currentLineText[i];
				}

				editBuilder.insert(position, `" +`);

			});
			const aftepos = new vscode.Position(position.line + 1,characterStartBefore);
			await editor.insertSnippet(new vscode.SnippetString('"'), aftepos);
			const newPos = new vscode.Position(position.line + 1, indent.length + 1);
			editor.selection = new vscode.Selection(newPos, newPos);
		} catch (err: unknown) {
			if (err instanceof Error) {
				console.error("Error editing document:", err.message);
			}
		} finally {
			isProcessing = false;
		}
	}
}