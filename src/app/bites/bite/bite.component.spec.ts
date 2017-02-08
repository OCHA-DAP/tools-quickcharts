/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { BiteComponent } from './bite.component';
import { KeyFigureBite } from './types/key-figure-bite';
import { By } from '@angular/platform-browser';
import { InlineEditComponent } from '../shared/inline-edit/inline-edit.component';
import { Renderer, ElementRef } from '@angular/core';

describe('Component: Bite', () => {
  const
    KEY_FIGURE_TITLE = 'My Key Figgure',
    KEY_FIGURE_VALUE_COLUMN = '#affected';
  let fixture, comp, titleEl;
  // async beforeEach
  beforeEach( async(() => {
    TestBed.configureTestingModule({
        declarations: [ BiteComponent, InlineEditComponent ]
      })
      .compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(BiteComponent);
    comp    = fixture.componentInstance;

    let keyFigureBite = new KeyFigureBite(KEY_FIGURE_TITLE, KEY_FIGURE_VALUE_COLUMN);
    comp.bite = keyFigureBite;
    comp.add = false;
    comp.edit = false;
    comp.listIsFull = false;

    titleEl  = fixture.debugElement.query(By.css('.title')); // find hero element

    fixture.detectChanges(); // trigger initial data binding
  });

  it('should create an instance', () => {
    let component = new BiteComponent();
    expect(component).toBeTruthy();

    expect(titleEl.nativeElement.textContent).toContain(KEY_FIGURE_TITLE);
  });
});
