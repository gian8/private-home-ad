const hapi = require('hapi');
const pup = require('./scraping.js');
const Vision = require('vision')
const Handlebars = require('handlebars')
const server = hapi.server({
	port: process.env.PORT || 4000
});

async function liftOff () {
	await server.register({
		plugin: require('vision')  // add template rendering support in hapi
	})

	// configure template support
	server.views({
		engines: {
			html: Handlebars
		},
		path: __dirname + '/views'
	})
}


const init = async () => {
	await liftOff();
	server.route([
		{
			method: 'GET',
			path: '/',
			handler: (req, reply) => {
				return reply.view('index');
			}
		},
		{
			method: 'GET',
			path: '/search',
			handler: async (req, reply) => {
				const imUrl = req.query.imUrl;
				var dataArray = await pup.scrap(imUrl);
				var dataObj = {
					data: dataArray
				};
				return reply.view('result', dataObj);
			}
		}
	]);

	await server.start();
	console.log('Server running at: ' + server.info.uri);
};

init();