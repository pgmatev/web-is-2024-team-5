abstract class BaseError {
    status: number;
    message: string;

    constructor(status: number, message: string) {
        this.status = status;
        this.message = message;
    }
}

class BadRequestError extends BaseError {
    constructor(message: string) {
        super(400, message);
    }
}

class UnauthorizedError extends BaseError {
    constructor(message: string) {
        super(401, message);
    }
}

class ForbiddenError extends BaseError {
    constructor(message: string) {
        super(403, message);
    }
}

class NotFoundError extends BaseError {
    constructor(message: string) {
        super(404, message);
    }
}

export {BadRequestError, UnauthorizedError, NotFoundError, ForbiddenError, BaseError};