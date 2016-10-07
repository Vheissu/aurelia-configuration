import {Configure} from './configure';

export function configure(aurelia, configCallback) {
    let instance = aurelia.container.get(Configure);
    let promise = null;

    // Do we have a callback function?
    if (configCallback !== undefined && typeof(configCallback) === 'function') {
        promise = configCallback(instance);
    }

    // If there was no configCallback, or it didn't return a promise, create a resolved promise.
    if (promise == null) {
        promise = Promise.resolve();
    }

    // Don't load the config until the configCallback has completed.
    return promise
        .then(() => {
            return instance.loadConfig();
        })
        .catch(() => {
            throw new Error('Configuration file could not be loaded.');
        });
}

export {Configure};
