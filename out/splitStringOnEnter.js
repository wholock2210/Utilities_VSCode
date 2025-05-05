"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitStringOnEnter = SplitStringOnEnter;
const vscode = __importStar(require("vscode"));
let isProcessing = false;
/*
    class này là chức năng xuống dòng khi mà người dùng nhấn enter
*/
function SplitStringOnEnter(context) {
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(handleEnterKeyPress));
}
async function handleEnterKeyPress(event) {
    if (isProcessing) {
        return;
    }
    const editor = vscode.window.activeTextEditor;
    if (!editor || event.document !== editor.document) {
        return;
    }
    if (!event.contentChanges || event.contentChanges.length === 0) {
        return;
    }
    const change = event.contentChanges[0];
    if (!change || !change.text.includes('\n')) {
        return;
    }
    const position = change.range.start;
    if (!position) {
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
                editBuilder.delete(new vscode.Range(position, position.translate(0, position.character + 1)));
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
            const aftepos = new vscode.Position(position.line + 1, characterStartBefore);
            await editor.insertSnippet(new vscode.SnippetString('"'), aftepos);
            const newPos = new vscode.Position(position.line + 1, indent.length + 1);
            editor.selection = new vscode.Selection(newPos, newPos);
        }
        catch (err) {
            if (err instanceof Error) {
                console.error("Error editing document:", err.message);
            }
        }
        finally {
            isProcessing = false;
        }
    }
}
//# sourceMappingURL=splitStringOnEnter.js.map