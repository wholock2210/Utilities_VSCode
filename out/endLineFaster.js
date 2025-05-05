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
exports.EndLineFaster = EndLineFaster;
const vscode = __importStar(require("vscode"));
function EndLineFaster(context) {
    const disposable = vscode.commands.registerTextEditorCommand('Wholock-Utilities.endLineFaster', async (editor, edit) => {
        console.debug("chạy");
        const position = editor.selection.active;
        const lineText = editor.document.lineAt(position.line).text;
        const isNotEndLine = !lineText.trimEnd().endsWith(';');
        const textBefore = lineText.slice(0, position.character);
        const quoteCount = (textBefore.match(/"/g) || []).length;
        const isInsideString = quoteCount % 2 === 1;
        if (isNotEndLine && !isInsideString) {
            const newPos = new vscode.Position(position.line, lineText.length);
            editor.selection = new vscode.Selection(newPos, newPos);
            await editor.insertSnippet(new vscode.SnippetString(';'), newPos);
        }
        else {
            await vscode.commands.executeCommand('type', { text: ';' });
        }
    });
    context.subscriptions.push(disposable);
}
//# sourceMappingURL=endLineFaster.js.map