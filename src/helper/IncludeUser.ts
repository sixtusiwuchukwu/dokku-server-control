import {NextFunction, Request, Response} from "express";
import {refreshTokens, verifyJWT} from "./utils.jwt";

export default async (req:Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  const token:string = req.cookies['x-token'];
  if (token) {
    try {
      // @ts-ignore
      const user  = await verifyJWT(token);
      // @ts-ignore
      req.user = user;
    } catch (err) {
      // @ts-ignore
      const refreshToken = req.cookies['x-refresh-token'];
      const newTokens = await refreshTokens(token, refreshToken);
      if (newTokens.token && newTokens.refreshToken) {
        // @ts-ignore
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        // @ts-ignore
        res.cookie('x-token', newTokens.token);
        // @ts-ignore
        res.cookie('x-refresh-token', newTokens.refreshToken);
      }
      // @ts-ignore
      req.user = newTokens.user;
    }
  }
  next();
};
