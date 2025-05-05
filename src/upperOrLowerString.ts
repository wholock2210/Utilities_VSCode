import * as vscode from 'vscode';

export function TransFormSelectedStrings(transform: (input: string) => string) {
    return (editor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
        const selections = editor.selections;

        for (const selection of selections) {
            const selectedText = editor.document.getText(selection);

            // Chỉ xử lý nếu có ít nhất một chuỗi nằm trong dấu nháy kép
            const stringRegex = /"([^"]*)"/g;
            let match: RegExpExecArray | null;
            let modifiedText = selectedText;

            let hasString = false;
            while ((match = stringRegex.exec(selectedText)) !== null) {
                hasString = true;
                const original = match[1];
                const transformed = transform(original);
                modifiedText = modifiedText.replace(`"${original}"`, `"${transformed}"`);
            }

            if (hasString) {
                edit.replace(selection, modifiedText);
            }
        }
    };
}