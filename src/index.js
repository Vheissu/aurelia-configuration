import {Configure} from './configure';

export function configure(aurelia, configCallback) {
    var instance = aurelia.container.get(Configure);

    // Do we have a callback function?
    if (configCallback !== undefined && typeof(configCallback) === 'function') {
        configCallback(instance);
    }

    return new Promise((resolve, reject) => {
        instance.loadConfig().then(data => {
            instance.setAll(data);

            // Gets the current pathName to determine dynamic environments (if defined)
            instance.check();
            resolve();
        });
    }).catch(() => {
        reject(new Error('Configuration file could not be loaded'));
    });
}

export {Configure};
