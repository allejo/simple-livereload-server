#!/usr/bin/env node

'use strict';

const express = require('express');
const tinylr = require('tiny-lr')();
const watch = require('node-watch');

function notifyLiveReload(event, filename) {
    var fileName = require('path').relative(__dirname, filename);

    tinylr.changed({
        body: {
            files: [fileName]
        }
    });
}

const dir = process.argv[2] || '_site';

tinylr.listen(35729);
watch(dir, { recursive: true }, notifyLiveReload);

var app = express();

app.use(require('connect-livereload')({ port: 35729 }));
app.use(express.static(dir, {
    extensions: ['html']
}));
app.listen(3000, '0.0.0.0');

console.log('site available on port 3000');
