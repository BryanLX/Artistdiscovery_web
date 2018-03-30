import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventjoinComponent } from './eventjoin.component';

describe('EventjoinComponent', () => {
  let component: EventjoinComponent;
  let fixture: ComponentFixture<EventjoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventjoinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventjoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
