import type { Request, Response } from "express";
import { Route } from "../route";

export default class Index extends Route {
    public path = "/";
    public override async get(req: Request, res: Response) {
        res.send("Hello World!");
    }
}