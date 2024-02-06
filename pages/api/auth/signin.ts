import {NextApiRequest, NextApiResponse} from "next";
import jwt from 'jsonwebtoken';
import User from "../../../db/model/User";
import mongooseStartup from "../../../lib/mongoose";
import AuthenticationHelper from "../../../lib/AuthHelper";
import Session from "../../../db/model/Session";

export default async function handle(req: NextApiRequest,
                                     res: NextApiResponse) {
    if (req.method != 'POST') {
        return res.status(405).send('Only POST or GET requests allowed');
    }
    if (!req.body.email || !req.body.password) {
        return res.status(400).send('Email and password required to login');
    }

    const {email, password} = req.body;
    await mongooseStartup;
    const user = (await User.findOne({email, password})).toObject();
    if (!process.env.REFRESH_TOKEN_SECRET || !process.env.ACCESS_TOKEN_SECRET) {
        return res.status(500).send('');
    }
    if (!user) {
        return res.status(401).send('Invalid username or password');
    }
    res.status(200);
    const accessToken = AuthenticationHelper.GenerateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    await mongooseStartup;
    const session = await Session.updateOne({user}, {refreshToken, user}, {upsert: true});
    res.setHeader('Authorization', `Bearer ${accessToken}`);
    let exp = new Date();
    exp.setMinutes(exp.getMinutes() + 10);
    res.setHeader('Set-Cookie', `token=${accessToken};Expires=${exp.toUTCString()};Path=/`);
    res.send({accessToken, refreshToken});
}
