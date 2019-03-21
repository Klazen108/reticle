import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistCardComponent } from './checklist-card.component';

describe('ChecklistCardComponent', () => {
  let component: ChecklistCardComponent;
  let fixture: ComponentFixture<ChecklistCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChecklistCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
