import type { Request, Response } from 'express';
import { User } from '../models/User';
import { Middleware, Route, RouteOptions } from '../route';
import bcrypt from 'bcrypt';

@RouteOptions({
	path: '/auth/register',
	middleware: [Middleware.Json],
	spec: {
		description: 'Registers a user',
		post: {
			requestBody: {
				description: 'The body of the registration request',
				required: true,
				content: {
					"application/json": {
						schema: {
							type: 'object',
							properties: {
								username: {
									type: 'string',
									description: 'The username of the user to authenticate as'
								},
								password: {
									type: 'string',
									description: 'The password of the user to authenticate as'
								}
							},
							required: ['username', 'password'],
							description: 'The username and password of the user to authenticate as'
						},
						example: {
							username: 'tyman',
							password: 'password'
						}
					}
				}
			},
			responses: {
				'200': {
					description: 'Successfully registered the user.',
					content: {
						"application/json": {
							schema: {
								description: 'The success response.',
								type: 'object',
								properties: {
									success: {
										type: 'boolean',
										description: 'Whether the registration was successful.'
									}
								}
							}
						}
					}
				},
				'400': {
					description: 'Part of the request was invalid.',
					content: {
						"application/json": {
							schema: {
								description: 'The error response.',
								type: 'object',
								properties: {
									success: {
										type: 'boolean',
										description: 'Whether the registration was successful.'
									},
									error: {
										type: 'string',
										description: 'The error message.'
									}
								}
							}
						}
					}
				}
			}
		}
	}
})
export default class Register extends Route {
	public override async post(req: Request, res: Response) {
		const { username, password }: {
			username: string;
			password: string;
		} = req.body;
		const userModel = await User.count({
			where: {
				username
			}
		})
		if (userModel > 0) {
			res.status(400).json({
				success: false,
				message: 'Username already registered.'
			});
			return;
		}
		const hash = await bcrypt.hash(password, 15);
		await User.create({
			username: username,
			password: hash
		})
		res.status(200).json({
			success: true
		});
	}
}
