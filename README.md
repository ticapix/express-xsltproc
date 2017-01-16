
# express-xsltproc

[![Build Status](https://travis-ci.org/ticapix/express-xsltproc.svg?branch=master)](https://travis-ci.org/ticapix/express-xsltproc)

## Getting started

**THIS PACKAGE USES AWAIT/ASYNC AND REQUIRES NODE 7.x**

Install the module with: `npm install express-xsltproc --save`

There is an external dependency on xsltproc required by [`node-xsltproc`](https://github.com/ticapix/node-xsltproc). Check its [documentation](https://github.com/ticapix/node-xsltproc#getting-started).

### Options

- `sourcedir` : root folder where to serve file from (default: '.')
- `warning_as_error` : treat xsltproc warning as error (default: true)
- additional options are passed as it is to `node-xsltproc`

### Notes

- This middleware only answers to the `GET` method.
- The path must end by `*.xml`.
- The file must have a `<?xml-stylesheet type="text/xsl" href="XXX.xsl"?>` tag

### Exemples

```javascript
const express = require('express');
const xsltproc = require('express-xsltproc');

let app = express();
app.use(xsltproc({sourcedir: 'test/fixtures'}));
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
```
