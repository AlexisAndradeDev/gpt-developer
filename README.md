# GPT Developer

Software development assistant based on GPT. Auto-complete code, give software architecture suggestions, debug, simulate executions, and all the other functions that GPT can perform if good prompts are used.

## Features

* Use GPT-3.5-turbo (current ChatGPT) or GPT-4 (if you have access!).
* Autocode: Select a piece of code and GPT will automatically generate new code (works better if you specify using comments what you want GPT to write!). If no code is selected, all the code before the cursor's position will be passed to GPT (20,000 chars ~ 4,000 tokens is the max length).
* Autorun: GPT simulates how the selected code would run, giving details about variables values, exceptions raised, bugs and information about runtime and compilation.
* Ask Problem: Select a piece of code and ask GPT about a problem that the piece of code has or might have.
* Autochange: Select a piece of code and ask GPT to change something about it.

> More features coming soon...

## How to use

Setup your settings. Go to `File/Preferences/Settings` and type `GPT Developer`. You will see two fields: `Model` and `Open AIKey`. Choose a model and enter your OpenAI key. You can see more details about how to fill them in the **Extension Settings** section.

Go to your code and start playing with GPT! You can see all the commands that this extension provides by going to `View/Command Palette...` (or using the default shortcut `Ctrl + Shift + P`). An input box will appear; type `>GPT Developer:` and all the commands will be displayed. To execute a command, just click on it.

## Extension Settings

This extension contributes the following settings:

* `gpt-developer.openAIKey`: Your OpenAI API key. Leave this field blank if you already have a key in the OPENAI_SECRET_KEY environment variable and you want to use it instead. Your data is completely secure! This key will be stored in your computer, so only you have access to it. If for some reason you don't want to store your key in this settings attribute, just set the OPENAI_SECRET_KEY environment variable and leave this field blank.
* `gpt-developer.model`: The model from OpenAI that you want to use (e.g. `gpt-4-0314`).

## Release Notes

### 1.1.0

Added Explain.

### 1.0.0

Initial release.

Added Autocode, Autorun, Ask Problem and Autochange.

---

## **Enjoy GPT!**

> I'll be updating this extension frequently, making as many interesting and useful features as possible!