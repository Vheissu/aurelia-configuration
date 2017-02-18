import { AureliaConfiguration } from './aurelia-configuration';
export function configure(aurelia, configCallback) {
    var instance = aurelia.container.get(AureliaConfiguration);
    var promise = null;
    if (configCallback !== undefined && typeof (configCallback) === 'function') {
        promise = Promise.resolve(configCallback(instance));
    }
    else {
        promise = Promise.resolve();
    }
    return promise
        .then(function () {
        return instance.loadConfig();
    });
}
export { AureliaConfiguration };
//# sourceMappingURL=index.js.map