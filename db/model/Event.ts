import mongoose from 'mongoose';
import { IUser } from "./User";
import { IAttendee } from "./Attendee";

// Required for references
import './User';
import './Attendee';

export interface IEvent {
    creator: IUser,
    title: string,
    startTime: Date,
    endTime: Date,
    description: string,
    // TODO: Tags
    //location: ILocation,
    location: string,
    capacity: number,
    rsvp: { yes: IUser[], maybe: IUser[], no: IUser[] },
    invitedUsers: IUser[]
}

interface IEventDocument extends mongoose.Document, IEvent {
}

export type EventModel = IEvent & {
    // Note that mongoose.Types.ObjectId != mongoose.Schema.Types.ObjectId
    _id: mongoose.Types.ObjectId
};

const eventSchema = new mongoose.Schema<IEventDocument>({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    rsvp: {
        yes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        maybe: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        no: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    invitedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }]
});

export default mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);
