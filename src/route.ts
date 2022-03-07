import bodyParser from 'body-parser';
import type { Express, Request, RequestHandler, Response } from 'express';
import type { OpenAPIV3 } from 'openapi-types';

export abstract class Route {
	declare options: IRouteOptions;
	public get?(req: Request, res: Response): Promise<void>;
	public post?(req: Request, res: Response): Promise<void>;
	public delete?(req: Request, res: Response): Promise<void>;
	public app: Express;
	public constructor(app: Express) {
		this.app = app;
	}
}

// Decorator
export interface IRouteOptions {
	path: string;
	middleware?: RequestHandler[];
	spec: OpenAPIV3.PathItemObject | null;
}

export function RouteOptions(routeOptions: IRouteOptions) {
	return function <T extends { new (...args: any[]): {} }>(constructor: T) {
		return class extends constructor {
			options = routeOptions;
		};
	};
}

// Middleware
export const Middleware = {
	UrlEncoded: bodyParser.urlencoded({ extended: true }),
	Json: bodyParser.json()
};
