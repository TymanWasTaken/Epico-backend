import type { Express, Request, RequestHandler, Response } from 'express';

export abstract class Route {
	public abstract path: string;
	public get?(req: Request, res: Response): Promise<void>;
	public post?(req: Request, res: Response): Promise<void>;
	public delete?(req: Request, res: Response): Promise<void>;
    public middleware?: RequestHandler[];
	public app: Express;
	public constructor(app: Express) {
		this.app = app;
	}
}
