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

        spyOn(config, 'loadConfig');

        config.loadConfig();
    });

    describe('Basic tests: ', () => {
        it('default directory value should be set', (done) => {
            expect(config.directory).toEqual('config');
            done();
        });

        it('default config file value should be set', (done) => {
            expect(config.config).toEqual('application.json');
            done();
        });

        it('default config object should be empty', (done) => {
            expect(config.obj).toBeDefined();
            done();
        });

        it('constructor should inject classes', (done) => {
            expect(config.http).toBeDefined();
            expect(config.ea).toBeDefined();
            done();
        });

        it('loadConfig method should have been called', (done) => {
            expect(config.loadConfig).toHaveBeenCalled();
            done();
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
