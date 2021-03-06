import type { Request, Response } from 'express';
import { Auth } from '../auth';
import { User } from '../models/User';
import { Middleware, Route, RouteOptions } from '../route';
import bcrypt from 'bcrypt';

@RouteOptions({
	path: '/auth/login',
	middleware: [Middleware.Json],
	spec: {
		description: 'Manages user authentication',
		post: {
			requestBody: {
				description: 'The body of the authentication request',
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
					description: 'Successfully logs in and returns the JWT token.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								description: 'The successful login response.',
								properties: {
									token: {
										type: 'string',
										description: 'The signed JWT token.'
									},
									success: {
										type: 'boolean',
										description: 'Whether the login was successful.'
									}
								}
							}
						}
					}
				},
				'401': {
					description: 'Not authorized.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								description: 'The failed login response.',
								properties: {
									error: {
										type: 'string',
										description: 'The error message.'
									},
									success: {
										type: 'boolean',
										description: 'Whether the login was successful.'
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
export default class Login extends Route {
	public override async post(req: Request, res: Response) {
		const { username, password }: {
			username: string;
			password: string;
		} = req.body;
		const user = await User.findOne({
			where: {
				username
			}
		})
		if (!(user && await bcrypt.compare(password, user.password))) {
			res.status(401).json({
				success: false,
				message: 'Invalid username or password.'
			});
			return
		}
		const token = await Auth.createToken(req.body.username);
		res.send({
			success: true,
			token: token
		});
	}
}
