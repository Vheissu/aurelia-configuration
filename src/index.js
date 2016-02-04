import ConfigureService from './configure-service';

export function configure(aurelia, configCallback) {
    let configure = aurelia.container.get(ConfigureService);

    // Do we have a callback function?
    if (configCallback !== undefined && typeof(configCallback) === 'function') {
        configCallback(instance);
    }

    return new Promise((resolve, reject) => {
        configure.loadConfig().then(data => {
            configure.setAll(data);
            resolve();
        });
    }).catch(() => {
        reject(new Error('Configuration file could not be loaded'));
    });
}

export {ConfigureService};
