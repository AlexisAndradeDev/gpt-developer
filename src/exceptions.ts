export class ConfigError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class NoActiveEditor extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class NoPrompt extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class NoResponse extends Error {
    constructor(message: string) {
        super(message);
    }
}
