import * as vscode from 'vscode';
import { NoActiveEditor } from './exceptions';

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

    const maxPromptLength = 5000 * 4; // 1 token ~= 4 chars in English
    if (selectedCode.length > maxPromptLength) {
        vscode.window.showWarningMessage(`The selected code surpasses the max number of characters (${maxPromptLength} chars). Only the last ${maxPromptLength} will be used.`);
    }
    const prompt = selectedCode.substring(0, maxPromptLength);

    return [editor, prompt] as const;
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

export function showGPTAnswer(answer: string) {
    const panel = vscode.window.createWebviewPanel(
        "gptResponse", "GPT Response", vscode.ViewColumn.Two,
        {}
    );
    const escapedContent = escapeHtml(answer);
    const gptAnswerHtml = "<html><body style=\"font-size: 1rem; font-family: Roboto\"><pre>" + escapedContent + "</pre></body></html>";
    panel.webview.html = gptAnswerHtml;
}