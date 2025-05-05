"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransFormSelectedStrings = TransFormSelectedStrings;
function TransFormSelectedStrings(transform) {
    return (editor, edit) => {
        const selections = editor.selections;
        for (const selection of selections) {
            const selectedText = editor.document.getText(selection);
            // Chỉ xử lý nếu có ít nhất một chuỗi nằm trong dấu nháy kép
            const stringRegex = /"([^"]*)"/g;
            let match;
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
//# sourceMappingURL=upperOrLowerString.js.map