import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
    userId:number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    longLivedAccessToken: string;
    otp: string; // Field to store the generated OTP
    otpExpiry: Date;
    profilePhoto: string; // Field to store the expiry date/time of the OTP
    about:String;
    country:String;
    website:String;
}

const UserSchema: Schema = new Schema({
    userId:{type:Number,reuired:true ,unique:true},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    longLivedAccessToken: { type: String, default: null },
    otp: { type:Number, default: null }, // Default value is null until an OTP is generated
    otpExpiry: { type: Date, default: null }, // Default value is null until an OTP is generated
    profilePhoto: {type:String,default:null},
    about:{type:String,default:null},
    country:{type:String,default:null},
    website:{type:String,default:null}
});

export default mongoose.model<UserDocument>('User', UserSchema);
