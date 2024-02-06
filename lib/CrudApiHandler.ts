import { NextApiRequest, NextApiResponse } from "next";
import mongoose, { Document, Model as MongooseModel, Types as MongooseTypes } from "mongoose";
import mongooseStartup from '../lib/mongoose';

interface CreateOrUpdateRequest<T> extends NextApiRequest {
    body: T
}

type ModelWithId<T> = T & {
    _id: MongooseTypes.ObjectId
}

export default class CrudApiHandler<IModel extends Document, Model extends MongooseModel<IModel>> {
    model: Model;

    constructor(model: Model) {
        this.model = model;
    };

    handleIndex = async (
        req: NextApiRequest | CreateOrUpdateRequest<IModel>,
        res: NextApiResponse<ModelWithId<IModel>[] | IModel | string>
    ) => {
        await mongooseStartup;

        switch (req.method) {
            case 'GET':
                let request: mongoose.Query<any, any> = this.model.find();
                // Populate any required fields
                Object.entries(this.model.schema.paths)
                    .filter(([_, v]) => (v.instance == 'ObjectID' && v.options?.ref))
                    .map(([k, _]) => k)
                    .forEach(k => request = request.populate(k));
                Object.entries(this.model.schema.paths)
                    .filter(([_, v]) => v.instance == 'Array')
                    ?.map(([k, _]) => k)
                    ?.forEach(k => request = request.populate(k));
                const data = await request;
                res.status(200).json(data);
                return;
            case 'POST':
                const missingProperties = Object.entries(this.model.schema.paths)
                    .filter(([k, v]) => (v.isRequired) && !req.body[k]);
                if (!missingProperties.length) {
                    const data = await this.model.create((req as CreateOrUpdateRequest<IModel>).body);
                    res.status(201).json(data);
                    return;
                }
                res
                    .status(400)
                    .send('The following properties were missing from the request: '
                        + `${ missingProperties.map(([name, _]) => name).join(', ') }`);
                return;
        }
        res.status(405);
    };

    handleId = async (
        req: NextApiRequest | CreateOrUpdateRequest<IModel>,
        res: NextApiResponse<ModelWithId<IModel> | string>
    ) => {
        await mongooseStartup;

        switch (req.method) {
            case 'GET':
                const data = await this.model.findById(req.query.id);
                if (!data) {
                    res.status(404).send(`User with id ${ req.query.id } does not exist`);
                    return;
                }
                res.status(200).json(data);
                return;
            case 'PUT':
                const update: any = {};
                Object.entries(this.model.schema.paths).forEach(([e]) => {
                    if (req.body[e]) update[e] = req.body[e];
                });
                if (Object.keys(update).length === 0) {
                    res.status(400).end();
                    return;
                }
                await this.model.findOneAndUpdate({ _id: req.query.id }, { $set: update }, { new: true })
                    .then(u => res.status(200).json(u as unknown as ModelWithId<IModel>))
                    .catch(_ => res.status(500).end());
                return;
            case 'DELETE':
                await this.model.deleteOne({ _id: req.query.id })
                    .then(u => res.status(200).json(u as unknown as ModelWithId<IModel>))
                    .catch(_ => res.status(500).end());
                return;
        }
        res.status(405);
    }
}

