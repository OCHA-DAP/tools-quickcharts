/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HxlproxyService } from './hxlproxy.service';
import { Logger } from 'angular2-logger/core';
import { HttpModule, Http, Response, ResponseOptions, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { AppConfigService } from '../../shared/app-config.service';
import { ObservableInput } from 'rxjs/Observable';

describe('Service: Hxlproxy', () => {
  let mockbackend, service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        AppConfigService,
        HxlproxyService,
        BaseRequestOptions,
        MockBackend,
        Logger,
        {
          provide: Http,
          deps: [MockBackend, BaseRequestOptions],
          useFactory: (backend, options) => {
            return new Http(backend, options);
          }
        }
      ]
    });
  });

  beforeEach(inject([HxlproxyService, MockBackend], (_service, _mockbackend) => {
    service = _service;
    mockbackend = _mockbackend;
  }));

  it('should ...', () => {
    expect(service).toBeTruthy();
  });

  it('should ... throw error when meta rows missing', () => {
    const response = [];
    mockbackend.connections.subscribe(connection => {
      connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify(response)})));
    });

    const proxy: HxlproxyService = service;
    let errorThrown = false;
    try {
      proxy.fetchMetaRows('test.csv').subscribe(row => {
        expect(function(){}).not.toHaveBeenCalled();
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
    mockbackend.connections.subscribe(connection => {
      connection.mockRespond(new Response(new ResponseOptions({body: response})));
    });

    proxy.fetchMetaRows('test.csv').subscribe(result => {
      expect(result[0][0]).toBe('id');
    });
  });

});
