import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateJobPopupComponent } from './update-job-popup.component';

describe('UpdateJobPopupComponent', () => {
  let component: UpdateJobPopupComponent;
  let fixture: ComponentFixture<UpdateJobPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateJobPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateJobPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
