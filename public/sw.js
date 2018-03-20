'use strict';
importScripts('sw-toolbox.js');
toolbox.precache([
	"/",
	"index.html",
	"css/style.css",
	"css/media.css",
	"js/modelModule.js",
	"js/viewModule.js",
	"js/controlModule.js",
	"js/script.js",
	"js/handlebars-v4.0.11.js"]);
toolbox.router.get('/images/*', toolbox.cacheFirst);
toolbox.router.get('/*', toolbox.networkFirst, {networkTimeoutSeconds: 5});