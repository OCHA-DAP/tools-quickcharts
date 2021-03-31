import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SimpleDropdownComponent } from './simple-dropdown.component';
import { BsDropdownModule } from 'ngx-bootstrap';

describe('SimpleDropdownComponent', () => {
  let component: SimpleDropdownComponent;
  let fixture: ComponentFixture<SimpleDropdownComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleDropdownComponent ],
      imports: [BsDropdownModule.forRoot()],
      providers: []
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
