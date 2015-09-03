'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaHttpClient = require('aurelia-http-client');

var _aureliaEventAggregator = require('aurelia-event-aggregator');

var Configure = (function () {
    function Configure(http, ea) {
        var _this = this;

        _classCallCheck(this, _Configure);

        this.directory = 'config';
        this.config = 'application.json';
        this.obj = {};

        this.http = http;
        this.ea = ea;

        this.loadConfig().then(function (data) {
            return _this.obj = data;
        });
    }

    Configure.prototype.setDirectory = function setDirectory(path) {
        this.directory = path;
    };

    Configure.prototype.setConfig = function setConfig(name) {
        this.config = name;
    };

    Configure.prototype.get = function get(key) {
        if (key.indexOf('.') === -1) {
            return this.obj[key] ? this.obj[key] : false;
        } else {
            var splitKey = key.split('.');
            var _parent = splitKey[0];
            var child = splitKey[1];

            if (this.obj[_parent]) {
                return this.obj[_parent][child] ? this.obj[_parent][child] : false;
            }

            return false;
        }
    };

    Configure.prototype.set = function set(key, val) {
        if (key.indexOf('.') === -1) {
            this.obj[key] = val;
        } else {
            var splitKey = key.split('.');
            var _parent2 = splitKey[0];
            var child = splitKey[1];

            this.obj[_parent2][child] = val;
        }
    };

    Configure.prototype.getAll = function getAll() {
        return this.obj;
    };

    Configure.prototype.loadConfig = function loadConfig() {
        var _this2 = this;

        return new Promise(function (resolve, reject) {
            _this2.http.get(_this2.directory + '/' + _this2.config).then(function (data) {
                return resolve(data.response);
            });
        });
    };

    var _Configure = Configure;
    Configure = _aureliaDependencyInjection.inject(_aureliaHttpClient.HttpClient, _aureliaEventAggregator.EventAggregator)(Configure) || Configure;
    return Configure;
})();

exports.Configure = Configure;