import { configure } from '../../src/index';
import { Configuration } from '../../src/aurelia-configuration';

let AureliaStub = {
    container: {
        get: (key: string) => {
            return key;
        },
    },
};

(<any>window).callback = function(config: any) {
    return config;
};

describe('Index', () => {
    beforeEach(() => {
        // spyOn(window, 'callback').and.callThrough();
        spyOn(AureliaStub.container, 'get').and.returnValue(new Configuration());
    });

    it('expect callback to be called', () => {
        configure(AureliaStub as any, (<any>window).callback);

        // expect((<any>window).callback).toHaveBeenCalledWith(new Configuration);
        expect((<any>window).callback(new Configuration())).toEqual(new Configuration());
    });
});
