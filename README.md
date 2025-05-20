# GPT Developer

Software development assistant based on GPT. Auto-complete code, give software architecture suggestions, debug, simulate executions, and all the other functions that GPT can perform when good prompts are used.

## Features

* Use any of the OpenAI's chat and reasoning models.

* Autocomplete: Given the selected code snippet or any text, GPT automatically generates new code or content (works better if you specify using comments or some text what you want GPT to write!). It pays special attention to the latest comment or directive. If no code is selected, all the code before the cursor's position will be passed as the prompt.

* Autocode: Select a code snippet and GPT will automatically generate new code (works better if you specify using comments what you want GPT to write!). If no code is selected, all the code before the cursor's position will be passed as the prompt.

![Autocode GIF](https://www.dropbox.com/s/d103qjdersuovk7/autocode.gif?dl=1)

* Autorun: GPT simulates how the selected code would run, giving details about variables values, exceptions raised, bugs and information about runtime and compilation.

![Autorun GIF](https://www.dropbox.com/s/75g6slq148y18e8/autorun.gif?dl=1)

* Autorun in Sequence: GPT simulates, sequentially and step-by-step, how the selected code would run. Analyzes the possible inputs and outputs from the program.

![Autorun in Sequence GIF](https://www.dropbox.com/s/xi7yh4dra0gn0ph/autorun-sequence.gif?dl=1)

* Autorun with Example: GPT simulates, sequentially and step-by-step, how the selected code would run, giving an example as if GPT were a user.

![Autorun with Example GIF](https://www.dropbox.com/s/ivb52xra59vb0t4/autorun-example.gif?dl=1)

* Ask Problem: Select a code snippet and ask GPT about a problem that the code snippet has or might have.

* Autochange: Select a code snippet and ask GPT to change something about it.

* Explain: Select a code snippet and ask GPT to explain what it does.

* Ask Free: Select a code snippet and ask GPT anything you want. If no code is selected, GPT will not receive any code and the prompt will only consist of the message that you typed.

* Design Patterns Suggestions: Select a code snippet and GPT will tell you the best design patterns to apply.

* Design Pattern: Select a code snippet, enter the name of a design pattern and GPT will apply it to the code snippet.

* Esoteric: ?

> More features coming soon...

## How to use

Setup your settings. Go to `File/Preferences/Settings` and type `GPT Developer`. You will see two fields: `Model` and `Open AIKey`. Choose a model and enter your OpenAI key. You can see more details about how to fill them in the **Extension Settings** section.

Go to your code and start playing with GPT! You can see all the commands that this extension provides by going to `View/Command Palette...` (or using the default shortcut `Ctrl + Shift + P`). An input box will appear; type `>GPT Developer:` and all the commands will be displayed. To execute a command, just click on it.

## Extension Settings

This extension contributes the following settings:

* `gpt-developer.openAIKey`: Your OpenAI API key. Leave this field blank if you already have a key in the OPENAI_API_KEY environment variable and you want to use it instead. Your data is completely secure! This key will be stored in your computer, so only you have access to it. If for some reason you don't want to store your key in this settings attribute, just set the OPENAI_API_KEY environment variable and leave this field blank.
* `gpt-developer.model`: The model from OpenAI that you want to use (e.g. `gpt-4-0314`).
* `gpt-developer.maxOutputTokens`: Maximum number of tokens that GPT will generate. The higher this value, the more tokens will be used. There's the possibility that, considering also the number of input tokens (length of the selected code), the token limit of the model is surpassed and it will not be possible to receive a response from the model.
* `gpt-developer.maxInputTokens`: Maximum number of approximate tokens (4 characters) that GPT will get as input. The higher this value, the more tokens will be used. Learn more about each model's context window: https://platform.openai.com/docs/models.

## Release Notes

### 1.9.0

Add Autocomplete command.

### 1.8.0

Add models: gpt-4.1, gpt-4.1-mini, gpt-4.1-nano, o4-mini, o3, o3-mini, o1-pro, o1.

Remove model: o1-preview

Show a warning message when a reasoning model uses all of the output tokens in the reasoning process.

### 1.7.0

Add models: gpt-4o-mini, o1-preview, o1-mini.

Update OpenAI library version.

### 1.6.0

Add models: gpt-4o, gpt-4, gpt-4-turbo.

Remove model: gpt-4-0314.

Rename max output tokens configuration.

Add max input tokens configuration.

Add Optimize Code, Error Handling, Comment Code and Create Tests commands.

### 1.5.4

Fix 1 bug.

### 1.5.3

Refactorize code.

### 1.5.2

Fix environment variable name.

### 1.5.1

Update README.md

### 1.5.0

Added Esoteric, Refactorize, Design Patterns Suggestions and Design Pattern commands.

### 1.4.0

Added Autorun Example and Autorun Sequential commands.

### 1.3.4

Fix 1 bug.

Escape HTML for all code generated by GPT.

### 1.3.3

Fix 3 bugs.

HTML content generated by GPT is now correctly displayed as plain text.

### 1.3.0

Added max tokens configuration.

### 1.2.0

Added Ask Free command.

### 1.1.0

Added Explain.

### 1.0.0

Initial release.

Added Autocode, Autorun, Ask Problem and Autochange.

---

## **Enjoy GPT!**

> I'll be updating this extension frequently, making as many interesting and useful features as possible!
