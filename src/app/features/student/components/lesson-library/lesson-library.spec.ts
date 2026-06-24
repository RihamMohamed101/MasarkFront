import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonLibrary } from './lesson-library';

describe('LessonLibrary', () => {
  let component: LessonLibrary;
  let fixture: ComponentFixture<LessonLibrary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonLibrary],
    }).compileComponents();

    fixture = TestBed.createComponent(LessonLibrary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
