import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CheckboxSliderComponent } from './checkbox-slider.component';

describe('CheckboxSliderComponent', () => {
  let component: CheckboxSliderComponent;
  let fixture: ComponentFixture<CheckboxSliderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [CheckboxSliderComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
