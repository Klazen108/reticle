import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultPhaseDialogComponent } from './default-phase-dialog.component';

describe('DefaultPhaseDialogComponent', () => {
  let component: DefaultPhaseDialogComponent;
  let fixture: ComponentFixture<DefaultPhaseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultPhaseDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultPhaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
