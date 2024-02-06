import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";

export default function useAuth(
    initial?: { user: any | undefined, accessToken: any | undefined, refreshToken: any | undefined } | undefined
) {
    const [user, setUser] = useState(initial?.user);
    const [accessToken, setAccessToken] = useState(initial?.accessToken);
    const [refreshToken, setRefreshToken] = useState(initial?.refreshToken);

    useEffect(() => {
        if (localStorage['refreshToken']) {
            setRefreshToken(localStorage['refreshToken']);
        }
        if (localStorage['accessToken']) {
            setAccessToken(localStorage['accessToken']);
        }
        const token = localStorage['accessToken'] || localStorage['refreshToken'];
        if (token) {
            setUser(jwt.decode(token) as any);
        }
        (async function () {
            const token = localStorage['accessToken'] || document.cookie
                .split(';')
                .map(c => c.split('='))
                .find(([k, _]) => k == 'token')
                ?.map(([_, v]) => v);
            if (!token) return;
            const decoded: any = jwt.decode(token);
            if (!decoded) return;
            if (Date.now() >= decoded.exp * 1000) {
                const refreshToken = localStorage['refreshToken'];
                if (!refreshToken) return;
                fetch('/api/auth/token', {
                    method: 'POST',
                    body: JSON.stringify({ refreshToken })
                })
                    .then(response => {
                        if (!response.ok) return;
                        response.json();
                    })
                    .then((body: any) => {
                        if (!body) return;
                        const { accessToken } = body;
                        if (!accessToken) return;
                        localStorage['accessToken'] = accessToken;
                        let exp = new Date();
                        exp.setUTCSeconds(accessToken.exp);
                        document.cookie = `token=${ accessToken };Expires=${ exp.toUTCString() };path=/`;
                        setAccessToken(accessToken);
                        setUser(jwt.decode(accessToken) as any);
                    }, err => {
                        setUser(undefined);
                        setAccessToken(undefined);
                        setRefreshToken(undefined);
                        console.error(err);
                    });
            }
        })();
    }, []);

    const logout = async () => {
        const res = await fetch('/api/auth/signout', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
        })
            .catch(e => {
                console.error(`logout error: ${ e }`)
            });
        if (!res?.ok) {
            console.error(res);
            return;
        }

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }

    return { user, accessToken, refreshToken, logout };
}
