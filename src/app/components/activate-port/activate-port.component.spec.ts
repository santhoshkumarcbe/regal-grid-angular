import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatePortComponent } from './activate-port.component';

describe('ActivatePortComponent', () => {
  let component: ActivatePortComponent;
  let fixture: ComponentFixture<ActivatePortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivatePortComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivatePortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
