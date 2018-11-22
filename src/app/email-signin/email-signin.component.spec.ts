import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSigninComponent } from './email-signin.component';

describe('EmailSigninComponent', () => {
  let component: EmailSigninComponent;
  let fixture: ComponentFixture<EmailSigninComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailSigninComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
