import mongoose, { Document, Schema } from 'mongoose';

export interface IPermission extends Document {
    name: string;
}

const PermissionSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
});

export default mongoose.model<IPermission>('Permission', PermissionSchema);
