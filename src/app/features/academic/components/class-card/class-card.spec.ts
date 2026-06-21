import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassCard } from './class-card';

describe('ClassCard', () => {
  let component: ClassCard;
  let fixture: ComponentFixture<ClassCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
