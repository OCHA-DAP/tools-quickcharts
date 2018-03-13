import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentComparisonChartComponent } from './content-comparison-chart.component';

describe('ContentComparisonChartComponent', () => {
  let component: ContentComparisonChartComponent;
  let fixture: ComponentFixture<ContentComparisonChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentComparisonChartComponent ]
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
