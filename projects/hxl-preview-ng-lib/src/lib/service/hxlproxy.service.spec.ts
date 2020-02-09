/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HxlproxyService } from './hxlproxy.service';
import {HttpClientModule, HttpRequest} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('Service: Hxlproxy', () => {
  let service: HxlproxyService;
  let mockbackend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
          HttpClientModule,
          HttpClientTestingModule
      ],
      providers: [
        HxlproxyService
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

  beforeEach(inject([HxlproxyService, HttpTestingController], (_service: HxlproxyService, _backend: HttpTestingController) => {
    service = _service;
    mockbackend = _backend;
  }));

  it('should ...', () => {
    expect(service).toBeTruthy();
  });

  it('should ... throw error when meta rows missing', () => {
    const response: any[] = [];
    mockbackend.expectOne(((req: HttpRequest<any>) => true));

    const proxy: HxlproxyService = service;
    let errorThrown = false;
    try {
      proxy.fetchMetaRows('test.csv').subscribe(row => {
        expect(function() {}).not.toHaveBeenCalled();
      });
    } catch (err) {
      errorThrown = true;
      expect(err).toBe('There should be 2 meta rows');
    }
    expect(errorThrown).toBeTruthy();
  });

  it('should ... work with mocked data', () => {
    const proxy: HxlproxyService = service;
    const response = '[' +
      '["id", "ident", "type", "name", "latitude_deg", "longitude_deg", "elevation_ft", "continent", ' +
      '"iso_country", "iso_region", "municipality", "scheduled_service", "gps_code", "iata_code", ' +
      '"local_code", "home_link", "wikipedia_link", "keywords", "score", "last_updated"],' +
      '["#meta+id", "#meta+code", "#loc+airport+type", "#loc+airport+name", "#geo+lat", "#geo+lon", ' +
      '"#geo+elevation+ft", "#region+continent+code", "#country+code+iso2", "#adm1+code+iso", ' +
      '"#loc+municipality+name", "#status+scheduled", "#loc+airport+code+gps", "#loc+airport+code+iata", ' +
      '"#loc+airport+code+local", "#meta+url+airport", "#meta+url+wikipedia", "#meta+keywords", ' +
      '"#meta+score", "#date+updated"]' +
      ']';

    mockbackend.expectOne((req: HttpRequest<any>) => true).flush(response);
    // mockbackend.connections.subscribe(connection => {
    //   connection.mockRespond(new Response(new ResponseOptions({body: response})));
    // });

    proxy.fetchMetaRows('test.csv').subscribe(result => {
      expect(result[0][0]).toBe('id');
    });
  });

});
