import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeManagement } from './grade-management';

describe('GradeManagement', () => {
  let component: GradeManagement;
  let fixture: ComponentFixture<GradeManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradeManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(GradeManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
