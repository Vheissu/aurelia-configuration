import {FrameworkConfiguration} from 'aurelia-framework';
import {AureliaConfiguration} from './aurelia-configuration';

export function configure(aurelia: FrameworkConfiguration, configCallback?: (config: AureliaConfiguration) => Promise<any>) {
    let instance = aurelia.container.get(AureliaConfiguration) as AureliaConfiguration;
    let promise: Promise<any> | null = null;

    // Do we have a callback function?
    if (configCallback !== undefined && typeof(configCallback) === 'function') {
        promise = Promise.resolve(configCallback(instance));
    } else {
        promise = Promise.resolve();
    }

    // Don't load the config until the configCallback has completed.
    return promise
        .then(function () {
            return instance.loadConfig();
        })
        .catch(function () {
            throw new Error('Configuration file could not be loaded');
        });
}

export {AureliaConfiguration};
