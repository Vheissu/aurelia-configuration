import { AureliaConfiguration } from '../../src/aurelia-configuration';
import { WindowInfo } from '../../src/window-info';

describe('Configuration class', () => {
    let configInstance: any;

    beforeEach(() => {
        configInstance = new AureliaConfiguration();
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
        spyOn(configInstance, 'check');
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

    it('works with the same url but different port (using Karma port)', () => {
        let environments = {
            dev1: ['localhost'],
            dev2: ['localhost:9876'],
        };
        
        configInstance.setAll({
            'test': 'fallback',
            'dev1': {
                'test': 'dev1'
            },
            'dev2': {
                'test': 'dev2'
            }
        });
        
        configInstance.setEnvironments(environments);
        
        configInstance.check();
        const test = configInstance.get('test');
        expect(test).toEqual('dev2');
    });
    
    it('works with the different url but same ports', () => {
        let environments = {
            local: ['localhost:9000'],
            qa: ['www.qa.com:9000'],
            prod: ['www.prod.com:9000'],
        };
        
        configInstance.setAll({
            'test': 'fallback',
            'local': {
                'test': 'local'
            },
            'qa': {
                'test': 'qa'
            },
            'prod': {
                'test': 'prod'
            }
        });
        
        configInstance.setEnvironments(environments);
        // Test to see if our local dev config works
        let window = new WindowInfo();
        window.hostName = 'localhost';
        window.pathName = '/';
        window.port = '9000';
        configInstance.setWindow(window);
        configInstance.check();
        const testLocal = configInstance.get('test');
        expect(testLocal).toEqual('local');
        
        // Test to see if our qa config works
        window.hostName = 'www.qa.com';
        configInstance.setWindow(window);
        configInstance.check();
        const testQa = configInstance.get('test');
        expect(testQa).toEqual('qa');

        // Test to see if our prod config works
        window.hostName = 'www.prod.com';
        configInstance.setWindow(window);
        configInstance.check();
        const testProd = configInstance.get('test');
        expect(testProd).toEqual('prod');
    });

    it('works with a base path', () => {
        let environments = {
            local: ['localhost'],
            qa: ['www.qa.com'],
            qaMaster: ['www.qa.com/master'],
            qaFeature1: ['www.qa.com/feature1'],
            qaFeature1SubFeature1: ['www.qa.com/feature1/subfeature1'],
            qaFeature1SubFeature2: ['www.qa.com/feature1/subfeature2'],
        };
        
        configInstance.setAll({
            'test': 'fallback',
            'local': {
                'test': 'local'
            },
            'qa': {
                'test': 'qa'
            },
            'qaMaster': {
                'test': 'qaMaster'
            },
            'qaFeature1': {
                'test': 'qaFeature1'
            },
            'qaFeature1SubFeature1': {
                'test': 'qaFeature1SubFeature1'
            },
            'qaFeature1SubFeature2': {
                'test': 'qaFeature1SubFeature2'
            }
        });
        
        configInstance.setEnvironments(environments);
        // Test to see if we don't set basePathMode=true that everything works as expected
        let window = new WindowInfo();
        window.hostName = 'localhost';
        window.pathName = '/';
        window.port = '';
        configInstance.setWindow(window);
        configInstance.check();
        let testNonBasePathMode = configInstance.get('test');
        expect(testNonBasePathMode).toEqual('local');
        
        window.hostName = 'www.qa.com';
        window.pathName = '/master';
        window.port = '';
        configInstance.setWindow(window);
        configInstance.check();
        testNonBasePathMode = configInstance.get('test');
        expect(testNonBasePathMode).toEqual('qa');

        // Test to see if our qa config works with a base path for application
        configInstance.setBasePathMode(true);
        configInstance.check();
        let testQa = configInstance.get('test');
        expect(testQa).toEqual('qaMaster');

        window.pathName = '/feature1';
        configInstance.setWindow(window);
        configInstance.check();
        testQa = configInstance.get('test');
        expect(testQa).toEqual('qaFeature1');

        window.pathName = '/feature1/subfeature1';
        configInstance.setWindow(window);
        configInstance.check();
        testQa = configInstance.get('test');
        expect(testQa).toEqual('qaFeature1SubFeature1');

        window.pathName = '/feature1/subfeature2';
        configInstance.setWindow(window);
        configInstance.check();
        testQa = configInstance.get('test');
        expect(testQa).toEqual('qaFeature1SubFeature2');
    });

    it('should get nested values from dicts', () => {
        let nestedDict = {
            'level1': 'level1',
            'nested1': {
                'nested12': 'nested12',
                'nested2': {
                    'nested21': 'nested21'
                }
            }
        };
        configInstance.setAll(nestedDict);

        expect(configInstance.getDictValue(nestedDict, 'level1')).toEqual('level1');
        expect(configInstance.getDictValue(nestedDict, 'nested1.nested12')).toEqual('nested12');
        expect(configInstance.getDictValue(nestedDict, 'nested1.nested2.nested21')).toEqual('nested21');

        expect(
            configInstance.getDictValue(nestedDict['nested1'], 'nested2.nested21'),
        ).toEqual('nested21');

        expect(
            configInstance.getDictValue(nestedDict['nested1']['nested2'], 'nested21'),
        ).toEqual('nested21');

        expect(
            function () { configInstance.getDictValue(nestedDict, 'nonExisting') }
        ).toThrow();
    });

    it('should get nested values from configs', () => {
        let nestedDict = {
            'level1': 'level1',
            'nested1': {
                'nested12': 'nested12',
                'nested2': {
                    'nested21': 'nested21'
                }
            }
        };
        configInstance.setAll(nestedDict);

        expect(configInstance.get('level1')).toEqual('level1');
        expect(configInstance.get('nested1.nested12')).toEqual('nested12');
        expect(configInstance.get('nested1.nested2.nested21')).toEqual('nested21');
        expect(
            configInstance.get('nested1.nested2')
        ).toEqual({'nested21': 'nested21'});
        expect(
            configInstance.get('nested1.nested2.nested21')
        ).toEqual('nested21');
        expect(
            function () { configInstance.getDictValue(nestedDict, 'nonExisting') }
        ).toThrow();
    });

    it('should prefer environment values from configs', () => {
        let nestedDict = {
            'level1': 'level1',
            'nested1': {
                'nested12': 'nested12',
                'nested2': {
                    'nested21': 'nested21'
                },
                'nested13': 'nested13'
            },
            'dev2': {
                'level1': 'level1e',
                'nested1': {
                    'nested12': 'nested12e',
                    'nested2': {
                        'nested21': 'nested21e'
                    }
                }
            }
        };
        configInstance.setAll(nestedDict);
        configInstance.setEnvironment('dev2');

        expect(configInstance.get('level1')).toEqual('level1e');
        expect(configInstance.get('nested1.nested12')).toEqual('nested12e');
        expect(configInstance.get('nested1.nested2.nested21')).toEqual('nested21e');
        expect(
            configInstance.get('nested1.nested2')
        ).toEqual({'nested21': 'nested21e'});
        expect(
            configInstance.get('nested1.nested2.nested21')
        ).toEqual('nested21e');
        expect(
            configInstance.get('nested1.nested13')
        ).toEqual('nested13');
        expect(configInstance.get('nonExisting', 'default')).toEqual('default');
        expect(
            function () { configInstance.getDictValue(nestedDict, 'nonExisting') }
        ).toThrow();
    });
});
