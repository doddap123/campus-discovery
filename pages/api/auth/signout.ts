import {NextApiRequest, NextApiResponse} from "next";
import mongooseStartup from "../../../lib/mongoose";
import Session from "../../../db/model/Session";

export default async function handle(req: NextApiRequest,
                                     res: NextApiResponse) {
    if (req.method != 'POST') {
        return res.status(405).send('Only POST requests allowed');
    }
    let token = req.body.refreshToken;
    if (!token) {
        return res.status(400).send('Session required to sign out');
    }

    await mongooseStartup;
    await Session.deleteOne({refreshToken: token});
    res.setHeader('Set-Cookie', 'token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT');
    res.status(200).send('Session destroyed');
}
