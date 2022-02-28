#!/usr/bin/env node

'use strict';

const express = require('express');
const tinylr = require('tiny-lr')();
const watch = require('node-watch');
const getPort = require('get-port');

function notifyLiveReload(event, filename) {
    var fileName = require('path').relative(__dirname, filename);

    tinylr.changed({
        body: {
            files: [fileName]
        }
    });
}

const dir = process.argv[2] || '_site';
const lrPort = 35729;

tinylr.listen(lrPort);
watch(dir, { recursive: true }, notifyLiveReload);

const app = express();

app.use(express.static(dir, {
    extensions: ['html']
}));

(async () => {
    const port = await getPort({ port: [3000, 3001, 3002, 3003, 3004, 3005] });

    app.use(require('connect-livereload')({ port: lrPort }));
    app.listen(port, '0.0.0.0');

    console.log('site available on port http://localhost:' + port);
})();
