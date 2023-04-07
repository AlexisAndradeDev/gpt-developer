// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as gpt from "./gpt";
import * as vsc from "./vsc_interaction";
import { NoPrompt, NoResponse } from './exceptions';

async function autocodeCommand() {
	const [editor, inputCode] = vsc.startCommandForTextEditor();
	
	try {
		vscode.window.showInformationMessage("Asking GPT...");
		const answer = await gpt.getGptAutocode(inputCode);

		editor.edit(editBuilder => {
			const position = editor.selection.active;
			editBuilder.insert(position, answer);
		});
		vscode.window.showInformationMessage("Code created.");
	}
	catch (error) {
		vscode.window.showErrorMessage("Could not get response from OpenAI.");
		throw new NoResponse("Could not get response from OpenAI");
	}
}

async function autorunCommand() {
	const [editor, inputCode] = vsc.startCommandForTextEditor();
	
	try {
		vscode.window.showInformationMessage("Asking GPT...");
		const answer = await gpt.getGptAutorun(inputCode);

		const htmlContent = "<html><body><pre>" + answer + "</pre></body></html>";
		vsc.showSideBar(htmlContent);
		vscode.window.showInformationMessage("Code ran.");
	}
	catch (error) {
		vscode.window.showErrorMessage("Could not get response from OpenAI.");
		throw new NoResponse("Could not get response from OpenAI");
	}
}

async function askProblemCommand() {
	const [editor, inputCode] = vsc.startCommandForTextEditor();

	const userInput = await vscode.window.showInputBox();
	if (!userInput) {
		vscode.window.showErrorMessage("Enter your prompt.");
		throw new NoPrompt("Enter your prompt.");
	}
	
	const prompt = "Code:\n```" + inputCode + "\n```\nQuestion:\n\"" + userInput + "\".";

	try {
		vscode.window.showInformationMessage("Asking GPT...");
		const answer = await gpt.getGptAskProblem(prompt);

		const htmlContent = "<html><body><pre>" + answer + "</pre></body></html>";
		vsc.showSideBar(htmlContent);
		vscode.window.showInformationMessage("Answer created.");
	}
	catch (error) {
		vscode.window.showErrorMessage("Could not get response from OpenAI.");
		throw new NoResponse("Could not get response from OpenAI");
	}
}

async function autochangeCommand() {
	const [editor, inputCode] = vsc.startCommandForTextEditor();

	const userInput = await vscode.window.showInputBox();
	if (!userInput) {
		vscode.window.showErrorMessage("Enter your prompt.");
		throw new NoPrompt("Enter your prompt.");
	}
	
	const prompt = "Code:\n```" + inputCode + "\n```\nChange this:\n\"" + userInput + "\".";

	try {
		vscode.window.showInformationMessage("Asking GPT...");
		const answer = await gpt.getGptAutochange(prompt);

		const htmlContent = "<html><body><pre>" + answer + "</pre></body></html>";
		vsc.showSideBar(htmlContent);
		vscode.window.showInformationMessage("Changed code created.");
	}
	catch (error) {
		vscode.window.showErrorMessage("Could not get response from OpenAI.");
		throw new NoResponse("Could not get response from OpenAI");
	}
}

async function explainCommand() {
	const [editor, inputCode] = vsc.startCommandForTextEditor();

	const userInput = await vscode.window.showInputBox();

	const userQuestion = !userInput ? "Explain this code." : userInput;
	
	const prompt = "Code:\n```" + inputCode + "\n```\nUser says:\n\"" + userQuestion + "\".";

	try {
		vscode.window.showInformationMessage("Asking GPT...");
		const answer = await gpt.getGptExplain(prompt);

		const htmlContent = "<html><body><pre>" + answer + "</pre></body></html>";
		vsc.showSideBar(htmlContent);
		vscode.window.showInformationMessage("Explanation created.");
	}
	catch (error) {
		vscode.window.showErrorMessage("Could not get response from OpenAI.");
		throw new NoResponse("Could not get response from OpenAI");
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let disposables = [
		vscode.commands.registerCommand("gpt-developer.autocode", async () => {
			autocodeCommand();
		}),

		vscode.commands.registerCommand("gpt-developer.autorun", async () => {
			autorunCommand();
		}),

		vscode.commands.registerCommand("gpt-developer.ask_problem", async () => {
			askProblemCommand();
		}),

		vscode.commands.registerCommand("gpt-developer.autochange", async () => {
			autochangeCommand();
		}),

		vscode.commands.registerCommand("gpt-developer.explain", async () => {
			explainCommand();
		}),
	];

	disposables.forEach(disposable => {
		context.subscriptions.push(disposable);
	});
}

// This method is called when your extension is deactivated
export function deactivate() {}
