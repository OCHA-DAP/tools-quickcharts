import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleDropdownComponent } from './simple-dropdown.component';
import { BsDropdownModule } from 'ngx-bootstrap';
import { LoggerModule } from 'simple-angular-logger';

describe('SimpleDropdownComponent', () => {
  let component: SimpleDropdownComponent;
  let fixture: ComponentFixture<SimpleDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleDropdownComponent ],
      imports: [BsDropdownModule.forRoot()],
      providers: [LoggerModule]
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
