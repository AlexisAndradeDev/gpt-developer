import * as vscode from 'vscode';
import openai = require("openai");
import { ConfigError } from './exceptions';

/**
 * Returns just the code inside of the input string.
 */
export function getCodeFromModelSuggestion(suggestion: string) {
    const codeRegex = /```\w*\n([\S\s]*?)\n```/;
    const code = suggestion.replace(codeRegex, '$1');
    return code;
}

export function cleanCodeAnswer(modelAnswer: string) {
    modelAnswer = modelAnswer.replace(new RegExp("```", "g"), "");
    return modelAnswer;
}

function getOpenAIApi(): openai.OpenAI {
    var apiKey: string;

    const vscApiKey = vscode.workspace.getConfiguration("gpt-developer").get<string>("openAIKey");
    if (!vscApiKey) {
        const envApiKey = process.env.OPENAI_API_KEY;
        if (!envApiKey) {
            vscode.window.showErrorMessage("Could not find an OpenAI API key. Please, enter it in the configuration of the extension or as an environment variable (OPENAI_API_KEY).");
            throw new ConfigError("Could not find an OpenAI API key. Please, enter it in the configuration of the extension or as an environment variable (OPENAI_API_KEY).");
        }
        else {
            vscode.window.showInformationMessage("Could not find an OpenAI API key in VSC Workspace configuration. OPENAI_API_KEY environment variable value will be used.");
            apiKey = envApiKey;
        }
    }
    else {
        apiKey = vscApiKey;
    }

    var openAIApi = new openai.OpenAI({apiKey: apiKey});
    return openAIApi;
}

function getModelName(): string {
    let modelName = vscode.workspace.getConfiguration("gpt-developer").get<string>("model");
    if (modelName === undefined) {
        vscode.window.showErrorMessage("Could not find a model name. Choose a model in the configuration of this extension.");
        throw new ConfigError("Could not find a model name. Choose a model in the configuration of this extension.");
    }
    return modelName;
}

function getMaxOutputTokens(): number {
    let maxOutputTokens = vscode.workspace.getConfiguration("gpt-developer").get<number>("maxOutputTokens");
    if (maxOutputTokens === undefined) {
        vscode.window.showWarningMessage("You haven't stablished a max number of output tokens. Please, enter it in the configuration of the extension.");
        throw new ConfigError("You haven't stablished a max number of output tokens. Please, enter it in the configuration of the extension.");
    }
    return maxOutputTokens;
}

function getMaxInputTokens(): number {
    let maxInputTokens = vscode.workspace.getConfiguration("gpt-developer").get<number>("maxInputTokens");
    if (maxInputTokens === undefined) {
        vscode.window.showWarningMessage("You haven't stablished a max number of input tokens. Please, enter it in the configuration of the extension.");
        throw new ConfigError("You haven't stablished a max number of input tokens. Please, enter it in the configuration of the extension.");
    }
    return maxInputTokens;
}

function getConfig() {
    const openAIApi = getOpenAIApi();
    const modelName = getModelName();
    const maxOutputTokens = getMaxOutputTokens();
    const maxInputTokens = getMaxInputTokens();

    const config = {
        "openAIApi": openAIApi,
        "modelName": modelName,
        "maxOutputTokens": maxOutputTokens,
        "maxInputTokens": maxInputTokens,
    };

    return config;
}

export async function getGptSuggestion(prompt: string, systemMessage: string): Promise<string> {
    const config = getConfig();

    const maxPromptLength = config["maxInputTokens"] * 4;
    if (prompt.length > maxPromptLength) {  // 1 token ~ 4 characters in English
        vscode.window.showWarningMessage(`The selected code surpasses the max number of characters (${maxPromptLength} chars). Only the last ${maxPromptLength} will be used.`);
        prompt = prompt.substring(prompt.length-maxPromptLength, prompt.length);
    }

    var messages: openai.OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
    if (config["modelName"] === "gpt-3.5-turbo") {
        messages = [
            {"role": "system", "content": systemMessage},
            {"role": "user", "content": prompt + "\nIMPORTANT: " + systemMessage},
        ];
    }
    else if (["gpt-4", "gpt-4-turbo", "gpt-4o", "gpt-4o-mini"].includes(config["modelName"])) {
        messages = [
            {"role": "system", "content": systemMessage},
            {"role": "user", "content": prompt},
        ];
    }
    else if (["o1-preview", "o1-mini"].includes(config["modelName"])) {
        messages = [
            {"role": "user", "content": "System message:\n" + systemMessage},
            {"role": "user", "content": prompt},
        ];
    }
    else {
        vscode.window.showErrorMessage("Model not supported. Choose a supported model in the configuration of this extension.");
        throw new ConfigError("Model not supported. Choose a supported model in the configuration of this extension.");
    }

    const params: openai.OpenAI.Chat.ChatCompletionCreateParams = {
        model: config["modelName"],
        messages: messages,
        max_completion_tokens: config["maxOutputTokens"],
        n: 1,
    };

    const response = await config["openAIApi"].chat.completions.create(params);

    const suggestion = response.choices[0].message?.content;
    return suggestion !== null ? suggestion : "";
}
