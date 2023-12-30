import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicRoomComponent } from './public-room.component';

describe('PublicRoomComponent', () => {
  let component: PublicRoomComponent;
  let fixture: ComponentFixture<PublicRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicRoomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
