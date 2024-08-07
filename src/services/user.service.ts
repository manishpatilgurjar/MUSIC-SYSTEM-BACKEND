import bcrypt from 'bcryptjs';
import User from '../models/users'; // Ensure IUser is imported from the user model
import { handleResponse, internalServerError } from '../helpers/responseFormate';
import { ResponseCodes } from '../utils/responseCodes';
import { ResponseMessages } from '../utils/responseMessages';
import { generateAccessToken, generateLongLivedAccessToken } from '../helpers/user.helper';
import { generateRandomId } from '../utils/IdGenetrator';
import { formatEmailTemplate, transporter } from '../configs/mail';
class UserService {
    public async createUser(firstName: string, lastName: string, username: string, email: string, password: string) {
        // Check if user already exists
        let userId = generateRandomId();

        // Ensure that the generated task ID is unique
        while (await User.exists({ userId })) {
            userId = generateRandomId();
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return handleResponse(ResponseCodes.userAlreadyExist, ResponseMessages.userAlredyExist);
        }

        const existingUsernameUser = await User.findOne({ username });
        if (existingUsernameUser) {
            return handleResponse(ResponseCodes.userAlreadyExist, ResponseMessages.userUsernameAlreadyExist);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User<any>({
            userId,
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            role: "66979733116ce25dd9841078"
        });

        await newUser.save();
        return handleResponse(ResponseCodes.success, ResponseMessages.userRegistered, newUser);
    }

    public async loginUser(loginIdentifier: string, password: string) {
        const user = await User.findOne({ $or: [{ email: loginIdentifier }, { username: loginIdentifier }] });
        if (!user) {
            return handleResponse(ResponseCodes.notFound, ResponseMessages.userNotFound);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return handleResponse(ResponseCodes.unauthorized, ResponseMessages.invalidPassword);
        }

        try {
            const accessToken = generateAccessToken(user._id);
            const longLivedAccessToken = generateLongLivedAccessToken(user._id);

            user.longLivedAccessToken = longLivedAccessToken;
            await user.save();

            return handleResponse(ResponseCodes.success, ResponseMessages.loginSuccess, {accessToken, longLivedAccessToken });

        } catch (error) {
            console.error(error);
            return internalServerError;
        }
    }

    public async generateAndSendOtp(email: string) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

        const user = await User.findOneAndUpdate(
            { email },
            { otp, otpExpiry },
            { new: true }
        );

        if (!user) {
            return handleResponse(ResponseCodes.notFound, ResponseMessages.userNotFound);
        }

        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Your One-Time Password (OTP)',
                html: formatEmailTemplate(otp),
            };

            await transporter.sendMail(mailOptions);

            return handleResponse(ResponseCodes.success, ResponseMessages.otpsent);
        } catch (error) {
            // console.error(error);
            return error;
        }
    }

    public async resetPassword(email: string, otp: string, newPassword: string) {
        const user = await User.findOne({ email });
        if (!user) {
            return handleResponse(ResponseCodes.notFound, ResponseMessages.userNotFound);
        }

        if (user.otp.toString() !== otp) {
            return handleResponse(ResponseCodes.invalidOTP, ResponseMessages.invalidOtp);
        }

        if (new Date() > user.otpExpiry) {
            return handleResponse(ResponseCodes.expiredOTP, ResponseMessages.expiredOtp);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.otp = '';
        user.otpExpiry = new Date(0);
        await user.save();

        return handleResponse(ResponseCodes.success, ResponseMessages.passwordReset);
    }

    public async getUserDetails(userId: string) {
        const user = await User.findOne({ userId });
        if (!user) {
            return handleResponse(ResponseCodes.notFound, ResponseMessages.userNotFound);
        }

        const response = {
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            image: user.profilePhoto,
        };

        return handleResponse(ResponseCodes.success, ResponseMessages.UserDetails, response);
    }

    public async changePassword(userId: string, currentPassword: string, newPassword: string) {
        const user = await User.findOne({ userId });
        if (!user) {
            return handleResponse(ResponseCodes.notFound, ResponseMessages.userNotFound);
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return handleResponse(ResponseCodes.unauthorized, ResponseMessages.invalidCurrentPassword);
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedNewPassword;
        await user.save();

        return handleResponse(ResponseCodes.success, ResponseMessages.passwordChanged);
    }

    public async uploadProfilePhoto(userId: string, profilePhotoPath: string) {
        try {
            const user = await User.findOne({ userId });
            if (!user) {
                return handleResponse(ResponseCodes.notFound, ResponseMessages.userNotFound);
            }

            user.profilePhoto = profilePhotoPath;
            await user.save();

            return handleResponse(ResponseCodes.success, ResponseMessages.userRegistered, { profilePhoto: profilePhotoPath });
        } catch (error) {
            console.error(error);
            return internalServerError;
        }
    }
}

export default new UserService();
