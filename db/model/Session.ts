import mongoose, { Types } from 'mongoose';
import { IUser } from "./User";
import './User';
import ObjectId = Types.ObjectId;

export interface ISession {
    refreshToken: string,
    user: IUser
}

interface ISessionDocument extends mongoose.Document, ISession {
}

export type SessionModel = ISession & {
    _id: ObjectId
};

const sessionSchema = new mongoose.Schema<ISessionDocument>({
    refreshToken: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'}
});

export default mongoose.models.Session || mongoose.model<ISession>('Session', sessionSchema);
