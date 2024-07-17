import mongoose, { Schema, Document } from 'mongoose';
import { IRole } from '../models/roles'; // Import the role interface

export interface UserDocument extends Document {
    _id:any,
    userId: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    longLivedAccessToken: string;
    otp: string;
    otpExpiry: Date;
    profilePhoto: string;
    about: string;
    country: string;
    website: string;
    role: IRole['_id']; // Reference to Role ID
}

const UserSchema: Schema = new Schema({
    userId: { type: Number, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    longLivedAccessToken: { type: String, default: null },
    otp: { type: Number, default: null },
    otpExpiry: { type: Date, default: null },
    profilePhoto: { type: String, default: null },
    about: { type: String, default: null },
    country: { type: String, default: null },
    website: { type: String, default: null },
    role: { type: Schema.Types.ObjectId, ref: 'Role', default: null } // Reference to Role
});

export default mongoose.model<UserDocument>('User', UserSchema);
