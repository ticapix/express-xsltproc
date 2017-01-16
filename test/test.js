const assert = require('assert');
const path = require('path');
const xsltproc = require(path.join('..', 'src'));
const http = require('http');
const express = require('express');
const request = require('supertest');

const fixtures_path = path.join(__dirname, 'fixtures');


function initServer(options) {
	let app = express();
	let server = http.createServer(app).listen();
	let port = server.address().port;
	app.set('port', port);
	app.use(xsltproc(options));
	return server;
}

describe('express-xsltproc', function() {
	describe('transform', () => {
		let server;
  		beforeEach(function () {
    		server = initServer({sourcedir: fixtures_path, debug: true});
  		});
  		afterEach(function () {
    		server.close();
  		});
		it('check files are processed (warning as warning)', () => {
			return new Promise((resolve, reject) => {
				request(server)
				.get('/page.xml')
				.expect(200)
				.end((error, res) => {
					if (error !== null) {
						return reject(error);
					}
					resolve();
				});
			});
		});
		// it('check files are processed (warning as error)', () => {
		// 	return new Promise((resolve, reject) => {
		// 		gulp.src(path.join(fixtures_path, '**', 'menu.xml'))
		// 		.pipe(xsltproc().on('error', (error) => {
		// 			assert.notEqual(error.message.indexOf('warning: failed to load external entity'), -1);
		// 			assert.notEqual(error.message.indexOf('fakefile.dtd'), -1);
		// 			resolve();
		// 		}));
		// 	});
		// });
		// it('do not generate metadata', () => {
		// 	let output = [];
		// 	return new Promise((resolve, reject) => {
		// 		gulp.src(path.join(fixtures_path, 'page.xml'))
		// 		.pipe(xsltproc({metadata: false}))
		// 		.pipe(map((file, done) => {
		// 			output.push(path.relative(fixtures_path, file.path));
		// 			done(null, file);
		// 		}))
		// 		.on('end', () => {
		// 			assert.deepEqual(output, ['page.xml']);
		// 			resolve();
		// 		});
		// 	});
		// });
		// it('check stringparams', () => {
		// 	return new Promise((resolve, reject) => {
		// 		gulp.src(path.join(fixtures_path, 'params.xml'))
		// 		.pipe(xsltproc({metadata: false, stringparams: {n: '42'}}))
		// 		.pipe(map((file, done) => {
		// 			assert.equal(file.contents, 'n=42');
		// 			resolve();
		// 		}));
		// 	});
		// });
	});
});
