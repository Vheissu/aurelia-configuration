import {AureliaConfiguration} from '../../src/aurelia-configuration';

describe('Configuration class', () => {
    let configInstance: any;

    beforeEach(() => {
        configInstance = new AureliaConfiguration();

        spyOn(configInstance, 'check');
        spyOn(configInstance, 'setEnvironment').and.callThrough();
    });

    it('expect defaults to be set', () => {
        expect(configInstance.environment).toEqual('default');
        expect(configInstance.environments).toBeFalsy();
        expect(configInstance.directory).toEqual('config');
        expect(configInstance.config_file).toEqual('config.json');
        expect(configInstance.cascade_mode).toBeTruthy();
        expect(configInstance._config_object).toEqual({});
        expect(configInstance._config_merge_object).toEqual({});
    });

    it('set directory to non-default value', () => {
        configInstance.setDirectory('configuration-files');
        expect(configInstance.directory).toEqual('configuration-files');
    });

    it('set config file name to non-default value', () => {
        configInstance.setConfig('awesome-config-file.json');
        expect(configInstance.config_file).toEqual('awesome-config-file.json');
    });

    it('set environment to non-default value', () => {
        configInstance.setEnvironment('development');
        expect(configInstance.environment).toEqual('development');
    });

    it('set multiple environments', () => {
        let environments = {
            development: ['localhost', 'dev.local'],
            staging: ['staging.website.com', 'test.staging.website.com'],
            production: ['website.com']
        };
        configInstance.setEnvironments(environments);

        expect(configInstance.environments).toEqual(environments);
        expect(configInstance.check).toHaveBeenCalled();
    });

    it('set cascade mode enabled', () => {
        configInstance.setCascadeMode(true);
        expect(configInstance.cascade_mode).toBeTruthy();
    });

    it('set cascade mode disabled', () => {
        configInstance.setCascadeMode(false);
        expect(configInstance.cascade_mode).toBeFalsy();
    });

    it('return config object', () => {
        expect(configInstance.obj).toEqual({});
    });

    it('return config file', () => {
        expect(configInstance.config).toEqual('config.json');
    });

    it('is environment', () => {
        expect(configInstance.is('default')).toBeTruthy();
    });

    it('environment check function', () => {
        let environments = {
            development: ['localhost', 'dev.local'],
            staging: ['staging.website.com', 'test.staging.website.com'],
            production: ['website.com']
        };
        
        configInstance.setEnvironments(environments);

        configInstance.check();

        //expect(configInstance.setEnvironment).toHaveBeenCalled();
    });
});
