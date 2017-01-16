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
	describe('failure', () => {
		let server;
  		beforeEach(function () {
    		server = initServer({sourcedir: fixtures_path});
  		});
  		afterEach(function () {
    		server.close();
  		});
		it('check files are processed (warning as error)', () => {
			return new Promise((resolve, reject) => {
				request(server)
				.get('/menu.xml')
				.expect(501)
				.end((error, res) => {
					error !== null ? reject(error) : resolve();
				});
			});
		});		
	});
	describe('transform', () => {
		let server;
  		beforeEach(function () {
    		server = initServer({
    			sourcedir: fixtures_path,
    			warning_as_error: false,
    			stringparams: {n: '42'}
    		});
  		});
  		afterEach(function () {
    		server.close();
  		});
		it('check files are processed (warning as warning)', () => {
			return new Promise((resolve, reject) => {
				request(server)
				.get('/menu.xml')
				.expect(200)
				.end((error, res) => {
					error !== null ? reject(error) : resolve();
				});
			});
		});
		it('check files are processed', () => {
			return new Promise((resolve, reject) => {
				request(server)
				.get('/page.xml')
				.expect(200)
				.end((error, res) => {
					error !== null ? reject(error) : resolve();
				});
			});
		});
		it('check stringparams', () => {
			return new Promise((resolve, reject) => {
				request(server)
				.get('/params.xml')
				.expect(200, 'n=42')
				.end((error, res) => {
					error !== null ? reject(error) : resolve();
				});
			});
		});
	});
});
