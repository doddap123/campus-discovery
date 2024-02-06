import { NextApiRequest, NextApiResponse } from "next";
import mongooseStartup from "../../../lib/mongoose";
import Session from "../../../db/model/Session";
import AuthenticationHelper from "../../../lib/AuthHelper";

export default async function handle(req: NextApiRequest,
                                     res: NextApiResponse) {
    if (req.method != 'POST') {
        return res.status(405).send('Only POST requests allowed');
    }
    const {refreshToken} = JSON.parse(req.body);
    if (!refreshToken) {
        return res.status(400).send('Refresh token must be sent');
    }

    if (!process.env.REFRESH_TOKEN_SECRET || !process.env.ACCESS_TOKEN_SECRET) {
        return res.status(500).send('Internal Server Error');
    }
    await mongooseStartup;
    const session = await Session.findOne({refreshToken});
    if (!session) {
        return res.status(403).send('');
    }
    res.status(200);
    const user = await AuthenticationHelper.VerifyRefreshToken(refreshToken);
    if (!user) {
        return res.status(403).send('');
    }
    const accessToken = AuthenticationHelper.GenerateAccessToken(user);
    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.setHeader('Set-Cookie', `token=${accessToken}; Path=/`);
    res.send({accessToken});
}
