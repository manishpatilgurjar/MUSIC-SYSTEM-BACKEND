import mongoose, { Document, Schema } from 'mongoose';

export interface ISong extends Document {
    title: string;
    artist: string;
    album: string;
    genre: string;
    releaseDate: Date;
    songUrl: string;
    posterUrl: string;
    songKey: string;
    posterKey: string;
}

const SongSchema = new Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String, required: true },
    genre: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    songUrl: { type: String, required: true },
    posterUrl: { type: String, required: true },
    songKey: { type: String, required: true },
    posterKey: { type: String, required: true },
});

export default mongoose.model<ISong>('Song', SongSchema);
