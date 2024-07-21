import mongoose, { Document, Schema } from 'mongoose';

export interface ISongView extends Document {
    song: mongoose.Types.ObjectId;
    views: number;
}

const SongViewSchema = new Schema({
    song: { type: mongoose.Types.ObjectId, ref: 'Song', required: true },
    views: { type: Number, default: 0 },
});

export default mongoose.model<ISongView>('SongView', SongViewSchema);
