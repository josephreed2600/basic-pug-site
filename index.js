package = require('./package.json');
const logger = require('logger').get('main');

logger.info(`Starting ${package.name} v${package.version}`);

logger.info(`Loading dependencies...`);
const uuid = require('uuid');
const express = require('express');
const app = express();
const path = require('path');
const access_logger = require('logger').get('access');
app.locals.pretty = true; // pretty print html: https://stackoverflow.com/a/11812841/6627273
app.all(/.*/, (q,s,n) => {
	access_logger.debug(`${q.ip} ${q.method} ${q.originalUrl}`)
	n();
	access_logger.info(`${s.statusCode} ${q.ip} ${q.method} ${q.originalUrl}`);
});
app.set('trust proxy', 1);
app.set('view engine', 'pug');
app.set('views', ['views'].map(n => path.join(__dirname,'/'+n))); // add more view (sub?)directories to array if desired
app.locals.basedir = path.join(__dirname, 'views');
logger.info(`Loaded dependencies.`);

logger.info(`Configuring routes...`);
app.use('/static', express.static(path.join(__dirname + '/public')));
app.use('/doc', express.static(path.join(__dirname + '/files')));
app.get(/.*/, (q,s) => {
	view_name = q.path.match('^/(?<view_name>.*)$').groups.view_name || 'index' // strip leading slash, default to 'index'
	s.render(view_name);
});
app.use(/.*/, (e,q,s,n) => {
	let customErr;
	switch (true) {
		case !!e.message.match('Failed to lookup view'):
			s.status(404); break;
		default:
			logger.error(e.stack);
			s.status(500);
	}
	app.render('error', {status: s.statusCode, customErr}, (e,h) => {
		if (e) logger.error(e);
		if (h) s.send(h);
		else {
			let error_id = uuid.v4();
			logger.debug(error_id);
			let old_status = s.statusCode;
			s.status(500);
			s.send(`A ${old_status} error was thrown, but another error was encountered while trying to render it. Please report this number to the site administrator: ${error_id}`);
		}
	});
});
logger.info(`Configured routes.`);

logger.info(`Starting server...`);
app.listen(8080); // FIXME config port number
logger.info(`Started server.`);
