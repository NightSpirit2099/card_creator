export class CardCreatorError extends Error {
    constructor(message, code, context = {}) {
        super(message);
        this.name = 'CardCreatorError';
        this.code = code;
        this.context = context;
    }
}

export class LayoutError extends CardCreatorError {
    constructor(message, context = {}) {
        super(message, 'LAYOUT_ERROR', context);
        this.name = 'LayoutError';
    }
}

export class ValidationError extends CardCreatorError {
    constructor(message, context = {}) {
        super(message, 'VALIDATION_ERROR', context);
        this.name = 'ValidationError';
    }
}