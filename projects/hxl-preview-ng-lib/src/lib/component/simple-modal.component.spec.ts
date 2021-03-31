import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SimpleModalComponent } from './simple-modal.component';
import { ModalModule } from 'ngx-bootstrap';
import { } from 'jasmine';

describe('SimpleModalComponent', () => {
  let component: SimpleModalComponent;
  let fixture: ComponentFixture<SimpleModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleModalComponent ],
      imports: [ModalModule.forRoot()]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
