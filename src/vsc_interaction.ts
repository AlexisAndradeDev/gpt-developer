import * as vscode from 'vscode';
import { NoActiveEditor } from './exceptions';

export const WRITE_IN_SIDE_PANEL = 1;
export const WRITE_IN_ACTIVE_EDITOR = 2;

export function getSelectedCode(editor: vscode.TextEditor, getAllPreviousCodeIfNotSelected: boolean = true): string {
    var selectedCode = "";

    editor.selections.forEach(selection => {
        // get selected text
        selectedCode += editor.document.getText(selection);
    });

    if (!selectedCode && getAllPreviousCodeIfNotSelected) {
        // get the text before cursor position
        const currentPosition = editor.selection.active;
        const textRange = new vscode.Range(
            new vscode.Position(0, 0), currentPosition,
        );
        selectedCode = editor.document.getText(textRange);
    }
    return selectedCode;
}

export function startCommandForTextEditor(getAllPreviousCodeIfNotSelected: boolean = true) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage("There's no active editor.");
        throw new NoActiveEditor("There's no active editor.");
    }

    const selectedCode = getSelectedCode(editor, getAllPreviousCodeIfNotSelected);

    return [editor, selectedCode] as const;
}

function escapeHtml(unsafeHtml: string) {
    return unsafeHtml
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeCodeSections(content: string) {
    return content.replace(/```([\s\S]*?)```/g, (match, code) => {
        return '```' + escapeHtml(code) + '```';
    });
}

export function writeInVSC(editor: vscode.TextEditor, answer: string, method: number) {
    switch (method) {
        case WRITE_IN_SIDE_PANEL:
            writeInSidePanel(answer);
            break;
    
        case WRITE_IN_ACTIVE_EDITOR:
            writeInActiveEditor(editor, answer);
            break;
    }
}

function writeInSidePanel(text: string) {
    const panel = vscode.window.createWebviewPanel(
        "gptDeveloper", "GPT Developer", vscode.ViewColumn.Two,
        {}
    );
    const escapedContent = escapeHtml(text);
    const gptAnswerHtml = "<html><body style=\"font-size: 1rem; font-family: Roboto\"><pre>" + escapedContent + "</pre></body></html>";
    panel.webview.html = gptAnswerHtml;
}

function writeInActiveEditor(editor: vscode.TextEditor, text: string) {
    editor.edit(editBuilder => {
        const position = editor.selection.active;
        editBuilder.insert(position, text);
    });
}
