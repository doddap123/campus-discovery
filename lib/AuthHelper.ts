import jwt from "jsonwebtoken";
import {UserModel} from "../db/model/User";

export function GenerateAccessToken(user: UserModel) {
    if (!process.env.ACCESS_TOKEN_SECRET) throw new Error('process.env.ACCESS_TOKEN_SECRET must be set');
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10m'});
}

export async function VerifyRefreshToken(token: string): Promise<UserModel> {
    return new Promise((resolve,reject) => {
        if (!process.env.REFRESH_TOKEN_SECRET) return reject('process.env.REFRESH_TOKEN_SECRET must be set');
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return reject(err);
            return resolve(user as UserModel);
        })
    });
}

const AuthHelper = {GenerateAccessToken, VerifyRefreshToken};
export default AuthHelper;
