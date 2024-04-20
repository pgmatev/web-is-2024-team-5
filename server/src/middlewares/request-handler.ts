import { RequestHandler, Request, Response, NextFunction } from "express";
import { BaseError } from "../errors";

export function requestHandler<T>(handler: (req: Request, res: Response, next: NextFunction) => Promise<T>): RequestHandler {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        } catch (error) {
            if (error instanceof BaseError) {
                res.status(error.status).send({ message: error.message });
                return;
            }
            console.error(error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    };
}
