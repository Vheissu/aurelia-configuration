import {inject} from 'aurelia-dependency-injection';
import {HttpClient} from 'aurelia-http-client';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(HttpClient, EventAggregator)
export class Configure {
    // Location of configuration file(s)
    directory = 'config';

    // Configuration file name
    config = 'application.json';

    // Configuration store object
    obj = {};

    constructor(http, ea) {
        // Injected dependencies
        this.http = http;
        this.ea = ea;

        // Load the config file and then populate obj with the response
        this.loadConfig()
          .then(data => this.obj = data);
    }

    directory(path) {
        this.directory = path;
    }

    file(name) {
        this.config = name;
    }

    get(key) {
        if (key.indexOf('.') === -1) {
            return this.obj[key] ? this.obj[key] : false;
        } else {
            let splitKey = key.split('.');
            let parent = splitKey[0];
            let child = splitKey[1];

            if (this.obj[parent]) {
                return this.obj[parent][child] ? this.obj[parent][child] : false;
            }

            return false;
        }
    }

    set(key, val) {
        if (key.indexOf('.') === -1) {
            this.obj[key] = val;
        } else {
            let splitKey = key.split('.');
            let parent = splitKey[0];
            let child = splitKey[1];

            this.obj[parent][child] = val;
        }
    }

    getAll() {
        return this.obj;
    }

    loadConfig() {
        return new Promise((resolve, reject) => {
            this.http
              .get(`${this.directory}/${this.config}`)
              .then(data => resolve(data.response));
        });
    }
}
