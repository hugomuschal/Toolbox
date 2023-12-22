import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiceElementComponent } from './dice-element.component';

describe('DiceElementComponent', () => {
  let component: DiceElementComponent;
  let fixture: ComponentFixture<DiceElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiceElementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiceElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
