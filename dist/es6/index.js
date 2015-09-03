import {Configure} from './configure';

export function configure(aurelia, configCallback) {
    var instance = aurelia.container.get(Configure);

    return new Promise((resolve, reject) => {
        instance.loadConfig().then(data => {
            instance.setAll(data);
            resolve();
        });
    }).catch(() => {
        reject(new Error('Configuration file could not be loaded'));
    });
}

export {Configure};
