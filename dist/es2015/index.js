import { Configure } from './configure';

export function configure(aurelia, configCallback) {
    let instance = aurelia.container.get(Configure);
    let promise = null;

    if (configCallback !== undefined && typeof configCallback === 'function') {
        promise = Promise.resolve(configCallback(instance));
    }

    return promise.then(function () {
        return instance.loadConfig();
    }).catch(function () {
        reject(new Error('Configuration file could not be loaded'));
    });
}

export { Configure };