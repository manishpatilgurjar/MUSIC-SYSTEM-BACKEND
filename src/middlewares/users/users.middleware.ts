import { Request, Response, NextFunction } from 'express';
import { validateSchema } from '../../helpers/validation.helper';
import { getOTP, userLogin, userSignup } from './TypesCheck/users.types';


class ValidUser {
    static validateSignup(req: Request, res: Response, next: NextFunction) {
        return validateSchema(userSignup)(req, res, next);
    }
    static validateLogin(req: Request, res: Response, next: NextFunction) {
        return validateSchema(userLogin)(req, res, next)
    };

    static validateEmailOtp(req: Request, res: Response, next: NextFunction) {
        return validateSchema(getOTP)(req, res, next)}
}

export default ValidUser