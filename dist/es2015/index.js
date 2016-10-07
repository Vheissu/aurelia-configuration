import { Configure } from './configure';
export function configure(aurelia, configCallback) {
    let instance = aurelia.container.get(Configure);
    let promise = null;
    if (configCallback !== undefined && typeof (configCallback) === 'function') {
        promise = configCallback(instance);
    }
    if (promise == null) {
        promise = Promise.resolve();
    }
    return promise
        .then(() => {
        return instance.loadConfig();
    })
        .catch(() => {
        throw new Error('Configuration file could not be loaded.');
    });
}
export { Configure };
//# sourceMappingURL=index.js.map