import jwt from 'jsonwebtoken'
import User from '../models/user/user'
import {ObjectId} from "mongoose"
const privateKey:string = `
-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQDKPj94N+OIkOr3b/+9OBhmriacv/426lUcpQ8C0XqOoV2OCrnD
8eM7RmgV1wGpR4CN6R9Xe9QzJxr9bCh2rwU4pNuEu26I7wDZMeIDvchBMP3xGwJA
ZxqRTrm6P0gUPqTWcZc8Od8m9tA7gkAyyFdVFz4meVlxG6rHyQaAcR59uQIDAQAB
AoGAbAeKIa5A5Q7748Y4phtTtW1rBKntoenUIuPsO8YnoA6ECb6i8g7AIUZ/jML3
iTO/cI5JBpMHi3dlDF980cC1mVNBNyebYxywgQD2Dd46QDfpaToauXmpp0cG5etv
vHQ81HfnE+8KRuREefscas3qFfVVC8hkBOiEiaD0sNYfjd0CQQD3/33wpAhkzPCl
hyLAIpyxxGYUPxA51ySOElT3fioMOhuUMyIWxjsQ9BRjotmpveYWu96G8Qj0Lrnh
tXHuPwjTAkEA0MTQCPfOnkld0DP0NtM8GRE9uALR9J/nOQWMcgmUwQ0r/SOppn/7
SZMvA104/AwMZJAb1w8wL24sapgWcI8HwwJBAPNwLOQnYMXyFtely4rnbwFhVQLS
1M6yTgPYIue/RO8zqxbTCsdoV1rQ/aLAnQFuk4oFaO71dGCd7YGOZwQDhFkCQE6/
vr1zRGQexp1vy5IWshe+kipkHfCJlL3EowqtJIiBwHMXTbo5kn9ZXqWFN6aToOUa
GvZPi1yI0YZP4j8JJOMCQBzGrZAGqOuAkEp/AKoNO4mQzizwxGopJQUKJIfzNzCY
mBLh0Y1RUmy0pWN07C+2JGDYh2GiVByaOE+5I5Yb1E8=
-----END RSA PRIVATE KEY-----
`
const publicKey:string = `
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDKPj94N+OIkOr3b/+9OBhmriac
v/426lUcpQ8C0XqOoV2OCrnD8eM7RmgV1wGpR4CN6R9Xe9QzJxr9bCh2rwU4pNuE
u26I7wDZMeIDvchBMP3xGwJAZxqRTrm6P0gUPqTWcZc8Od8m9tA7gkAyyFdVFz4m
eVlxG6rHyQaAcR59uQIDAQAB
-----END PUBLIC KEY-----
`

export const signJWT = (payload: object, expiresIn: string | number, refreshExpiresIn?: string | number):Array<string> => {
  const newPayloadData = (payload as any)
   const newToken = jwt.sign({...newPayloadData, lastReset: undefined}, privateKey, {expiresIn, algorithm:'RS256'})
  const newRefreshToken =  jwt.sign({_id: (payload as any)._id, integrity:(payload as any).lastReset}, privateKey, {expiresIn:refreshExpiresIn||expiresIn, algorithm:'RS256'})
  return [newToken, newRefreshToken]
}
export const refreshTokens = async (token:string, refreshToken:string) => {
  let userId;
  let lastReset;
  try {
    // @ts-ignore
    let { _id, integrity } = jwt.decode(refreshToken);
    userId = _id;
    lastReset = integrity
  } catch (err) {
    return {};
  }

  if (!userId || !lastReset) {
    return {};
  }
  const user = await User.findOne({_id:userId, lastReset: lastReset},{username:1, email:1, lastReset:1}, {lean: true});
  if (!user) {
    return {};
  }

  try {
    await verifyJWT(refreshToken);
  } catch (err) {
    return {};
  }
  const [newToken, newRefreshToken] = signJWT(user,'15s', '24h');
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user,
  };
};
export const verifyJWT = async (token: string):Promise<any>=> {
    try {
      jwt.verify(token,publicKey)
      const decoded:any = jwt.decode(token)
      decoded.expired = false;
      // @ts-ignore
      return decoded
    }
    catch (e) {
        throw new Error('jwt expired')
    }
}
