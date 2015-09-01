System.register(['aurelia-framework', 'aurelia-http-client', 'aurelia-event-aggregator'], function (_export) {
    'use strict';

    var inject, HttpClient, EventAggregator, Configuration;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_aureliaFramework) {
            inject = _aureliaFramework.inject;
        }, function (_aureliaHttpClient) {
            HttpClient = _aureliaHttpClient.HttpClient;
        }, function (_aureliaEventAggregator) {
            EventAggregator = _aureliaEventAggregator.EventAggregator;
        }],
        execute: function () {
            Configuration = (function () {
                function Configuration(http, ea) {
                    var _this = this;

                    _classCallCheck(this, _Configuration);

                    this.directory = 'config';
                    this.config = 'application.json';
                    this.obj = {};

                    this.http = http;
                    this.ea = ea;

                    this.loadConfig().then(function (data) {
                        return _this.obj = data;
                    });
                }

                Configuration.prototype.directory = function directory(path) {
                    this.directory = path;
                };

                Configuration.prototype.file = function file(name) {
                    this.config = name;
                };

                Configuration.prototype.get = function get(key) {
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

                Configuration.prototype.set = function set(key, val) {
                    if (key.indexOf('.') === -1) {
                        this.obj[key] = val;
                    } else {
                        var splitKey = key.split('.');
                        var _parent2 = splitKey[0];
                        var child = splitKey[1];

                        this.obj[_parent2][child] = val;
                    }
                };

                Configuration.prototype.getAll = function getAll() {
                    return this.obj;
                };

                Configuration.prototype.loadConfig = function loadConfig() {
                    var _this2 = this;

                    return new Promise(function (resolve, reject) {
                        _this2.http.get(_this2.directory + '/' + _this2.config).then(function (data) {
                            return resolve(data.response);
                        });
                    });
                };

                var _Configuration = Configuration;
                Configuration = inject(HttpClient, EventAggregator)(Configuration) || Configuration;
                return Configuration;
            })();

            _export('Configuration', Configuration);
        }
    };
});