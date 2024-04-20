import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user';
import { JwtService } from '../services/jwt-service';
import { UserService } from '../services/user-service';

const userService = new UserService();
const jwtService = new JwtService();

export async function authMiddleware(req:Request, res:Response, next:NextFunction) {
    const auth = req.headers.authorization;
    
    if (!auth?.startsWith('Bearer ')) {
        res.status(401).send({ message: 'Unauthorized' });
        return;
    }

    const token = auth.replace('Bearer ', ''); //take the remainder of the string only
    let userInfo;

    try {
        userInfo = jwtService.check(token); 
    } catch (error) {
        res.status(401).send({ message: 'Unauthorized' });
        return;
    }
    const user = await userService.getUserById(userInfo.id);

    if (!user) {
        res.status(401).send({ message: 'Unauthorized' });
        return;
    }
    res.locals.user = user;
    next();
}

export function getUserFromLocals(res: Response): User {
    return res.locals.user;
}