import express from 'express';
import { promises as fs } from 'fs';
import { join } from 'path';
import type { Route } from './route';
import type { OpenAPIV3 } from 'openapi-types';
import { Sequelize } from 'sequelize';
import { database as dbOptions } from './config'
import { User } from './models/User';

const spec: OpenAPIV3.Document = {
	openapi: '3.0.0',
	info: {
		title: 'Epico',
		description: 'A chat platform',
		license: {
			name: 'OSL-3.0',
			url: 'https://opensource.org/licenses/OSL-3.0'
		},
		version: '1.0.0'
	},
	components: {
		securitySchemes: {
			Bearer: {
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT'
			}
		}
	},
	paths: {}
};

(async () => {
	const sequelize = new Sequelize({
		database: 'epico',
		dialect: 'postgres',
		host: dbOptions.host,
		password: dbOptions.password,
		username: dbOptions.username,
		port: dbOptions.port,
		logging: false
	});
	await sequelize.authenticate();
	User.initModel(sequelize);
	await sequelize.sync({ alter: true });
	const app = express();
	const routes: string[] = await fs.readdir(join(__dirname, 'routes'));
	for (const route of routes) {
		const routeClass: {
			default: typeof Route;
		} = await import(`./routes/${route.replace(/\.js/g, '')}`);
		const instance = new (routeClass.default.prototype.constructor.bind.apply(
			routeClass.default.prototype.constructor,
			[null]
		))(app) as Route;
		if (typeof instance.get == 'function')
			app.get(
				instance.options.path,
				...(instance.options.middleware ?? []),
				instance.get
			);

		if (typeof instance.post == 'function')
			app.post(
				instance.options.path,
				...(instance.options.middleware ?? []),
				instance.post
			);

		if (typeof instance.delete == 'function')
			app.delete(
				instance.options.path,
				...(instance.options.middleware ?? []),
				instance.delete
			);
		if (instance.options.spec)
			spec.paths[instance.options.path] = instance.options.spec;
	}
	app.get('/openapi.json', (req, res) => res.send(JSON.stringify(spec)));
	app.listen(3000, () => console.log('Listening on port 3000'));
})();
