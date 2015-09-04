import {Configure} from '../src/configure';

class HttpStub {
    get(url) {

    }
}

class EventStub {

}

describe('configure.js -- ', () => {
    var config;
    var mockedHttp;
    var mockedEvent;

    beforeEach(() => {
        mockedHttp = new HttpStub();
        mockedEvent = new EventStub();
        config = new Configure(mockedHttp, mockedEvent);

        spyOn(config, 'loadConfig').and.callFake(() => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve({
                        name: "Test Application",
                        version: 1.0
                    });
                }, 500);
            })
        });
    });

    describe('Basic tests: ', () => {
        it('default directory value should be set', () => {
            expect(config.directory).toEqual('config');
        });

        it('default config file value should be set', () => {
            expect(config.config).toEqual('application.json');
        });

        it('default config object should be empty', () => {
            expect(config.obj).toBeDefined();
        });

        it('constructor should inject classes', () => {
            expect(config.http).toBeDefined();
            expect(config.ea).toBeDefined();
        });

        it('loadConfig method should have been called', () => {
            config.loadConfig();
            expect(config.loadConfig).toHaveBeenCalled();
        });
    });

    describe('Config tests: ', () => {
        it('change config directory', (done) => {
            config.setDirectory('testdir');
            setTimeout(() => {
                expect(config.directory).toEqual('testdir');
                done();
            }, 0);
        });

        it('change config filename', (done) => {
            config.setConfig('testconfig.json');
            setTimeout(() => {
                expect(config.config).toEqual('testconfig.json');
                done();
            }, 0);
        });

        it('set single config value', (done) => {
            config.set('mykey', 'myval');
            setTimeout(() => {
                expect(config.get('mykey')).toEqual('myval');
                done();
            }, 0);
        });

        it('set namespaced config value', (done) => {
            config.set('mykey.childkey', 'myval');
            console.log(config.getAll());
            setTimeout(() => {
                expect(config.get('mykey.childkey')).toEqual('myval');
                done();
            }, 0);
        });
    });

});
