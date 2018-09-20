import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightPlanComponent } from './flight-plan.component';
import {} from 'jasmine';

describe('FlightPlanComponent', () => {
  let component: FlightPlanComponent;
  let fixture: ComponentFixture<FlightPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
