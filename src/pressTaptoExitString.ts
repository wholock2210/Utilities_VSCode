import * as vscode from 'vscode';


export function PressTabToExitString(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerTextEditorCommand('Wholock-Utilities.smartTab', async (editor, edit) => {
        
		const position = editor.selection.active;
		const lineText = editor.document.lineAt(position.line).text;

		const quoteStart = lineText.lastIndexOf('"', position.character - 1);
		const quoteEnd = lineText.indexOf('"', position.character);
		const quoteStartNew = lineText.lastIndexOf("'", position.character - 1);
		const quoteEndNew = lineText.indexOf("'", position.character);

		const before = lineText.substring(0, position.character);
		const quoteCount = (before.match(/"/g) || []).length;
		const isInsideString = quoteCount % 2 === 1 && quoteStart !== -1 && quoteEnd !== -1;
		const quoteCountNew = (before.match(/'/g) || []).length;
		const isInsideStringNew = quoteCountNew % 2 === 1 && quoteStartNew !== -1 && quoteEndNew !== -1;

		if (isInsideString || isInsideStringNew) {
			const newPos = new vscode.Position(position.line, quoteEnd + 1);
			editor.selection = new vscode.Selection(newPos, newPos);
		}else {
			//await vscode.commands.executeCommand('tab');
			PressTabToAdvance(editor,edit);
		}
	});

	context.subscriptions.push(disposable);
}

function PressTabToAdvance(editor: vscode.TextEditor,edit: vscode.TextEditorEdit){
	const position = editor.selection.active;
	const lineText = editor.document.lineAt(position.line).text;
	const lineafter = lineText.substring(position.character);
	const isWhiteSpace = lineText.charAt(position.character);
	if (/\s/.test(isWhiteSpace) && position.character < lineText.length) {
		const firstChar = lineafter.match(/\S/);
		if(firstChar && firstChar.index !== undefined){
			const newPos = new vscode.Position(position.line, position.character + firstChar.index);
			editor.selection = new vscode.Selection(newPos,newPos);
		}
	}else{
		const match = lineafter.match(/[-.,;:?!()\s[\]'"{}<>/=+*]/);

		if (match && match.index !== undefined) {			
		let jumpOffset = match.index;

		if (match.index === 0) {
			jumpOffset = 1;
		}

		const newPos = new vscode.Position(position.line, position.character + jumpOffset);
		editor.selection = new vscode.Selection(newPos, newPos);
	}
}
	
	
		


	console.log(lineafter);
	// const lineText = 'let a = 5  ; // hello world';
	// const position = 8; // ví dụ đang ở chữ `5`, sau đó là `;`

	// const rest = lineText.substring(position); // => "; // hello world"
	// const match = rest.match(/[.,;:?!\s]/);

	// if (match) {
  	// 	const relativeOffset = match.index ?? 0;
  	// 	const absolutePos = position + relativeOffset;
  	// 	console.log("Gặp ký tự đặc biệt ở:", absolutePos);
	// }	

}