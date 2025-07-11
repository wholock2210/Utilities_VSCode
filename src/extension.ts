
import * as vscode from 'vscode';
import {EndLineFaster} from './endLineFaster';
import { PressTabToExitString } from './pressTaptoExitString';
import { SplitStringOnEnter } from './splitStringOnEnter';
import { TransFormSelectedStrings } from './upperOrLowerString';
import {PressShiftTabToExitString} from './PressShiftTabGoToBack';

export function activate(context: vscode.ExtensionContext) {

	EndLineFaster(context);
	PressTabToExitString(context);
	SplitStringOnEnter(context);
	PressShiftTabToExitString(context);
	context.subscriptions.push(
		vscode.commands.registerTextEditorCommand('Wholock-Utilities.uppercaseString',TransFormSelectedStrings(str => str.toUpperCase()))
	);
	context.subscriptions.push(
		vscode.commands.registerTextEditorCommand('Wholock-Utilities.lowercaseString',TransFormSelectedStrings(str => str.toLowerCase()))
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
