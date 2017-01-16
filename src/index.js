const afs = require('async-file');
const path = require('path');
const xsltproc = require('node-xsltproc');

function express_xsltproc(options = {}) {
	options.sourcedir = options.sourcedir || '.';
	return async (req, res, next) => {
		if (req.method !== 'GET') {
			return next();
		}
		let filepath = path.normalize(path.join(options.sourcedir, req.path));
		if (!filepath.endsWith('.xml')) {
			return next();
		}
		if ((await afs.readFile(filepath)).indexOf('<?xml-stylesheet ') === -1) {
			return next();
		}
		return xsltproc(options).transform(filepath, options)
		.then((data) => { // if ok
			if (options.warning_as_error && data.metadata.message !== '') { // if warning, still fail as if it was an error
				return res.status(501).send(data.metadata.message);
			}
			return res.send(data.result); // return transformation output
		})
		.catch((error) => { // if error
			return res.status(500).send(error.message);
		});
	}
};

module.exports = express_xsltproc;
