import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LisaaTreeni } from './page4.page';

describe('LisaaTreeni', () => {
  let component: LisaaTreeni;
  let fixture: ComponentFixture<LisaaTreeni>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LisaaTreeni);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});