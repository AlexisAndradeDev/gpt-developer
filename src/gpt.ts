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

function getMaxTokens(): number | undefined {
    const maxTokens = vscode.workspace.getConfiguration("gpt-developer").get<number>("maxTokens");
    return maxTokens;
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

    var maxTokens = getMaxTokens();
    if (maxTokens === undefined) {
        maxTokens = 2000;
        vscode.window.showWarningMessage("You haven't stablished a max number of tokens. By default, " + maxTokens + " tokens is the limit.");
    }

    const config = {
        "openAIApi": openAIApi,
        "modelName": modelName,
        "maxTokens": maxTokens,
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
        max_tokens: config["maxTokens"],
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
