import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
    name: string,
    email: string,
    password: string,
    category: string,
    firebase_id: string
}

export type UserModel = IUser & {
    _id: mongoose.Types.ObjectId
};

export const UserSchema = new mongoose.Schema<IUser>({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    category: {type: String, required: false, default: 'user'}
});

export default mongoose?.models?.User || mongoose.model<IUser>('User', UserSchema);
