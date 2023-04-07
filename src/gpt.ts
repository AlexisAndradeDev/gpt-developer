import * as vscode from 'vscode';
import openai = require("openai");
import { ConfigError } from './exceptions';

function getCodeFromModelSuggestion(suggestion: string) {
    const codeRegex = /```\w*\n([\S\s]*?)\n```/;
    const code = suggestion.replace(codeRegex, '$1');
    return code;
}

function cleanCodeAnswer(modelAnswer: string) {
    modelAnswer = modelAnswer.replace(new RegExp("```", "g"), "");
    return modelAnswer;
}

function getOpenAIApi(): openai.OpenAIApi | undefined {
    var apiKey: string;

    const vscApiKey = vscode.workspace.getConfiguration("gpt-developer").get<string>("openAIKey");
    if (!vscApiKey) {
        const envApiKey = process.env.OPENAI_API_KEY;
        if (!envApiKey) {
            return;
        }
        else {
            vscode.window.showInformationMessage("Could not find an OpenAI API key in VSC Workspace configuration. OPENAI_API_KEY environment variable value will be used.");
            apiKey = envApiKey;
        }
    }
    else {
        apiKey = vscApiKey;
    }

    const configuration = new openai.Configuration({
        apiKey: apiKey,
    });
    var openAIApi = new openai.OpenAIApi(configuration);
    return openAIApi;
}

function getModelName(): string | undefined {
    const modelName = vscode.workspace.getConfiguration("gpt-developer").get<string>("model");
    return modelName;
}

function getConfig() {
    const openAIApi = getOpenAIApi();
    if (openAIApi === undefined) {
        vscode.window.showErrorMessage("Could not find an OpenAI API key. Please, enter it in the configuration of the extension or as an environment variable (OPENAI_API_KEY).");
        throw new ConfigError("Could not find an OpenAI API key. Please, enter it in the configuration of the extension or as an environment variable (OPENAI_API_KEY).");
    }

    const modelName = getModelName();
    if (modelName === undefined) {
        vscode.window.showErrorMessage("Could not find a model name. Choose a model in the configuration of this extension.");
        throw new ConfigError("Could not find a model name. Choose a model in the configuration of this extension.");
    }

    const config = {
        "openAIApi": openAIApi,
        "modelName": modelName,
    };

    return config;
}

export async function getGptSuggestion(prompt: string, systemMessage: string): Promise<string> {
    const config = getConfig();

    var messages = [];
    if (config["modelName"] === "gpt-3.5-turbo") {
        messages = [
            {"role": openai.ChatCompletionResponseMessageRoleEnum.System, "content": systemMessage},
            {"role": openai.ChatCompletionResponseMessageRoleEnum.User, "content": prompt + "\nIMPORTANT: " + systemMessage},
        ];
    }
    else if (config["modelName"] === "gpt-4-0314") {
        messages = [
            {"role": openai.ChatCompletionResponseMessageRoleEnum.System, "content": systemMessage},
            {"role": openai.ChatCompletionResponseMessageRoleEnum.User, "content": prompt},
        ];
    }
    else {
        throw new ConfigError("Model not supported. Choose a supported model in the configuration of this extension.");
    }

    const response = await config["openAIApi"].createChatCompletion({
        model: config["modelName"],
        messages: messages,
        max_tokens: 1000,
        n: 1,
    });

    const suggestion = response.data.choices[0].message?.content;
    if (suggestion !== undefined) {
        return suggestion;
    }
    else {
        return "";
    }
}

export async function getGptAutocode(prompt: string): Promise<string> {
    var suggestion = await getGptSuggestion(
        prompt, 
        "You are a code auto-completion tool installed in Visual Studio Code as an extension. You ONLY give *code*. Do NOT explain or write anything more.",
    );
    suggestion = cleanCodeAnswer(suggestion);
    return suggestion;
}

export async function getGptAutorun(prompt: string): Promise<string> {
    var suggestion = await getGptSuggestion(
        prompt,
        "You are a debugging tool installed in Visual Studio Code as an extension. You are given a piece of code and you simulate how it would run, giving details about variables values, exceptions raised, bugs and information about runtime and compilation.",
    );
    return suggestion;
}

export async function getGptAskProblem(prompt: string): Promise<string> {
    var suggestion = await getGptSuggestion(
        prompt,
        "You are a debugging tool installed in Visual Studio Code as an extension. You are given a piece of code and are asked about a problem that piece of code is having/might have.",
    );
    return suggestion;
}

export async function getGptAutochange(prompt: string): Promise<string> {
    var suggestion = await getGptSuggestion(
        prompt,
        "You are a coding tool installed in Visual Studio Code as an extension. You are given a piece of code and are asked to change something on it. You ONLY give *code*. Do NOT explain or write anything more.",
    );
    suggestion = cleanCodeAnswer(suggestion);
    return suggestion;
}
