import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleJoinedComponent } from './people-joined.component';

describe('PeopleJoinedComponent', () => {
  let component: PeopleJoinedComponent;
  let fixture: ComponentFixture<PeopleJoinedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleJoinedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleJoinedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
