import * as vscode from 'vscode';
import { SplitStringOnEnter } from './splitStringOnEnter';
import {PressTabToExitString } from './pressTaptoExitString';
import {EndLineFaster} from './endLineFaster';
import {TransFormSelectedStrings} from './upperOrLowerString';
import {ShowFileSize} from './YuriShaposhnikov/showFileSize';


export function activate(context: vscode.ExtensionContext) {
	console.log('Extension activated');
	SplitStringOnEnter(context);
	PressTabToExitString(context);
	EndLineFaster(context);
	context.subscriptions.push(
		vscode.commands.registerTextEditorCommand('Wholock-Utilities.uppercaseString',TransFormSelectedStrings(str => str.toUpperCase()))
	);
	context.subscriptions.push(
		vscode.commands.registerTextEditorCommand('Wholock-Utilities.lowercaseString',TransFormSelectedStrings(str => str.toLowerCase()))
	);
	const config = vscode.workspace.getConfiguration('Wholock-Utilities');
	const fileSizeEnabled = config.get<boolean>('enableFileSizeExplorer', true); // true mặc định

	if (fileSizeEnabled) {
		ShowFileSize(context);
	}
}

export function deactivate() { }
