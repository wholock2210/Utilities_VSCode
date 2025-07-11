import * as vscode from 'vscode';


export function PressShiftTabToExitString(context: vscode.ExtensionContext){
    const disposable = vscode.commands.registerTextEditorCommand('Wholock-Utilities.ShiftTabGoToBack', async (editor, edit) => {
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
            const newPos = new vscode.Position(position.line, quoteStart);
            editor.selection = new vscode.Selection(newPos, newPos);
        }else{
            PressShiftTabGoToBack(editor,edit);
        }
    });
    context.subscriptions.push(disposable);
}



function PressShiftTabGoToBack(editor: vscode.TextEditor,edit: vscode.TextEditorEdit){
    const position = editor.selection.active;
    const lineText = editor.document.lineAt(position.line).text;
    const lineBefore = lineText.substring(0, position.character);
    const isWhiteSpace = lineText.charAt(position.character - 1);
    if (/\s/.test(isWhiteSpace) && position.character < lineText.length) {
        const reversed = [...lineBefore].reverse().join('');
        const firstChar = reversed.match(/\S/);
        if(firstChar && firstChar.index !== undefined){
            const newPos = new vscode.Position(position.line, position.character - firstChar.index);
            editor.selection = new vscode.Selection(newPos,newPos);
        }
    }else{
        const reversed = [...lineBefore].reverse().join('');
        const match = reversed.match(/[-.,;:?!()\s[\]'"{}<>/=+*]/);
        
        if (match && match.index !== undefined) {			
            let jumpOffset = match.index;
        
            if (match.index === 0) {
                jumpOffset = 1;
            }
        
            const newPos = new vscode.Position(position.line, position.character - jumpOffset);
            editor.selection = new vscode.Selection(newPos, newPos);
        }    
    }
}