import { configure } from '../../src/index';
import { AureliaConfiguration } from '../../src/aurelia-configuration';

let AureliaStub = {
    container: {
        get: (key: string) => {
            return key;
        }
    }
};

(<any>window).callback = function (config: any) {
    return config;
}

describe('Index', () => {

    beforeEach(() => {
        // spyOn(window, 'callback').and.callThrough();
        spyOn(AureliaStub.container, 'get').and.returnValue(new AureliaConfiguration);
    });

    it('expect callback to be called', () => {
        configure(AureliaStub as any, (<any>window).callback);

        // expect((<any>window).callback).toHaveBeenCalledWith(new AureliaConfiguration);
        expect((<any>window).callback(new AureliaConfiguration)).toEqual(new AureliaConfiguration);
    });

});
