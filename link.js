/**
 * @license RequireJS link 0.1.0 Copyright (c) 2014-2014, Gabriel Reitz Giannattasio All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/gartz/requirejs-import for details
 */
/*jslint regexp: true */
/*global define: false */

define(function () {
    'use strict';

    var root = (function(){
        return typeof window === 'object' ? window : global;
    }());

    function setupLink(link, ext) {
        switch (ext) {
            case 'css':
                link.rel = 'stylesheet';
                link.type = 'text/css';
                break;
            case 'html':
                link.rel = 'import';
                break;
        }
        return link;
    }

    function getExtension(filename) {
        var ext = filename.split('/').pop();
        return ext.indexOf('.') < 1 ? '' : ext.split('.').pop();
    }

    var importPlugin = {
        load: function (name, req, load, config) {

            // TODO: Use Vulcanize to merge imported files in one
            // Ref: https://github.com/Polymer/vulcanize
            // TODO: Use style and get the inside style import
            if (config.isBuild) {
                load();
                return;
            }

            if (!document.head) {
                throw new Error('DOM must be loaded before HTMLImports');
            }

            var link = document.createElement('link');

            link = setupLink(link, getExtension(name));

            var path = '';

            var conf = config.link || {};

            // Ignore requirejs baseUrl
            if (!conf.ignoreBaseUrl) {
                path = root.location.pathname + config.baseUrl;
            }

            var url = path + name,
                urlArgs = config.urlArgs && (typeof config.urlArgs === 'function'
                    ? config.urlArgs(name, url)
                    : (url.indexOf('?') === -1 ? '?' : '&') + urlArgs);

            link.href = url + urlArgs;

            link.addEventListener('load', function () {
                load(link);
            });

            link.addEventListener('error', function () {
                throw new Error('Unable to load link resource using requirejs-link plugin');
            });

            document.head.appendChild(link);
        }
    };

    return importPlugin;
});
