"use strict";
/* tslint:disable:no-unused-variable */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var hxlproxy_service_1 = require("./hxlproxy.service");
var http_1 = require("@angular/common/http");
var testing_2 = require("@angular/common/http/testing");
describe('Service: Hxlproxy', function () {
    var service;
    var mockbackend;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                http_1.HttpClientModule,
                testing_2.HttpClientTestingModule
            ],
            providers: [
                hxlproxy_service_1.HxlproxyService
                // BaseRequestOptions,
                // MockBackend,
                // Logger,
                // {
                //   provide: Http,
                //   deps: [MockBackend, BaseRequestOptions],
                //   useFactory: (backend, options) => {
                //     return new Http(backend, options);
                //   }
                // }
            ]
        });
    });
    beforeEach(testing_1.inject([hxlproxy_service_1.HxlproxyService, testing_2.HttpTestingController], function (_service, _backend) {
        service = _service;
        mockbackend = _backend;
    }));
    it('should ...', function () {
        expect(service).toBeTruthy();
    });
    it('should ... throw error when meta rows missing', function () {
        var response = [];
        mockbackend.expectOne((function (req) { return true; }));
        var proxy = service;
        var errorThrown = false;
        try {
            proxy.fetchMetaRows('test.csv').subscribe(function (row) {
                expect(function () { }).not.toHaveBeenCalled();
            });
        }
        catch (err) {
            errorThrown = true;
            expect(err).toBe('There should be 2 meta rows');
        }
        expect(errorThrown).toBeTruthy();
    });
    it('should ... work with mocked data', function () {
        var proxy = service;
        var response = '[' +
            '["id", "ident", "type", "name", "latitude_deg", "longitude_deg", "elevation_ft", "continent", ' +
            '"iso_country", "iso_region", "municipality", "scheduled_service", "gps_code", "iata_code", ' +
            '"local_code", "home_link", "wikipedia_link", "keywords", "score", "last_updated"],' +
            '["#meta+id", "#meta+code", "#loc+airport+type", "#loc+airport+name", "#geo+lat", "#geo+lon", ' +
            '"#geo+elevation+ft", "#region+continent+code", "#country+code+iso2", "#adm1+code+iso", ' +
            '"#loc+municipality+name", "#status+scheduled", "#loc+airport+code+gps", "#loc+airport+code+iata", ' +
            '"#loc+airport+code+local", "#meta+url+airport", "#meta+url+wikipedia", "#meta+keywords", ' +
            '"#meta+score", "#date+updated"]' +
            ']';
        mockbackend.expectOne(function (req) { return true; }).flush(response);
        // mockbackend.connections.subscribe(connection => {
        //   connection.mockRespond(new Response(new ResponseOptions({body: response})));
        // });
        proxy.fetchMetaRows('test.csv').subscribe(function (result) {
            expect(result[0][0]).toBe('id');
        });
    });
});
//# sourceMappingURL=hxlproxy.service.spec.js.map