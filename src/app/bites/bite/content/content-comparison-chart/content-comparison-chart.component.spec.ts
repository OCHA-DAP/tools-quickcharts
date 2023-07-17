import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContentComparisonChartComponent } from './content-comparison-chart.component';

describe('ContentComparisonChartComponent', () => {
  let component: ContentComparisonChartComponent;
  let fixture: ComponentFixture<ContentComparisonChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [ContentComparisonChartComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentComparisonChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
