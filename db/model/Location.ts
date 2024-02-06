import mongoose from 'mongoose';

export interface ILocation {
    buildingName: string,
    roomName: string,
    plusCode: string
}

interface ILocationDocument extends ILocation, mongoose.Document {
}


export type LocationModel = ILocation & {
    _id: mongoose.Types.ObjectId
};

export let locationSchema = new mongoose.Schema<ILocation>({
    buildingName: {type: String, required: true},
    roomName: {type: String, required: true},
    plusCode: {type: String, required: true}
});

export default mongoose.models.Location || mongoose.model<ILocation>('Location', locationSchema);
