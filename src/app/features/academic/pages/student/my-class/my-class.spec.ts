import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyClass } from './my-class';

describe('MyClass', () => {
  let component: MyClass;
  let fixture: ComponentFixture<MyClass>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyClass],
    }).compileComponents();

    fixture = TestBed.createComponent(MyClass);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
