// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as commands from './commands';
import * as gpt from "./gpt";
import * as vsc from "./vsc_interaction";
import { NoPrompt, NoResponse } from './exceptions';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let disposables = [
		vscode.commands.registerCommand("gpt-developer.autocode", async () => {
			new commands.AutocodeCommand().execute();
		}),
		vscode.commands.registerCommand("gpt-developer.autorun", () => {
			new commands.AutorunCommand().execute();
		}),
		vscode.commands.registerCommand("gpt-developer.ask_problem", () => {
			new commands.AskProblemCommand().execute();
		}),
		vscode.commands.registerCommand("gpt-developer.autochange", () => {
			new commands.AutochangeCommand().execute();
		}),
		vscode.commands.registerCommand("gpt-developer.explain", () => {
			new commands.ExplainCommand().execute();
		}),
		vscode.commands.registerCommand("gpt-developer.ask_free", () => {
			new commands.AskFreeCommand().execute();
		}),
		vscode.commands.registerCommand("gpt-developer.autorun_example", () => {
			new commands.AutorunExampleCommand().execute();
		}),
		vscode.commands.registerCommand("gpt-developer.autorun_sequence", () => {
		   new commands.AutorunSequenceCommand().execute();
		}),
		vscode.commands.registerCommand("gpt-developer.esoteric", () => {
			new commands.EsotericCommand().execute();
		}),
		vscode.commands.registerCommand("gpt-developer.refactorize", () => {
			new commands.RefactorizeCommand().execute();
		}),
		vscode.commands.registerCommand("gpt-developer.design_patterns_suggestions", () => {
		    new commands.DesignPatternsSuggestionsCommand().execute();
		}),
		vscode.commands.registerCommand("gpt-developer.design_pattern", () => {
			new commands.DesignPatternCommand().execute();
		}),
		vscode.commands.registerCommand("gpt-developer.optimize_code", () => {
			new commands.OptimizeCodeCommand().execute();
		}),
		vscode.commands.registerCommand("gpt-developer.add_error_handling", () => {
			new commands.AddErrorHandlingCommand().execute();
		}),
		vscode.commands.registerCommand("gpt-developer.comment_code", () => {
			new commands.CommentCodeCommand().execute();
		}),
		vscode.commands.registerCommand("gpt-developer.create_tests", () => {
			new commands.CreateTestsCommand().execute();
		}),
	];

	disposables.forEach(disposable => {
		context.subscriptions.push(disposable);
	});
}

// This method is called when your extension is deactivated
export function deactivate() {}
