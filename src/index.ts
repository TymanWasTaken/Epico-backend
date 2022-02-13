import express from 'express';
import { promises as fs } from 'fs';
import { join } from 'path';
import type { Route } from './route';

(async () => {
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
		if (typeof instance.get == 'function') app.get(instance.path, ...(instance.middleware ?? []), instance.get);
		if (typeof instance.post == 'function')
			app.post(instance.path, ...(instance.middleware ?? []), instance.post);
		if (typeof instance.delete == 'function')
			app.delete(instance.path, ...(instance.middleware ?? []), instance.delete);
	}
    app.listen(3000, () => console.log('Listening on port 3000'));
})();
