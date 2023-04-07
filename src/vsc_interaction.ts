import * as vscode from 'vscode';
import { NoActiveEditor } from './exceptions';

export function getSelectedCode(editor: vscode.TextEditor): string {
    var selectedCode = "";

    editor.selections.forEach(selection => {
        // get selected text
        selectedCode += editor.document.getText(selection);
    });

    if (!selectedCode) {
        // get the text before cursor position
        const currentPosition = editor.selection.active;
        const textRange = new vscode.Range(
            new vscode.Position(0, 0), currentPosition,
        );
        selectedCode = editor.document.getText(textRange);
    }
    return selectedCode;
}

export function startCommandForTextEditor() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage("There's no active editor.");
        throw new NoActiveEditor("There's no active editor.");
    }

    const selectedCode = getSelectedCode(editor);

    const maxPromptLength = 5000 * 4; // 1 token ~= 4 chars in English
    if (selectedCode.length > maxPromptLength) {
        vscode.window.showWarningMessage(`The selected code surpasses the max number of characters (${maxPromptLength} chars). Only the last ${maxPromptLength} will be used.`);
    }
    const prompt = selectedCode.substring(0, maxPromptLength);

    return [editor, prompt] as const;
}

export function showSideBar(htmlContent: string) {
    const panel = vscode.window.createWebviewPanel(
        "sidebarExtension", "GPT Response", vscode.ViewColumn.Two,
        {}
    );
    panel.webview.html = htmlContent;
}