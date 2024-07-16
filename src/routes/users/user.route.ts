import express from 'express';
import UserController from '../../controllers/user.controller'
import ValidUser from "../../middlewares/users/users.middleware";
import userController from '../../controllers/user.controller';
// import { profileUpload } from '../configs/upload.config';

const router = express.Router();

router.post("/signup",ValidUser.validateSignup,UserController.signup)
router.post("/login",ValidUser.validateLogin,UserController.login)
router.post("/reset-password",UserController.resetPasswordController)
router.post("/send-otp",ValidUser.validateEmailOtp,UserController.requestOtpController)
router.post("/user-details",userController.getUserDetails)
router.post("/change-password",userController.changePassword)
// router.post('/upload-profile',profileUpload.single("image"),userController.uploadProfile)
export default router