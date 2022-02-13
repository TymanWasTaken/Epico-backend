import type { Request, Response } from "express";
import { Auth } from "../auth";
import { Route } from "../route";
import bodyParser from "body-parser";

export default class Login extends Route {
    public path = "/login";
    public middleware = [bodyParser.urlencoded({ extended: true })]
    public override async post(req: Request, res: Response) {
        res.send(await Auth.createToken(req.body.username));
    }
}