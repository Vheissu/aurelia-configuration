import { AureliaConfiguration } from './aurelia-configuration';
export function configure(aurelia, configCallback) {
    var instance = aurelia.container.get(AureliaConfiguration);
    var promise = null;
    // Do we have a callback function?
    if (configCallback !== undefined && typeof (configCallback) === 'function') {
        promise = Promise.resolve(configCallback(instance));
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
export { AureliaConfiguration };
