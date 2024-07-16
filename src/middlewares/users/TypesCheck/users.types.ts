import Joi from 'joi';


export interface Signup {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
}

export interface Login{
    loginIdentifier:string;
    password :string;

}

export interface ForgotPassword{
    email:string;
}
export interface ResetPassword{
    email:string;
    otp:string;
    newPassword:string;

}

export const userSignup = Joi.object<Signup>({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

export const userLogin = Joi.object<Login>({
    loginIdentifier: Joi.string().required(),
    password: Joi.string().required()
})

export const getOTP = Joi.object<ForgotPassword>({
    email: Joi.string().email().required()
})

export const forgotPassword = Joi.object<ResetPassword>({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
    newPassword: Joi.string().required()
})