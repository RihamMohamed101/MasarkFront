import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeSelector } from './grade-selector';

describe('GradeSelector', () => {
  let component: GradeSelector;
  let fixture: ComponentFixture<GradeSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradeSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(GradeSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
