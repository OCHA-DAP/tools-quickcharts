import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleDropdownComponent } from './simple-dropdown.component';
import { BsDropdownModule } from 'ngx-bootstrap';
import { LOG_LOGGER_PROVIDERS } from 'angular2-logger/core';

describe('SimpleDropdownComponent', () => {
  let component: SimpleDropdownComponent;
  let fixture: ComponentFixture<SimpleDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleDropdownComponent ],
      imports: [BsDropdownModule.forRoot()],
      providers: [LOG_LOGGER_PROVIDERS]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
