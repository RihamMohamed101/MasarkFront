import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionScheduler } from './session-scheduler';

describe('SessionScheduler', () => {
  let component: SessionScheduler;
  let fixture: ComponentFixture<SessionScheduler>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionScheduler],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionScheduler);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
