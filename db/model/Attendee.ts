import mongoose from 'mongoose';
import {IUser} from "./User";
// Required for populate
import './User';

export interface IAttendee extends mongoose.Document {
    user: IUser,
    status: string
}

export type AttendeeModel = IAttendee & {
    _id: mongoose.Types.ObjectId
};

export const AttendeeSchema = new mongoose.Schema<IAttendee>({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    status: {type: String, required: true}
});

export default mongoose?.models?.Attendee || mongoose.model<IAttendee>('Attendee', AttendeeSchema);
