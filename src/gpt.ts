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

export async function getGptAutocode(prompt: string): Promise<string> {
    var suggestion = await getGptSuggestion(
        prompt, 
        "You are a code auto-completion tool installed in Visual Studio Code as an extension. Given the input code and comments, generate new code (DO NOT rewrite the input code, just return the NEW one). Pay especial attention to the latest comment (if there's one). You ONLY give *code*. Do NOT explain or write anything more.",
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

export async function getGptExplain(prompt: string): Promise<string> {
    var suggestion = await getGptSuggestion(
        prompt,
        "You are a debugging tool installed in Visual Studio Code as an extension. You are given a piece of code and are asked to explain it.",
    );
    return suggestion;
}

export async function getGptAskFree(prompt: string): Promise<string> {
    var suggestion = await getGptSuggestion(
        prompt,
        "You are a virtual assistant installed in Visual Studio Code as an extension to help in software development and programming tasks.",
    );
    return suggestion;
}

export async function getGptAutorunExample(prompt: string): Promise<string> {
    var suggestion = await getGptSuggestion(
        prompt,
        "You are given a piece of code and you run it as it you were the user. Write, step-by-step, what are you interacting with and what results you are getting. Be really specific with your examples, create realistic input data. Like '1. The program prints ...\n2. I type something\n3. The program prints ....\n4. I decide 'option'.\n5. The program...'"
    );
    return suggestion;
}

export async function getGptAutorunSequence(prompt: string): Promise<string> {
    var suggestion = await getGptSuggestion(
        prompt,
        "You are a debugging tool installed in Visual Studio Code as an extension. You are given a piece of code and you simulate how it would run, giving details about variables values, exceptions raised, bugs and information about runtime and compilation. Write what would happen step-by-step, and, if it's a good format, enumerate each step.",
    );
    return suggestion;
}

export async function getGptEsoteric(prompt: string): Promise<string> {
    var suggestion = await getGptSuggestion(
        prompt,
        "You are a coding tool installed in Visual Studio Code as an extension. You are given a piece of code and you will code it in: LOLCODE, Brainfuck, Chef or Shakespeare Programming Language. Just use one of them.",
    );
    suggestion = cleanCodeAnswer(suggestion);
    return suggestion;
}
