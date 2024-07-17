import mongoose, { Document, Schema } from 'mongoose';
import { IPermission } from '../models/permission'; // Import the permission interface

export interface IRole extends Document {
    name: string;
    permissions: IPermission['_id'][]; // Reference to Permission IDs
}

const RoleSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }] // Array of Permission references
});

export default mongoose.model<IRole>('Role', RoleSchema);
