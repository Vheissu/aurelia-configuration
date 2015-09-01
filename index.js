import {Configure} from './configure';

export function configure(aurelia) {
    let instance = aurelia.container.get(Configure);
    aurelia.container.registerInstance(Configure, instance);
}
