import {Configure} from '../src/configure';

class HttpStub {
    get(url) {

    }
}

class EventStub {

}

describe('the main configure.js singleton', () => {
    var config;
    var mockedHttp;
    var mockedEvent;

    beforeEach(() => {
        mockedHttp = new HttpStub();
        mockedEvent = new EventStub();
        config = new Configure(mockedHttp, mockedEvent);

        spyOn(config, 'loadConfig');
    });

    describe('Basic tests', () => {
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

        it('loadConfig method should have been called', (done) => {
            expect(config.loadConfig).toHaveBeenCalled();
            done();
        });
    });
});
